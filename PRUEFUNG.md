# Selbstpruefung 2026-11-02

Getestet walk-forward auf 2672 Spielen der Saisons 2016-2025: jede Saison wurde mit einem Modell vorhergesagt, das nur die Jahre davor kannte.

Aktives Modell: elo_diff, qb_diff, inj_diff, mkt_diff

LogLoss 0.6214, Treffer 65.0 %

Markt auf denselben 2671 Spielen: LogLoss 0.6082 gegen 0.6216 fuer das Modell, Treffer 66.5 %.

## Merkmale

Negative Differenz heisst: die Aenderung waere besser. Geurteilt wird nur,
wenn das 95 %-Intervall die Null nicht enthaelt.

| Merkmal | Rolle | Differenz | 95 %-Intervall | Urteil |
|---|---|---|---|---|
| `elo_diff` | aktiv | +0.00244 | -0.00082 bis +0.00569 | kein Unterschied |
| `qb_diff` | aktiv | +0.00351 | +0.00066 bis +0.00635 | so lassen (belegt) |
| `off_diff` | aus | +0.00016 | -0.00060 bis +0.00091 | kein Unterschied |
| `def_diff` | aus | +0.00031 | +0.00009 bis +0.00054 | so lassen (belegt) |
| `cpoe_diff` | aus | -0.00029 | -0.00208 bis +0.00141 | kein Unterschied |
| `rest_diff` | aus | -0.00010 | -0.00122 bis +0.00101 | kein Unterschied |
| `inj_diff` | aktiv | +0.00271 | -0.00036 bis +0.00572 | kein Unterschied |
| `qb_new_diff` | aus | -0.00008 | -0.00096 bis +0.00084 | kein Unterschied |
| `bye_diff` | aus | -0.00021 | -0.00126 bis +0.00090 | kein Unterschied |
| `tz_shift_away` | aus | -0.00048 | -0.00154 bis +0.00059 | kein Unterschied |
| `west_early_away` | aus | +0.00012 | -0.00065 bis +0.00092 | kein Unterschied |
| `mkt_diff` | aktiv | +0.00306 | -0.00050 bis +0.00679 | kein Unterschied |

## Kalibrierung

| Band | n | gesagt | real |
|---|---|---|---|
| 50-58 % | 727 | 53.9 % | 51.7 % |
| 58-70 % | 963 | 63.8 % | 62.6 % |
| 70+ % | 982 | 79.3 % | 77.3 % |

## Empfehlung

Nichts aendern. Es wurde keine belegte Verbesserung gefunden.

Umgesetzt wird nichts automatisch: `AKTIV` in `update_data.py` aendert ein Mensch.
