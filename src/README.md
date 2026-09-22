# src/ - Frontend

## Stand

Die urspruengliche Quelle ging verloren; im Repo lag nur das fertige
Bundle. `nfl-predictor.jsx` ist der Neuaufbau, und er ist noch nicht
fertig.

Alle sechs Tabs sind nachgebaut und gegen echte Daten in Chromium
gerendert, ohne Konsolenfehler.

| Tab | Inhalt |
|---|---|
| Spielplan | Wochenwahl, Wochenvorschau, Bilanz gegen Vegas, Markierungen BANK / Muenzwurf / Gegen den Markt mit Legende |
| Live | ESPN-Feed alle 45 s, WP-Balken und -Kurve, Kipp-Hinweis, Fuehrungswechsel, Tipp-Haekchen, kommende Spiele aus Feed und Spielplan, Vorbereitungsspiele als Mechaniktest |
| Matchup | Prognose, Edge-Attribution, KI-Kontext, Marktbewegung, Ligavergleich, Spieltyp, Aufstellungs-Duell (Offense gegen Defense, Seitentausch, Ausfall-Last) |
| Tippschein | EV je Tipp, Risikomischung, Poisson-Binomial-Verteilung, Gesamtquote |
| Vegas-Duell | Bilanz, CLV, Kalibrierung mit Signifikanztest, Modell gegen Modell+KI, Merkmalsguete, bester Call |
| Elo-Ranking | Sortierung nach Elo/Offense/Defense/QB, Elo-Verlauf, Projektion |

### Bewusst nicht uebernommen

| Was | Warum |
|---|---|
| Einzelanalyse per Claude-API | Der Aufruf im alten Bundle sendet keinen `x-api-key`. Auf GitHub Pages schlaegt er immer fehl - toter Code. (Immerhin: es liegt damit auch kein Schluessel im oeffentlichen Bundle.) |
| Archetyp-Korrelationen | `Saisonstart` korreliert mit 0,72 zu `Heimfavorit` und 0,70 zu `Enges Spiel` - weil die Marke frueh in der Saison auf jedes Spiel zutrifft. Ein Artefakt, keine Erkenntnis. |

**Live laeuft weiterhin `app26.js`.** Der Seite-an-Seite-Vergleich mit
identischem Feed (`pruef/vergleich2.mjs`) ist bestanden. Zwei Abweichungen
sind gewollt und bleiben:

- **Live-Balken:** die neue Seite nutzt die korrigierte Live-Formel (unten).
- **Tipp-Haekchen:** die neue Seite nimmt den eingefrorenen Pick, die alte
  rechnet ihn nachtraeglich mit dem heutigen Modell aus.

Offen ist nur noch der Blick auf den echten ESPN-Feed an einem Spieltag -
danach wird `index.html` umgestellt.

## Bauen

```bash
cd src
npm install
node build.mjs              # -> ../app_next.js  (Probe, nicht verlinkt)
node build.mjs app27.js     # -> ../app27.js     (scharf)
```

Der Dateiname wechselt bei jeder Version mit Absicht: Safari haelt
gleichnamige Bundles hartnaeckig im Cache. Nach einem scharfen Bau muss
`index.html` auf den neuen Namen zeigen.

`jsx: "automatic"` in `build.mjs` ist nicht optional - fehlt es, wirft
das Bundle zur Laufzeit `React is not defined`.

## Pruefungen

| Skript | Prueft | Wann |
|---|---|---|
| `pruef/kreuzprobe.py` | Rechnet die Oberflaeche jedes Spiel exakt wie `predict_game()` der Pipeline? 4000 Zufallsspiele, kuenstliche Koeffizienten fuer alle elf Merkmale. | nach jeder Aenderung an `features()` oder `predict_game()` |
| `pruef/alle.mjs` | Rendern alle sieben Tabs ohne Konsolenfehler? | vor jedem scharfen Build |
| `pruef/qb.mjs` | QB-Ranking mit Daten und mit altem Export ohne `qbs` | nach Aenderungen am QB-Tab |
| `pruef/vergleich2.mjs` | Zeigen alte und neue Seite bei gleichem Feed dasselbe? | bis zur Umstellung |
| `../live_test.py` | Trifft die Live-Formel echte Spielverlaeufe? | nach Aenderungen an `liveWP()` |

