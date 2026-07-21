"""
Gridiron Modell - naechtliches Daten-Update + Modell-Neutraining (V4).
Laeuft per GitHub Action:
1. Laedt nflverse-Daten (Spiele, Team-Stats, Injuries)
2. Berechnet Elo, QB-Ratings, EPA-Features
3. Trainiert das Logit-Modell NEU auf allen abgeschlossenen Spielen
4. Schreibt data/app_data.json, data/model.json, data/elo_history.csv, REPORT.md
"""
import io
import json
import math
import datetime
import urllib.request
from collections import defaultdict, Counter

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

GAMES_URL = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
STATS_URL = "https://github.com/nflverse/nflverse-data/releases/download/stats_team/stats_team_week_{y}.csv"
INJ_URL = "https://github.com/nflverse/nflverse-data/releases/download/injuries/injuries_{y}.csv"

K, HOME_ADV, START, REG = 20, 48, 1500, 0.33
QB_ALPHA = 2 / (12 + 1)
QB_REPL = -0.06
QB_MIN_STARTS = 3
STATS_FROM = 2006
INJ_FROM = 2009
TRAIN_FROM = 2010

FEATURE_ORDER = ["elo_diff", "qb_diff", "off_diff", "def_diff", "cpoe_diff", "rest_diff",
                 "inj_diff", "qb_new_diff", "bye_diff", "tz_shift_away", "west_early_away"]

TZ = {"BUF": 0, "MIA": 0, "NE": 0, "NYJ": 0, "NYG": 0, "PHI": 0, "PIT": 0, "BAL": 0,
      "CIN": 0, "CLE": 0, "WAS": 0, "CAR": 0, "ATL": 0, "JAX": 0, "TB": 0, "IND": 0,
      "DET": 0, "CHI": -1, "GB": -1, "MIN": -1, "DAL": -1, "HOU": -1, "TEN": -1,
      "NO": -1, "KC": -1, "DEN": -2, "ARI": -2, "SEA": -3, "SF": -3, "LA": -3,
      "LAC": -3, "LV": -3, "OAK": -3, "SD": -3, "STL": -1}

NAMES = {"ARI": "Cardinals", "ATL": "Falcons", "BAL": "Ravens", "BUF": "Bills",
         "CAR": "Panthers", "CHI": "Bears", "CIN": "Bengals", "CLE": "Browns",
         "DAL": "Cowboys", "DEN": "Broncos", "DET": "Lions", "GB": "Packers",
         "HOU": "Texans", "IND": "Colts", "JAX": "Jaguars", "KC": "Chiefs",
         "LA": "Rams", "LAC": "Chargers", "LV": "Raiders", "MIA": "Dolphins",
         "MIN": "Vikings", "NE": "Patriots", "NO": "Saints", "NYG": "Giants",
         "NYJ": "Jets", "PHI": "Eagles", "PIT": "Steelers", "SEA": "Seahawks",
         "SF": "49ers", "TB": "Buccaneers", "TEN": "Titans", "WAS": "Commanders"}

POS_W = {"QB": 10.0, "T": 2.0, "OT": 2.0, "G": 1.2, "OG": 1.2, "C": 1.5, "OL": 1.5,
         "WR": 2.5, "TE": 1.5, "RB": 1.8, "FB": 0.5, "DE": 2.0, "DT": 1.5, "NT": 1.2,
         "DL": 1.7, "EDGE": 2.2, "OLB": 1.8, "ILB": 1.5, "LB": 1.6, "MLB": 1.5,
         "CB": 2.2, "S": 1.6, "SS": 1.6, "FS": 1.6, "DB": 1.8, "K": 0.8, "P": 0.4, "LS": 0.2}
STATUS_W = {"Out": 1.0, "Doubtful": 0.8, "Questionable": 0.35}


def fetch_csv(url):
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return pd.read_csv(io.BytesIO(r.read()))
    except Exception as e:
        print(f"  (uebersprungen: {url} -> {e})")
        return None


