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
SNAP_URL = "https://github.com/nflverse/nflverse-data/releases/download/snap_counts/snap_counts_{y}.csv"
PSTAT_URL = "https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_{y}.csv"
DEPTH_URL = "https://github.com/nflverse/nflverse-data/releases/download/depth_charts/depth_charts_{y}.csv"

# Positionsgruppen fuer die Aufstellung
OFF_POS = ["QB", "RB", "WR", "TE", "T", "G", "C", "OL", "OT", "OG", "FB"]
DEF_POS = ["DE", "DT", "NT", "EDGE", "DL", "LB", "OLB", "ILB", "MLB", "CB", "S", "SS", "FS", "DB"]
# Wie viele Starter je Gruppe angezeigt werden
LINEUP_SLOTS = {"QB": 1, "RB": 1, "WR": 3, "TE": 1, "OL": 5, "DL": 4, "LB": 3, "DB": 4}


def pos_group(p):
    if p in ("T", "G", "C", "OL", "OT", "OG"):
        return "OL"
    if p in ("DE", "DT", "NT", "EDGE", "DL"):
        return "DL"
    if p in ("LB", "OLB", "ILB", "MLB"):
        return "LB"
    if p in ("CB", "S", "SS", "FS", "DB"):
        return "DB"
    if p in ("QB", "RB", "WR", "TE", "FB"):
        return "RB" if p == "FB" else p
    return None

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

# Historische Trefferquoten je Spiel-Archetyp (Walk-Forward 2018-2025, Basis 65.5 %)
ARCHETYPES = {
    "Heimfavorit":          {"hit": 69.0, "n": 1055},
    "Gastfavorit":          {"hit": 68.6, "n": 423},
    "Enges Spiel":          {"hit": 58.5, "n": 709},
    "Division":             {"hit": 65.9, "n": 768},
    "QB-Neuling":           {"hit": 70.4, "n": 253},
    "Ruhe-Ungleichgewicht": {"hit": 65.1, "n": 470},
    "Saisonstart":          {"hit": 63.8, "n": 373},
}
# Korrelation der Modellfehler zwischen Archetypen (wochenweise, 2018-2025)
ARCH_CORR = {
    "Heimfavorit":          {"Division": 0.30, "Enges Spiel": 0.00, "Ruhe-Ungleichgewicht": 0.32, "Gastfavorit": 0.05, "Saisonstart": 0.72},
    "Division":             {"Heimfavorit": 0.30, "Enges Spiel": 0.32, "Ruhe-Ungleichgewicht": 0.28, "Gastfavorit": 0.12, "Saisonstart": 0.20},
    "Enges Spiel":          {"Heimfavorit": 0.00, "Division": 0.32, "Ruhe-Ungleichgewicht": 0.19, "Gastfavorit": -0.01, "Saisonstart": 0.70},
    "Ruhe-Ungleichgewicht": {"Heimfavorit": 0.32, "Division": 0.28, "Enges Spiel": 0.19, "Gastfavorit": 0.20, "Saisonstart": 0.30},
    "Gastfavorit":          {"Heimfavorit": 0.05, "Division": 0.12, "Enges Spiel": -0.01, "Ruhe-Ungleichgewicht": 0.20, "Saisonstart": 0.32},
    "Saisonstart":          {"Heimfavorit": 0.72, "Division": 0.20, "Enges Spiel": 0.70, "Ruhe-Ungleichgewicht": 0.30, "Gastfavorit": 0.32},
}
# Trefferquote bei deutlicher Marktabweichung (>=4 Punkte), nach dominanter Edge-Quelle
EDGE_SOURCES = {
    "qb_diff":  {"hit": 66.2, "n": 207, "label": "QB-Rating",    "trust": "hoch"},
    "elo_diff": {"hit": 65.0, "n": 874, "label": "Elo/Form",     "trust": "hoch"},
    "inj_diff": {"hit": 51.6, "n": 161, "label": "Verletzungen", "trust": "niedrig"},
}

DIVISIONS = {
    "AFC_East": ["BUF", "MIA", "NE", "NYJ"], "AFC_North": ["BAL", "CIN", "CLE", "PIT"],
    "AFC_South": ["HOU", "IND", "JAX", "TEN"], "AFC_West": ["DEN", "KC", "LAC", "LV"],
    "NFC_East": ["DAL", "NYG", "PHI", "WAS"], "NFC_North": ["CHI", "DET", "GB", "MIN"],
    "NFC_South": ["ATL", "CAR", "NO", "TB"], "NFC_West": ["ARI", "LA", "SF", "SEA"],
}

POS_W = {"QB": 10.0, "T": 2.0, "OT": 2.0, "G": 1.2, "OG": 1.2, "C": 1.5, "OL": 1.5,
         "WR": 2.5, "TE": 1.5, "RB": 1.8, "FB": 0.5, "DE": 2.0, "DT": 1.5, "NT": 1.2,
         "DL": 1.7, "EDGE": 2.2, "OLB": 1.8, "ILB": 1.5, "LB": 1.6, "MLB": 1.5,
         "CB": 2.2, "S": 1.6, "SS": 1.6, "FS": 1.6, "DB": 1.8, "K": 0.8, "P": 0.4, "LS": 0.2}
STATUS_W = {"Out": 1.0, "Doubtful": 0.8, "Questionable": 0.35}


