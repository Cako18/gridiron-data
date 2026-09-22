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
| Matchup | Prognose, Edge-Attribution, KI-Kontext, Marktbewegung, Ligavergleich, Spieltyp, beide Depth Charts |
| Tippschein | EV je Tipp, Risikomischung, Poisson-Binomial-Verteilung, Gesamtquote |
| Vegas-Duell | Bilanz, CLV, Kalibrierung mit Signifikanztest, Merkmalsguete, bester Call |
| Elo-Ranking | Sortierung nach Elo/Offense/Defense/QB, Elo-Verlauf, Projektion |

### Bewusst nicht uebernommen

| Was | Warum |
|---|---|
| Einzelanalyse per Claude-API | Der Aufruf im alten Bundle sendet keinen `x-api-key`. Auf GitHub Pages schlaegt er immer fehl - toter Code. (Immerhin: es liegt damit auch kein Schluessel im oeffentlichen Bundle.) |
| Aufstellungs-Duell | Die Pipeline fuellt `lineups` nur fuer zwei Teams. Erst muss `update_data.py` alle 32 liefern. |
| Archetyp-Korrelationen | `Saisonstart` korreliert mit 0,72 zu `Heimfavorit` und 0,70 zu `Enges Spiel` - weil die Marke frueh in der Saison auf jedes Spiel zutrifft. Ein Artefakt, keine Erkenntnis. |

**Live laeuft weiterhin `app26.js`.** Der Seite-an-Seite-Vergleich mit
identischem Feed (`pruef/vergleich2.mjs`) ist bestanden: Live-Balken,
Kipp-Hinweis, Vorbereitungsspiel, Fuehrungswechsel und alle Vorab-Prognosen
stimmen mit dem alten Bundle ueberein. Offen ist nur noch der Blick auf den
echten ESPN-Feed an einem Spieltag - danach wird `index.html` umgestellt.

Zusaetzlich prueft `pruef/rechnung.cjs` den Rechenkern direkt gegen die
Pipeline: fuer alle noch nicht eingefrorenen Picks muss `predictHome()` die
Wahrscheinlichkeit aus `update_data.py` treffen. Stand 22.09.: 16 von 16,
groesste Abweichung 0,005 Prozentpunkte (Rundung).

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
| `duel{}` | Bilanz gegen den Markt, Kalibrierung, CLV |
| `line_moves{}`, `depth{}`, `lineups{}`, `proj{}` | Zusatzdaten der uebrigen Tabs |

**`model.json`**: `features`, `mean`, `scale`, `coef`, `intercept` -
die logistische Regression, nachgerechnet in `predictHome()`.

## Zwei Regeln, die aus Fehlern stammen

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
4. **Keine Merkmale auf 0 setzen, weil sie "wohl egal" sind.** Der erste
   Entwurf liess die beiden Reisemerkmale weg. Bei Seattle in Washington
   lag die Vorab-Prognose dadurch 5,7 Punkte daneben. Aufgefallen ist es
   erst im Vergleich mit dem alten Bundle.
5. **Der Tipp eines beendeten Spiels ist der eingefrorene Pick.** Die alte
   Live-Seite rechnete ihn nachtraeglich mit dem heutigen Modell aus -
   derselbe Rueckschaufehler, der einmal die Wochenbilanz geschoent hat.
6. **Rauschen wird als Rauschen ausgewiesen.** Die Kalibrierungstabelle
   rechnet je Band einen zweiseitigen Binomialtest und schreibt das
   Ergebnis hin. Bei zehn Spielen sieht "gesagt 55 %, real 75 %"
   dramatisch aus und ist p = 0,25 - also nichts. Eine Seite, die solche
   Zahlen hervorhebt, erzieht ihren Leser zu Fehlschluessen.

## Altbestand

- `app26.readable.js` - das laufende Bundle, mit Prettier entzerrt.
  Nachschlagewerk, keine Arbeitsgrundlage.
- `nfl-predictor.2026-07-21.jsx` - letzte erhaltene echte Quelle,
  507 Zeilen. Kennt Elo-Ranking, Upsets, Bilanz; alles Spaetere fehlt.

**Regel fuer die Zukunft: die Quelle gehoert ins Repo, nicht nur das
Bundle.**

## Offener Befund: Die Live-Kurve startet zu nah an 50 %

Beim Anpfiff ist nichts passiert, die Live-Wahrscheinlichkeit muesste also
genau der Vorab-Prognose entsprechen. Sie tut es nicht - in der alten wie
der neuen Fassung:

| Spiel | Modell vorab | Live-Kurve beim Anpfiff |
|---|---|---|
| ATL @ GB | 77,5 % | 70,5 % |
| LAC @ BUF | 85,5 % | 78,0 % |
| LA @ SF | 67,7 % | 62,7 % |

Ursache ist die Umrechnung der Vorab-Wahrscheinlichkeit in einen erwarteten
Punkteabstand, `16 * log10(p / (1 - p))`. Konsistent waere
`15,94 * Phi^-1(p)` (15,94 = Streuung beim Anpfiff). Nicht geaendert, weil
die uebrigen Konstanten an 43.671 echten Spielzustaenden geeicht sind und
die Eichung diesen Faktor womoeglich mitgetragen hat. Vor einer Aenderung
gehoert beides gegen nflverse-Play-by-Play-Daten geprueft.

Die Markierungen, Vorab-Prognosen, Tippschein und Bilanz sind davon nicht
betroffen - nur die Live-Kurve.
