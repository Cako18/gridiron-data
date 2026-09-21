"""
Markttest, volles Modell - schlaegt Cako's NFL World den Wettmarkt?

Ergaenzt markttest.py. Der erste Test pruefte nur Elo. Dieser baut den vollen
Merkmalssatz exakt wie update_data.py - Elo, QB-Rating, Offense-EPA,
Defense-EPA, CPOE, alles walk-forward und ohne Blick in die Zukunft - und
prueft ihn streng ausserhalb der Stichprobe:

    Training  2006-2019
    Test      2020-2026, nie zum Anpassen benutzt

Drei Fragen:
    1. Traegt irgendein Merkmal etwas bei, das der Markt nicht kennt?
    2. Sagt Markt + Modell die ungesehenen Spiele besser voraus als der Markt?
    3. Wie oft hat das Modell recht, wenn es anderer Meinung ist als der Markt?

Aufruf:  python markttest_voll.py     (braucht pandas und numpy)
Erster Lauf laedt ca. 190 MB von nflverse, behaelt davon ~20 MB im Ordner cache/.
"""
import math
import os
import urllib.request
from collections import defaultdict
from math import comb

import numpy as np
import pandas as pd

GAMES = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
STATS = "https://github.com/nflverse/nflverse-data/releases/download/stats_team/stats_team_week_{y}.csv"
PSTAT = "https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_{y}.csv"
JAHRE = range(2006, 2027)
TRAIN_BIS = 2019

# Muss mit update_data.py uebereinstimmen.
K, HOME_ADV, START, REG = 20, 48, 1500, 0.33
QB_ALPHA, QB_REPL, QB_MIN_STARTS = 2 / 13, -0.06, 3
MERKMALE = ["elo_diff", "qb_diff", "off_diff", "def_diff", "cpoe_diff"]
CACHE = "cache"


def lade(url, pfad):
    if not os.path.exists(pfad):
        with urllib.request.urlopen(url, timeout=180) as r:
            open(pfad, "wb").write(r.read())
    return pfad


def teamstats():
    frames = []
    for y in JAHRE:
        try:
            frames.append(pd.read_csv(lade(STATS.format(y=y), f"{CACHE}/st_{y}.csv"), low_memory=False))
        except Exception as e:
            print(f"  Teamstats {y} fehlt: {e}")
    return pd.concat(frames, ignore_index=True)


def qb_leistungen():
    teile = []
    for y in JAHRE:
        pfad = f"{CACHE}/qb_{y}.csv"
        if not os.path.exists(pfad):
            try:
                with urllib.request.urlopen(PSTAT.format(y=y), timeout=180) as r:
                    roh = pd.read_csv(r, low_memory=False)
            except Exception as e:
                print(f"  Spielerstats {y} fehlt: {e}")
                continue
            spalten = [c for c in ["season", "week", "player_display_name", "position", "attempts",
                                   "sacks_suffered", "passing_epa", "carries", "rushing_epa"]
                       if c in roh.columns]
            roh[roh["position"] == "QB"][spalten].to_csv(pfad, index=False)
        teile.append(pd.read_csv(pfad))
    pl = pd.concat(teile, ignore_index=True)
    for c in ["attempts", "sacks_suffered", "passing_epa", "carries", "rushing_epa"]:
        pl[c] = pd.to_numeric(pl.get(c, 0), errors="coerce").fillna(0.0)
    pl["vol"] = pl["attempts"] + pl["sacks_suffered"] + pl["carries"]
    pl = pl[pl["vol"] >= 10].copy()
    pl["qb_epa"] = (pl["passing_epa"] + pl["rushing_epa"]) / pl["vol"].clip(lower=1)
    return pl