def ml_to_dec(ml):
    """Amerikanische Moneyline -> Dezimalquote."""
    if pd.isna(ml) or ml == 0:
        return None
    return round(1 + (100 / abs(ml) if ml < 0 else ml / 100), 2)


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

    # Bootstrap-Ensemble: misst, wie stabil eine Vorhersage gegenueber der Datenauswahl ist
    print("  Bootstrap-Ensemble (20 Modelle) fuer Konfidenz...")
    boot = []
    rng_b = np.random.default_rng(11)
    for _ in range(20):
        s = df.sample(len(df), replace=True, random_state=int(rng_b.integers(1e6)))
        sc_b = StandardScaler().fit(s[FEATURE_ORDER])
        lr_b = LogisticRegression(max_iter=1000).fit(sc_b.transform(s[FEATURE_ORDER]), s["y"])
        boot.append({"mean": [round(v, 5) for v in sc_b.mean_.tolist()],
                     "scale": [round(v, 5) for v in sc_b.scale_.tolist()],
                     "coef": [round(v, 5) for v in lr_b.coef_[0].tolist()],
                     "intercept": round(float(lr_b.intercept_[0]), 5)})
    model = {"features": FEATURE_ORDER,
             "mean": [round(x, 5) for x in sc.mean_.tolist()],
             "scale": [round(x, 5) for x in sc.scale_.tolist()],
             "coef": [round(x, 5) for x in lr.coef_[0].tolist()],
             "intercept": round(float(lr.intercept_[0]), 5),
             "home_adv_elo": HOME_ADV, "qb_repl": QB_REPL,
             "trained": datetime.date.today().isoformat(),
             "train_games": int(len(df)), "boot": boot}
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
            "mh": ml_to_dec(r["home_moneyline"]),
            "ma": ml_to_dec(r["away_moneyline"]),
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

    with open("data/model.json") as f:
        model_now = json.load(f)
    # Analyse je offenem Spiel: Konfidenz, Archetypen, Edge-Attribution
    print("Analysiere kommende Spiele (Konfidenz, Archetypen, Edge)...")
    analysis = {}
    boot_models = model_now.get("boot", [])
    for g in sched:
        if g["hs"] is not None:
            continue
        p = predict_game(g, teams, model_now)
        if p is None:
            continue
        key = f"{g['w']}-{g['a']}-{g['h']}"
        entry = {"tags": game_archetypes(g, teams, model_now)}
        # Konfidenz: Streuung der Bootstrap-Modelle
        if boot_models:
            x = feature_vector(g, teams, model_now)
            ps = []
            for bm in boot_models:
                z = bm["intercept"]
                for i, v in enumerate(x):
                    z += bm["coef"][i] * ((v - bm["mean"][i]) / bm["scale"][i])
                ps.append(1 / (1 + math.exp(-z)))
            sd = float(np.std(ps))
            entry["sd"] = round(100 * sd, 2)
            entry["conf"] = "hoch" if sd < 0.012 else ("mittel" if sd < 0.022 else "niedrig")
        ea = edge_attribution(g, teams, model_now, p)
        if ea:
            entry["edge"] = ea
        # Erwartete Trefferquote nach Archetyp (Minimum der zutreffenden Typen)
        hits = [ARCHETYPES[t]["hit"] for t in entry["tags"] if t in ARCHETYPES]
        if hits:
            entry["arch_hit"] = min(hits)
        analysis[key] = entry

    print("Lade Aufstellungen...")
    lineup_season = current_season if current_season in stat_seasons else last_played
    try:
        lineups, player_rate = build_lineups(lineup_season, team_qb)
    except Exception as e:
        print(f"  (Aufstellungen uebersprungen: {e})")
        lineups, player_rate = {}, {}
    print(f"  {len(lineups)} Teams mit Aufstellung (Saison {lineup_season})")

    inj_status = {}
    if len(cur_inj):
        for _, r in cur_inj.iterrows():
            if isinstance(r.get("full_name"), str):
                inj_status[(r["full_name"], r["team"])] = str(r["report_status"])[:1]
    try:
        depth = build_depth_charts(current_season, player_rate, inj_status)
        if not depth:
            depth = build_depth_charts(lineup_season, player_rate, inj_status)
    except Exception as e:
        print(f"  (Depth Charts uebersprungen: {e})")
        depth = {}
    print(f"  {len(depth)} Teams mit Depth Chart")

    print("Protokolliere Linien-Bewegungen...")
    try:
        line_moves = track_lines(games_all, current_season)
    except Exception as e:
        print(f"  (uebersprungen: {e})")
        line_moves = {}
    print(f"  {len(line_moves)} Spiele mit Bewegung >= 1.5 Punkte")

    print("Simuliere Saison (10.000 Durchlaeufe)...")
    proj = simulate_season(sched, teams, model_now)
    duel = vegas_duel(games_all, teams, model_now, current_season)
    kiadj = claude_batch(sched, teams, model_now, current_season)
    ai_stats = ai_bilanz(games_all, current_season)
    if ai_stats:
        duel["ai"] = ai_stats
    print(f"  Duell-Stand: {duel['n']} abgerechnete Spiele, {duel['dis_n']} Uneinigkeiten")

    out = {"generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
           "season": current_season, "last_result": str(games["gameday"].max()),
           "teams": teams, "schedule": sched, "proj": proj, "duel": duel,
           "kiadj": kiadj, "analysis": analysis, "archetypes": ARCHETYPES,
           "lineups": lineups, "depth": depth, "line_moves": line_moves, "lineup_season": lineup_season,
           "arch_corr": ARCH_CORR, "edge_sources": EDGE_SOURCES}
    with open("data/app_data.json", "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"OK: data/app_data.json geschrieben ({len(teams)} Teams, {len(sched)} Spiele Saison {current_season})")

    write_history_and_report(line_moves, teams, sched, current_season, model, proj, duel)



def simulate_season(sched, teams, model, n_sims=10000):
    """Monte-Carlo ueber die Restsaison: erwartete Siege, Playoff- und Division-Chancen."""
    codes = sorted(teams.keys())
    idx = {t: i for i, t in enumerate(codes)}
    base = np.zeros(len(codes))
    upcoming = []
    for g in sched:
        if g["h"] not in idx or g["a"] not in idx:
            continue
        if g["hs"] is not None:
            if g["hs"] > g["as"]:
                base[idx[g["h"]]] += 1
            elif g["hs"] < g["as"]:
                base[idx[g["a"]]] += 1
            else:
                base[idx[g["h"]]] += 0.5; base[idx[g["a"]]] += 0.5
        else:
            p = predict_game(g, teams, model)
            if p is not None:
                upcoming.append((idx[g["h"]], idx[g["a"]], p))
    rng = np.random.default_rng(7)
    wins = np.tile(base, (n_sims, 1))
    if upcoming:
        hs = np.array([u[0] for u in upcoming]); as_ = np.array([u[1] for u in upcoming])
        ps = np.array([u[2] for u in upcoming])
        draws = rng.random((n_sims, len(upcoming))) < ps
        for j in range(len(upcoming)):
            wins[:, hs[j]] += draws[:, j]
            wins[:, as_[j]] += ~draws[:, j]
    noisy = wins + rng.random(wins.shape) * 0.01   # zufaellige Tiebreaks
    div_win = np.zeros((n_sims, len(codes)), dtype=bool)
    for div, ts in DIVISIONS.items():
        cols = [idx[t] for t in ts if t in idx]
        best = np.argmax(noisy[:, cols], axis=1)
        for k, c in enumerate(cols):
            div_win[best == k, c] = True
    playoff = div_win.copy()
    for conf in [["AFC_East", "AFC_North", "AFC_South", "AFC_West"],
                 ["NFC_East", "NFC_North", "NFC_South", "NFC_West"]]:
        cols = [idx[t] for d in conf for t in DIVISIONS[d] if t in idx]
        cw = noisy[:, cols].copy()
        cw[div_win[:, cols]] = -1                   # Division-Sieger raus
        order = np.argsort(-cw, axis=1)[:, :3]      # Top-3-Wildcards
        rows = np.arange(n_sims)[:, None]
        wc = np.zeros_like(cw, dtype=bool)
        wc[rows, order] = True
        for k, c in enumerate(cols):
            playoff[:, c] |= wc[:, k]
    return {t: {"w": round(float(wins[:, idx[t]].mean()), 1),
                "po": round(100 * float(playoff[:, idx[t]].mean())),
                "dv": round(100 * float(div_win[:, idx[t]].mean()))}
            for t in codes}


def build_depth_charts(season, rate, inj_status):
    """Offizielle Depth Charts im ESPN-Stil: Position x String-Tiefe, mit
    Verletzungsstatus und Gridiron-Rating je Spieler."""
    dc = fetch_csv(DEPTH_URL.format(y=season))
    if dc is None or not len(dc):
        return {}
    dc = dc[dc["dt"] == dc["dt"].max()].copy()      # aktuellster Stand
    stamp = str(dc["dt"].iat[0])[:10]
    out = {}
    for team, tg in dc.groupby("team"):
        groups = {}
        for grp_name, gg in tg.groupby("pos_grp"):
            rows = []
            for slot, sg in gg.sort_values("pos_slot").groupby("pos_slot", sort=True):
                sg = sg.sort_values("pos_rank")
                players = []
                for _, r in sg.iterrows():
                    nm = r["player_name"]
                    e = {"n": nm, "d": int(r["pos_rank"])}
                    rt = rate.get((nm, team))
                    if rt:
                        e["r"] = rt
                    st = inj_status.get((nm, team))
                    if st:
                        e["i"] = st
                    players.append(e)
                if players:
                    rows.append({"pos": sg["pos_abb"].iat[0], "players": players[:3]})
            if rows:
                groups[str(grp_name)] = rows
        if groups:
            out[team] = {"stamp": stamp, "groups": groups}
    return out


def build_lineups(season, team_qb=None):
    """Startaufstellungen je Team mit transparentem Gridiron-Rating (0-99).

    Starter = hoechster Snap-Anteil der letzten Spiele. Rating aus EPA-Produktion
    (Offense) bzw. Impact-Plays je Snap (Defense), ligaweit auf 0-99 normiert.
    """
    snaps = fetch_csv(SNAP_URL.format(y=season))
    pstats = fetch_csv(PSTAT_URL.format(y=season))
    if snaps is None or pstats is None or not len(snaps):
        return {}

    # --- Starter je Team ueber die letzten 6 Wochen ---
    last_wk = snaps["week"].max()
    recent = snaps[snaps["week"] > last_wk - 6].copy()
    recent["snap_pct"] = recent[["offense_pct", "defense_pct"]].max(axis=1)
    agg = (recent.groupby(["team", "player", "position"], as_index=False)
           .agg(snap_pct=("snap_pct", "mean"), games=("player", "size")))
    agg = agg[agg["games"] >= 2]
    snaps["snap_pct_all"] = snaps[["offense_pct", "defense_pct"]].max(axis=1)
    season_agg = (snaps.groupby(["team", "player", "position"], as_index=False)
                  .agg(snap_pct=("snap_pct_all", "mean")))
    agg["grp"] = agg["position"].apply(pos_group)
    agg = agg[agg["grp"].notna()]

    # --- Spieler-Rating ---
    p = pstats.copy()
    for c in ["passing_epa", "rushing_epa", "receiving_epa", "def_sacks", "def_qb_hits",
              "def_tackles_for_loss", "def_interceptions", "def_pass_defended",
              "def_fumbles_forced", "def_tackles_solo", "attempts", "carries",
              "targets", "sacks_suffered"]:
        if c not in p.columns:
            p[c] = 0
        p[c] = p[c].fillna(0)
    grp = p.groupby(["player_display_name", "team"], as_index=False).agg(
        pass_epa=("passing_epa", "sum"), rush_epa=("rushing_epa", "sum"),
        rec_epa=("receiving_epa", "sum"), att=("attempts", "sum"),
        car=("carries", "sum"), tgt=("targets", "sum"), wk=("week", "nunique"),
        sacks=("def_sacks", "sum"), qbh=("def_qb_hits", "sum"),
        tfl=("def_tackles_for_loss", "sum"), ints=("def_interceptions", "sum"),
        pd_=("def_pass_defended", "sum"), ff=("def_fumbles_forced", "sum"),
        tkl=("def_tackles_solo", "sum"))
    grp["off_epa"] = grp["pass_epa"] + grp["rush_epa"] + grp["rec_epa"]
    grp["opps"] = grp["att"] + grp["car"] + grp["tgt"]
    # Haupt-Position je Spieler (haeufigste in den Wochenstats)
    posmap = (p.groupby(["player_display_name", "team"])["position"]
              .agg(lambda s: s.mode().iat[0] if len(s.mode()) else None).reset_index())
    grp = grp.merge(posmap, on=["player_display_name", "team"], how="left")
    grp["grp"] = grp["position"].apply(pos_group)

    OFF_GRPS, DEF_GRPS = {"QB", "RB", "WR", "TE"}, {"DL", "LB", "DB"}
    grp["score"] = np.nan
    off_mask = grp["grp"].isin(OFF_GRPS) & (grp["opps"] >= 20)
    grp.loc[off_mask, "score"] = (grp.loc[off_mask, "off_epa"]
                                  / grp.loc[off_mask, "opps"].clip(lower=1))
    def_mask = grp["grp"].isin(DEF_GRPS) & (grp["wk"] >= 3)
    grp.loc[def_mask, "score"] = ((2.0 * grp["sacks"] + 1.0 * grp["qbh"] + 1.5 * grp["tfl"]
                                   + 3.0 * grp["ints"] + 1.2 * grp["pd_"] + 2.0 * grp["ff"]
                                   + 0.25 * grp["tkl"]) / grp["wk"].clip(lower=1))[def_mask]

    # Normierung INNERHALB der Positionsgruppe -> QB vergleicht sich mit QBs
    rate = {}
    for g_name, sub in grp[grp["score"].notna()].groupby("grp"):
        if len(sub) < 8:
            continue
        lo, hi = sub["score"].quantile(0.10), sub["score"].quantile(0.90)
        for _, r in sub.iterrows():
            v = (r["score"] - lo) / (hi - lo) if hi > lo else 0.5
            rate[(r["player_display_name"], r["team"])] = int(round(45 + 53 * min(1, max(0, v))))

    # --- Aufstellung zusammenstellen ---
    out = {}
    for team, tg in agg.groupby("team"):
        side = {"off": [], "def": []}
        # Stamm-QB aus der Saisonauswertung hat Vorrang vor dem Snap-Anteil
        # (sonst landet der Backup aus Woche 18 in der Aufstellung)
        starter_qb = (team_qb or {}).get(team, {}).get("name")
        for g_, slots in LINEUP_SLOTS.items():
            sel = tg[tg["grp"] == g_].sort_values("snap_pct", ascending=False)
            if g_ == "QB" and starter_qb:
                prio = sel[sel["player"] == starter_qb]
                if not len(prio):
                    # Stamm-QB spielte zuletzt nicht (Ruhe/Verletzung) -> Saisonwerte nutzen
                    prio = season_agg[(season_agg["team"] == team)
                                      & (season_agg["player"] == starter_qb)].copy()
                if len(prio):
                    sel = pd.concat([prio, sel[sel["player"] != starter_qb]])
            sel = sel.head(slots)
            for _, r in sel.iterrows():
                entry = {"n": r["player"], "p": r["position"],
                         "s": int(round(100 * r["snap_pct"]))}
                rt = rate.get((r["player"], team))
                if rt:
                    entry["r"] = rt
                side["off" if g_ in ("QB", "RB", "WR", "TE", "OL") else "def"].append(entry)
        out[team] = side
    return out, rate


def market_prob(g, pick):
    """Entvigte implizite Wahrscheinlichkeit des Picks aus den Moneylines."""
    dh, da = ml_to_dec(g["home_moneyline"]), ml_to_dec(g["away_moneyline"])
    if not dh or not da:
        return None
    ih, ia = 1 / dh, 1 / da
    p_home = ih / (ih + ia)
    return p_home if pick == g["home_team"] else 1 - p_home


def track_lines(games_all, season):
    """Protokolliert Moneylines je Lauf und meldet auffaellige Bewegungen."""
    import csv, os
    path = "data/line_history.csv"
    rows = []
    if os.path.exists(path):
        with open(path) as f:
            rows = [r for r in list(csv.reader(f))[1:] if len(r) >= 4]
    stamp = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="minutes")
    cur = games_all[(games_all["season"] == season) & games_all["home_score"].isna()]
    latest = {}
    for _, g in cur.iterrows():
        if pd.isna(g["home_moneyline"]) or pd.isna(g["away_moneyline"]):
            continue
        key = f"{int(g['week'])}-{g['away_team']}-{g['home_team']}"
        pm = market_prob(g, g["home_team"])
        if pm is None:
            continue
        latest[key] = pm
        prev = [r for r in rows if r[0] == key]
        if prev and abs(float(prev[-1][2]) - pm) < 0.002:
            continue                      # unveraendert -> keine neue Zeile
        rows.append([key, stamp, f"{pm:.4f}", g["home_team"]])
    # Auf die letzten 60 Tage begrenzen
    cutoff = (datetime.date.today() - datetime.timedelta(days=60)).isoformat()
    rows = [r for r in rows if r[1][:10] >= cutoff]
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["key", "stamp", "p_home", "home_team"])
        w.writerows(rows)
    # Bewegungen berechnen
    moves = {}
    for key, pm in latest.items():
        hist = sorted([r for r in rows if r[0] == key], key=lambda r: r[1])
        if len(hist) < 2:
            continue
        opener = float(hist[0][2])
        move = 100 * (pm - opener)
        if abs(move) >= 1.5:
            moves[key] = {"open": round(100 * opener, 1), "now": round(100 * pm, 1),
                          "move": round(move, 1), "since": hist[0][1][:10],
                          "steps": len(hist)}
    return moves


