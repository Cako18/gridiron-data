"""
Gridiron - automatische Claude-Kontextanalyse (Feature A).
Laeuft donnerstags per GitHub Action: recherchiert fuer jedes Spiel der kommenden
Woche die aktuelle Nachrichtenlage und uebersetzt sie in Elo-Anpassungen.
Ergebnis: data/ai_context.json  ->  von Website und Report gelesen.

Der API-Key kommt ausschliesslich aus der Umgebungsvariable ANTHROPIC_API_KEY
(GitHub-Secret) und wird nirgends gespeichert oder geloggt.
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
MAX_GAMES = 20          # Sicherheitsnetz gegen Kostenexplosion
MAX_ROUNDS = 4          # Fortsetzungen bei pausierter Websuche

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


def call_claude(api_key, prompt):
    """Ein Analyse-Durchlauf inkl. Fortsetzung bei pausierter Websuche."""
    messages = [{"role": "user", "content": prompt}]
    text = ""
    for _ in range(MAX_ROUNDS):
        payload = {"model": MODEL, "max_tokens": 1000, "messages": messages,
                   "tools": [{"type": "web_search_20250305", "name": "web_search"}]}
        req = urllib.request.Request(
            API_URL, data=json.dumps(payload).encode(),
            headers={"content-type": "application/json", "x-api-key": api_key,
                     "anthropic-version": "2023-06-01"})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                data = json.loads(r.read())
        except urllib.error.HTTPError as e:
            detail = ""
            try:
                detail = e.read().decode()[:300]
            except Exception:
                pass
            raise urllib.error.HTTPError(e.url, e.code, f"{e.reason} | {detail}", e.headers, None)
        content = data.get("content", [])
        messages.append({"role": "assistant", "content": content})
        text += "".join(b.get("text", "") for b in content if b.get("type") == "text")
        if data.get("stop_reason") == "pause_turn":
            continue
        if "home_adj" in text and text.rfind("}") > text.find("{"):
            break
        messages.append({"role": "user",
                         "content": "Gib jetzt AUSSCHLIESSLICH das geforderte JSON-Objekt aus."})
    m = re.search(r'\{[^{}]*"home_adj"[\s\S]*?\}', text.replace("```json", "").replace("```", ""))
    if not m:
        raise ValueError("kein JSON in der Antwort")
    p = json.loads(m.group(0))
    clamp = lambda v: max(-MAX_ADJ, min(MAX_ADJ, int(v)))
    return {"ha": clamp(p.get("home_adj", 0)), "aa": clamp(p.get("away_adj", 0)),
            "summary": str(p.get("summary", ""))[:400],
            "factors": [str(f)[:200] for f in (p.get("factors") or [])][:4]}


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print("Kein ANTHROPIC_API_KEY gesetzt - Analyse uebersprungen.")
        return 0

    with open("data/app_data.json") as f:
        app = json.load(f)
    sched = app.get("schedule", [])
    upcoming = [g for g in sched if g.get("hs") is None]
    if not upcoming:
        print("Keine offenen Spiele - nichts zu analysieren.")
        return 0
    week = min(g["w"] for g in upcoming)
    games = [g for g in upcoming if g["w"] == week][:MAX_GAMES]

    try:
        with open("data/ai_context.json") as f:
            loaded = json.load(f)
        ctx = loaded.get("games", loaded) if isinstance(loaded, dict) else {}
        ctx = {k: v for k, v in ctx.items() if isinstance(v, dict) and "ha" in v}
    except (FileNotFoundError, json.JSONDecodeError, AttributeError):
        ctx = {}

    today = datetime.date.today().isoformat()
    done = skipped = failed = 0
    for g in games:
        key = f"{g['w']}-{g['a']}-{g['h']}"
        old = ctx.get(key)
        if old and old.get("date") == today:          # heute schon analysiert
            skipped += 1
            continue
        hn, an = NAMES.get(g["h"], g["h"]), NAMES.get(g["a"], g["a"])
        prompt = (
            f"Du bist der Kontext-Layer eines statistischen NFL-Vorhersagemodells. "
            f"Matchup am {g['d']}: {hn} (Heim) gegen {an} (Auswaerts).\n"
            "Recherchiere per Websuche knapp die AKTUELLE Lage beider Teams: Verletzungen und "
            "Injury Reports, QB-Situation, Kaderveraenderungen, Trainerwechsel, Form. Maximal 4 Suchen.\n"
            f"Uebersetze die Erkenntnisse in Elo-Anpassungen zwischen -{MAX_ADJ} und +{MAX_ADJ} pro Team "
            "(0 = keine relevanten News; nur klare, belegbare Faktoren).\n"
            "Antworte am Ende AUSSCHLIESSLICH mit validem JSON, ohne Markdown:\n"
            '{"home_adj": <int>, "away_adj": <int>, "summary": "<2-3 Saetze auf Deutsch>", '
            '"factors": ["<Faktor 1>", "<Faktor 2>", "<Faktor 3>"]}')
        try:
            res = call_claude(api_key, prompt)
            res["date"] = today
            ctx[key] = res
            done += 1
            print(f"  {key}: {res['ha']:+d}/{res['aa']:+d}")
        except (urllib.error.HTTPError, urllib.error.URLError, ValueError, KeyError) as e:
            msg = str(e)
            if isinstance(e, urllib.error.HTTPError):
                msg = f"HTTP {e.code}: {e.reason}"
                if e.code in (401, 403):
                    print(f"  Abbruch: {msg} - API-Key pruefen.")
                    break
            failed += 1
            print(f"  {key}: fehlgeschlagen ({msg})")
        time.sleep(2)

    # Alte Eintraege vergangener Wochen aufraeumen
    def _week_of(key):
        try:
            return int(str(key).split("-")[0])
        except (ValueError, TypeError):
            return None
    ctx = {k: v for k, v in ctx.items()
           if _week_of(k) is not None and _week_of(k) >= week}
    with open("data/ai_context.json", "w") as f:
        json.dump({"generated": today, "week": week, "games": ctx}, f, separators=(",", ":"))
    print(f"OK: data/ai_context.json (Woche {week}: {done} neu, {skipped} aktuell, {failed} Fehler)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
