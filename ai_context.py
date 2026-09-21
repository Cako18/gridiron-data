"""
Gridiron - KI-Kontextanalyse (Batch-Verfahren).

Statt 16 Einzelgespraeche mit je eigenen Websuchen fuehrt Claude EINE Recherche
fuer die gesamte Woche durch und gibt die Elo-Anpassungen fuer alle Spiele
gebuendelt aus. Das senkt die Kosten deutlich, weil sich die Suchergebnisse
ueberschneiden (ein Injury Report deckt alle Spiele ab) und nicht mehr pro
Fortsetzung die komplette Konversation erneut bezahlt wird.

Der API-Key kommt ausschliesslich aus ANTHROPIC_API_KEY (GitHub-Secret).

V2 - gehaertet:
  * Antwortbudget deutlich groesser, damit das JSON nicht abgeschnitten wird
  * bei stop_reason "max_tokens" wird die Antwort fortgesetzt statt verworfen
  * Nachfragen nur noch fuer die tatsaechlich fehlenden Spiele
  * Teilergebnisse werden IMMER geschrieben - halbe Abdeckung schlaegt
    sieben Tage alten Kontext
  * Wiederholversuche bei 429/500/529 und ausfuehrliche Diagnose im Log
"""
import json
import os
import re
import sys
import time
import datetime
import urllib.request
import urllib.error

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"
MAX_ADJ = 75
MAX_SEARCHES = 6           # harte Obergrenze fuer Websuchen pro Lauf
MAX_ROUNDS = 6             # Fortsetzungen bei pausierter Suche / Nachfragen
MAX_OUTPUT_TOKENS = 16000  # Reserve fuer Recherchetext + JSON fuer ~16 Spiele
MIN_COVERAGE = 0.7         # ab hier gilt der Lauf als erfolgreich
HTTP_RETRIES = 3           # Wiederholversuche bei Ueberlast

NAMES = {"ARI": "Arizona Cardinals", "ATL": "Atlanta Falcons", "BAL": "Baltimore Ravens",
         "BUF": "Buffalo Bills", "CAR": "Carolina Panthers", "CHI": "Chicago Bears",
         "CIN": "Cincinnati Bengals", "CLE": "Cleveland Browns", "DAL": "Dallas Cowboys",
         "DEN": "Denver Broncos", "DET": "Detroit Lions", "GB": "Green Bay Packers",
         "HOU": "Houston Texans", "IND": "Indianapolis Colts", "JAX": "Jacksonville Jaguars",
         "KC": "Kansas City Chiefs", "LA": "Los Angeles Rams", "LAC": "Los Angeles Chargers",
         "LV": "Las Vegas Raiders", "MIA": "Miami Dolphins", "MIN": "Minnesota Vikings",
         "NE": "New England Patriots", "NO": "New Orleans Saints", "NYG": "New York Giants",
         "NYJ": "New York Jets", "PHI": "Philadelphia Eagles", "PIT": "Pittsburgh Steelers",
         "SEA": "Seattle Seahawks", "SF": "San Francisco 49ers", "TB": "Tampa Bay Buccaneers",
         "TEN": "Tennessee Titans", "WAS": "Washington Commanders"}


