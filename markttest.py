"""
Markttest - schlaegt unser Elo den Wettmarkt?

Hintergrund
-----------
Im September 2026 fiel auf, dass das Modell dem Markt sehr nah folgt: eine
Regression der Modell- auf die Marktwahrscheinlichkeit ergab bei 32 Spielen
R^2 = 0,82 bei einer Steigung von 0,825. Das Modell nahm also im Wesentlichen
die Marktmeinung und zog sie zum Unentschieden. Zwei Fragen blieben offen:

  1. Ist diese Daempfung gerechtfertigt - ist Elo ueberkonfident?
  2. Traegt Elo ueberhaupt etwas bei, das der Markt nicht schon kennt?

Bei 32 Spielen ist beides nicht entscheidbar. Dieses Skript beantwortet es
auf der vollen Historie: Elo wird walk-forward exakt wie in update_data.py
gerechnet, die Marktwahrscheinlichkeit kommt entvigt aus den Moneylines.

Aufruf
------
    python markttest.py

Braucht nur die Standardbibliothek und Netzzugang zu nflverse.
"""
import csv
import io
import math
import urllib.request
from collections import defaultdict

GAMES_URL = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"

# Muss mit update_data.py uebereinstimmen, sonst testet das Skript ein anderes Modell.
K, HOME_ADV, START, REG = 20, 48, 1500, 0.33

logit = lambda p: math.log(p / (1 - p))
sigmoid = lambda z: 1 / (1 + math.exp(-z))


def lade_spiele():
    with urllib.request.urlopen(GAMES_URL, timeout=120) as r:
        text = r.read().decode("utf-8", "replace")
    rows = [r for r in csv.DictReader(io.StringIO(text))
            if r["home_score"] and r["away_score"] and r["gameday"]]
    rows.sort(key=lambda r: (int(r["season"]), r["gameday"], r["gametime"] or ""))
    return rows


def elo_walk_forward(spiele):
    """Pre-Game-Elo je Spiel, identisch zu compute_elo() in update_data.py."""
    elo = defaultdict(lambda: float(START))
    saison = None
    aus = []
    for g in spiele:
        s = int(g["season"])
        if s != saison:
            if saison is not None:                       # Regression zur Mitte
                for t in list(elo):
                    elo[t] += REG * (START - elo[t])
            saison = s
        h, a = g["home_team"], g["away_team"]
        d = elo[h] + HOME_ADV - elo[a]
        p = 1 / (1 + 10 ** (-d / 400))
        aus.append((g, p))

        hs, as_ = float(g["home_score"]), float(g["away_score"])
        act = 1.0 if hs > as_ else (0.5 if hs == as_ else 0.0)
        pdf = hs - as_
        mult = (math.log(abs(pdf) + 1) * (2.2 / ((d if hs > as_ else -d) * 0.001 + 2.2))
                if pdf else 1.0)
        schritt = K * mult * (act - p)
        elo[h] += schritt
        elo[a] -= schritt
    return aus


def moneyline_prob(ml):
    """Amerikanische Quote -> implizite Wahrscheinlichkeit (noch mit Marge)."""
    try:
        ml = float(ml)
    except (TypeError, ValueError):
        return None
    return 100 / (ml + 100) if ml > 0 else (-ml) / ((-ml) + 100)


def logreg(X, y, iters=60):
    """Logistische Regression per IRLS. Liefert Koeffizienten und Standardfehler."""
    k = len(X[0])
    b = [0.0] * k
    inv = None
    for _ in range(iters):
        grad = [0.0] * k
        H = [[0.0] * k for _ in range(k)]
        for xi, yi in zip(X, y):
            z = sum(bj * xj for bj, xj in zip(b, xi))
            p = sigmoid(max(-30, min(30, z)))
            w = max(p * (1 - p), 1e-9)
            r = yi - p
            for i in range(k):
                grad[i] += r * xi[i]
                for j in range(k):
                    H[i][j] += w * xi[i] * xi[j]
        M = [H[i][:] + [1.0 if i == j else 0.0 for j in range(k)] for i in range(k)]
        for c in range(k):                               # Gauss-Jordan
            piv = max(range(c, k), key=lambda r_: abs(M[r_][c]))
            M[c], M[piv] = M[piv], M[c]
            d = M[c][c] or 1e-12
            M[c] = [v / d for v in M[c]]
            for r_ in range(k):
                if r_ != c and M[r_][c]:
                    f = M[r_][c]
                    M[r_] = [v - f * w2 for v, w2 in zip(M[r_], M[c])]
        inv = [row[k:] for row in M]
        schritt = [sum(inv[i][j] * grad[j] for j in range(k)) for i in range(k)]
        b = [bi + si for bi, si in zip(b, schritt)]
        if max(abs(s) for s in schritt) < 1e-10:
            break
    return b, [math.sqrt(max(inv[i][i], 0.0)) for i in range(k)]


def urteil(b, se, gegen=0.0):
    lo, hi = b - 1.96 * se, b + 1.96 * se
    return lo, hi, (lo > gegen or hi < gegen)