Alle `.mjs`-Tests brauchen `npm install playwright` und die Daten aus
`data/` in `pruef/` kopiert.

## Rendertest

```bash
npm install playwright
node pruef/run.mjs
```

Startet einen lokalen Server, faengt die GitHub-Abrufe ab und bedient
sie aus `pruef/app_data.json` und `pruef/model.json` (beide vorher aus
`data/` kopieren), rendert die Seite in Chromium und meldet Tage,
Spiele, Tabs, Bilanzzeile und jeden Konsolenfehler. Ein Screenshot
landet unter `pruef/geruest.png`.

Das ist der Massstab: Ein Tab gilt als fertig, wenn er dasselbe zeigt
wie die Produktionsseite - nicht, wenn er gut aussieht.

## Datenvertrag

Die App liest zwei Dateien von `raw.githubusercontent.com`:

**`app_data.json`**

| Feld | Inhalt |
|---|---|
| `generated` | Zeitstempel des Pipelinelaufs |
| `schedule[]` | `w` Woche, `d` Datum, `t` Anstoss (ET), `a`/`h` Teams, `ar`/`hr` Ruhetage, `dv` Divisionsspiel, `as`/`hs` Punkte (`null` = offen), `mh`/`ma` Quoten |
| `teams{}` | `elo`, `off_epa`, `def_epa`, `cpoe`, `inj`, `qb`, `qb_new`, `qb_name` |
| `picks{}` | eingefrorene Prognosen: `pick`, `p`, `vp`, `pm`, `src`, `st` (`fix` = festgeschrieben) |
| `analysis{}` | je Spiel: `tags`, `sd`, `conf`, `edge`, `arch_hit` |
| `qbs{}` | je Team `starter` und `backup` (`n` Name, `r` Modellwert, `roh` Rohwert, `starts`, `neu`, `form`, `stil`), `ausfall` = Siegchance mit minus ohne Starter, `p_mit` |
| `duel{}` | Bilanz gegen den Markt, Kalibrierung, CLV, `ki` = Zwischenstand Modell gegen Modell+KI |
| `line_moves{}`, `depth{}`, `lineups{}`, `proj{}` | Zusatzdaten der uebrigen Tabs |

**`model.json`**: `features`, `mean`, `scale`, `coef`, `intercept` -
die logistische Regression, nachgerechnet in `predictHome()`.

## Regeln, die aus Fehlern stammen

1. **Eingefrorene Picks haben Vorrang.** Ein Spiel mit `st == "fix"`
   wird nie neu gerechnet. Sonst misst die Bilanz das Modell von heute
   an Spielen von gestern - und sieht viel zu gut aus.
2. **Die Wochenwahl ist datengetrieben:** immer die niedrigste Woche
   mit offenen Spielen. Nichts hart kodieren.
3. **Werte werden gegen die Liga normiert, nicht gegeneinander.** Im
   Matchup-Vergleich sahen 1410 und 1513 Elo gegeneinander normiert fast
   gleich aus, weil die Absolutwerte nah beieinander liegen. Gegen die
   Liga gemessen sind das Rang 30 und Rang 16 - und genau das ist die
   Information. Der Rang steht deshalb an jedem Wert.
4. **Merkmale nie aus dem Gedaechtnis nachbauen, sondern gegen die Pipeline
   pruefen - mit Zufallswerten.** Der erste Entwurf rechnete "QB ohne
   Historie" verkehrt herum (Heim minus Gast statt Gast minus Heim) und
   begrenzte die Ruhetage auf +-7, was die Pipeline nicht tut. 16 echte
   Spiele stimmten trotzdem, weil gerade kein Team einen QB ohne Historie
   hatte. `pruef/kreuzprobe.py` haette es sofort gefunden.
