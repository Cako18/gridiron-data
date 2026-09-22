"""
Live-Test - wie gut trifft die Live-Siegwahrscheinlichkeit echte Spielverlaeufe?

Prueft die Formel aus liveWP() (src/nfl-predictor.jsx) an allen Spielzuegen der
regulaeren Saisons 2019-2024 aus nflverse. Angepasst wird an 2019-2021, geprueft
an 2022-2024. Als Vorab-Wahrscheinlichkeit dient die entvigte Marktquote.

Verglichen werden Varianten der Umrechnung Vorab-Wahrscheinlichkeit -> erwarteter
Punkteabstand:

    A  16 * log10(p / (1 - p))           bis September 2026 im Einsatz
    B  15,94 * Phi^-1(p)                 ab September 2026: trifft beim Anpfiff
                                         exakt die Prognose
    C  k * logit(p), k frei angepasst
    D  alle Konstanten frei angepasst

Aufruf:  python live_test.py   (braucht pandas, numpy, scipy; laedt ~120 MB)
"""
import io
import os
import urllib.request
from statistics import NormalDist

import numpy as np
import pandas as pd
from scipy.optimize import minimize
from scipy.stats import norm

GAMES = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
PBP = "https://github.com/nflverse/nflverse-data/releases/download/pbp/play_by_play_{y}.csv.gz"
JAHRE, TRAIN_BIS, CACHE = range(2019, 2025), 2021, "cache"
SPALTEN = ["game_id", "season", "season_type", "home_team", "away_team", "posteam", "qtr",
           "game_seconds_remaining", "total_home_score", "total_away_score", "play_type"]
ALT = 16 / np.log(10)


def zustaende():
    teile = []
    for y in JAHRE:
        pfad = f"{CACHE}/pbp_{y}.pkl"
        if not os.path.exists(pfad):
            with urllib.request.urlopen(PBP.format(y=y), timeout=300) as r:
                df = pd.read_csv(io.BytesIO(r.read()), compression="gzip",
                                 usecols=lambda c: c in SPALTEN, low_memory=False)
            df[df.season_type == "REG"].to_pickle(pfad)
        teile.append(pd.read_pickle(pfad))
    pbp = pd.concat(teile, ignore_index=True)
    g = pd.read_csv(GAMES, low_memory=False)
    g = g[g.home_score.notna() & g.home_moneyline.notna() & (g.home_score != g.away_score)]
    ml = lambda x: 100 / (x + 100) if x > 0 else (-x) / ((-x) + 100)
    g = g.assign(p_pre=g.home_moneyline.map(ml) / (g.home_moneyline.map(ml) + g.away_moneyline.map(ml)),
                 y=(g.home_score > g.away_score).astype(float))
    d = pbp.merge(g[["game_id", "p_pre", "y"]], on="game_id", how="inner")
    d = d[(d.qtr <= 4) & d.game_seconds_remaining.notna() & d.total_home_score.notna() & d.play_type.notna()]
    return d.assign(
        sec=d.game_seconds_remaining.clip(0, 3600),
        diff=d.total_home_score - d.total_away_score,
        poss=np.where(d.posteam == d.home_team, 1.0, np.where(d.posteam == d.away_team, -1.0, 0.0)),
        phi_inv=d.p_pre.map(lambda p: NormalDist().inv_cdf(min(max(p, 1e-4), 1 - 1e-4))),
        logit=np.log(d.p_pre / (1 - d.p_pre)),
    ).reset_index(drop=True)


def wp(df, m0, a=12.82, b=3.12, poss_w=1.94):
    z = df.sec.values / 3600.0
    em = df["diff"].values + m0 * z + poss_w * df.poss.values * np.minimum(1, z * 3)
    p = norm.cdf(em / (a * np.sqrt(z) + b))
    d = df["diff"].values
    return np.where(z == 0, np.where(d > 0, 1.0, np.where(d < 0, 0.0, 0.5)), p)


def ll(p, y):
    p = np.clip(p, 1e-6, 1 - 1e-6)
    return -(y * np.log(p) + (1 - y) * np.log(1 - p))


def main():
    os.makedirs(CACHE, exist_ok=True)
    d = zustaende()
    tr, te = d[d.season <= TRAIN_BIS], d[d.season > TRAIN_BIS]
    kC = minimize(lambda k: ll(wp(tr, k[0] * tr.logit.values), tr.y.values).mean(),
                  [ALT], method="Nelder-Mead").x[0]
    xD = minimize(lambda x: ll(wp(tr, x[0] * tr.logit.values, x[1], x[2], x[3]), tr.y.values).mean(),
                  [ALT, 12.82, 3.12, 1.94], method="Nelder-Mead",
                  options={"maxiter": 4000, "xatol": 1e-4, "fatol": 1e-8}).x
    varianten = {
        "A  16*log10 (alt)": lambda df: wp(df, ALT * df.logit.values),
        "B  15,94*Phi^-1 (neu)": lambda df: wp(df, 15.94 * df.phi_inv.values),
        f"C  Faktor frei, k={kC:.2f}": lambda df: wp(df, kC * df.logit.values),
        "D  alles frei": lambda df: wp(df, xD[0] * df.logit.values, xD[1], xD[2], xD[3]),
    }
    print(f"{len(d)} Spielzustaende | Training {tr.game_id.nunique()} Spiele | Test {te.game_id.nunique()} Spiele\n")
    y = te.y.values
    vq = np.select([te.sec.values > 2700, te.sec.values > 1800, te.sec.values > 900], ["Q1", "Q2", "Q3"], "Q4")
    basis = ll(varianten["A  16*log10 (alt)"](te), y)
    print(f"{'':28}{'gesamt':>8}{'Q1':>8}{'Q2':>8}{'Q3':>8}{'Q4':>8}   vs A")
    for nm, f in varianten.items():
        l = ll(f(te), y)
        print(f"{nm:28}{l.mean():8.4f}" + "".join(f"{l[vq == q].mean():8.4f}" for q in ["Q1", "Q2", "Q3", "Q4"])
              + f"   {l.mean() - basis.mean():+.4f}")
    ids = te.game_id.values
    uniq = np.unique(ids)
    lb = ll(varianten["B  15,94*Phi^-1 (neu)"](te), y)
    je = pd.DataFrame({"g": ids, "d": lb - basis}).groupby("g")["d"].agg(["sum", "count"])
    rng = np.random.default_rng(11)
    boot = []
    for _ in range(3000):
        s = je.iloc[rng.integers(0, len(je), len(je))]
        boot.append(s["sum"].sum() / s["count"].sum())
    lo, hi = np.percentile(boot, [2.5, 97.5])
    print(f"\nB gegen A: {np.mean(lb - basis):+.5f}  (Bootstrap ueber Spiele, 95 %: {lo:+.5f} bis {hi:+.5f})")
    print("-> " + ("B belegbar besser" if hi < 0 else "B belegbar schlechter" if lo > 0 else "kein belegbarer Unterschied"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