def vegas_duel(games_all, teams, model, season):
    """Friert Modell- und Vegas-Picks vor dem Spiel ein und rechnet spaeter ehrlich ab."""
    import csv, os
    path = "data/vegas_duel.csv"
    rows = {}
    if os.path.exists(path):
        with open(path) as f:
            for r in list(csv.reader(f))[1:]:
                if len(r) >= 4:
                    rows[r[0]] = r
    cur = games_all[games_all["season"] == season]
    for _, g in cur.iterrows():
        key = f"{int(g['week'])}-{g['away_team']}-{g['home_team']}"
        played = pd.notna(g["home_score"])
        existing = rows.get(key)
        if existing is None:
            if played or pd.isna(g["spread_line"]) or g["spread_line"] == 0:
                continue
            gg = {"h": g["home_team"], "a": g["away_team"],
                  "hr": int(g["home_rest"]) if pd.notna(g["home_rest"]) else 7,
                  "ar": int(g["away_rest"]) if pd.notna(g["away_rest"]) else 7,
                  "t": g["gametime"] if pd.notna(g["gametime"]) else ""}
            p = predict_game(gg, teams, model)
            if p is None:
                continue
            model_pick = g["home_team"] if p >= 0.5 else g["away_team"]
            vegas_pick = g["home_team"] if g["spread_line"] > 0 else g["away_team"]
            pm = market_prob(g, model_pick)
            gg2 = dict(gg); gg2["mh"] = ml_to_dec(g["home_moneyline"]); gg2["ma"] = ml_to_dec(g["away_moneyline"])
            ea = edge_attribution(gg2, teams, model, p)
            rows[key] = [key, model_pick, vegas_pick, datetime.date.today().isoformat(),
                         f"{max(p, 1 - p):.4f}", f"{pm:.4f}" if pm is not None else "",
                         ea["src"] if ea else ""]
            continue
        # Bestehender Lock: fehlende Spalten nachtragen, solange das Spiel noch nicht lief
        r = list(existing) + [""] * max(0, 7 - len(existing))
        if not played:
            if not r[4]:
                gg = {"h": g["home_team"], "a": g["away_team"],
                      "hr": int(g["home_rest"]) if pd.notna(g["home_rest"]) else 7,
                      "ar": int(g["away_rest"]) if pd.notna(g["away_rest"]) else 7,
                      "t": g["gametime"] if pd.notna(g["gametime"]) else ""}
                p = predict_game(gg, teams, model)
                if p is not None:
                    r[4] = f"{max(p, 1 - p):.4f}"
            if not r[5]:
                pm = market_prob(g, r[1])
                if pm is not None:
                    r[5] = f"{pm:.4f}"
        rows[key] = r[:7]

    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["key", "model_pick", "vegas_pick", "locked", "p_model", "p_mkt_lock", "edge_src"])
        w.writerows(rows.values())
    # Abrechnung
    stats = {"m": 0, "v": 0, "n": 0, "dis_n": 0, "dis_m": 0}
    # Kalibrierung: vorhergesagte vs. eingetretene Trefferquote pro Confidence-Bucket
    buckets = {"50-58": [0.50, 0.58], "58-70": [0.58, 0.70], "70+": [0.70, 1.01]}
    cal = {b: {"n": 0, "hit": 0, "p_sum": 0.0} for b in buckets}
    clv = {"n": 0, "sum": 0.0, "pos": 0}
    by_src = {}
    for _, g in cur.iterrows():
        if pd.isna(g["home_score"]) or g["home_score"] == g["away_score"]:
            continue
        key = f"{int(g['week'])}-{g['away_team']}-{g['home_team']}"
        if key not in rows:
            continue
        winner = g["home_team"] if g["home_score"] > g["away_score"] else g["away_team"]
        r = rows[key]
        mp, vp = r[1], r[2]
        stats["n"] += 1
        if mp == winner: stats["m"] += 1
        if vp == winner: stats["v"] += 1
        if mp != vp:
            stats["dis_n"] += 1
            if mp == winner: stats["dis_m"] += 1
        if len(r) >= 7 and r[6]:
            s = by_src.setdefault(r[6], {"n": 0, "hit": 0})
            s["n"] += 1
            if mp == winner:
                s["hit"] += 1
        if len(r) >= 5:
            try:
                pm = float(r[4])
                for b, (lo, hi) in buckets.items():
                    if lo <= pm < hi:
                        cal[b]["n"] += 1
                        cal[b]["p_sum"] += pm
                        if mp == winner:
                            cal[b]["hit"] += 1
            except ValueError:
                pass
        # CLV: Markt-Prob des Picks bei Lock vs. Schlusslinie (Lines nach Spielende = Closing)
        if len(r) >= 6 and r[5]:
            p_close = market_prob(g, mp)
            if p_close is not None:
                try:
                    diff = p_close - float(r[5])
                    clv["n"] += 1
                    clv["sum"] += diff
                    if diff > 0.001:
                        clv["pos"] += 1
                except ValueError:
                    pass
    stats["by_src"] = {k: {"n": v["n"], "hit": round(100 * v["hit"] / v["n"])} for k, v in by_src.items() if v["n"] > 0}
    stats["clv"] = {"n": clv["n"],
                    "avg": round(100 * clv["sum"] / clv["n"], 2) if clv["n"] else 0,
                    "pos": round(100 * clv["pos"] / clv["n"]) if clv["n"] else 0}
    stats["cal"] = {b: {"n": c["n"],
                        "pred": round(100 * c["p_sum"] / c["n"], 1) if c["n"] else 0,
                        "real": round(100 * c["hit"] / c["n"], 1) if c["n"] else 0}
                    for b, c in cal.items()}
    return stats