def build_prompt(week, games):
    lines = [f"{i+1}. {NAMES.get(g['a'], g['a'])} (Auswaerts) bei {NAMES.get(g['h'], g['h'])} (Heim)"
             f" - Kennung: {g['w']}-{g['a']}-{g['h']}" for i, g in enumerate(games)]
    return (
        f"Du bist der Kontext-Layer eines statistischen NFL-Vorhersagemodells. "
        f"Es geht um alle {len(games)} Spiele der Woche {week}:\n\n" + "\n".join(lines) + "\n\n"
        f"AUFGABE IN ZWEI SCHRITTEN:\n"
        f"1) Recherchiere mit HOECHSTENS {MAX_SEARCHES} Websuchen die Nachrichtenlage der "
        f"gesamten Woche. Nutze breite Suchen, die viele Teams auf einmal abdecken - etwa den "
        f"offiziellen Injury Report der Woche, Inactives, QB-Wechsel, wichtige Transfers. "
        f"Fuehre KEINE Einzelsuche pro Team durch.\n"
        f"2) Gib danach fuer JEDES gelistete Spiel eine Elo-Anpassung zwischen -{MAX_ADJ} und "
        f"+{MAX_ADJ} je Team aus. 0 bedeutet: keine relevanten Nachrichten. Nur klare, belegbare "
        f"Faktoren zaehlen - erfinde nichts. Findest du zu einem Spiel nichts, setze beide Werte "
        f"auf 0 und schreibe das in die Begruendung.\n\n"
        f"WICHTIG FUER DIE AUSGABE:\n"
        f"- Schreibe KEINEN Fliesstext und KEINE Zwischenzusammenfassung vor dem JSON. "
        f"Sobald die Recherche steht, kommt direkt das JSON-Array.\n"
        f"- Jede summary hoechstens 240 Zeichen, hoechstens 3 factors je Spiel.\n"
        f"- Alle {len(games)} Spiele muessen im Array vorkommen.\n\n"
        f"Antworte am Ende AUSSCHLIESSLICH mit einem JSON-Array, ohne Markdown, ohne weiteren Text:\n"
        f'[{{"key": "<Kennung>", "home_adj": <int>, "away_adj": <int>, '
        f'"summary": "<1-2 Saetze auf Deutsch>", "factors": ["<Faktor>", "<Faktor>"]}}, ...]'
    )


def call_api(api_key, messages, tools=None):
    payload = {"model": MODEL, "max_tokens": MAX_OUTPUT_TOKENS, "messages": messages}
    if tools:
        payload["tools"] = tools
    body = json.dumps(payload).encode()
    last = ""
    for attempt in range(HTTP_RETRIES):
        req = urllib.request.Request(
            API_URL, data=body,
            headers={"content-type": "application/json", "x-api-key": api_key,
                     "anthropic-version": "2023-06-01"})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            detail = ""
            try:
                detail = e.read().decode()[:300]
            except Exception:
                pass
            last = f"HTTP {e.code}: {detail or e.reason}"
            # 429/500/529 sind Ueberlast oder Ratelimit - das lohnt einen zweiten Anlauf.
            # 400/401/403 sind Konfigurationsfehler und wiederholen sich garantiert.
            if e.code not in (429, 500, 502, 503, 529) or attempt == HTTP_RETRIES - 1:
                raise RuntimeError(last)
            wait = 15 * (attempt + 1)
            print(f"  {last} - neuer Anlauf in {wait}s")
            time.sleep(wait)
        except urllib.error.URLError as e:
            last = f"Netzwerkfehler: {e.reason}"
            if attempt == HTTP_RETRIES - 1:
                raise RuntimeError(last)
            time.sleep(15 * (attempt + 1))
    raise RuntimeError(last or "unbekannter Fehler")


