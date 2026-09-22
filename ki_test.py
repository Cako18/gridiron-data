"""
KI-Test - bringt die KI-Kontextanalyse etwas?

Die Recherche in ai_context.py kostet jede Woche Geld. Sie fliesst nicht in die
offiziellen Picks ein; stattdessen friert update_data.py in data/ki_protokoll.csv
fuer jedes Spiel zum Lock-Zeitpunkt beides ein: die Wahrscheinlichkeit des
Modells ohne und mit den KI-Anpassungen, dazu die Marktquote dieses Moments.
Dieses Skript rechnet ab.

Drei Fragen, in steigender Strenge:

    1. Trifft Modell+KI besser als das Modell allein?
    2. Traegt die KI-Anpassung etwas bei, das der Markt nicht schon kennt?
    3. Bewegt die KI das Modell nur dorthin, wo der Markt ohnehin steht?

Frage 2 ist die eigentliche. Eine Recherche, die das Modell nur an den Markt
heranfuehrt, verbessert Frage 1 - und ist trotzdem nutzlos, weil man die Quote
auch direkt ablesen koennte.

Ausgewertet werden nur Spiele, an denen die KI etwas geaendert hat. Unter
MIN_SPIELE gibt das Skript Zwischenstaende aus, aber kein Urteil.

Aufruf:  python ki_test.py        (braucht pandas und numpy)
"""
import csv
import math
import os
import sys

import numpy as np
import pandas as pd

GAMES = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
PROTOKOLL = "data/ki_protokoll.csv"
MIN_SPIELE = 60     # darunter sind selbst grosse Unterschiede meist Zufall


def logit(p):
    p = min(max(p, 1e-6), 1 - 1e-6)
    return math.log(p / (1 - p))


def logloss(p, y):
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return -(y * np.log(p) + (1 - y) * np.log(1 - p))


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


def lade():
    if not os.path.exists(PROTOKOLL):
        sys.exit(f"{PROTOKOLL} fehlt - die Pipeline hat noch nichts eingefroren.")
    prot = pd.read_csv(PROTOKOLL)
    g = pd.read_csv(GAMES, low_memory=False).dropna(subset=["home_score", "away_score"])
    g = g[g["home_score"] != g["away_score"]]
    g["key"] = g["week"].astype(int).astype(str) + "-" + g["away_team"] + "-" + g["home_team"]
    g["y"] = (g["home_score"] > g["away_score"]).astype(float)
    # Nur die Saison des Protokolls - Schluessel wiederholen sich jedes Jahr
    jahr = int(str(prot["locked"].iloc[0])[:4]) if len(prot) else None
    if jahr:
        g = g[g["season"] == jahr]
    d = prot.merge(g[["key", "y"]], on="key", how="inner")
    return prot, d


def main():
    prot, d = lade()
    alle = len(d)
    d = d[(d["ha"] != 0) | (d["aa"] != 0)].copy()
    n = len(d)
    print(f"Protokoll: {len(prot)} eingefrorene Spiele, {alle} mit Ergebnis, "
          f"davon {n} mit KI-Anpassung.\n")
    if n == 0:
        print("Noch kein abgerechnetes Spiel mit KI-Anpassung.")
        return 0

    y = d["y"].values
    pm, pk = d["p_model"].values, d["p_ki"].values
    hat_markt = d["p_markt"].notna().values

    print("=" * 72)
    print("1  TRIFFT MODELL+KI BESSER ALS DAS MODELL ALLEIN?")
    print("=" * 72)
    tm = np.mean((pm >= 0.5) == (y == 1)) * 100
    tk = np.mean((pk >= 0.5) == (y == 1)) * 100
    print(f"   Treffer   Modell {tm:5.1f} %   Modell+KI {tk:5.1f} %")
    print(f"   LogLoss   Modell {logloss(pm, y).mean():.4f}   Modell+KI {logloss(pk, y).mean():.4f}")
    wechsel = (pm >= 0.5) != (pk >= 0.5)
    if wechsel.any():
        k = int(np.sum(((pk >= 0.5) == (y == 1))[wechsel]))
        print(f"   Die KI hat {int(wechsel.sum())}-mal den Tipp gedreht, danach richtig: {k}")
    diff = logloss(pk, y) - logloss(pm, y)
    rng = np.random.default_rng(7)
    boot = [diff[rng.integers(0, n, n)].mean() for _ in range(4000)]
    lo, hi = np.percentile(boot, [2.5, 97.5])
    print(f"   Gewinn durch die KI: {diff.mean():+.4f}  (Bootstrap-95 %: {lo:+.4f} bis {hi:+.4f})")
    if n < MIN_SPIELE:
        print(f"   -> Zwischenstand. Fuer ein Urteil fehlen noch {MIN_SPIELE - n} Spiele.")
    else:
        print("   -> " + ("KI verbessert das Modell belegbar" if hi < 0 else
                          "KI verschlechtert das Modell belegbar" if lo > 0 else
                          "kein belegbarer Unterschied"))

    dm = d[hat_markt]
    if len(dm) >= 10:
        print()
        print("=" * 72)
        print("2  TRAEGT DIE KI ETWAS BEI, DAS DER MARKT NICHT KENNT?")
        print("=" * 72)
        ym = dm["y"].values
        X = np.column_stack([np.ones(len(dm)),
                             dm["p_markt"].map(logit).values,
                             dm["p_ki"].map(logit).values - dm["p_model"].map(logit).values])
        b, se = irls(X, ym)
        lo2, hi2 = b[2] - 1.96 * se[2], b[2] + 1.96 * se[2]
        print(f"   Ergebnis ~ Markt + KI-Verschiebung   (n = {len(dm)})")
        print(f"   KI-Verschiebung: {b[2]:+.3f}   95 %: {lo2:+.3f} bis {hi2:+.3f}")
        if len(dm) < MIN_SPIELE:
            print("   -> Zwischenstand, noch kein Urteil.")
        else:
            print("   -> " + ("die KI weiss etwas, das die Quote nicht enthaelt" if lo2 > 0 else
                              "die KI-Verschiebung zeigt in die falsche Richtung" if hi2 < 0 else
                              "kein Mehrwert gegenueber der Quote belegbar"))

        print()
        print("=" * 72)
        print("3  FUEHRT DIE KI DAS MODELL NUR ZUM MARKT?")
        print("=" * 72)
        zum_markt = np.abs(dm["p_ki"] - dm["p_markt"]) < np.abs(dm["p_model"] - dm["p_markt"])
        print(f"   In {zum_markt.mean() * 100:.0f} % der Faelle rueckt die KI das Modell naeher an die Quote.")
        print("   Hoch heisst: die Recherche findet vor allem, was der Markt schon eingepreist hat.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
