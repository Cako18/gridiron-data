"""
Gridiron Modell - naechtliches Daten-Update.
Laeuft per GitHub Action: laedt nflverse-Daten, berechnet Elo (komplette Historie),
EPA-EWMA-Features und aktuelle Injury-Impacts, schreibt data/app_data.json.
"""
import io
import json
import math
import datetime
import urllib.request
from collections import defaultdict

import pandas as pd

GAMES_URL = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
STATS_URL = "https://github.com/nflverse/nflverse-data/releases/download/stats_team/stats_team_week_{y}.csv"
INJ_URL = "https://github.com/nflverse/nflverse-data/releases/download/injuries/injuries_{y}.csv"

K, HOME_ADV, START, REG = 20, 48, 1500, 0.33
EWMA_SPAN = 10

POS_W = {"QB": 10.0, "T": 2.0, "OT": 2.0, "G": 1.2, "OG": 1.2, "C": 1.5, "OL": 1.5,
         "WR": 2.5, "TE": 1.5, "RB": 1.8, "FB": 0.5, "DE": 2.0, "DT": 1.5, "NT": 1.2,
         "DL": 1.7, "EDGE": 2.2, "OLB": 1.8, "ILB": 1.5, "LB": 1.6, "MLB": 1.5,
         "CB": 2.2, "S": 1.6, "SS": 1.6, "FS": 1.6, "DB": 1.8, "K": 0.8, "P": 0.4, "LS": 0.2}
STATUS_W = {"Out": 1.0, "Doubtful": 0.8, "Questionable": 0.35}
QB_ALPHA = 2 / (12 + 1)   # EWMA-Span 12 Starts
QB_REPL = -0.06           # Replacement-Level fuer QBs ohne Historie
QB_MIN_STARTS = 3


def fetch_csv(url):
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return pd.read_csv(io.BytesIO(r.read()))
    except Exception as e:
        print(f"  (uebersprungen: {url} -> {e})")
        return None


