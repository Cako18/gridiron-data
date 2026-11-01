# Cako's NFL World

Selbstlernendes NFL-Vorhersagesystem mit öffentlich nachprüfbarer Bilanz.

**Website:** https://cako18.github.io/gridiron-data/

## Was das System macht

- **Prognose = Marktquote.** Die großen Prozente auf der Seite sind seit
  November 2026 die Siegwahrscheinlichkeit laut Quote, ohne Buchmacher-Marge.
  Sie ist die genaueste Zahl, die es gibt (2016–2025: 66,5 % Treffer gegen
  64,5 % für unser Modell), und das Modell zusätzlich auf die Quote zu setzen
  bringt nachweislich nichts. Ohne Quote steht dort das Modell.
- **Unser Modell als zweite Meinung** mit vier Merkmalen: Elo, QB-Rating,
  Verletzungen und Markt-Rating (Teamstärke aus den Schlussquoten vergangener
  Spiele). Acht weitere wurden gemessen und abgeschaltet – siehe *Was wir
  gemessen haben*. Das Vegas-Duell misst es weiter gegen den Markt.
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
- **Früh-Messung und Früh-Schein:** 1 bis 6 Tage vor Anpfiff (meist dienstags)
  werden Modell und Quote eingefroren. Gemessen wird, ob sich der Markt bis zum
  Anpfiff auf die Seite bewegt, die das Modell höher sah – das ist die einzige
  Stelle, an der das Modell erkennbar etwas weiß, das der Markt erst später
  einpreist. Liegt das Modell mindestens 5 Punkte über der Quote (Quote ab 1,30),
  steht der Tipp als Testlauf auf dem Früh-Schein. `data/frueh_protokoll.csv`.
- **Spieltags-Schein (nur noch im Hintergrund):** die alte Regel – Einzelwetten
  bei Einigkeit mit dem Markt, Quote ab 1,30 – verlor im Zehn-Jahres-Test 4,7 %
  je Wette. Sie läuft zur Kontrolle weiter (`schein_protokoll.csv`), wird aber
  nicht mehr als Schein angezeigt.
- **Monatliche Selbstprüfung:** wiederholt die Ablation und die Kalibrierung mit
  den Daten von heute und schreibt `PRUEFUNG.md`. Sie ändert das Modell *nicht*;
  eine Empfehlung gibt es nur, wenn das 95 %-Intervall die Null nicht enthält.
- **Depth Charts** mit Injury-Status, Live-Wahrscheinlichkeiten während der
  Spiele und ein Tippschein-Rechner mit Erwartungswert-Logik

## Was wir gemessen haben