def feature_vector(g, teams, model, adj_home=0, adj_away=0):
    """Feature-Vektor in der Reihenfolge von model["features"] - oder None."""
    h, a = teams.get(g["h"]), teams.get(g["a"])
    if not h or not a:
        return None
    hr, ar = g.get("hr", 7), g.get("ar", 7)
    hour = 99
    try:
        hour = int(str(g.get("t", ""))[:2])
    except (ValueError, TypeError):
        pass
    return [
        (h["elo"] + adj_home) + model["home_adv_elo"] - (a["elo"] + adj_away),
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


def game_archetypes(g, teams, model):
    """Archetyp-Tags eines Spiels - identisch zur Backtest-Definition."""
    x = feature_vector(g, teams, model)
    if x is None:
        return []
    tags = []
    tags.append("Heimfavorit" if x[0] > 60 else ("Gastfavorit" if x[0] < -60 else "Enges Spiel"))
    if g.get("dv") == 1:
        tags.append("Division")
    h, a = teams.get(g["h"], {}), teams.get(g["a"], {})
    if h.get("qb_new") or a.get("qb_new"):
        tags.append("QB-Neuling")
    if abs(g.get("hr", 7) - g.get("ar", 7)) >= 3:
        tags.append("Ruhe-Ungleichgewicht")
    if g.get("w", 99) <= 3:
        tags.append("Saisonstart")
    return tags


def edge_attribution(g, teams, model, p_model):
    """Zerlegt die Abweichung vom Markt in Feature-Beitraege.
    Rueckgabe: (edge in Punkten, dominante Quelle, Beitragsliste) oder None."""
    dh, da = g.get("mh"), g.get("ma")
    if not dh or not da:
        return None
    ih, ia = 1 / dh, 1 / da
    p_mkt = ih / (ih + ia)
    x = feature_vector(g, teams, model)
    if x is None:
        return None
    parts = []
    for i, f in enumerate(model["features"]):
        z = (x[i] - model["mean"][i]) / model["scale"][i] * model["coef"][i]
        parts.append((f, z))
    # Beitraege relativ zum neutralen Spiel (z=0) -> groesster Betrag = dominante Quelle
    parts.sort(key=lambda t: -abs(t[1]))
    top = parts[0][0]
    return {"edge": round(100 * (p_model - p_mkt), 1),
            "p_mkt": round(100 * p_mkt, 1),
            "src": top,
            "src_label": EDGE_SOURCES.get(top, {}).get("label", top),
            "trust": EDGE_SOURCES.get(top, {}).get("trust", "unbekannt"),
            "parts": [[f, round(z, 3)] for f, z in parts[:4]]}


def predict_game(g, teams, model, adj_home=0, adj_away=0):
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
        (h["elo"] + adj_home) + model["home_adv_elo"] - (a["elo"] + adj_away),
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


def write_history_and_report(line_moves_report, teams, sched, season, model, proj=None, duel=None):
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
    try:
        with open("data/ai_context.json") as f:
            ai_ctx = json.load(f).get("games", {})
    except (FileNotFoundError, json.JSONDecodeError):
        ai_ctx = {}
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
            ai_note = ""
            a = ai_ctx.get(f"{g['w']}-{g['a']}-{g['h']}")
            if a:
                gg = dict(g)
                p_ai = predict_game(gg, teams, model, a.get("ha", 0), a.get("aa", 0))
                if p_ai is not None:
                    fav_ai = g["h"] if p_ai >= 0.5 else g["a"]
                    prob_ai = max(p_ai, 1 - p_ai)
                    shown = prob_ai if fav_ai == fav else 1 - prob_ai
                    arrow = "▲" if shown > prob + 0.001 else ("▼" if shown < prob - 0.001 else "•")
                    ai_note = f" · KI {arrow} {shown*100:.0f} %"
            lines.append(f"- {NAMES.get(fav, fav)} über {NAMES.get(dog, dog)} – {prob*100:.0f} %{tier}{ai_note}")
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
    if proj:
        lines += ["", "## Saisonprojektion (10.000 Simulationen)", ""]
        top = sorted(proj.items(), key=lambda x: -x[1]["w"])[:8]
        for t, p in top:
            lines.append(f"- {NAMES.get(t, t)}: Ø {p['w']} Siege · Playoffs {p['po']} % · Division {p['dv']} %")
    if duel and duel["n"] > 0:
        lines += ["", "## Vegas-Duell", "",
                  f"Modell {duel['m']}/{duel['n']} ({100*duel['m']/duel['n']:.1f} %) vs. Vegas {duel['v']}/{duel['n']} ({100*duel['v']/duel['n']:.1f} %)"]
        if duel["dis_n"] > 0:
            lines.append(f"Bei Uneinigkeit ({duel['dis_n']} Spiele): Modell gewinnt {duel['dis_m']} ({100*duel['dis_m']/duel['dis_n']:.0f} %)")
        ai = duel.get("ai")
        if ai:
            lines.append(f"Modell+KI (Auto-Analyse): {ai['hit']}/{ai['n']} ({100*ai['hit']/ai['n']:.1f} %)")
        cal = duel.get("cal", {})
        if any(c["n"] > 0 for c in cal.values()):
            lines += ["", "### Kalibrierung (vorhergesagt vs. eingetreten)", ""]
            for b in ["50-58", "58-70", "70+"]:
                c = cal.get(b, {"n": 0})
                if c["n"] > 0:
                    drift = c["real"] - c["pred"]
                    flag = " ⚠" if abs(drift) > 8 and c["n"] >= 15 else ""
                    lines.append(f"- {b} %: {c['n']} Spiele · vorhergesagt Ø {c['pred']} % · eingetreten {c['real']} %{flag}")
            lines.append("")
            lines.append("Gut kalibriert = beide Werte nah beieinander. ⚠ = Drift über 8 Punkte bei genug Spielen – Modell prüfen.")
        clv = duel.get("clv", {"n": 0})
        if clv["n"] > 0:
            lines += ["", "### Closing Line Value", "",
                      f"Ø CLV: {clv['avg']:+.2f} Prozentpunkte · {clv['pos']} % der Picks schlagen die Schlusslinie ({clv['n']} Spiele)",
                      "",
                      "CLV misst, ob sich der Markt nach unserem eingefrorenen Pick in unsere Richtung bewegt. Dauerhaft über 0 = echte Kante, unabhängig vom Glück einzelner Ergebnisse. Profis vertrauen dieser Zahl mehr als der Trefferquote."]
    elif duel is not None:
        lines += ["", "## Vegas-Duell", "", "Startet, sobald Quoten fuer kommende Spiele verfuegbar sind."]
    lines += ["", "---", "*Automatisch generiert von der Gridiron-Pipeline.*"]
    with open("REPORT.md", "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"OK: REPORT.md geschrieben (Woche {week}, {len(movers)} Elo-Bewegungen)")




def claude_batch(sched, teams, model, season):
    """Automatische News-Analyse der Swing-Spiele der Woche via Anthropic API.
    Laeuft nur, wenn ANTHROPIC_API_KEY gesetzt ist (Do/So oder FORCE_CLAUDE=1).
    Ergebnisse werden eingefroren in data/claude_adjust.json + data/ai_picks.csv."""
    import os, urllib.request
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return {}
    today = datetime.date.today()
    if today.weekday() not in (3, 6) and os.environ.get("FORCE_CLAUDE") != "1":
        # Nur Donnerstag/Sonntag analysieren (Kosten sparen)
        try:
            return json.load(open("data/claude_adjust.json"))
        except Exception:
            return {}
    try:
        adjust = json.load(open("data/claude_adjust.json"))
    except Exception:
        adjust = {}

    upcoming = [g for g in sched if g["hs"] is None]
    week = min((g["w"] for g in upcoming), default=None)
    try:
        with open("data/ai_context.json") as f:
            ai_ctx = json.load(f).get("games", {})
    except (FileNotFoundError, json.JSONDecodeError):
        ai_ctx = {}
    if week is None:
        return adjust
    candidates = []
    for g in upcoming:
        if g["w"] != week:
            continue
        p = predict_game(g, teams, model)
        if p is None:
            continue
        fav_p = max(p, 1 - p)
        key = f"{g['w']}-{g['a']}-{g['h']}"
        old = adjust.get(key)
        if old and (today - datetime.date.fromisoformat(old["date"])).days < 5:
            continue
        if fav_p < 0.65:                      # nur Swing-Spiele: da bewegen News am meisten
            candidates.append((fav_p, key, g))
    candidates = sorted(candidates)[:10]      # Kostendeckel: max 10 Spiele pro Lauf
    print(f"Claude-Batch: analysiere {len(candidates)} Swing-Spiele der Woche {week}...")

    for _, key, g in candidates:
        hn, an = NAMES.get(g["h"], g["h"]), NAMES.get(g["a"], g["a"])
        prompt = (f"Du bist der Kontext-Layer eines statistischen NFL-Vorhersagemodells. "
                  f"Matchup: {hn} (Heim) gegen {an} (Auswaerts), Saison {season} Woche {g['w']}. "
                  f"Recherchiere per Websuche knapp die AKTUELLE Lage beider Teams: Verletzungen/Inactives, "
                  f"QB-Situation, Trainerwechsel, Form. Maximal 3 Suchen. "
                  f"Uebersetze in Elo-Anpassungen zwischen -75 und +75 pro Team (0 = keine relevanten News). "
                  f"Antworte am Ende AUSSCHLIESSLICH mit validem JSON ohne Markdown: "
                  f'{{"home_adj": <int>, "away_adj": <int>, "summary": "<2 Saetze Deutsch>", "factors": ["<F1>", "<F2>"]}}')
        msgs = [{"role": "user", "content": prompt}]
        text = ""
        try:
            for _round in range(4):
                body = json.dumps({"model": "claude-sonnet-4-6", "max_tokens": 1000,
                                   "messages": msgs,
                                   "tools": [{"type": "web_search_20250305", "name": "web_search"}]}).encode()
                req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
                    headers={"x-api-key": api_key, "anthropic-version": "2023-06-01",
                             "content-type": "application/json"})
                with urllib.request.urlopen(req, timeout=180) as r:
                    data = json.loads(r.read())
                if data.get("error"):
                    raise RuntimeError(data["error"].get("message", "API-Fehler"))
                msgs.append({"role": "assistant", "content": data.get("content", [])})
                text += "\n".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
                if data.get("stop_reason") == "pause_turn":
                    continue
                if '"home_adj"' in text and text.rfind("}") > text.find("{"):
                    break
                msgs.append({"role": "user", "content": "Gib jetzt AUSSCHLIESSLICH das geforderte JSON aus."})
            clean = text.replace("```json", "").replace("```", "")
            js = clean[clean.find("{"): clean.rfind("}") + 1]
            import re as _re
            m = _re.search(r"\{[\s\S]*\"home_adj\"[\s\S]*\}", clean)
            if m:
                js = m.group(0)
            parsed = json.loads(js)
            adjust[key] = {
                "ha": max(-75, min(75, int(parsed.get("home_adj", 0)))),
                "aa": max(-75, min(75, int(parsed.get("away_adj", 0)))),
                "summary": str(parsed.get("summary", ""))[:400],
                "factors": [str(f)[:150] for f in parsed.get("factors", [])][:3],
                "date": today.isoformat(),
            }
            print(f"  {key}: H{adjust[key]['ha']:+d} / A{adjust[key]['aa']:+d}")
        except Exception as e:
            print(f"  {key}: uebersprungen ({e})")

    with open("data/claude_adjust.json", "w") as f:
        json.dump(adjust, f, ensure_ascii=False, separators=(",", ":"))

    # Modell+KI-Picks separat einfrieren (fuer die A/B-Bilanz im Duell)
    import csv, os as _os
    ai_path = "data/ai_picks.csv"
    ai_rows = {}
    if _os.path.exists(ai_path):
        with open(ai_path) as f:
            for r in list(csv.reader(f))[1:]:
                if len(r) >= 2:
                    ai_rows[r[0]] = r
    for g in upcoming:
        key = f"{g['w']}-{g['a']}-{g['h']}"
        if key in ai_rows or key not in adjust:
            continue
        adj = adjust[key]
        h2 = dict(teams.get(g["h"], {})); a2 = dict(teams.get(g["a"], {}))
        if not h2 or not a2:
            continue
        h2["elo"] += adj["ha"]; a2["elo"] += adj["aa"]
        p = predict_game(g, {**teams, g["h"]: h2, g["a"]: a2}, model)
        if p is None:
            continue
        ai_rows[key] = [key, g["h"] if p >= 0.5 else g["a"], today.isoformat()]
    with open(ai_path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["key", "ai_pick", "locked"])
        w.writerows(ai_rows.values())
    return adjust


def ai_bilanz(games_all, season):
    """Abrechnung der eingefrorenen Modell+KI-Picks."""
    import csv, os as _os
    if not _os.path.exists("data/ai_picks.csv"):
        return None
    rows = {}
    with open("data/ai_picks.csv") as f:
        for r in list(csv.reader(f))[1:]:
            if len(r) >= 2:
                rows[r[0]] = r[1]
    n = hit = 0
    for _, g in games_all[games_all["season"] == season].iterrows():
        if pd.isna(g["home_score"]) or g["home_score"] == g["away_score"]:
            continue
        key = f"{int(g['week'])}-{g['away_team']}-{g['home_team']}"
        if key not in rows:
            continue
        winner = g["home_team"] if g["home_score"] > g["away_score"] else g["away_team"]
        n += 1
        if rows[key] == winner:
            hit += 1
    return {"n": n, "hit": hit} if n else None

if __name__ == "__main__":
    main()