def baue_merkmale():
    g = pd.read_csv(GAMES, low_memory=False).dropna(subset=["home_score", "away_score"])
    g = g.sort_values(["season", "gameday", "game_id"]).reset_index(drop=True)

    # Elo, walk-forward
    elo, cur, ed = defaultdict(lambda: float(START)), None, []
    for _, r in g.iterrows():
        if r["season"] != cur:
            if cur is not None:
                for t in list(elo):
                    elo[t] += REG * (START - elo[t])
            cur = r["season"]
        h, a = r["home_team"], r["away_team"]
        d = elo[h] + HOME_ADV - elo[a]
        ed.append(d)
        p = 1 / (1 + 10 ** (-d / 400))
        hs, as_ = r["home_score"], r["away_score"]
        act = 1.0 if hs > as_ else (0.5 if hs == as_ else 0.0)
        pdf = hs - as_
        mult = math.log(abs(pdf) + 1) * (2.2 / ((d if hs > as_ else -d) * 0.001 + 2.2)) if pdf else 1.0
        s = K * mult * (act - p)
        elo[h] += s
        elo[a] -= s
    g["elo_diff"] = ed

    # Teamform, Stand VOR dem Spiel
    st = teamstats()
    st = st.assign(
        plays=st["attempts"].fillna(0) + st["carries"].fillna(0) + st["sacks_suffered"].fillna(0))
    st = st.assign(off_epa_pp=(st["passing_epa"].fillna(0) + st["rushing_epa"].fillna(0))
                   / st["plays"].clip(lower=1))
    opp = st[["game_id", "team", "off_epa_pp"]].rename(
        columns={"team": "opponent_team", "off_epa_pp": "def_epa_pp"})
    st = st.merge(opp, on=["game_id", "opponent_team"], how="left")
    st = st.sort_values(["team", "season", "week"]).reset_index(drop=True).copy()

    def ewma_vor(grp, col):
        prev, cs, n, vor = None, None, 0, []
        for _, r in grp.iterrows():
            if r["season"] != cs:
                cs, n = r["season"], 0
            vor.append(prev)
            v = r[col]
            if pd.isna(v):
                n += 1
                continue
            prev = v if prev is None else prev + (0.60 if n == 0 else 2 / 11) * (v - prev)
            n += 1
        return vor

    neu = {}
    for col, name in [("off_epa_pp", "f_off"), ("def_epa_pp", "f_def"), ("passing_cpoe", "f_cpoe")]:
        s = pd.Series(np.nan, index=st.index, dtype="float64")
        for _, grp in st.groupby("team", sort=False):
            s.loc[grp.index] = pd.Series(ewma_vor(grp, col), index=grp.index, dtype="float64")
        neu[name] = s
    st = pd.concat([st, pd.DataFrame(neu)], axis=1)

    tf = st[["game_id", "team", "f_off", "f_def", "f_cpoe"]]
    for side in ["home", "away"]:
        g = g.merge(tf.rename(columns={"team": f"{side}_team", "f_off": f"{side}_off",
                                       "f_def": f"{side}_def", "f_cpoe": f"{side}_cpoe"}),
                    on=["game_id", f"{side}_team"], how="left")

    # QB-Rating, walk-forward
    pl = qb_leistungen()
    qperf = {(int(r.season), int(r.week), r.player_display_name): float(r.qb_epa)
             for r in pl.itertuples() if pd.notna(r.week)}
    qr, qs, qh, qa = {}, defaultdict(int), [], []
    for _, r in g.iterrows():
        for side, arr in [("home", qh), ("away", qa)]:
            qb = r[f"{side}_qb_name"]
            if not isinstance(qb, str):
                arr.append(np.nan)
                continue
            arr.append(qr.get(qb, QB_REPL) if qs[qb] >= QB_MIN_STARTS else QB_REPL)
            wk = pd.to_numeric(r["week"], errors="coerce")
            obs = qperf.get((int(r["season"]), int(wk), qb)) if pd.notna(wk) else None
            if obs is not None:
                prev = qr.get(qb, obs)
                qr[qb] = prev + QB_ALPHA * (obs - prev)
                qs[qb] += 1

    g = g.assign(qb_diff=np.array(qh) - np.array(qa),
                 off_diff=g["home_off"] - g["away_off"],
                 def_diff=g["away_def"] - g["home_def"],
                 cpoe_diff=g["home_cpoe"] - g["away_cpoe"])

    def ml(x):
        try:
            x = float(x)
        except (TypeError, ValueError):
            return np.nan
        return 100 / (x + 100) if x > 0 else (-x) / ((-x) + 100)

    ph, pa = g["home_moneyline"].map(ml), g["away_moneyline"].map(ml)
    g = g.assign(p_mkt=ph / (ph + pa), y=(g["home_score"] > g["away_score"]).astype(float))
    g = g[g["home_score"] != g["away_score"]]
    d = g[["season", "y", "p_mkt"] + MERKMALE].dropna()
    return d[(d.p_mkt > 0.02) & (d.p_mkt < 0.98)].copy()


def irls(X, y, it=80):
    b = np.zeros(X.shape[1])
    for _ in range(it):
        p = 1 / (1 + np.exp(-np.clip(X @ b, -30, 30)))
        W = np.clip(p * (1 - p), 1e-9, None)
        H = X.T @ (X * W[:, None])
        s = np.linalg.solve(H, X.T @ (y - p))
        b += s
        if np.max(np.abs(s)) < 1e-10:
            break
    return b, np.sqrt(np.diag(np.linalg.inv(H)))