| Frage | Antwort | Skript |
|---|---|---|
| Schlägt das Modell den Wettmarkt? | Nein. Außerhalb der Stichprobe trägt kein Merkmal etwas bei, das die Quote nicht schon enthält. Tippt das Modell gegen den Markt, liegt es nur in rund 42 % richtig. | `markttest.py`, `markttest_voll.py` |
| Welche Merkmale braucht das Modell? | Elo, QB-Rating, Verletzungen. Die übrigen acht ändern nichts oder schaden. | Ablation im Commit-Verlauf |
| Ist das Modell zu vorsichtig? | Nein. Gegen die Ergebnisse ist es geeicht; es ist weniger sicher als der Markt, weil es weniger weiß. | – |
| Trifft die Live-Kurve echte Spielverläufe? | Seit der Korrektur im September 2026 besser: sie startet beim Anpfiff genau bei der Prognose. | `live_test.py` |
| Hilft ein feineres QB-Merkmal? | Nein. Weder QB-Werte nach Stichprobengröße geschrumpft noch ein eigenes „QB fällt aus“-Merkmal verbessern etwas Belegbares (walk-forward 2016–2025, 2672 Spiele, alle Intervalle enthalten die Null). In den 319 Spielen mit QB-Ausfall bleibt der Markt deutlich besser: LogLoss 0,563 gegen 0,593. | 28.09.2026, Commit-Verlauf |
| Bringt die KI-Recherche etwas? | Offen. Über Ergebnisse (17 Spiele, Nov. 2026) frühestens 2027 entscheidbar; deshalb seit Nov. 2026 zusätzlich an der Marktbewegung gemessen (`ki_bewegung.csv`). | `ki_test.py` |
| Bringen unsere Merkmale etwas *auf* die Quote? | Nein. Markt allein LogLoss 0,6082, Markt plus Elo, QB, Verletzungen 0,6083 (walk-forward 2016–2025, 2671 Spiele). Deshalb ist die Prognose seit Nov. 2026 die Quote. | 01.11.2026 |
| Elo neu einstellen, neuere Saisons stärker gewichten, QB-Zuordnung aus echten Pässen? | Alles nichts: −0,0004, −0,0005, −0,0002 LogLoss, alle Intervalle enthalten die Null. | 01.11.2026 |
| Hilft ein Markt-Rating (Teamstärke aus vergangenen Schlussquoten)? | Ja, knapp: LogLoss −0,0031 (95 %: −0,0066 bis +0,0005), Treffer 65,0 % statt 64,5 %, besser in 8 von 10 Saisons. Seit Nov. 2026 im Modell. | 01.11.2026 |
| Weiß das Modell etwas vor dem Markt? | Möglicherweise am Dienstag: Lag es dort mehr als 5 Punkte über der Quote, bewegte sich der Markt bis zum Anpfiff im Schnitt 1,5 Punkte darauf zu (Korrelation +0,25, t = 2,67, 106 Spiele, rekonstruiert aus dem Git-Verlauf der Wochen 1–8/2026). Eine Saison – wird seit Nov. 2026 vorab eingefroren gemessen. | `frueh_protokoll.csv` |
| Taugt die Regel des Spieltags-Scheins? | Nein: −4,7 % je Wette über 2016–2025 (569 Wetten), schlechter als blind jeden Favoriten (−3,1 %). | 01.11.2026 |

## Lernt das System dazu?

Zum Teil, und es lohnt sich, den Unterschied zu kennen.

**Aktualisiert sich laufend:** Elo nach jedem Spiel, QB-Ratings als gleitender
Mittelwert, Verletzungen und Quoten täglich. Das Modell wird jede Nacht neu
trainiert.

**Wird dadurch nicht besser:** Das Training umfasst rund 4000 Spiele, pro Woche
kommen 16 dazu – 0,4 % mehr Daten. Die Koeffizienten bewegen sich in der vierten
Nachkommastelle. Die Eingangswerte sind frischer, die Rechenvorschrift bleibt
gleich gut.

**Was wirklich dazulernt**, sind die Messungen daneben: `frueh_protokoll.csv`
misst, ob das Modell dem Markt unter der Woche voraus ist, `ki_bewegung.csv` und
`ki_protokoll.csv` die KI-Recherche, `PRUEFUNG.md` monatlich die Merkmalsauswahl.
Daraus folgen Änderungen – von Hand, mit Begründung.

**Warum an der Marktbewegung gemessen wird:** Sieg oder Niederlage rauschen so
stark, dass ein Vorsprung von zwei Prozentpunkten erst nach rund 2.000 Spielen
nachweisbar ist – sieben Saisons. Die Bewegung der Quote bis zum Anpfiff rauscht
viel weniger; dort zeigte sich ein Signal schon nach 106 Spielen.

## Automatik

| Wann (UTC) | Was |
|---|---|
| täglich 06:13 | Daten, Modelltraining, Projektion, Report |
| So 09:19 / 12:19 / 16:19, Mo 15:19, Do 15:19 | vor den Lock-Fenstern: Quoten, Picks festschreiben |
| Mo 02:19, Di 06:19, Fr 03:19 | Ergebnisse einsammeln, neue Woche öffnen |
| Mi 20:37 | KI-Kontext für die ganze Woche, nach dem ersten Verletzungsbericht |
| Do 12:23 | KI-Kontext nur für das Donnerstagsspiel |
| So 04:23, So 10:37 | KI-Kontext für die noch offenen Spiele |
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