def guete(ps, y):
    ll = -sum(yi * math.log(max(p, 1e-9)) + (1 - yi) * math.log(max(1 - p, 1e-9))
              for p, yi in zip(ps, y)) / len(y)
    brier = sum((p - yi) ** 2 for p, yi in zip(ps, y)) / len(y)
    treffer = sum(1 for p, yi in zip(ps, y) if (p >= 0.5) == (yi == 1)) / len(y)
    return ll, brier, treffer


def main():
    spiele = lade_spiele()
    mit_elo = elo_walk_forward(spiele)

    daten = []
    for g, p_elo in mit_elo:
        ph, pa = moneyline_prob(g["home_moneyline"]), moneyline_prob(g["away_moneyline"])
        if ph is None or pa is None:
            continue
        hs, as_ = float(g["home_score"]), float(g["away_score"])
        if hs == as_:                                    # Unentschieden hat keinen Sieger
            continue
        p_mkt = ph / (ph + pa)                           # Marge herausgerechnet
        if not (0.02 < p_mkt < 0.98 and 0.02 < p_elo < 0.98):
            continue
        try:
            rest = max(-7.0, min(7.0, float(g["home_rest"]) - float(g["away_rest"])))
        except (TypeError, ValueError):
            rest = 0.0
        daten.append({
            "p_elo": p_elo, "p_mkt": p_mkt,
            "rest": rest, "div": 1.0 if g["div_game"] == "1" else 0.0,
            "y": 1.0 if hs > as_ else 0.0, "saison": int(g["season"]),
        })

    y = [d["y"] for d in daten]
    print(f"Datenbasis: {len(daten)} Spiele, "
          f"Saisons {min(d['saison'] for d in daten)}-{max(d['saison'] for d in daten)}\n")

    print("=" * 74)
    print("TEST 1  Ist Elo ueber- oder unterkonfident?")
    print("=" * 74)
    b, se = logreg([[1.0, logit(d["p_elo"])] for d in daten], y)
    lo, hi, _ = urteil(b[1], se[1], gegen=1.0)
    print(f"   Ergebnis ~ a + b * logit(Elo)")
    print(f"   b = {b[1]:+.3f}   95 %-Intervall {lo:.3f} bis {hi:.3f}")
    if lo > 1:
        print("   -> Elo ist UNTERkonfident. Daempfung schadet.")
    elif hi < 1:
        print("   -> Elo ist UEBERkonfident. Daempfung ist richtig.")
    else:
        print("   -> b ist nicht von 1 zu unterscheiden: Elo ist sauber geeicht.")
        print("      Eine Daempfung unter diesem Intervall ist nicht begruendbar.")
    b_elo_allein = b

    print()
    print("=" * 74)
    print("TEST 2  Traegt Elo etwas bei, das der Markt nicht schon kennt?")
    print("=" * 74)
    b2, se2 = logreg([[1.0, logit(d["p_mkt"]), logit(d["p_elo"])] for d in daten], y)
    for nm, bi, si in zip(["Konstante", "logit(Markt)", "logit(Elo)"], b2, se2):
        lo, hi, sig_ = urteil(bi, si)
        print(f"   {nm:<14} {bi:+.4f}  95 %: {lo:+.4f} bis {hi:+.4f}   "
              f"{'traegt bei' if sig_ else 'nicht von 0 zu unterscheiden'}")

    print()
    print("=" * 74)
    print("TEST 3  Zusatzmerkmale aus dem Spielplan")
    print("=" * 74)
    b3, se3 = logreg([[1.0, logit(d["p_mkt"]), logit(d["p_elo"]), d["rest"], d["div"]]
                      for d in daten], y)
    for nm, bi, si in zip(["Konstante", "logit(Markt)", "logit(Elo)",
                           "Ruhetage-Differenz", "Divisionsspiel"], b3, se3):
        lo, hi, sig_ = urteil(bi, si)
        print(f"   {nm:<20} {bi:+.4f}  95 %: {lo:+.4f} bis {hi:+.4f}   "
              f"{'traegt bei' if sig_ else 'nichts'}")

    print()
    print("=" * 74)
    print("TEST 4  Wer sagt die Spiele besser voraus?")
    print("=" * 74)
    print(f"   {'':<26}{'LogLoss':>9}{'Brier':>9}{'Treffer':>9}")
    varianten = [
        ("Markt", [d["p_mkt"] for d in daten]),
        ("Elo pur", [d["p_elo"] for d in daten]),
        ("Elo, neu geeicht", [sigmoid(b_elo_allein[0] + b_elo_allein[1] * logit(d["p_elo"]))
                              for d in daten]),
        ("Markt + Elo kombiniert", [sigmoid(b2[0] + b2[1] * logit(d["p_mkt"])
                                            + b2[2] * logit(d["p_elo"])) for d in daten]),
    ]
    for nm, ps in varianten:
        ll, br, tr = guete(ps, y)
        print(f"   {nm:<26}{ll:>9.4f}{br:>9.4f}{tr * 100:>8.1f}%")
    print("   LogLoss und Brier: kleiner ist besser.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