def compute_elo(games):
    """Pre-Game-Elo pro Spiel + finale Ratings."""
    elo = defaultdict(lambda: float(START))
    cur = None
    eh, ea = [], []
    for _, g in games.iterrows():
        if g["season"] != cur:
            if cur is not None:
                for t in list(elo):
                    elo[t] += REG * (START - elo[t])
            cur = g["season"]
        h, a = g["home_team"], g["away_team"]
        eh.append(elo[h]); ea.append(elo[a])
        d = elo[h] + HOME_ADV - elo[a]
        p = 1 / (1 + 10 ** (-d / 400))
        hs, as_ = g["home_score"], g["away_score"]
        act = 1.0 if hs > as_ else (0.5 if hs == as_ else 0.0)
        pdf = hs - as_
        mult = math.log(abs(pdf) + 1) * (2.2 / ((d if hs > as_ else -d) * 0.001 + 2.2)) if pdf else 1.0
        s = K * mult * (act - p)
        elo[h] += s; elo[a] -= s
    return eh, ea, elo


def main():
    print("Lade Spiele...")
    games_all = fetch_csv(GAMES_URL)
    games = games_all.dropna(subset=["home_score", "away_score"]).copy()
    games = games.sort_values(["season", "gameday", "game_id"]).reset_index(drop=True)
    current_season = int(games_all["season"].max())
    print(f"  {len(games)} gewertete Spiele, aktuelle Saison: {current_season}")

    eh, ea, elo = compute_elo(games)
    games["elo_home"], games["elo_away"] = eh, ea
    games["elo_diff"] = games["elo_home"] + HOME_ADV - games["elo_away"]

    print("Lade Team-Stats...")
    frames = [df for y in range(STATS_FROM, current_season + 1)
              if (df := fetch_csv(STATS_URL.format(y=y))) is not None]
    stats = pd.concat(frames, ignore_index=True).copy()
    stats["plays"] = stats["attempts"].fillna(0) + stats["carries"].fillna(0) + stats["sacks_suffered"].fillna(0)
    stats["off_epa_pp"] = (stats["passing_epa"].fillna(0) + stats["rushing_epa"].fillna(0)) / stats["plays"].clip(lower=1)
    stats["dropbacks"] = stats["attempts"].fillna(0) + stats["sacks_suffered"].fillna(0)
    stats["pass_epa_pp"] = stats["passing_epa"].fillna(0) / stats["dropbacks"].clip(lower=1)
    opp = stats[["game_id", "team", "off_epa_pp"]].rename(
        columns={"team": "opponent_team", "off_epa_pp": "def_epa_pp"})
    stats = stats.merge(opp, on=["game_id", "opponent_team"], how="left")
    stats = stats.sort_values(["team", "season", "week"]).reset_index(drop=True)
    # f_* = Stand VOR dem jeweiligen Spiel (fuers Training), f_now_* = inkl. letztem Spiel (fuer Export)
    for col, new in [("off_epa_pp", "f_off"), ("def_epa_pp", "f_def"), ("passing_cpoe", "f_cpoe")]:
        stats[new] = stats.groupby("team")[col].transform(
            lambda s: s.shift(1).ewm(span=10, min_periods=4).mean())
        stats["now_" + new] = stats.groupby("team")[col].transform(
            lambda s: s.ewm(span=10, min_periods=4).mean())
    latest = stats.groupby("team").tail(1).set_index("team")

    # ---------- QB-Ratings ----------
    qperf = stats.set_index(["game_id", "team"])["pass_epa_pp"].to_dict()
    qb_rating, qb_starts = {}, defaultdict(int)
    stat_seasons = set(stats["season"].unique())
    qh, qa, qnh, qna = [], [], [], []
    for _, g in games.iterrows():
        for side, arr, narr in [("home", qh, qnh), ("away", qa, qna)]:
            qb = g[f"{side}_qb_name"]
            if not isinstance(qb, str):
                arr.append(np.nan); narr.append(0); continue
            n = qb_starts[qb]
            arr.append(qb_rating.get(qb, QB_REPL) if n >= QB_MIN_STARTS else QB_REPL)
            narr.append(1 if n < QB_MIN_STARTS else 0)
            if g["season"] in stat_seasons:
                obs = qperf.get((g["game_id"], g[f"{side}_team"]))
                if obs is not None and not pd.isna(obs):
                    r = qb_rating.get(qb, obs)
                    qb_rating[qb] = r + QB_ALPHA * (obs - r)
                    qb_starts[qb] += 1
    games["qb_h"], games["qb_a"] = qh, qa
    games["qb_new_h"], games["qb_new_a"] = qnh, qna

    # Haeufigster Starter pro Team der letzten gespielten Saison
    last_played = int(games["season"].max())
    starts = defaultdict(Counter)
    for _, g in games[games["season"] == last_played].iterrows():
        if isinstance(g["home_qb_name"], str):
            starts[g["home_team"]][g["home_qb_name"]] += 1
        if isinstance(g["away_qb_name"], str):
            starts[g["away_team"]][g["away_qb_name"]] += 1
    team_qb = {}
    for t, cnt in starts.items():
        q = cnt.most_common(1)[0][0]
        team_qb[t] = {"name": q, "rating": round(qb_rating.get(q, QB_REPL), 4),
                      "new": 1 if qb_starts.get(q, 0) < QB_MIN_STARTS else 0}

    # ---------- Injuries: Historie fuers Training + aktueller Stand ----------
    print("Lade Injuries...")
    inj_frames = [df for y in range(INJ_FROM, current_season + 1)
                  if (df := fetch_csv(INJ_URL.format(y=y))) is not None]
    inj_hist = pd.concat(inj_frames, ignore_index=True) if inj_frames else pd.DataFrame(
        columns=["season", "week", "team", "position", "report_status"])
    inj_hist = inj_hist[inj_hist["report_status"].isin(STATUS_W)].copy()
    inj_hist["impact"] = inj_hist["position"].map(POS_W).fillna(1.0) * inj_hist["report_status"].map(STATUS_W)
    team_inj_hist = inj_hist.groupby(["season", "week", "team"])["impact"].sum().reset_index(name="inj_impact")

    inj_impact, qb_out = {}, {}
    cur_inj = inj_hist[inj_hist["season"] == current_season]
    if len(cur_inj):
        wk = cur_inj["week"].max()
        cur_inj = cur_inj[cur_inj["week"] == wk]
        inj_impact = cur_inj.groupby("team")["impact"].sum().round(2).to_dict()
        qb_out = ((cur_inj["position"] == "QB") & (cur_inj["report_status"] == "Out")
                  ).groupby(cur_inj["team"]).max().astype(int).to_dict()

    # ---------- Trainings-Matrix + naechtliches Neutraining ----------
    print("Trainiere Modell neu...")
    df = games[games["season"] >= TRAIN_FROM].copy()
    df["week_i"] = pd.to_numeric(df["week"], errors="coerce")
    tf = stats[["game_id", "team", "f_off", "f_def", "f_cpoe"]]
    for side in ["home", "away"]:
        r = {c: f"{side}_{c}" for c in ["f_off", "f_def", "f_cpoe"]}
        df = df.merge(tf.rename(columns=r), left_on=["game_id", f"{side}_team"],
                      right_on=["game_id", "team"], how="left").drop(columns="team")
        ir = team_inj_hist.rename(columns={"team": f"{side}_team", "inj_impact": f"{side}_inj"})
        df = df.merge(ir, left_on=["season", "week_i", f"{side}_team"],
                      right_on=["season", "week", f"{side}_team"], how="left", suffixes=("", "_d"))
        df = df.drop(columns=[c for c in df.columns if c.endswith("_d")])
        df[f"{side}_inj"] = df[f"{side}_inj"].fillna(0)
    df["off_diff"] = df["home_f_off"] - df["away_f_off"]
    df["def_diff"] = df["away_f_def"] - df["home_f_def"]
    df["cpoe_diff"] = df["home_f_cpoe"] - df["away_f_cpoe"]
    df["rest_diff"] = df["home_rest"].fillna(7) - df["away_rest"].fillna(7)
    df["inj_diff"] = df["away_inj"] - df["home_inj"]
    df["qb_diff"] = df["qb_h"] - df["qb_a"]
    df["qb_new_diff"] = df["qb_new_a"] - df["qb_new_h"]
    df["bye_diff"] = (df["home_rest"].fillna(7) >= 13).astype(int) - (df["away_rest"].fillna(7) >= 13).astype(int)
    df["tz_shift_away"] = df.apply(lambda r: abs(TZ.get(r["home_team"], 0) - TZ.get(r["away_team"], 0)), axis=1)
    def west_early(r):
        try:
            hour = int(str(r["gametime"])[:2])
        except (ValueError, TypeError):
            return 0
        return 1 if (TZ.get(r["away_team"], 0) - TZ.get(r["home_team"], 0)) <= -2 and hour <= 13 else 0
    df["west_early_away"] = df.apply(west_early, axis=1)
    df["y"] = (df["home_score"] > df["away_score"]).astype(int)
    df = df[df["home_score"] != df["away_score"]].dropna(subset=FEATURE_ORDER)

    sc = StandardScaler().fit(df[FEATURE_ORDER])
    lr = LogisticRegression(max_iter=1000).fit(sc.transform(df[FEATURE_ORDER]), df["y"])
    train_acc = (lr.predict(sc.transform(df[FEATURE_ORDER])) == df["y"]).mean()
    model = {"features": FEATURE_ORDER,
             "mean": [round(x, 5) for x in sc.mean_.tolist()],
             "scale": [round(x, 5) for x in sc.scale_.tolist()],
             "coef": [round(x, 5) for x in lr.coef_[0].tolist()],
             "intercept": round(float(lr.intercept_[0]), 5),
             "home_adv_elo": HOME_ADV, "qb_repl": QB_REPL,
             "trained": datetime.date.today().isoformat(),
             "train_games": int(len(df))}
    with open("data/model.json", "w") as f:
        json.dump(model, f, separators=(",", ":"))
    print(f"  Modell neu trainiert: {len(df)} Spiele, In-Sample {100*train_acc:.1f}%")

    # ---------- Spielplan ----------
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

    # ---------- Team-Export (EPA inkl. letztem Spiel) ----------
    teams = {}
    for t in sorted(set(games["home_team"]) | set(games["away_team"])):
        if t not in latest.index or t not in NAMES:
            continue
        r = latest.loc[t]
        teams[t] = {
            "elo": round(elo[t], 1),
            "off_epa": round(float(r["now_f_off"]), 4) if pd.notna(r["now_f_off"]) else 0,
            "def_epa": round(float(r["now_f_def"]), 4) if pd.notna(r["now_f_def"]) else 0,
            "cpoe": round(float(r["now_f_cpoe"]), 3) if pd.notna(r["now_f_cpoe"]) else 0,
            "inj": inj_impact.get(t, 0),
            "qb_out": int(qb_out.get(t, 0)),
            "qb": team_qb.get(t, {}).get("rating", QB_REPL),
            "qb_new": team_qb.get(t, {}).get("new", 1),
            "qb_name": team_qb.get(t, {}).get("name", ""),
        }

    out = {"generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
           "season": current_season, "last_result": str(games["gameday"].max()),
           "teams": teams, "schedule": sched}
    with open("data/app_data.json", "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"OK: data/app_data.json geschrieben ({len(teams)} Teams, {len(sched)} Spiele Saison {current_season})")

    write_history_and_report(teams, sched, current_season, model)


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


def write_history_and_report(teams, sched, season, model):
    import csv, os
    today = datetime.date.today().isoformat()

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

    dates = sorted({r[0] for r in rows})
    movers, baseline_date = [], None
    for d in reversed(dates):
        if (datetime.date.fromisoformat(today) - datetime.date.fromisoformat(d)).days >= 6:
            baseline_date = d
            break
    if baseline_date:
        base = {r[1]: float(r[2]) for r in rows if r[0] == baseline_date}
        movers = sorted(((t, teams[t]["elo"] - base[t]) for t in teams if t in base),
                        key=lambda x: -abs(x[1]))
        movers = [m for m in movers if abs(m[1]) >= 1][:6]

    upcoming = [g for g in sched if g["hs"] is None]
    week = min((g["w"] for g in upcoming), default=None)
    lines = ["# Gridiron Wochenreport", "", f"Stand: {today} · Saison {season} · Modell trainiert auf {model['train_games']} Spielen ({model['trained']})", ""]
    if week is not None:
        lines += [f"## Woche {week} – Picks", ""]
        cur_day = None
        bank = ups = 0
        for g in [g for g in upcoming if g["w"] == week]:
            p = predict_game(g, teams, model)
            if p is None:
                continue
            fav, prob = (g["h"], p) if p >= 0.5 else (g["a"], 1 - p)
            dog = g["a"] if fav == g["h"] else g["h"]
            tier = ""
            if prob >= 0.70:
                tier = " **[BANK]**"; bank += 1
            elif prob < 0.58:
                tier = " **[UPSET-ALARM]**"; ups += 1
            if g["d"] != cur_day:
                lines.append(f"**{g['d']}**")
                cur_day = g["d"]
            lines.append(f"- {NAMES.get(fav, fav)} über {NAMES.get(dog, dog)} – {prob*100:.0f} %{tier}")
        lines += ["", f"{bank} BANK-Picks (historisch ~75 % Trefferquote) · {ups} Upset-Alarme (Münzwürfe)", ""]
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
