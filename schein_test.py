"""
Schein-Test - bringt die Auswahl des Wochenscheins etwas?

Die Pipeline friert in data/schein_protokoll.csv zwei Dinge ein, jeweils kurz
vor Anpfiff und danach nie wieder veraendert:

    art = schein      die vier Tipps, die der Rechner ausgewaehlt hat
    art = vergleich   stumpf jeder Favorit des Marktes derselben Woche,
                      flacher Einsatz von einer Einheit

Die interessante Frage ist nicht, ob der Schein Gewinn macht - bei rund 4 %
Marge des Buchmachers verlieren auf Dauer beide Seiten. Die Frage ist, ob die
AUSWAHL besser ist als kein Nachdenken. Deshalb wird gegen den Vergleich
gerechnet und nicht gegen null.

Aufruf:  python schein_test.py        (braucht pandas und numpy)
"""
import os
import sys

import numpy as np
import pandas as pd

GAMES = "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv"
PROTOKOLL = "data/schein_protokoll.csv"
MIN_WETTEN = 40      # darunter ist jeder Unterschied Zufall


def lade():
    if not os.path.exists(PROTOKOLL):
        sys.exit(f"{PROTOKOLL} fehlt - die Pipeline hat noch nichts eingefroren.")
    p = pd.read_csv(PROTOKOLL)
    if not len(p):
        sys.exit("Das Protokoll ist noch leer.")
    jahr = int(str(p["locked"].iloc[0])[:4])
    g = pd.read_csv(GAMES, low_memory=False)
    g = g[(g["season"] == jahr) & g["home_score"].notna()]
    g = g[g["home_score"] != g["away_score"]].copy()
    g["key"] = g["week"].astype(int).astype(str) + "-" + g["away_team"] + "-" + g["home_team"]
    g["sieger"] = np.where(g["home_score"] > g["away_score"], g["home_team"], g["away_team"])
    d = p.merge(g[["key", "sieger"]], on="key", how="inner")
    d["gewinn"] = np.where(d["pick"] == d["sieger"], d["einsatz"] * d["quote"], 0.0) - d["einsatz"]
    return p, d, jahr


def kennzahlen(d):
    if not len(d):
        return None
    ein = d["einsatz"].sum()
    return {"n": len(d), "treffer": int((d["pick"] == d["sieger"]).sum()),
            "einsatz": ein, "gewinn": d["gewinn"].sum(),
            "roi": d["gewinn"].sum() / ein if ein else float("nan")}


def zeile(name, k):
    if not k:
        return f"   {name:<22} -"
    return (f"   {name:<22} {k['treffer']:>3}/{k['n']:<3}  Einsatz {k['einsatz']:>7.1f}  "
            f"Ergebnis {k['gewinn']:>+7.2f}  ROI {k['roi'] * 100:>+6.1f} %")


def main():
    p, d, jahr = lade()
    schein = d[d["art"] == "schein"]
    vergleich = d[d["art"] == "vergleich"]
    print(f"Saison {jahr}: {len(p)} eingefrorene Zeilen, {len(d)} davon abgerechnet.\n")

    print("=" * 74)
    print("1  SCHEIN GEGEN STUMPFEN VERGLEICH")
    print("=" * 74)
    ks, kv = kennzahlen(schein), kennzahlen(vergleich)
    print(zeile("Schein (Auswahl)", ks))
    print(zeile("alle Markt-Favoriten", kv))
    if not ks:
        print("\n   Noch kein abgerechneter Tipp.")
        return 0

    # ROI je Einheit, damit unterschiedliche Einsaetze vergleichbar bleiben
    rs = (schein["gewinn"] / schein["einsatz"]).values
    rv = (vergleich["gewinn"] / vergleich["einsatz"]).values if kv else np.array([])
    if len(rv):
        rng = np.random.default_rng(3)
        boot = [rs[rng.integers(0, len(rs), len(rs))].mean() - rv[rng.integers(0, len(rv), len(rv))].mean()
                for _ in range(4000)]
        lo, hi = np.percentile(boot, [2.5, 97.5])
        print(f"\n   Unterschied je eingesetzter Einheit: {rs.mean() - rv.mean():+.4f}"
              f"   (95 %: {lo:+.4f} bis {hi:+.4f})")
        if len(schein) < MIN_WETTEN:
            print(f"   -> Zwischenstand. Fuer ein Urteil fehlen noch {MIN_WETTEN - len(schein)} Wetten.")
        else:
            print("   -> " + ("die Auswahl schlaegt den stumpfen Vergleich belegbar" if lo > 0 else
                              "die Auswahl ist belegbar schlechter als der stumpfe Vergleich" if hi < 0 else
                              "kein belegbarer Unterschied - die Auswahl bringt nichts Messbares"))

    print()
    print("=" * 74)
    print("2  WAR DER ERWARTUNGSWERT DES MODELLS BERECHTIGT?")
    print("=" * 74)
    # Das Modell hat je Tipp eine Wahrscheinlichkeit behauptet. Traf sie zu?
    mit_p = schein.dropna(subset=["p"])
    if len(mit_p):
        erwartet = mit_p["p"].mean() * 100
        real = (mit_p["pick"] == mit_p["sieger"]).mean() * 100
        print(f"   Modell versprach im Schnitt {erwartet:.1f} %, eingetreten sind {real:.1f} % "
              f"({len(mit_p)} Tipps).")
        if "p_markt" in mit_p and mit_p["p_markt"].notna().any():
            print(f"   Die Quote sagte zu denselben Tipps {mit_p['p_markt'].mean() * 100:.1f} %.")
        print("   Liegt der Markt naeher an der Realitaet, ist der Erwartungswert des")
        print("   Scheins eine Illusion - dann rechnet er mit zu optimistischen Zahlen.")

    print()
    print("=" * 74)
    print("3  WOCHE FUER WOCHE")
    print("=" * 74)
    for w, grp in schein.groupby("woche"):
        k = kennzahlen(grp)
        print(zeile(f"Woche {int(w)}", k))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
