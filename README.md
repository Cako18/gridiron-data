# Cako's NFL World

Selbstlernendes NFL-Vorhersagesystem mit öffentlich nachprüfbarer Bilanz.

**Website:** https://cako18.github.io/gridiron-data/

## Was das System macht

- **Vorhersagen** für jedes Spiel der Saison. Das Modell nutzt drei Merkmale:
  Elo, QB-Rating und Verletzungen. Acht weitere (EPA, CPOE, Ruhetage, Reise
  u. a.) wurden gemessen und abgeschaltet, weil sie nichts beitrugen – siehe
  *Was wir gemessen haben*.
- **Täglich neu trainiert** auf allen abgeschlossenen Spielen seit 2010
- **Vegas-Duell:** Jeder Pick wird vor Anpfiff eingefroren und gegen den
  Wettmarkt abgerechnet – inklusive Closing Line Value und Kalibrierung
- **KI-Kontextanalyse:** Claude recherchiert QB-Lage und Ausfälle von
  Schlüsselspielern. Die Anpassungen fließen *nicht* in die offiziellen Picks;
  zum selben Zeitpunkt wird festgehalten, was das Modell mit ihnen getippt
  hätte, damit sich messen lässt, ob die Recherche etwas bringt.
- **QB-Ranking:** alle 32 Starter nach dem Wert, mit dem das Modell rechnet,
  dazu der Vertreter und was ein Ausfall kostet (Siegchance daheim gegen ein
  Durchschnittsteam, einmal mit Starter, einmal mit Vertreter). Form und Stil
  (Quote, CPOE, Laufanteil) stehen daneben, fließen aber nicht ins Modell.
  Meldet der Verletzungsbericht der anstehenden Woche den Starter als „Out“,
  rechnet das Modell automatisch mit dem Vertreter; der Starter bleibt
  durchgestrichen im Ranking stehen.
- **Depth Charts** mit Injury-Status, Live-Wahrscheinlichkeiten während der
  Spiele und ein Tippschein-Rechner mit Erwartungswert-Logik

## Was wir gemessen haben

| Frage | Antwort | Skript |
|---|---|---|
| Schlägt das Modell den Wettmarkt? | Nein. Außerhalb der Stichprobe trägt kein Merkmal etwas bei, das die Quote nicht schon enthält. Tippt das Modell gegen den Markt, liegt es nur in rund 42 % richtig. | `markttest.py`, `markttest_voll.py` |
| Welche Merkmale braucht das Modell? | Elo, QB-Rating, Verletzungen. Die übrigen acht ändern nichts oder schaden. | Ablation im Commit-Verlauf |
| Ist das Modell zu vorsichtig? | Nein. Gegen die Ergebnisse ist es geeicht; es ist weniger sicher als der Markt, weil es weniger weiß. | – |
| Trifft die Live-Kurve echte Spielverläufe? | Seit der Korrektur im September 2026 besser: sie startet beim Anpfiff genau bei der Prognose. | `live_test.py` |
| Bringt die KI-Recherche etwas? | Offen – wird seit Woche 3 der Saison 2026 gemessen. | `ki_test.py` |

## Automatik

| Wann (UTC) | Was |
|---|---|
| täglich 06:13 | Daten, Modelltraining, Projektion, Report |
| So 09:19 / 12:19 / 16:19, Mo 15:19, Do 15:19 | vor den Lock-Fenstern: Quoten, Picks festschreiben |
| Mo 02:19, Di 06:19, Fr 03:19 | Ergebnisse einsammeln, neue Woche öffnen |
| Do 12:23 | KI-Kontext nur für das Donnerstagsspiel |
| So 08:23, So 15:37 | KI-Kontext für die noch offenen Spiele |
| nach jeder KI-Analyse | Daten-Update startet automatisch hinterher |

Alle Zeiten liegen auf krummen Minuten und weit vor den Lock-Fenstern
(2,5 Stunden vor Anpfiff): GitHub startet geplante Läufe teils Stunden zu
spät, zur vollen Stunde besonders.

## Dateien

- `update_data.py` – Rechenwerk der Pipeline
- `ai_context.py` – KI-Kontextanalyse
- `data/app_data.json` – Daten für die Website
- `data/vegas_duel.csv` – eingefrorene Picks mit Zeitstempel
- `data/ki_protokoll.csv` – eingefrorene Modell+KI-Wahrscheinlichkeiten
- `src/` – Quelle der Oberfläche, Build und Prüfskripte (eigenes README)
- `REPORT.md` – täglicher Bericht inkl. Wochenauswertung
- `SYSTEMTEST.md` – Validierung auf Saison 2025

## Ehrlichkeit

Die Picks werden vor dem Spiel eingefroren und mit Zeitstempel im Repo
festgehalten – nachträgliches Schönrechnen ist damit ausgeschlossen. Die
Prüfskripte oben sind reproduzierbar; jedes lädt seine Daten selbst von
nflverse und trennt streng zwischen Daten zum Anpassen und Daten zum Prüfen.

*Kein Wett-Tipp – ein Experiment.*
