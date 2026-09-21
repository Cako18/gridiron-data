# src/ - Frontend

## Stand

Die urspruengliche Quelle ging verloren; im Repo lag nur das fertige
Bundle. `nfl-predictor.jsx` ist der Neuaufbau, und er ist noch nicht
fertig.

| Tab | Zustand |
|---|---|
| Spielplan | gebaut, gegen echte Daten geprueft |
| Vegas-Duell | gebaut, gegen echte Daten geprueft |
| Elo-Ranking | gebaut, gegen echte Daten geprueft |
| Live | offen |
| Matchup | offen |
| Tippschein | offen |

**Live laeuft weiterhin `app26.js`.** `index.html` zeigt weiter dorthin
und wird erst umgestellt, wenn alle Tabs nachgebaut und geprueft sind.
Nicht vorher umstellen - ein halbfertiges Bundle scharf zu schalten
heisst, Funktionen zu verlieren, die heute laufen.

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
3. **Rauschen wird als Rauschen ausgewiesen.** Die Kalibrierungstabelle
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