def logloss(p, y):
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return -(y * np.log(p) + (1 - y) * np.log(1 - p))


def main():
    os.makedirs(CACHE, exist_ok=True)
    d = baue_merkmale()
    d["m"] = np.log(d.p_mkt / (1 - d.p_mkt))
    tr, te = d[d.season <= TRAIN_BIS], d[d.season > TRAIN_BIS]
    mu, sd = tr[MERKMALE].mean(), tr[MERKMALE].std()
    Z = lambda df: ((df[MERKMALE] - mu) / sd).values
    one = lambda df: np.ones((len(df), 1))
    print(f"Training {len(tr)} Spiele (bis {TRAIN_BIS}) | Test {len(te)} Spiele (ab {TRAIN_BIS + 1})\n")

    print("=" * 76)
    print("1  WAS TRAEGT UEBER DEN MARKT HINAUS?")
    print("=" * 76)
    b, se = irls(np.hstack([one(tr), tr[["m"]].values, Z(tr)]), tr.y.values)
    for nm, bi, si in zip(["Konstante", "logit(Markt)"] + MERKMALE, b, se):
        lo, hi = bi - 1.96 * si, bi + 1.96 * si
        print(f"   {nm:<14} {bi:+.4f}  95 %: {lo:+.4f} bis {hi:+.4f}   "
              f"{'TRAEGT' if (lo > 0 or hi < 0) else '-'}")

    print()
    print("=" * 76)
    print("2  AUSSERHALB DER STICHPROBE")
    print("=" * 76)
    y = te.y.values
    bM, _ = irls(np.hstack([one(tr), Z(tr)]), tr.y.values)
    bK, _ = irls(np.hstack([one(tr), tr[["m"]].values, Z(tr)]), tr.y.values)
    p_modell = 1 / (1 + np.exp(-(np.hstack([one(te), Z(te)]) @ bM)))
    p_komb = 1 / (1 + np.exp(-(np.hstack([one(te), te[["m"]].values, Z(te)]) @ bK)))
    p_markt = te.p_mkt.values
    basis = logloss(p_markt, y).mean()
    print(f"   {'':<22}{'LogLoss':>9}{'Treffer':>9}{'vs Markt':>11}")
    for nm, p in [("Markt", p_markt), ("Modell allein", p_modell), ("Markt + Modell", p_komb)]:
        print(f"   {nm:<22}{logloss(p, y).mean():>9.4f}"
              f"{np.mean((p >= 0.5) == (y == 1)) * 100:>8.1f}%{logloss(p, y).mean() - basis:>+11.4f}")

    rng = np.random.default_rng(7)
    diff = logloss(p_komb, y) - logloss(p_markt, y)
    boot = [diff[rng.integers(0, len(y), len(y))].mean() for _ in range(4000)]
    lo, hi = np.percentile(boot, [2.5, 97.5])
    print(f"\n   Gewinn durch das Modell: {diff.mean():+.5f}, Bootstrap-95 %: {lo:+.5f} bis {hi:+.5f}")
    print("   -> " + ("belegbarer Mehrwert" if hi < 0 else "nicht von null zu unterscheiden"))

    print()
    print("=" * 76)
    print("3  WENN DAS MODELL ANDERER MEINUNG IST ALS DER MARKT")
    print("=" * 76)
    anders = (p_modell >= 0.5) != (p_markt >= 0.5)
    n = int(anders.sum())
    k = int(np.sum(((p_modell >= 0.5) == (y == 1))[anders]))
    q = k / n
    se_q = math.sqrt(q * (1 - q) / n)
    p_wert = sum(comb(n, i) * 0.5 ** n for i in range(n + 1) if abs(i - n / 2) >= abs(k - n / 2))
    print(f"   {n} von {len(te)} Spielen ({n / len(te) * 100:.1f} %)")
    print(f"   Modell richtig: {k} = {q * 100:.1f} %  (95 %: {(q - 1.96 * se_q) * 100:.1f} "
          f"bis {(q + 1.96 * se_q) * 100:.1f} %, Test gegen 50 %: p = {p_wert:.4f})")
    if q + 1.96 * se_q < 0.5:
        print("   -> SIGNIFIKANT UNTER 50 %. Gegen den Markt zu tippen ist ein Verlustgeschaeft.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