def extract_entries(text):
    """Findet die JSON-Objekte - auch wenn drumherum Text steht oder das Array abbricht."""
    cleaned = text.replace("```json", "").replace("```", "")
    m = re.search(r"\[\s*\{[\s\S]*\}\s*\]", cleaned)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    # Einzelobjekt-Rettung: greift auch bei abgeschnittenem Array
    out = []
    for om in re.finditer(r'\{[^{}]*"key"[^{}]*\}', cleaned):
        try:
            out.append(json.loads(om.group(0)))
        except json.JSONDecodeError:
            continue
    return out


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print("Kein ANTHROPIC_API_KEY gesetzt - Analyse uebersprungen.")
        return 0

    with open("data/app_data.json") as f:
        app = json.load(f)
    upcoming = [g for g in app.get("schedule", []) if g.get("hs") is None]
    if not upcoming:
        print("Keine offenen Spiele - nichts zu analysieren.")
        return 0
    week = min(g["w"] for g in upcoming)
    games = [g for g in upcoming if g["w"] == week]
    valid_keys = {f"{g['w']}-{g['a']}-{g['h']}" for g in games}
    print(f"Woche {week}: {len(games)} Spiele in einem gebuendelten Rechercheauftrag")

    messages = [{"role": "user", "content": build_prompt(week, games)}]
    tools = [{"type": "web_search_20250305", "name": "web_search", "max_uses": MAX_SEARCHES}]
    text = ""
    usage = {"in": 0, "out": 0, "searches": 0}
    found = {}

    try:
        for rnd in range(MAX_ROUNDS):
            data = call_api(api_key, messages, tools)
            u = data.get("usage", {}) or {}
            usage["in"] += u.get("input_tokens", 0)
            usage["out"] += u.get("output_tokens", 0)
            srv = u.get("server_tool_use", {}) or {}
            usage["searches"] += srv.get("web_search_requests", 0)
            stop = data.get("stop_reason")
            content = data.get("content", [])
            messages.append({"role": "assistant", "content": content})
            text += "".join(b.get("text", "") for b in content if b.get("type") == "text")

            for e in extract_entries(text):
                if isinstance(e, dict):
                    k = str(e.get("key", "")).strip()
                    if k in valid_keys:
                        found[k] = e
            missing = sorted(valid_keys - set(found))
            print(f"  Runde {rnd+1}: stop={stop} | erfasst {len(found)}/{len(games)}"
                  f" | Suchen bisher {usage['searches']}")

            if not missing:
                break
            if stop == "pause_turn":
                continue          # Suche laeuft noch - einfach fortsetzen
            if stop == "max_tokens":
                # Antwort wurde mitten im JSON abgeschnitten: exakt dort weiterschreiben
                messages.append({"role": "user", "content":
                                 "Die Antwort wurde abgeschnitten. Schreibe ab der "
                                 "Abbruchstelle weiter - nur die noch fehlenden Objekte, "
                                 "keine Wiederholung, kein Fliesstext."})
                continue
            # Antwort ist zu Ende, aber Spiele fehlen: gezielt nachfassen
            namen = ", ".join(missing)
            messages.append({"role": "user", "content":
                             f"Es fehlen noch diese Kennungen: {namen}. Gib NUR fuer diese "
                             f"ein JSON-Array im selben Format aus, ohne weitere Suche, "
                             f"ohne Fliesstext. Bei fehlender Nachrichtenlage beide Werte 0."})
    except RuntimeError as e:
        print(f"Abbruch der Recherche: {e}")
        if not found:
            return 1
        print(f"Teilergebnis von {len(found)} Spielen wird trotzdem gesichert.")

    if not found:
        print("Keine verwertbare Antwort erhalten.")
        print("Letzte 500 Zeichen der Modellantwort zur Diagnose:")
        print(text[-500:] if text else "(leer)")
        return 1

    try:
        with open("data/ai_context.json") as f:
            loaded = json.load(f)
        ctx = loaded.get("games", loaded) if isinstance(loaded, dict) else {}
        ctx = {k: v for k, v in ctx.items() if isinstance(v, dict) and "ha" in v}
    except (FileNotFoundError, json.JSONDecodeError, AttributeError):
        ctx = {}

    today = datetime.date.today().isoformat()

    def clamp(v):
        return max(-MAX_ADJ, min(MAX_ADJ, int(v)))

    written = 0
    for key, e in found.items():
        try:
            ctx[key] = {"ha": clamp(e.get("home_adj", 0)), "aa": clamp(e.get("away_adj", 0)),
                        "summary": str(e.get("summary", ""))[:400],
                        "factors": [str(f)[:200] for f in (e.get("factors") or [])][:4],
                        "date": today}
            written += 1
        except (TypeError, ValueError):
            continue

    def week_of(k):
        try:
            return int(str(k).split("-")[0])
        except (ValueError, TypeError):
            return None

    ctx = {k: v for k, v in ctx.items() if week_of(k) is not None and week_of(k) >= week}

    # Teilergebnisse werden immer geschrieben: halbe Abdeckung von heute schlaegt
    # volle Abdeckung von vor einer Woche.
    with open("data/ai_context.json", "w") as f:
        json.dump({"generated": today, "week": week, "games": ctx,
                   "coverage": f"{written}/{len(games)}"}, f, separators=(",", ":"))

    # Kostenabschaetzung (Sonnet ca. 3 $/Mio Input, 15 $/Mio Output, 10 $/1000 Suchen)
    est = usage["in"] / 1e6 * 3 + usage["out"] / 1e6 * 15 + usage["searches"] / 1000 * 10
    print(f"Geschrieben: {written}/{len(games)} Spiele | {usage['in']} Input-/"
          f"{usage['out']} Output-Tokens, {usage['searches']} Suchen | geschaetzt {est:.2f} $")

    if written < len(games) * MIN_COVERAGE:
        fehlt = sorted(valid_keys - set(found))
        print(f"Warnung: Abdeckung unter {int(MIN_COVERAGE*100)} %. Ohne Kontext bleiben: "
              f"{', '.join(fehlt)}")
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
