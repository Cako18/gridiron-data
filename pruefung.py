"""
Selbstpruefung - prueft monatlich, ob das Modell noch das richtige Modell ist.

Warum es das gibt
-----------------
Die Pipeline trainiert jede Nacht neu, aber sie stellt sich nie die Frage, ob
die RECHENVORSCHRIFT noch stimmt. Welche Merkmale aktiv sind, wurde im
September 2026 einmal gemessen und seitdem geglaubt. Dieses Skript wiederholt
die Messung mit den Daten von heute und schreibt das Ergebnis ins Repo.

Was es tut
----------
1. Ablation, walk-forward: Jede Testsaison wird mit einem Modell vorhergesagt,
   das nur die Jahre davor kennt. Dann wird geprueft, was passiert, wenn man
   ein aktives Merkmal weglaesst - und was, wenn man ein abgeschaltetes
   wieder dazunimmt.
2. Kalibrierung: Halten die versprochenen Wahrscheinlichkeiten?
3. Vergleich mit dem Markt auf denselben Spielen.

Was es NICHT tut
----------------
Es aendert das Modell nicht. Eine Empfehlung wird nur ausgesprochen, wenn das
Bootstrap-Intervall die Null nicht enthaelt - und selbst dann entscheidet ein
Mensch. Ein System, das sich selbst nach jedem Rauschen umbaut, jagt Zufall
und wird schlechter, nicht besser. Genau deshalb laeuft die Pruefung monatlich
und nicht woechentlich: sonst schaut man elfmal im Jahr auf dieselben Daten
und findet irgendwann zwangslaeufig etwas.

Aufruf
------
    python pruefung.py                  # holt die Trainings-Matrix selbst
    python pruefung.py frame.csv        # nutzt eine vorhandene Matrix

Ergebnis: data/pruefung.json und PRUEFUNG.md
"""
import datetime
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

TEST_SAISONS = 10        # so viele abgeschlossene Saisons werden getestet
BOOT = 3000
MIN_SPIELE = 1500        # darunter kein Urteil


