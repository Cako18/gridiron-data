# Selbstpruefung 2026-10-02

Getestet walk-forward auf 2672 Spielen der Saisons 2016-2025: jede Saison wurde mit einem Modell vorhergesagt, das nur die Jahre davor kannte.

Aktives Modell: elo_diff, qb_diff, inj_diff

LogLoss 0.6245, Treffer 64.5 %

Markt auf denselben 2671 Spielen: LogLoss 0.6082 gegen 0.6246 fuer das Modell, Treffer 66.5 %.

## Merkmale

Negative Differenz heisst: die Aenderung waere besser. Geurteilt wird nur,
wenn das 95 %-Intervall die Null nicht enthaelt.

| Merkmal | Rolle | Differenz | 95 %-Intervall | Urteil |
|---|---|---|---|---|
| `elo_diff` | aktiv | +0.02035 | +0.01103 bis +0.02993 | so lassen (belegt) |
| `qb_diff` | aktiv | +0.00495 | +0.00163 bis +0.00829 | so lassen (belegt) |
| `off_diff` | aus | +0.00023 | -0.00089 bis +0.00138 | kein Unterschied |
| `def_diff` | aus | +0.00027 | +0.00011 bis +0.00044 | so lassen (belegt) |
| `cpoe_diff` | aus | +0.00001 | -0.00193 bis +0.00185 | kein Unterschied |
| `rest_diff` | aus | -0.00006 | -0.00102 bis +0.00090 | kein Unterschied |
| `inj_diff` | aktiv | +0.00289 | -0.00013 bis +0.00590 | kein Unterschied |
| `qb_new_diff` | aus | -0.00006 | -0.00100 bis +0.00092 | kein Unterschied |
| `bye_diff` | aus | -0.00017 | -0.00111 bis +0.00081 | kein Unterschied |
| `tz_shift_away` | aus | -0.00053 | -0.00162 bis +0.00054 | kein Unterschied |
| `west_early_away` | aus | +0.00005 | -0.00075 bis +0.00085 | kein Unterschied |

## Kalibrierung

| Band | n | gesagt | real |
|---|---|---|---|
| 50-58 % | 743 | 54.0 % | 52.0 % |
| 58-70 % | 985 | 63.9 % | 62.5 % |
| 70+ % | 944 | 78.9 % | 76.5 % |

## Empfehlung

Nichts aendern. Es wurde keine belegte Verbesserung gefunden.

Umgesetzt wird nichts automatisch: `AKTIV` in `update_data.py` aendert ein Mensch.
