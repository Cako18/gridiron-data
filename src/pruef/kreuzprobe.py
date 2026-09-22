"""
Kreuzprobe: rechnet die Oberflaeche genau so wie die Pipeline?

Erzeugt einige tausend zufaellige Spiele mit zufaelligen Werten fuer JEDES
Merkmal und rechnet jedes zweimal: mit predict_game() aus update_data.py und
mit predictHome(features(...)) aus nfl-predictor.jsx. Beide muessen bis auf
Rechengenauigkeit gleich sein.

Warum Zufall statt echter Spiele: bei echten Spielen stehen viele Merkmale oft
auf 0 (etwa "QB ohne Historie"), und ein Vorzeichenfehler faellt dort nicht auf.
Genau so ist es im September 2026 passiert - 16 echte Spiele stimmten, die
Oberflaeche rechnete das QB-Merkmal trotzdem verkehrt herum.

Aufruf (aus src/):   python pruef/kreuzprobe.py
Nach jeder Aenderung an features() oder predict_game() laufen lassen. Die
Probe setzt fuer alle elf Merkmale kuenstliche Koeffizienten ungleich 0 und
prueft so auch Merkmale, die im aktuellen Modell abgeschaltet sind.
"""
import json
import math
import os
import random
import re
import subprocess
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HIER)
REPO = os.path.dirname(SRC)
N = 4000
TEAMS = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB",
         "HOU", "IND", "JAX", "KC", "LA", "LAC", "LV", "MIA", "MIN", "NE", "NO", "NYG",
         "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"]


def pipeline_rechner():
    src = open(os.path.join(REPO, "update_data.py"), encoding="utf-8").read()
    ns = {"math": math}
    exec(re.search(r"^TZ = \{.*?\}\n", src, re.S | re.M).group(0), ns)
    exec(re.search(r"^def predict_game\(.*?(?=^def )", src, re.S | re.M).group(0), ns)
    return ns["predict_game"]


def frontend_modul():
    jsx = open(os.path.join(SRC, "nfl-predictor.jsx"), encoding="utf-8").read()
    teile = []
    for muster in [r"const sigmoid = .*?;\n", r"function predictHome\(.*?\n}\n",
                   r"const ZEITZONE = \{.*?\};\n", r"function features\(.*?\n}\n"]:
        m = re.search(muster, jsx, re.S)
        if not m:
            sys.exit(f"Im Frontend nicht gefunden: {muster}")
        teile.append(m.group(0))
    pfad = os.path.join(HIER, "_rechnung.cjs")
    open(pfad, "w", encoding="utf-8").write("\n".join(teile) + "\nmodule.exports={predictHome,features};\n")
    return pfad


def main():
    modell = json.load(open(os.path.join(REPO, "data", "model.json")))
    # Kuenstliche Koeffizienten ungleich 0 fuer ALLE Merkmale: sonst prueft die
    # Probe nur die gerade aktiven, und ein Fehler in einem abgeschalteten
    # Merkmal faellt erst auf, wenn es jemand wieder einschaltet.
    random.seed(1)
    modell["coef"] = [random.choice([-1, 1]) * random.uniform(0.1, 0.6) for _ in modell["features"]]
    predict_game = pipeline_rechner()
    faelle = []
    for _ in range(N):
        h, a = random.sample(TEAMS, 2)

        def team():
            return {"elo": random.uniform(1300, 1750), "qb": random.uniform(-.3, .3),
                    "off_epa": random.uniform(-.3, .3), "def_epa": random.uniform(-.3, .3),
                    "cpoe": random.uniform(-10, 10), "inj": random.uniform(0, 15),
                    "qb_new": random.choice([0, 0, 1])}
        teams = {h: team(), a: team()}
        g = {"h": h, "a": a, "w": 3, "hr": random.choice([4, 6, 7, 8, 10, 13, 14]),
             "ar": random.choice([4, 6, 7, 8, 10, 13, 14]), "t": random.choice(["13:00", "16:25", "20:20", ""])}
        faelle.append({"g": g, "teams": teams, "py": predict_game(g, teams, modell)})
    daten = os.path.join(HIER, "_faelle.json")
    json.dump({"model": modell, "faelle": faelle}, open(daten, "w"))
    modul = frontend_modul()
    js = ("const {predictHome,features}=require(process.argv[1]);"
          "const {model,faelle}=require(process.argv[2]);let m=0,schlimm=null;"
          "for(const f of faelle){const d=Math.abs(predictHome(model,features(f.g,f.teams,{}))-f.py);"
          "if(d>m){m=d;schlimm=f.g;}}console.log(JSON.stringify({m,schlimm}));")
    aus = subprocess.run(["node", "-e", js, modul, daten], capture_output=True, text=True)
    os.remove(daten)
    os.remove(modul)
    if aus.returncode:
        sys.exit(aus.stderr)
    erg = json.loads(aus.stdout)
    print(f"{N} Zufallsspiele, groesste Abweichung Oberflaeche gegen Pipeline: {erg['m']:.2e}")
    if erg["m"] < 1e-9:
        print("-> identisch")
        return 0
    print(f"-> ABWEICHUNG, schlimmster Fall: {erg['schlimm']}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
