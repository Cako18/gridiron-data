# Cako's NFL World

Selbstlernendes NFL-Vorhersagesystem mit öffentlich nachprüfbarer Bilanz.

**Website:** https://cako18.github.io/gridiron-data/

## Was das System macht

- **Vorhersagen** für jedes Spiel der Saison aus Elo, EPA, QB-Rating, Verletzungen
  und Situationsfaktoren (Reise, Ruhetage, Bye-Week)
- **Täglich neu trainiert** auf allen abgeschlossenen Spielen seit 2010
- **Vegas-Duell:** Jeder Pick wird vor Anpfiff eingefroren und gegen den
  Wettmarkt abgerechnet – inklusive Closing Line Value und Kalibrierung
- **KI-Kontextanalyse:** Claude recherchiert wöchentlich die Nachrichtenlage
  (Verletzungen, Kaderwechsel, Trainerfragen) und übersetzt sie in Elo-Anpassungen
- **Depth Charts** mit aktuellem Injury-Status, Live-Wahrscheinlichkeiten während
  der Spiele und ein Tippschein-Rechner mit Erwartungswert-Logik

## Automatik

| Wann | Was |
|---|---|
| täglich 09:00 UTC | Daten, Modelltraining, Projektion, Report |
| vor jedem Anstoßfenster | Injury-Daten, Quoten, Picks festschreiben |
| sonntags 2× | KI-Kontextanalyse aller Spiele der Woche |

## Dateien

- `update_data.py` – Rechenwerk der Pipeline
- `ai_context.py` – KI-Kontextanalyse
- `data/app_data.json` – Daten für die Website
- `data/vegas_duel.csv` – eingefrorene Picks mit Zeitstempel
- `REPORT.md` – täglicher Bericht inkl. Wochenauswertung
- `SYSTEMTEST.md` – Validierung auf Saison 2025

## Ehrlichkeit

Die Picks werden vor dem Spiel eingefroren und mit Zeitstempel im Repo
festgehalten – nachträgliches Schönrechnen ist damit ausgeschlossen. Der
Systemtest auf Saison 2025 dokumentiert Stärken und Schwächen, einschließlich
der offenen Frage, ob das Modell dort recht behält, wo es dem Markt widerspricht.

*Kein Wett-Tipp – ein Experiment.*