def main():
    print("Lade Spiele...")
    games = fetch_csv(GAMES_URL)
    games_all = games.copy()
    games = games.dropna(subset=["home_score", "away_score"])
    games = games.sort_values(["season", "gameday", "game_id"]).reset_index(drop=True)
    current_season = int(games_all["season"].max())
    print(f"  {len(games)} gewertete Spiele, aktuelle Saison: {current_season}")

    # ---------- Elo ueber komplette Historie ----------
    elo = defaultdict(lambda: START)
    cur = None
    for _, g in games.iterrows():
        if g["season"] != cur:
            if cur is not None:
                for t in list(elo):
                    elo[t] += REG * (START - elo[t])
            cur = g["season"]
        h, a = g["home_team"], g["away_team"]
        d = elo[h] + HOME_ADV - elo[a]
        p = 1 / (1 + 10 ** (-d / 400))
        hs, as_ = g["home_score"], g["away_score"]
        act = 1.0 if hs > as_ else (0.5 if hs == as_ else 0.0)
        pdf = hs - as_
        mult = math.log(abs(pdf) + 1) * (2.2 / ((d if hs > as_ else -d) * 0.001 + 2.2)) if pdf else 1.0
        s = K * mult * (act - p)
        elo[h] += s
        elo[a] -= s

    # ---------- EPA-Features (letzte Saisons reichen fuer EWMA) ----------
    print("Lade Team-Stats...")
    frames = [df for y in range(current_season - 2, current_season + 1)
              if (df := fetch_csv(STATS_URL.format(y=y))) is not None]
    stats = pd.concat(frames, ignore_index=True)
    stats["plays"] = stats["attempts"].fillna(0) + stats["carries"].fillna(0) + stats["sacks_suffered"].fillna(0)
    stats["off_epa_pp"] = (stats["passing_epa"].fillna(0) + stats["rushing_epa"].fillna(0)) / stats["plays"].clip(lower=1)
    opp = stats[["game_id", "team", "off_epa_pp"]].rename(
        columns={"team": "opponent_team", "off_epa_pp": "def_epa_pp"})
    stats = stats.merge(opp, on=["game_id", "opponent_team"], how="left")
    stats = stats.sort_values(["team", "season", "week"]).reset_index(drop=True)
    for col, new in [("off_epa_pp", "f_off"), ("def_epa_pp", "f_def"), ("passing_cpoe", "f_cpoe")]:
        stats[new] = stats.groupby("team")[col].transform(
            lambda s: s.ewm(span=EWMA_SPAN, min_periods=4).mean())
    latest = stats.groupby("team").tail(1).set_index("team")

    # ---------- QB-Ratings (EWMA der Passing-EPA/Dropback des Starters) ----------
    stats["dropbacks"] = stats["attempts"].fillna(0) + stats["sacks_suffered"].fillna(0)
    stats["qb_epa_pp"] = stats["passing_epa"].fillna(0) / stats["dropbacks"].clip(lower=1)
    qb_perf = stats.set_index(["game_id", "team"])["qb_epa_pp"].to_dict()
    qb_rating, qb_starts = {}, {}
    stat_seasons = set(stats["season"].unique())
    qb_games = games[games["season"].isin(stat_seasons)]
    for _, g in qb_games.iterrows():
        for side in ["home", "away"]:
            qb = g[f"{side}_qb_name"]
            if not isinstance(qb, str):
                continue
            obs = qb_perf.get((g["game_id"], g[f"{side}_team"]))
            if obs is None or pd.isna(obs):
                continue
            r = qb_rating.get(qb, obs)
            qb_rating[qb] = r + QB_ALPHA * (obs - r)
            qb_starts[qb] = qb_starts.get(qb, 0) + 1
    # Haeufigster Starter pro Team in der letzten Saison mit Ergebnissen
    from collections import Counter
    last_season_played = int(games["season"].max())
    starts = defaultdict(Counter)
    for _, g in games[games["season"] == last_season_played].iterrows():
        if isinstance(g["home_qb_name"], str):
            starts[g["home_team"]][g["home_qb_name"]] += 1
        if isinstance(g["away_qb_name"], str):
            starts[g["away_team"]][g["away_qb_name"]] += 1
    team_qb = {}
    for t, cnt in starts.items():
        q = cnt.most_common(1)[0][0]
        team_qb[t] = {"name": q,
                      "rating": round(qb_rating.get(q, QB_REPL), 4),
                      "new": 1 if qb_starts.get(q, 0) < QB_MIN_STARTS else 0}

    # ---------- Aktuelle Injury-Impacts ----------
    print("Lade Injuries...")
    inj = fetch_csv(INJ_URL.format(y=current_season))
    inj_impact, qb_out = {}, {}
    if inj is not None and len(inj):
        inj = inj[inj["report_status"].isin(STATUS_W)]
        if len(inj):
            wk = inj["week"].max()
            inj = inj[inj["week"] == wk]
            inj["impact"] = inj["position"].map(POS_W).fillna(1.0) * inj["report_status"].map(STATUS_W)
            grp = inj.groupby("team")
            inj_impact = grp["impact"].sum().round(2).to_dict()
            qb_out = ((inj["position"] == "QB") & (inj["report_status"] == "Out")
                      ).groupby(inj["team"]).max().astype(int).to_dict()

    # ---------- Spielplan der aktuellen Saison ----------
    sched = []
    s = games_all[games_all["season"] == current_season].sort_values(["week", "gameday", "gametime"])
    for _, r in s.iterrows():
        done = pd.notna(r["home_score"])
        sched.append({
            "w": int(r["week"]), "d": r["gameday"],
            "t": r["gametime"] if pd.notna(r["gametime"]) else "",
            "a": r["away_team"], "h": r["home_team"],
            "hr": int(r["home_rest"]) if pd.notna(r["home_rest"]) else 7,
            "ar": int(r["away_rest"]) if pd.notna(r["away_rest"]) else 7,
            "rd": int((r["home_rest"] if pd.notna(r["home_rest"]) else 7)
                      - (r["away_rest"] if pd.notna(r["away_rest"]) else 7)),
            "dv": int(r["div_game"]) if pd.notna(r["div_game"]) else 0,
            "as": int(r["away_score"]) if done else None,
            "hs": int(r["home_score"]) if done else None,
        })

    # ---------- Export ----------
    teams = {}
    for t in sorted(set(games["home_team"]) | set(games["away_team"])):
        if t not in latest.index:
            continue
        r = latest.loc[t]
        teams[t] = {
            "elo": round(elo[t], 1),
            "off_epa": round(float(r["f_off"]), 4) if pd.notna(r["f_off"]) else 0,
            "def_epa": round(float(r["f_def"]), 4) if pd.notna(r["f_def"]) else 0,
            "cpoe": round(float(r["f_cpoe"]), 3) if pd.notna(r["f_cpoe"]) else 0,
            "inj": inj_impact.get(t, 0),
            "qb_out": int(qb_out.get(t, 0)),
            "qb": team_qb.get(t, {}).get("rating", QB_REPL),
            "qb_new": team_qb.get(t, {}).get("new", 1),
            "qb_name": team_qb.get(t, {}).get("name", ""),
        }

    out = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "season": current_season,
        "last_result": str(games["gameday"].max()),
        "teams": teams,
        "schedule": sched,
    }
    with open("data/app_data.json", "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"OK: data/app_data.json geschrieben ({len(teams)} Teams, {len(sched)} Spiele Saison {current_season})")

    write_history_and_report(teams, sched, current_season)


TZ = {"BUF": 0, "MIA": 0, "NE": 0, "NYJ": 0, "NYG": 0, "PHI": 0, "PIT": 0, "BAL": 0,
      "CIN": 0, "CLE": 0, "WAS": 0, "CAR": 0, "ATL": 0, "JAX": 0, "TB": 0, "IND": 0,
      "DET": 0, "CHI": -1, "GB": -1, "MIN": -1, "DAL": -1, "HOU": -1, "TEN": -1,
      "NO": -1, "KC": -1, "DEN": -2, "ARI": -2, "SEA": -3, "SF": -3, "LA": -3,
      "LAC": -3, "LV": -3}

NAMES = {"ARI": "Cardinals", "ATL": "Falcons", "BAL": "Ravens", "BUF": "Bills",
         "CAR": "Panthers", "CHI": "Bears", "CIN": "Bengals", "CLE": "Browns",
         "DAL": "Cowboys", "DEN": "Broncos", "DET": "Lions", "GB": "Packers",
         "HOU": "Texans", "IND": "Colts", "JAX": "Jaguars", "KC": "Chiefs",
         "LA": "Rams", "LAC": "Chargers", "LV": "Raiders", "MIA": "Dolphins",
         "MIN": "Vikings", "NE": "Patriots", "NO": "Saints", "NYG": "Giants",
         "NYJ": "Jets", "PHI": "Eagles", "PIT": "Steelers", "SEA": "Seahawks",
         "SF": "49ers", "TB": "Buccaneers", "TEN": "Titans", "WAS": "Commanders"}


def predict_game(g, teams, model):
    h, a = teams.get(g["h"]), teams.get(g["a"])
    if not h or not a:
        return None
    hr, ar = g.get("hr", 7), g.get("ar", 7)
    hour = 99
    try:
        hour = int(str(g.get("t", ""))[:2])
    except (ValueError, TypeError):
        pass
    x = [
        h["elo"] + model["home_adv_elo"] - a["elo"],
        h.get("qb", 0) - a.get("qb", 0),
        h["off_epa"] - a["off_epa"],
        a["def_epa"] - h["def_epa"],
        h["cpoe"] - a["cpoe"],
        hr - ar,
        a.get("inj", 0) - h.get("inj", 0),
        a.get("qb_new", 0) - h.get("qb_new", 0),
        (1 if hr >= 13 else 0) - (1 if ar >= 13 else 0),
        abs(TZ.get(g["h"], 0) - TZ.get(g["a"], 0)),
        1 if (TZ.get(g["a"], 0) - TZ.get(g["h"], 0)) <= -2 and hour <= 13 else 0,
    ]
    z = model["intercept"]
    for i, v in enumerate(x):
        z += model["coef"][i] * ((v - model["mean"][i]) / model["scale"][i])
    return 1 / (1 + math.exp(-z))


def write_history_and_report(teams, sched, season):
    import csv, os
    today = datetime.date.today().isoformat()

    # ---------- Elo-Historie fortschreiben (1 Zeile pro Team und Tag) ----------
    hist_path = "data/elo_history.csv"
    rows = []
    if os.path.exists(hist_path):
        with open(hist_path) as f:
            rows = [r for r in csv.reader(f)][1:]
    rows = [r for r in rows if r and r[0] != today]
    for t, v in sorted(teams.items()):
        rows.append([today, t, str(round(v["elo"], 1))])
    with open(hist_path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "team", "elo"])
        w.writerows(rows)

    # Bewegung vs. ~7 Tage zuvor
    dates = sorted({r[0] for r in rows})
    movers = []
    baseline_date = None
    for d in reversed(dates):
        if (datetime.date.fromisoformat(today) - datetime.date.fromisoformat(d)).days >= 6:
            baseline_date = d
            break
    if baseline_date:
        base = {r[1]: float(r[2]) for r in rows if r[0] == baseline_date}
        movers = sorted(((t, teams[t]["elo"] - base[t]) for t in teams if t in base),
                        key=lambda x: -abs(x[1]))
        movers = [m for m in movers if abs(m[1]) >= 1][:6]

    # ---------- Report ----------
    with open("data/model.json") as f:
        model = json.load(f)
    upcoming = [g for g in sched if g["hs"] is None]
    if not upcoming:
        week = None
    else:
        week = min(g["w"] for g in upcoming)
    lines = [f"# Gridiron Wochenreport", f"", f"Stand: {today} · Saison {season}", ""]
    if week is not None:
        lines += [f"## Woche {week} – Picks", ""]
        cur_day = None
        for g in [g for g in upcoming if g["w"] == week]:
            p = predict_game(g, teams, model)
            if p is None:
                continue
            fav, prob = (g["h"], p) if p >= 0.5 else (g["a"], 1 - p)
            dog = g["a"] if fav == g["h"] else g["h"]
            tier = " **[BANK]**" if prob >= 0.70 else (" **[UPSET-ALARM]**" if prob < 0.58 else "")
            if g["d"] != cur_day:
                lines.append(f"**{g['d']}**")
                cur_day = g["d"]
            lines.append(f"- {NAMES.get(fav, fav)} über {NAMES.get(dog, dog)} – {prob*100:.0f} %{tier}")
        lines.append("")
        bank = sum(1 for g in upcoming if g["w"] == week
                   and (pp := predict_game(g, teams, model)) is not None
                   and max(pp, 1 - pp) >= 0.70)
        ups = sum(1 for g in upcoming if g["w"] == week
                  and (pp := predict_game(g, teams, model)) is not None
                  and max(pp, 1 - pp) < 0.58)
        lines += [f"{bank} BANK-Picks (historisch ~75 % Trefferquote) · {ups} Upset-Alarme (Münzwürfe)", ""]
    else:
        lines += ["Keine offenen Spiele – Saison beendet.", ""]
    lines += ["## Elo-Bewegungen (letzte 7 Tage)", ""]
    if movers:
        for t, d in movers:
            arrow = "▲" if d > 0 else "▼"
            lines.append(f"- {arrow} {NAMES.get(t, t)}: {d:+.0f} (jetzt {teams[t]['elo']:.0f})")
    else:
        lines.append("Keine nennenswerten Bewegungen (oder Historie startet gerade erst).")
    lines += ["", "---", "*Automatisch generiert von der Gridiron-Pipeline.*"]
    with open("REPORT.md", "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"OK: REPORT.md geschrieben (Woche {week}, {len(movers)} Elo-Bewegungen)")


if __name__ == "__main__":
    main()
