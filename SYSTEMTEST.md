# Systemtest – Saison 2025

Vollständige Simulation der Saison 2025, Woche für Woche. Das Modell wurde für
jede Woche **ausschließlich mit Daten bis dahin** trainiert, die Picks vor dem
Spieltag eingefroren und erst danach abgerechnet – genau wie im Live-Betrieb.
Geprüft wurde nicht nur das Modell, sondern das **Gesamtsystem**: Tier-Schwellen,
Vegas-Duell, Kalibrierung, Edge-Attribution und Value-Logik.

**Datenbasis:** 284 Spiele (Regular Season + Playoffs), davon 284 mit Marktquoten.

## Kernergebnis

| Kennzahl | Wert |
|---|---|
| Trefferquote Modell | **65,5 %** |
| Trefferquote Markt (gleiche Spiele) | 65,8 % |
| **Bei Uneinigkeit mit dem Markt** | **48,8 %** (41 Spiele) |

Das Modell erreicht Marktniveau – aber im Wesentlichen, weil es in 86 % der Fälle
dasselbe sagt wie der Markt. Dort, wo beide auseinanderliegen, behält der Markt
häufiger recht. Einschränkung: Bei 41 Spielen reicht das 95-%-Intervall von
33,5 % bis 64,1 %; statistisch beweisend ist das nicht.

## Halten die Sicherheitsstufen, was sie versprechen?

| Stufe | Spiele | Modell sagt | Real eingetreten | Backtest-Versprechen |
|---|---|---|---|---|
| BANK (≥ 70 %) | 105 | 79,2 % | **77,1 %** | 74,6 % |
| Mittelfeld (58–70 %) | 103 | 63,4 % | **62,1 %** | 62,1 % |
| Münzwurf (< 58 %) | 76 | 53,6 % | **53,9 %** | 53,7 % |

Alle drei Stufen liegen im erwarteten Bereich. Die Schwellenwerte in der App sind
damit unabhängig bestätigt.

## Kalibrierung

| Bereich | Spiele | Vorhergesagt | Real |
|---|---|---|---|
| 50–57 % | 76 | 53,6 % | 53,9 % |
| 57–65 % | 69 | 61,4 % | 56,5 % |
| 65–72 % | 48 | 68,5 % | 70,8 % |
| 72–80 % | 44 | 75,9 % | 75,0 % |
| 80 %+ | 47 | 84,8 % | 83,0 % |

Gut kalibriert bis auf das Mittelband (57–65 %), wo das Modell etwas zu
selbstbewusst war.

## Woher stammen belastbare Abweichungen?

Bei deutlicher Abweichung vom Markt (≥ 4 Punkte), nach dominantem Treiber:

| Quelle | Spiele | Trefferquote |
|---|---|---|
| Elo / Form | 102 | 66,7 % |
| QB-Rating | 45 | 66,7 % |
| Verletzungen | 22 | **54,5 %** |

Der Befund aus dem großen Backtest (51,6 % für verletzungsgetriebene
Abweichungen) wird unabhängig bestätigt. Bei den 41 echten Uneinigkeiten fällt
die Aufteilung noch deutlicher aus: QB-getrieben 67 %, Elo-getrieben 44 %,
verletzungsgetrieben 25 %.

## Value-Logik im Praxistest

Einzelwetten mit Einsatz 1, echte Schlussquoten:

| Auswahl | Wetten | Treffer | Rendite |
|---|---|---|---|
| alle Picks | 284 | 65,5 % | −2,9 % |
| nur Value ≥ 1,00 | 130 | 62,3 % | +2,5 % |
| Value + Edge ≥ 2 Punkte | 130 | 62,3 % | +2,5 % |
| dito, ohne verletzungsgetriebene Edges | 112 | 65,2 % | **+5,4 %** |

Wichtig zur Einordnung: Der Standardfehler liegt bei ±7,9 Prozentpunkten. Die
positive Rendite ist damit **kein Beleg für Profitabilität**, sondern bestenfalls
ein Hinweis. Nebenbefund: Die Filter „Value ≥ 1,00" und „Edge ≥ 2 Punkte" wählen
mathematisch fast dieselben Spiele aus – sie sind weitgehend redundant.

## Schwankungsbreite einzelner Wochen

Die wöchentlichen Trefferquoten reichten von **21 %** (Woche 5: 3 von 14, darunter
drei verlorene BANK-Picks) bis **87 %** (Woche 11). Einzelne Spieltage taugen
nicht zur Beurteilung – erst ab etwa vier bis fünf Wochen werden die Zahlen
interpretierbar.

## Was folgt daraus

1. **Die Mechanik stimmt.** Tier-Schwellen, Abrechnung, Kalibrierung und
   Edge-Attribution arbeiten wie vorgesehen – es wurden keine Systemfehler gefunden.
2. **Die offene Frage ist die Kante.** Ob das Modell dort recht behält, wo es dem
   Markt widerspricht, ist mit 41 Spielen nicht entschieden. Genau das misst das
   Vegas-Duell über die laufende Saison.
3. **Verletzungsgetriebene Abweichungen bleiben unzuverlässig** – dreifach bestätigt.

*Durchgeführt am 13.09.2026. Methodik: Walk-Forward ohne Kenntnis der Ergebnisse,
Modell je Woche neu trainiert auf allen Spielen bis zum Vortag.*