5. **Keine Merkmale auf 0 setzen, weil sie "wohl egal" sind.** Der erste
   Entwurf liess die beiden Reisemerkmale weg. Bei Seattle in Washington
   lag die Vorab-Prognose dadurch 5,7 Punkte daneben. Aufgefallen ist es
   erst im Vergleich mit dem alten Bundle.
6. **Der Tipp eines beendeten Spiels ist der eingefrorene Pick.** Die alte
   Live-Seite rechnete ihn nachtraeglich mit dem heutigen Modell aus -
   derselbe Rueckschaufehler, der einmal die Wochenbilanz geschoent hat.
7. **Rauschen wird als Rauschen ausgewiesen.** Die Kalibrierungstabelle
   rechnet je Band einen zweiseitigen Binomialtest und schreibt das
   Ergebnis hin. Bei zehn Spielen sieht "gesagt 55 %, real 75 %"
   dramatisch aus und ist p = 0,25 - also nichts. Eine Seite, die solche
   Zahlen hervorhebt, erzieht ihren Leser zu Fehlschluessen.

8. **Training und Vorhersage muessen dieselbe Regel sehen.** Im Training
   bekommt ein QB mit weniger als drei Starts den Ersatzwert -0,06, egal wie
   seine ersten Spiele liefen. Die Pipeline nahm fuer die Vorhersage bis
   September 2026 trotzdem sein rohes Rating - ein Wert, den das Modell fuer
   solche Spieler nie gesehen hatte. Seitdem rechnen beide ueber
   `qb_wert()`. Das QB-Ranking zeigt den Rohwert nur zusaetzlich an.

## Altbestand

- `app26.readable.js` - das laufende Bundle, mit Prettier entzerrt.
  Nachschlagewerk, keine Arbeitsgrundlage.
- `nfl-predictor.2026-07-21.jsx` - letzte erhaltene echte Quelle,
  507 Zeilen. Kennt Elo-Ranking, Upsets, Bilanz; alles Spaetere fehlt.

**Regel fuer die Zukunft: die Quelle gehoert ins Repo, nicht nur das
Bundle.**

## Behoben: Die Live-Kurve startete zu nah an 50 %

Beim Anpfiff ist nichts passiert; die Live-Wahrscheinlichkeit muss also genau
der Vorab-Prognose entsprechen. Die alte Umrechnung
`16 * log10(p / (1 - p))` zog jede Kurve 5 bis 7 Punkte Richtung 50 %
(Green Bay: Prognose 77,5 %, Kurve 70,5 %).

Seit September 2026 gilt `liveStreuung(1) * normInv(p)`: beim Anpfiff genau
die Prognose. Geprueft mit `../live_test.py` an 269.461 Spielzustaenden aus
1594 Spielen, angepasst an 2019-21, geprueft an 2022-24:

| Variante | LogLoss |
|---|---|
| alt, 16 * log10 | 0,4735 |
| neu, konsistent | 0,4679 |
| Faktor frei angepasst | 0,4666 |
| alle Konstanten frei | 0,4676 |

Die Verbesserung ist belegt (Bootstrap ueber Spiele, 95 %: -0,0092 bis
-0,0021). Die uebrigen Konstanten (Streuung, Ballbesitz) blieben: sie neu
anzupassen machte das Ergebnis ausserhalb der Stichprobe schlechter. Die
frei angepasste Variante ist minimal besser, braucht aber eine zusaetzliche
Konstante und trifft beim Anpfiff nicht mehr exakt die Prognose.

Die JavaScript-Fassung ergibt auf denselben 136.458 Testzustaenden exakt
denselben LogLoss (0,4679) wie der Python-Test.
