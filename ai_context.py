"""
Gridiron - KI-Kontextanalyse (Batch-Verfahren).

Statt 16 Einzelgespraeche mit je eigenen Websuchen fuehrt Claude EINE Recherche
fuer die gesamte Woche durch und gibt die Elo-Anpassungen fuer alle Spiele
gebuendelt aus. Das senkt die Kosten deutlich, weil sich die Suchergebnisse
ueberschneiden (ein Injury Report deckt alle Spiele ab) und nicht mehr pro
Fortsetzung die komplette Konversation erneut bezahlt wird.

Der API-Key kommt ausschliesslich aus ANTHROPIC_API_KEY (GitHub-Secret).
"""
import json
import os
import re
import sys
import datetime
import urllib.request
import urllib.error

API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"
MAX_ADJ = 75
MAX_SEARCHES = 6          # harte Obergrenze fuer Websuchen pro Lauf
MAX_ROUNDS = 5            # Fortsetzungen bei pausierter Suche
MAX_OUTPUT_TOKENS = 6000  # reicht fuer ~16 Spiele mit Begruendung

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
        f"Antworte am Ende AUSSCHLIESSLICH mit einem JSON-Array, ohne Markdown, ohne weiteren Text:\n"
        f'[{{"key": "<Kennung>", "home_adj": <int>, "away_adj": <int>, '
        f'"summary": "<1-2 Saetze auf Deutsch>", "factors": ["<Faktor>", "<Faktor>"]}}, ...]'
    )


def call_api(api_key, messages, tools=None):
    payload = {"model": MODEL, "max_tokens": MAX_OUTPUT_TOKENS, "messages": messages}
    if tools:
        payload["tools"] = tools
    req = urllib.request.Request(
        API_URL, data=json.dumps(payload).encode(),
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
        raise RuntimeError(f"HTTP {e.code}: {detail or e.reason}")


def extract_entries(text):
    """Findet das JSON-Array - auch wenn drumherum noch Text steht."""
    cleaned = text.replace("```json", "").replace("```", "")
    m = re.search(r"\[\s*\{[\s\S]*\}\s*\]", cleaned)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
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
    try:
        for _ in range(MAX_ROUNDS):
            data = call_api(api_key, messages, tools)
            u = data.get("usage", {}) or {}
            usage["in"] += u.get("input_tokens", 0)
            usage["out"] += u.get("output_tokens", 0)
            srv = u.get("server_tool_use", {}) or {}
            usage["searches"] += srv.get("web_search_requests", 0)
            content = data.get("content", [])
            messages.append({"role": "assistant", "content": content})
            text += "".join(b.get("text", "") for b in content if b.get("type") == "text")
            if data.get("stop_reason") == "pause_turn":
                continue
            if extract_entries(text):
                break
            messages.append({"role": "user",
                             "content": "Gib jetzt ausschliesslich das JSON-Array fuer alle Spiele aus."})
    except RuntimeError as e:
        print(f"Abbruch: {e}")
        return 1

    entries = extract_entries(text)
    if not entries:
        print("Keine verwertbare Antwort erhalten.")
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
    for e in entries:
        if not isinstance(e, dict):
            continue
        key = str(e.get("key", "")).strip()
        if key not in valid_keys:
            continue
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

    with open("data/ai_context.json", "w") as f:
        json.dump({"generated": today, "week": week, "games": ctx}, f, separators=(",", ":"))

    # Kostenabschaetzung (Sonnet ca. 3 $/Mio Input, 15 $/Mio Output, 10 $/1000 Suchen)
    est = usage["in"] / 1e6 * 3 + usage["out"] / 1e6 * 15 + usage["searches"] / 1000 * 10
    print(f"OK: {written}/{len(games)} Spiele analysiert | {usage['in']} Input-/"
          f"{usage['out']} Output-Tokens, {usage['searches']} Suchen | geschaetzt {est:.2f} $")
    if written < len(games) / 2:
        print("Warnung: weniger als die Haelfte der Spiele abgedeckt.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
