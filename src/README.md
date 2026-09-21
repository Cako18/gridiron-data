# src/ - Stand der Frontend-Quelle

Kurz und unschoen: **die Quelle der laufenden App existiert nicht mehr
vollstaendig.** Im Repo lag nur `app26.js`, das fertige Bundle. Was hier
liegt, ist die Rekonstruktion dessen, was noch da war.

## Was hier liegt

| Datei | Was es ist | Taugt wofuer |
|---|---|---|
| `app26.readable.js` | `app26.js`, mit Prettier entzerrt. Funktional identisch zur laufenden App, aber mit verkuerzten Variablennamen aus dem Build. | Nachschlagen, was die App tut. Notaenderungen. |
| `nfl-predictor.2026-07-21.jsx` | Die letzte erhaltene echte Quelle, 507 Zeilen, vom 21.07.2026. | Geruest fuer einen Neuaufbau. |

## Was der alten JSX fehlt

Sie kennt `TEAM_META`, Elo-Ranking, Upset-Logik und die Bilanz. Alles
Spaetere fehlt: Live-Tab mit WP-Kurven, Depth Charts, Tippschein,
Vegas-Duell, Systemtest, Wochenvorschau, KI-Kontext-Anzeige. Grob ein
Viertel der heutigen App.

## Konsequenz

Die Seite laeuft stabil, aber die Oberflaeche ist bis auf Weiteres
eingefroren: jede Aenderung ist entweder eine Operation am entzerrten
Bundle oder ein Neuaufbau der JSX. Der Neuaufbau ist der richtige Weg,
er ist nur kein Nebenbei-Projekt.

**Regel fuer die Zukunft: die Quelle gehoert ins Repo, nicht nur das
Bundle.** Was hier passiert ist, darf sich nicht wiederholen.

## Haeufig gesuchte Stelle

Die Wochenwahl beim Laden, in `app26.readable.js`:

```js
let O = w.filter((d) => d.hs === null).map((d) => d.w);
O.length && Qc(Math.min(...O));
```

Die App zeigt immer die niedrigste Woche mit offenen Spielen. Sie
springt also von selbst weiter, sobald das Montagsspiel ausgewertet ist
- dafuer sorgt der Pipeline-Lauf dienstags 06:19 UTC.