def hole_frame(pfad=None):
    """Die Trainings-Matrix - dieselbe, die das Modell sieht."""
    if pfad and os.path.exists(pfad):
        return pd.read_csv(pfad)
    ziel = os.path.join(tempfile.gettempdir(), "gridiron_frame.csv")
    print("Baue die Trainings-Matrix (voller Pipelinelauf, dauert einige Minuten)...")
    umg = dict(os.environ, DUMP_FRAME=ziel)
    r = subprocess.run([sys.executable, "update_data.py"], env=umg,
                       stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if not os.path.exists(ziel):
        sys.exit("Die Pipeline hat keine Matrix geschrieben.\n" + (r.stderr or "")[-2000:])
    return pd.read_csv(ziel)


def logloss(p, y):
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return -(y * np.log(p) + (1 - y) * np.log(1 - p))


def walk_forward(df, feats, saisons):
    """Vorhersagen je Testsaison, trainiert nur auf den Jahren davor."""
    teile = []
    for s in saisons:
        tr, te = df[df.season < s], df[df.season == s]
        if not len(tr) or not len(te):
            continue
        sc = StandardScaler().fit(tr[feats])
        lr = LogisticRegression(max_iter=2000).fit(sc.transform(tr[feats]), tr.y)
        teile.append(pd.Series(lr.predict_proba(sc.transform(te[feats]))[:, 1], index=te.index))
    return pd.concat(teile) if teile else pd.Series(dtype=float)


def boot_ci(d, rng):
    b = [d[rng.integers(0, len(d), len(d))].mean() for _ in range(BOOT)]
    return float(np.percentile(b, 2.5)), float(np.percentile(b, 97.5))


def markt_prob(row):
    def imp(ml):
        if pd.isna(ml) or ml == 0:
            return None
        return 100 / (ml + 100) if ml > 0 else (-ml) / ((-ml) + 100)
    ih, ia = imp(row.get("home_moneyline")), imp(row.get("away_moneyline"))
    if ih is None or ia is None:
        return np.nan
    return ih / (ih + ia)


def kalibrierung(p, y):
    """Versprochen gegen eingetreten, in drei Baendern."""
    aus = []
    p_pick = np.maximum(p, 1 - p)
    traf = (p >= 0.5) == (y == 1)
    for lo, hi, name in [(0.5, 0.58, "50-58 %"), (0.58, 0.7, "58-70 %"), (0.7, 1.01, "70+ %")]:
        m = (p_pick >= lo) & (p_pick < hi)
        if m.sum() < 5:
            continue
        aus.append({"band": name, "n": int(m.sum()),
                    "gesagt": round(float(p_pick[m].mean()) * 100, 1),
                    "real": round(float(traf[m].mean()) * 100, 1)})
    return aus


def main():
    df = hole_frame(sys.argv[1] if len(sys.argv) > 1 else None)
    with open("data/model.json") as f:
        model = json.load(f)
    F = model["features"]
    aktiv = model.get("active") or F
    inaktiv = [f for f in F if f not in aktiv]

    fertige = sorted(s for s in df.season.unique() if (df.season == s).sum() > 200)
    saisons = fertige[-TEST_SAISONS:]
    te = df[df.season.isin(saisons)]
    y = te.y.values.astype(float)
    print(f"Testfenster {saisons[0]}-{saisons[-1]}: {len(te)} Spiele\n")

    basis = walk_forward(df, aktiv, saisons).loc[te.index].values
    ll_basis = logloss(basis, y)
    rng = np.random.default_rng(5)

    ergebnis = {"stand": datetime.date.today().isoformat(),
                "fenster": [int(saisons[0]), int(saisons[-1])], "spiele": int(len(te)),
                "aktiv": aktiv,
                "basis": {"logloss": round(float(ll_basis.mean()), 4),
                          "treffer": round(float(np.mean((basis >= 0.5) == (y == 1))) * 100, 1)},
                "merkmale": [], "kalibrierung": kalibrierung(basis, y), "empfehlungen": []}

    # Markt auf denselben Spielen
    pm = te.apply(markt_prob, axis=1).values if "home_moneyline" in te else np.array([])
    m = ~np.isnan(pm) if len(pm) else np.array([], dtype=bool)
    if m.any():
        ergebnis["markt"] = {"n": int(m.sum()),
                             "logloss": round(float(logloss(pm[m], y[m]).mean()), 4),
                             "logloss_modell": round(float(ll_basis[m].mean()), 4),
                             "treffer": round(float(np.mean((pm[m] >= 0.5) == (y[m] == 1))) * 100, 1)}

    print(f"{'Merkmal':18}{'Rolle':>10}{'Differenz':>12}   95 %-Intervall        Urteil")
    for f in F:
        if f in aktiv:
            feats = [x for x in aktiv if x != f]      # weglassen
            rolle = "aktiv"
        else:
            feats = aktiv + [f]                       # dazunehmen
            rolle = "aus"
        if not feats:
            continue
        p = walk_forward(df, feats, saisons).loc[te.index].values
        d = logloss(p, y) - ll_basis                  # negativ = Aenderung ist besser
        lo, hi = boot_ci(d, rng)
        if hi < 0:
            urteil = "AENDERN" if len(te) >= MIN_SPIELE else "Hinweis, zu wenig Spiele"
        elif lo > 0:
            urteil = "so lassen (belegt)"
        else:
            urteil = "kein Unterschied"
        ergebnis["merkmale"].append({"merkmal": f, "rolle": rolle, "diff": round(float(d.mean()), 5),
                                     "lo": round(lo, 5), "hi": round(hi, 5), "urteil": urteil})
        print(f"{f:18}{rolle:>10}{d.mean():>+12.5f}   {lo:+.5f} bis {hi:+.5f}   {urteil}")
        if urteil == "AENDERN":
            ergebnis["empfehlungen"].append(
                (f"{f} abschalten" if rolle == "aktiv" else f"{f} wieder einschalten")
                + f" (LogLoss {d.mean():+.5f}, 95 %: {lo:+.5f} bis {hi:+.5f})")

    print("\nKalibrierung des aktiven Modells")
    for b in ergebnis["kalibrierung"]:
        print(f"   {b['band']:<10} n={b['n']:<5} gesagt {b['gesagt']:>5.1f} %   real {b['real']:>5.1f} %")
    if "markt" in ergebnis:
        print(f"\nMarkt auf denselben Spielen: LogLoss {ergebnis['markt']['logloss']:.4f} "
              f"gegen {ergebnis['markt']['logloss_modell']:.4f} fuer das Modell")

    print("\nEmpfehlung: " + ("; ".join(ergebnis["empfehlungen"]) if ergebnis["empfehlungen"]
                              else "nichts aendern - keine belegte Verbesserung gefunden"))

    os.makedirs("data", exist_ok=True)
    with open("data/pruefung.json", "w") as f:
        json.dump(ergebnis, f, indent=1)
    schreibe_bericht(ergebnis)
    print("\nOK: data/pruefung.json und PRUEFUNG.md geschrieben.")
    return 0


def schreibe_bericht(e):
    z = [f"# Selbstpruefung {e['stand']}", "",
         f"Getestet walk-forward auf {e['spiele']} Spielen der Saisons "
         f"{e['fenster'][0]}-{e['fenster'][1]}: jede Saison wurde mit einem Modell "
         "vorhergesagt, das nur die Jahre davor kannte.", "",
         f"Aktives Modell: {', '.join(e['aktiv'])}", "",
         f"LogLoss {e['basis']['logloss']}, Treffer {e['basis']['treffer']} %", ""]
    if "markt" in e:
        z += [f"Markt auf denselben {e['markt']['n']} Spielen: LogLoss {e['markt']['logloss']} "
              f"gegen {e['markt']['logloss_modell']} fuer das Modell, Treffer {e['markt']['treffer']} %.", ""]
    z += ["## Merkmale", "",
          "Negative Differenz heisst: die Aenderung waere besser. Geurteilt wird nur,",
          "wenn das 95 %-Intervall die Null nicht enthaelt.", "",
          "| Merkmal | Rolle | Differenz | 95 %-Intervall | Urteil |", "|---|---|---|---|---|"]
    for m in e["merkmale"]:
        z.append(f"| `{m['merkmal']}` | {m['rolle']} | {m['diff']:+.5f} | "
                 f"{m['lo']:+.5f} bis {m['hi']:+.5f} | {m['urteil']} |")
    z += ["", "## Kalibrierung", "", "| Band | n | gesagt | real |", "|---|---|---|---|"]
    for b in e["kalibrierung"]:
        z.append(f"| {b['band']} | {b['n']} | {b['gesagt']} % | {b['real']} % |")
    z += ["", "## Empfehlung", ""]
    z += ([f"- {x}" for x in e["empfehlungen"]] if e["empfehlungen"]
          else ["Nichts aendern. Es wurde keine belegte Verbesserung gefunden."])
    z += ["", "Umgesetzt wird nichts automatisch: `AKTIV` in `update_data.py` aendert ein Mensch.", ""]
    with open("PRUEFUNG.md", "w") as f:
        f.write("\n".join(z))


if __name__ == "__main__":
    raise SystemExit(main())
