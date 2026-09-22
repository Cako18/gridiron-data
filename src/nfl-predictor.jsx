/* =====================================================================
   Cako's NFL World - Frontend
   =====================================================================

   Neuaufbau der verlorenen Quelle. Alle sechs Tabs stehen:
   Spielplan, Live, Matchup, Tippschein, Vegas-Duell, Elo-Ranking.

   Nicht uebernommen, mit Absicht:
     * Einzelanalyse per Claude-API - der Aufruf im alten Bundle sendet
       keinen Schluessel und schlaegt auf GitHub Pages immer fehl
     * Archetyp-Korrelationen - "Saisonstart" korreliert mit allem, weil
       es frueh in der Saison auf jedes Spiel zutrifft. Artefakt.

   Die laufende Seite (app26.js) bleibt unberuehrt, bis ein Tab hier
   nachweislich dasselbe zeigt. Vergleichsmassstab ist immer die
   Produktionsseite, nicht die Erinnerung daran.

   Bauen:  node build.mjs         (erzeugt ../appNN.js)
   ===================================================================== */

import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";

/* ---------------------------------------------------------------- Daten */

const BASE = "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data";

/** Teamkuerzel -> [voller Name, Vereinsfarbe] */
const TEAM = {
  ARI: ["Arizona Cardinals", "#97233F"], ATL: ["Atlanta Falcons", "#A71930"],
  BAL: ["Baltimore Ravens", "#241773"], BUF: ["Buffalo Bills", "#00338D"],
  CAR: ["Carolina Panthers", "#0085CA"], CHI: ["Chicago Bears", "#C83803"],
  CIN: ["Cincinnati Bengals", "#FB4F14"], CLE: ["Cleveland Browns", "#FF3C00"],
  DAL: ["Dallas Cowboys", "#003594"], DEN: ["Denver Broncos", "#FB4F14"],
  DET: ["Detroit Lions", "#0076B6"], GB: ["Green Bay Packers", "#203731"],
  HOU: ["Houston Texans", "#03202F"], IND: ["Indianapolis Colts", "#002C5F"],
  JAX: ["Jacksonville Jaguars", "#006778"], KC: ["Kansas City Chiefs", "#E31837"],
  LA: ["Los Angeles Rams", "#003594"], LAC: ["Los Angeles Chargers", "#0080C6"],
  LV: ["Las Vegas Raiders", "#A5ACAF"], MIA: ["Miami Dolphins", "#008E97"],
  MIN: ["Minnesota Vikings", "#4F2683"], NE: ["New England Patriots", "#002244"],
  NO: ["New Orleans Saints", "#D3BC8D"], NYG: ["New York Giants", "#0B2265"],
  NYJ: ["New York Jets", "#125740"], PHI: ["Philadelphia Eagles", "#004C54"],
  PIT: ["Pittsburgh Steelers", "#FFB612"], SEA: ["Seattle Seahawks", "#69BE28"],
  SF: ["San Francisco 49ers", "#AA0000"], TB: ["Tampa Bay Buccaneers", "#D50A0A"],
  TEN: ["Tennessee Titans", "#4B92DB"], WAS: ["Washington Commanders", "#5A1414"],
};
const name = (c) => (TEAM[c] || [c])[0];
const color = (c) => (TEAM[c] || [, "#8C94A8"])[1];

/* --------------------------------------------------------------- Palette */

const C = {
  bg: "#0A0D16", surface: "#131A2B", surface2: "#1A2033",
  line: "#26304A", line2: "#3A4560",
  text: "#F0EDE2", text2: "#C9CEDB", muted: "#8C94A8", muted3: "#5C6478",
  gold: "#D9A441", red: "#E0685C", green: "#8FCB9B", blue: "#7FB3D5",
};
const FONT = {
  head: "'Barlow Condensed', 'Helvetica Neue', sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  body: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
};

/* ------------------------------------------------------------ Rechnerei */

const pct = (x, d = 0) => `${(x * 100).toFixed(d)} %`;
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

/**
 * Siegwahrscheinlichkeit des Heimteams aus den Modellkoeffizienten.
 * Spiegelt update_data.py: standardisieren, gewichten, logistisch.
 * Wird nur fuer Spiele gebraucht, die noch keinen eingefrorenen Pick haben.
 */
function predictHome(model, feat) {
  if (!model || !feat) return null;
  let z = model.intercept;
  model.features.forEach((f, i) => {
    const v = feat[f];
    if (v === undefined || v === null) return;
    z += ((v - model.mean[i]) / model.scale[i]) * model.coef[i];
  });
  return sigmoid(z);
}

/**
 * Zeitzone je Stadion, relativ zur Ostkueste (ET = 0, CT = -1, MT = -2, PT = -3).
 * Uebernommen aus der alten Fassung. Arizona steht ganzjaehrig auf MT.
 */
const ZEITZONE = {
  BUF: 0, MIA: 0, NE: 0, NYJ: 0, NYG: 0, PHI: 0, PIT: 0, BAL: 0, CIN: 0, CLE: 0,
  WAS: 0, CAR: 0, ATL: 0, JAX: 0, TB: 0, IND: 0, DET: 0,
  CHI: -1, GB: -1, MIN: -1, DAL: -1, HOU: -1, TEN: -1, NO: -1, KC: -1,
  DEN: -2, ARI: -2,
  SEA: -3, SF: -3, LA: -3, LAC: -3, LV: -3,
};

/**
 * Merkmalsvektor eines Spiels aus den Teamwerten - muss exakt der Pipeline und
 * der alten Fassung entsprechen, sonst zeigt die Seite andere Zahlen.
 *
 * Die beiden Reisemerkmale standen hier im ersten Entwurf fest auf 0. Das fiel
 * erst im Seite-an-Seite-Vergleich mit dem alten Bundle auf. Sie wirken nur bei
 * Spielen quer durchs Land, dort aber spuerbar.
 */
function features(game, teams, kiadj = {}) {
  const h = teams[game.h], a = teams[game.a];
  if (!h || !a) return null;
  const k = kiadj[`${game.w}-${game.a}-${game.h}`] || { ha: 0, aa: 0 };
  const tzH = ZEITZONE[game.h] || 0, tzA = ZEITZONE[game.a] || 0;
  const stunde = game.t ? parseInt(String(game.t).slice(0, 2), 10) : NaN;
  // Ruhetage: Differenz Heim minus Gast, unbegrenzt - wie predict_game() in der
  // Pipeline. (Die alte Live-Seite begrenzte auf +-7; die Pipeline tut das nicht.)
  const rd = game.rd !== undefined && game.rd !== null
    ? game.rd : (game.hr ?? 7) - (game.ar ?? 7);
  return {
    elo_diff: h.elo + 48 + (k.ha || 0) - (a.elo + (k.aa || 0)),
    qb_diff: h.qb - a.qb,
    off_diff: h.off_epa - a.off_epa,
    def_diff: a.def_epa - h.def_epa,
    cpoe_diff: h.cpoe - a.cpoe,
    rest_diff: rd,
    inj_diff: (a.inj ?? 0) - (h.inj ?? 0),
    // Gast minus Heim - so ist das Merkmal trainiert (update_data.py: qb_new_a - qb_new_h).
    // Im ersten Entwurf stand es verkehrt herum; es fiel nur deshalb nicht auf, weil
    // gerade kein Team einen QB ohne Historie hat.
    qb_new_diff: (a.qb_new ?? 0) - (h.qb_new ?? 0),
    bye_diff: ((game.hr ?? 7) >= 13 ? 1 : 0) - ((game.ar ?? 7) >= 13 ? 1 : 0),
    // wie viele Zeitzonen das Gastteam wechselt
    tz_shift_away: Math.abs(tzH - tzA),
    // Gast mindestens zwei Zonen westlich und Anstoss um 13 Uhr ET oder frueher
    west_early_away: tzA - tzH <= -2 && !isNaN(stunde) && stunde <= 13 ? 1 : 0,
  };
}

/** Marktwahrscheinlichkeit Heimteam, Buchmachermarge herausgerechnet. */
function marketHome(game) {
  const { mh, ma } = game;
  if (!mh || !ma) return null;
  const ih = 1 / mh, ia = 1 / ma;
  return ih / (ih + ia);
}

/**
 * Zweiseitiger Binomialtest: Wie wahrscheinlich ist eine mindestens so grosse
 * Abweichung, wenn das Modell in Wahrheit richtig kalibriert waere?
 *
 * Gebraucht wird das, damit die Seite Rauschen nicht als Befund ausgibt. Bei
 * zehn Spielen sieht "gesagt 55 %, real 75 %" dramatisch aus und ist es nicht.
 */
function binomP(k, n, p) {
  if (!n) return 1;
  const logFak = (m) => { let s = 0; for (let i = 2; i <= m; i++) s += Math.log(i); return s; };
  const pmf = (i) => Math.exp(
    logFak(n) - logFak(i) - logFak(n - i) + i * Math.log(p) + (n - i) * Math.log(1 - p)
  );
  const ziel = pmf(k) * 1.0000001;
  let summe = 0;
  for (let i = 0; i <= n; i++) { const x = pmf(i); if (x <= ziel) summe += x; }
  return Math.min(1, summe);
}

/** Die anzuzeigende Woche: die niedrigste mit noch offenen Spielen. */
function currentWeek(schedule) {
  const open = schedule.filter((g) => g.hs === null).map((g) => g.w);
  return open.length ? Math.min(...open) : Math.max(...schedule.map((g) => g.w));
}

const DAY = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
function dayLabel(iso) {
  const d = new Date(iso + "T12:00:00Z");
  return `${DAY[d.getUTCDay()]}, ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
}

/* ------------------------------------------------------------ Datenhaken */

/** elo_history.csv -> { TEAM: [{date, elo}, ...] }, nach Datum sortiert. */
function parseEloHistorie(text) {
  const zeilen = text.trim().split("\n");
  const kopf = zeilen[0].split(",").map((s) => s.trim());
  const iD = kopf.indexOf("date"), iT = kopf.indexOf("team"), iE = kopf.indexOf("elo");
  if (iD < 0 || iT < 0 || iE < 0) return {};
  const out = {};
  for (let i = 1; i < zeilen.length; i++) {
    const f = zeilen[i].split(",");
    if (f.length < 3) continue;
    const team = f[iT].trim(), elo = Number(f[iE]);
    if (!team || !isFinite(elo)) continue;
    (out[team] = out[team] || []).push({ date: f[iD].trim(), elo });
  }
  for (const t of Object.keys(out)) out[t].sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

function useGridironData() {
  const [state, setState] = useState({
    status: "laedt", data: null, model: null, ki: null, eloHist: null, err: null,
  });

  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      try {
        // app_data.json ist Pflicht, der Rest ist Beiwerk: faellt eine Nebendatei
        // aus, soll die Seite trotzdem stehen statt in den Fehlerzustand zu kippen.
        const [rd, rm, rk, re] = await Promise.all([
          fetch(`${BASE}/app_data.json`, { cache: "no-store" }),
          fetch(`${BASE}/model.json`, { cache: "no-store" }).catch(() => null),
          fetch(`${BASE}/ai_context.json`, { cache: "no-store" }).catch(() => null),
          fetch(`${BASE}/elo_history.csv`, { cache: "no-store" }).catch(() => null),
        ]);
        if (!rd || !rd.ok) throw new Error(`app_data.json: HTTP ${rd ? rd.status : "offline"}`);
        const data = await rd.json();
        const model = rm && rm.ok ? await rm.json().catch(() => null) : null;
        const ki = rk && rk.ok ? await rk.json().catch(() => null) : null;
        let eloHist = null;
        if (re && re.ok) {
          try { eloHist = parseEloHistorie(await re.text()); } catch { eloHist = null; }
        }
        if (!abgebrochen) setState({ status: "bereit", data, model, ki, eloHist, err: null });
      } catch (e) {
        if (!abgebrochen) {
          setState({ status: "fehler", data: null, model: null, ki: null, eloHist: null, err: String(e) });
        }
      }
    })();
    return () => { abgebrochen = true; };
  }, []);

  return state;
}

/* ----------------------------------------------------------- Bausteine */

/** Tage zwischen einem ISO-Datum und heute. */
function tageHer(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00Z");
  if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / 864e5);
}

function Kopf({ generated, ki, woche }) {
  // Der KI-Kontext war schon einmal sieben Tage alt, ohne dass es jemand sah.
  // Deshalb steht sein Alter jetzt im Kopf, mit Farbe: gruen frisch, gold
  // aelter als drei Tage, rot aelter als die laufende Woche.
  const alter = ki ? tageHer(ki.generated) : null;
  // Zwischen Dienstag und Donnerstag steht der Kontext planmaessig noch auf der
  // Vorwoche - vorher wird bewusst kein Geld fuer Nachrichten ausgegeben, die
  // bis zum Wochenende veralten. Das ist kein Fehler und soll nicht rot leuchten.
  // Rot nur, wenn es wirklich klemmt: Kontext mehr als eine Woche zurueck,
  // oder aelter als acht Tage.
  const vorwoche = ki && woche && ki.week === woche - 1;
  const falscheWoche = ki && woche && ki.week !== woche && !vorwoche;
  const kiFarbe = alter === null ? C.muted3
    : falscheWoche || alter > 8 ? C.red
    : vorwoche ? C.muted3
    : alter > 3 ? C.gold : C.green;

  return (
    <header style={{ borderBottom: `1px solid ${C.line}`, padding: "20px 16px 12px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{
          margin: 0, fontFamily: FONT.head, fontSize: 30, letterSpacing: "0.04em",
          textTransform: "uppercase", color: C.text, fontWeight: 600,
        }}>
          Cako&rsquo;s <span style={{ color: C.gold }}>NFL World</span>
        </h1>
        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap", marginTop: 5,
          fontFamily: FONT.mono, fontSize: 10, color: C.muted3,
        }}>
          <span>{generated ? `Daten ${new Date(generated).toLocaleString("de-DE")}` : " "}</span>
          {ki && (
            <span style={{ color: kiFarbe }}>
              KI-Kontext {alter === 0 ? "heute" : alter === 1 ? "gestern" : `vor ${alter} Tagen`}
              {" · "}Woche {ki.week}
              {ki.coverage ? ` · ${ki.coverage}` : ""}
              {falscheWoche && " · veraltet"}
              {vorwoche && ` · Woche ${woche} folgt Do/So`}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

/** Vorschau auf die laufende Woche: was auffaellt, bevor gespielt wird. */
function Wochenvorschau({ data, model, ki, woche }) {
  const punkte = useMemo(() => {
    const offen = data.schedule.filter((g) => g.w === woche && g.hs === null);
    if (!offen.length) return null;

    const mit = offen.map((g) => {
      const key = `${g.w}-${g.a}-${g.h}`;
      const pk = data.picks[key];
      const pHome = predictHome(model, features(g, data.teams, data.kiadj));
      const tipp = pk ? pk.pick : pHome === null ? null : pHome >= 0.5 ? g.h : g.a;
      const p = pk ? pk.p : pHome === null ? null : Math.max(pHome, 1 - pHome);
      const mh = marketHome(g);
      const marktTipp = pk && pk.vp ? pk.vp : mh === null ? null : mh >= 0.5 ? g.h : g.a;
      const an = data.analysis[key];
      return { g, key, tipp, p, marktTipp, an, gegenMarkt: tipp && marktTipp && tipp !== marktTipp };
    }).filter((x) => x.tipp);

    const gegen = mit.filter((x) => x.gegenMarkt);
    const knapp = mit.filter((x) => x.p !== null && x.p < 0.56).sort((a, b) => a.p - b.p);
    const sicher = mit.filter((x) => x.p !== null).sort((a, b) => b.p - a.p)[0];
    const kiTreffer = ki && ki.games
      ? Object.entries(ki.games)
          .filter(([k, v]) => k.startsWith(`${woche}-`) && (v.ha || v.aa))
          .sort((a, b) => Math.max(Math.abs(b[1].ha), Math.abs(b[1].aa)) - Math.max(Math.abs(a[1].ha), Math.abs(a[1].aa)))[0]
      : null;
    return { anzahl: mit.length, gegen, knapp, sicher, kiTreffer };
  }, [data, model, ki, woche]);

  if (!punkte) return null;

  return (
    <div style={{
      margin: "0 16px 14px", padding: "12px 14px", borderRadius: 8,
      background: C.surface2, border: `1px solid ${C.line}`,
    }}>
      <div style={{
        fontFamily: FONT.head, fontSize: 14, letterSpacing: "0.08em",
        textTransform: "uppercase", color: C.text2, marginBottom: 7,
      }}>
        Woche {woche} &ndash; Vorschau
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, lineHeight: 1.9 }}>
        {punkte.anzahl} offene Spiele.{" "}
        {punkte.gegen.length === 0
          ? "Das Modell ist sich diese Woche mit dem Markt ueber jeden Sieger einig."
          : `Gegen den Markt in ${punkte.gegen.length} ${punkte.gegen.length === 1 ? "Spiel" : "Spielen"}: ` +
            punkte.gegen.map((x) => `${x.tipp} statt ${x.marktTipp}`).join(", ") +
            `. Vorsicht: In solchen Faellen lag historisch der Markt in ` +
            `${(100 - BACKTEST.gegen.real).toFixed(0)} % richtig.`}
        {punkte.sicher && (
          <><br />Sicherster Tipp: <span style={{ color: C.text2 }}>{name(punkte.sicher.tipp)}</span>{" "}
            mit {pct(punkte.sicher.p)}.</>
        )}
        {punkte.knapp.length > 0 && (
          <><br />Muenzwurf-Kandidaten: {punkte.knapp.slice(0, 3)
            .map((x) => `${x.g.a} bei ${x.g.h} (${pct(x.p)})`).join(", ")}.</>
        )}
        {punkte.kiTreffer && (
          <><br /><span style={{ color: C.gold }}>Groesste KI-Anpassung:</span>{" "}
            {punkte.kiTreffer[0].split("-").slice(1).join(" bei ")} &mdash;{" "}
            {punkte.kiTreffer[1].summary}</>
        )}
      </div>
    </div>
  );
}

const TABS = [
  ["sched", "Spielplan"],
  ["live", "Live"],
  ["match", "Matchup"],
  ["slip", "Tippschein"],
  ["duel", "Vegas-Duell"],
  ["rank", "Elo-Ranking"],
];

function TabLeiste({ aktiv, setAktiv, fertig }) {
  return (
    <nav style={{
      display: "flex", gap: 4, overflowX: "auto", padding: "10px 16px",
      borderBottom: `1px solid ${C.line}`, maxWidth: 760, margin: "0 auto",
    }}>
      {TABS.map(([id, label]) => {
        const an = id === aktiv, kann = fertig.includes(id);
        return (
          <button
            key={id}
            onClick={() => kann && setAktiv(id)}
            disabled={!kann}
            title={kann ? undefined : "noch nicht neu aufgebaut"}
            style={{
              flex: "0 0 auto", padding: "7px 13px", borderRadius: 6, cursor: kann ? "pointer" : "not-allowed",
              border: `1px solid ${an ? C.gold : C.line}`,
              background: an ? "rgba(217,164,65,0.12)" : "transparent",
              color: an ? C.gold : kann ? C.text2 : C.muted3,
              opacity: kann ? 1 : 0.45,
              fontFamily: FONT.head, fontSize: 15, letterSpacing: "0.05em", textTransform: "uppercase",
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function WochenWahl({ wochen, woche, setWoche }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "14px 16px 4px" }}>
      {wochen.map((w) => (
        <button
          key={w}
          onClick={() => setWoche(w)}
          style={{
            width: 36, height: 30, borderRadius: 5, cursor: "pointer",
            border: `1px solid ${w === woche ? C.gold : C.line}`,
            background: w === woche ? "rgba(217,164,65,0.12)" : C.surface,
            color: w === woche ? C.gold : C.muted,
            fontFamily: FONT.mono, fontSize: 12,
          }}
        >
          {w}
        </button>
      ))}
    </div>
  );
}

/**
 * Gemessene Trefferquoten der Markierungen fuer das Modell, das live laeuft
 * (Kernmodell: Elo, QB-Rating, Verletzungen). Gemessen im September 2026 am
 * echten Trainingsdatensatz der Pipeline, walk-forward 2016-2025: jede Saison
 * wurde mit einem Modell vorhergesagt, das nur die Jahre davor kannte.
 *
 * Diese Zahlen stehen hier fest und nicht aus der laufenden Bilanz, weil eine
 * Saison mit ein paar Dutzend Spielen fuer solche Aussagen zu duenn ist.
 * Neu messen, wenn sich das Modell aendert.
 */
const BACKTEST = {
  zeitraum: "2016\u20132025",
  n: 2671,
  bank: { n: 932, real: 76.9, markt: 75.4 },
  muenz: { n: 463, real: 59.2 },
  gegen: { n: 372, real: 42.7, lo: 37.7, hi: 47.8 },
};

/**
 * Einordnung eines Spiels. Bewusst gestrichen: "Favorit wackelt" - gleicher
 * Sieger wie der Markt, aber schwaecher eingeschaetzt. Gemessen gewannen diese
 * Favoriten 68,9 %, der Markt hatte 68,1 % vorhergesagt, das Modell 58,6 %.
 * Die Markierung warnte vor etwas, das nicht eintritt; sie war nur die
 * geringere Sicherheit des Modells in anderer Verkleidung.
 */
function markierung(tipp, p, marktTipp) {
  if (!tipp || p === null) return null;
  if (marktTipp && tipp !== marktTipp) {
    return {
      id: "gegen", label: "Gegen den Markt", farbe: C.red,
      text: `Das Modell tippt den Aussenseiter. In solchen Faellen hatte der Markt ` +
            `${(100 - BACKTEST.gegen.real).toFixed(0)} % recht (${BACKTEST.gegen.n} Spiele, ${BACKTEST.zeitraum}).`,
    };
  }
  if (p >= 0.7) return { id: "bank", label: "Bank", farbe: C.green };
  if (p < 0.58) return { id: "muenz", label: "Münzwurf", farbe: C.muted };
  return null;
}

function Markierungslegende({ duel }) {
  return (
    <details style={{
      margin: "0 16px 12px", padding: "9px 13px", borderRadius: 8,
      background: C.surface, border: `1px solid ${C.line}`,
    }}>
      <summary style={{ cursor: "pointer", fontFamily: FONT.mono, fontSize: 11, color: C.muted }}>
        Was die Markierungen bedeuten
      </summary>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, lineHeight: 1.8, marginTop: 8 }}>
        Gemessen an {BACKTEST.n} Spielen von {BACKTEST.zeitraum}. Jede Saison wurde mit
        einem Modell vorhergesagt, das nur die Jahre davor kannte:
        <br /><br />
        <span style={{ color: C.green }}>BANK</span> &ndash; Favorit mit mindestens 70 %.
        Gewann {BACKTEST.bank.real} % ({BACKTEST.bank.n} Spiele). Der Markt hatte {BACKTEST.bank.markt} % gesagt
        &ndash; also etwas naeher dran als das Modell.
        <br />
        <span style={{ color: C.text2 }}>M&Uuml;NZWURF</span> &ndash; unter 58 %. Traf {BACKTEST.muenz.real} %.
        Enge Spiele sind eng, da gibt es nichts herauszulesen.
        <br />
        <span style={{ color: C.red }}>GEGEN DEN MARKT</span> &ndash; das Modell sieht einen anderen Sieger als
        die Buchmacher. Es lag dabei nur in <strong style={{ color: C.red }}>{BACKTEST.gegen.real} %</strong> richtig
        (95 %: {BACKTEST.gegen.lo}&ndash;{BACKTEST.gegen.hi} %) &ndash; signifikant schlechter als ein Muenzwurf.
        Wer hier tippt, sollte auf die Seite des Marktes setzen.
        {duel && duel.dis_n > 0 && (
          <> Diese Saison bisher: {duel.dis_m} von {duel.dis_n}.</>
        )}
        <br /><br />
        Frueher gab es noch &bdquo;Favorit wackelt&ldquo;. Die Markierung ist weg: Diese Favoriten gewannen
        68,9 %, der Markt hatte 68,1 % vorhergesagt. Die Warnung war falsch.
      </div>
    </details>
  );
}

/** Ein Spiel: Teams, Modellprognose, Markt, Status. */
function SpielZeile({ game, pick, pModel, pMarkt }) {
  const gespielt = game.hs !== null && game.as !== null;
  const sieger = gespielt ? (game.hs > game.as ? game.h : game.as > game.hs ? game.a : null) : null;

  // Eingefrorener Pick hat Vorrang vor der Neuberechnung - so misst die
  // Bilanz das Modell zum Zeitpunkt des Locks, nicht das von heute.
  const tipp = pick ? pick.pick : pModel === null ? null : pModel >= 0.5 ? game.h : game.a;
  const p = pick ? pick.p : pModel === null ? null : Math.max(pModel, 1 - pModel);
  const marktTipp = pick && pick.vp ? pick.vp : pMarkt === null ? null : pMarkt >= 0.5 ? game.h : game.a;

  const treffer = gespielt && tipp ? tipp === sieger : null;
  const mark = markierung(tipp, p, marktTipp);

  return (
    <div style={{
      padding: "11px 14px", marginBottom: 6, borderRadius: 8, background: C.surface,
      border: `1px solid ${mark && mark.id === "gegen" && !gespielt ? C.red + "55" : C.line}`,
    }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: color(tipp || game.h) }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: C.text, fontWeight: sieger === game.a ? 600 : 400 }}>
          {name(game.a)}
          {gespielt && <span style={{ fontFamily: FONT.mono, color: C.muted, marginLeft: 8 }}>{game.as}</span>}
        </div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: sieger === game.h ? 600 : 400 }}>
          bei {name(game.h)}
          {gespielt && <span style={{ fontFamily: FONT.mono, color: C.muted, marginLeft: 8 }}>{game.hs}</span>}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 3 }}>
          {game.t ? `${game.t.slice(0, 5)} ET` : ""}
          {game.dv ? " · Division" : ""}
          {pick && pick.st === "fix" ? " · Pick eingefroren" : ""}
          {mark && (
            <span style={{
              marginLeft: 7, padding: "1px 6px", borderRadius: 4,
              border: `1px solid ${mark.farbe}66`, color: mark.farbe,
              fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {mark.label}
            </span>
          )}
        </div>
      </div>

      <div style={{ textAlign: "right", minWidth: 96 }}>
        {tipp ? (
          <>
            <div style={{ fontFamily: FONT.mono, fontSize: 15, color: treffer === null ? C.text : treffer ? C.green : C.red }}>
              {tipp} {p !== null ? pct(p) : ""}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3 }}>
              {pMarkt !== null
                ? `Markt ${marktTipp} ${pct(Math.max(pMarkt, 1 - pMarkt))}`
                : "keine Quote"}
            </div>
          </>
        ) : (
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted3 }}>keine Prognose</span>
        )}
      </div>
    </div>
    {/* Nur vor dem Spiel: danach ist der Hinweis Geschichte und die Farbe sagt alles. */}
    {mark && mark.text && !gespielt && (
      <div style={{
        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.line}`,
        fontFamily: FONT.mono, fontSize: 10, color: C.text2, lineHeight: 1.6,
      }}>
        {mark.text}
      </div>
    )}
    </div>
  );
}

function SpielplanTab({ data, model, ki }) {
  const wochen = useMemo(
    () => [...new Set(data.schedule.map((g) => g.w))].sort((a, b) => a - b),
    [data]
  );
  const [woche, setWoche] = useState(() => currentWeek(data.schedule));

  const spiele = useMemo(
    () => data.schedule.filter((g) => g.w === woche),
    [data, woche]
  );

  const nachTag = useMemo(() => {
    const m = new Map();
    for (const g of spiele) {
      if (!m.has(g.d)) m.set(g.d, []);
      m.get(g.d).push(g);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [spiele]);

  const bilanz = useMemo(() => {
    let n = 0, m = 0, v = 0;
    for (const g of spiele) {
      if (g.hs === null || g.as === null || g.hs === g.as) continue;
      const pk = data.picks[`${g.w}-${g.a}-${g.h}`];
      if (!pk) continue;
      const sieger = g.hs > g.as ? g.h : g.a;
      n++;
      if (pk.pick === sieger) m++;
      if (pk.vp === sieger) v++;
    }
    return { n, m, v };
  }, [spiele, data]);

  return (
    <>
      <WochenWahl wochen={wochen} woche={woche} setWoche={setWoche} />

      <Wochenvorschau data={data} model={model} ki={ki} woche={woche} />
      <Markierungslegende duel={data.duel} />

      {bilanz.n > 0 && (
        <div style={{
          margin: "8px 16px 14px", padding: "10px 14px", borderRadius: 8,
          background: C.surface2, border: `1px solid ${C.line}`,
          fontFamily: FONT.mono, fontSize: 12, color: C.text2,
        }}>
          Woche {woche}: Modell{" "}
          <strong style={{ color: C.gold }}>{bilanz.m}/{bilanz.n}</strong>{" "}
          &middot; Vegas <strong style={{ color: C.text }}>{bilanz.v}/{bilanz.n}</strong>
        </div>
      )}

      <div style={{ padding: "0 16px 40px" }}>
        {nachTag.map(([tag, gs]) => (
          <section key={tag} style={{ marginBottom: 18 }}>
            <h2 style={{
              margin: "0 0 7px", fontFamily: FONT.head, fontSize: 15, fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted,
            }}>
              {dayLabel(tag)}
            </h2>
            {gs.map((g) => {
              const key = `${g.w}-${g.a}-${g.h}`;
              return (
                <SpielZeile
                  key={key}
                  game={g}
                  pick={data.picks[key]}
                  pModel={predictHome(model, features(g, data.teams, data.kiadj))}
                  pMarkt={marketHome(g)}
                />
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- Live */

const ESPN = "https://site.api.espn.com/apis/site/v2/sports/football/nfl";
/** ESPN nutzt teils andere Kuerzel als nflverse. */
const ESPN_CODE = { LAR: "LA", WSH: "WAS" };

/**
 * Standardnormalverteilung, Naeherung nach Abramowitz & Stegun 26.2.17.
 * Maximaler Fehler unter 7.5e-8 - fuer eine Siegwahrscheinlichkeit reichlich.
 */
function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x >= 0 ? 1 - p : p;
}

/**
 * Live-Siegwahrscheinlichkeit des Heimteams.
 *
 * Gedanke: Der Endabstand ist normalverteilt um eine Erwartung, die sich aus
 * dem aktuellen Punktestand plus dem noch ausstehenden Anteil der Vorab-
 * Erwartung zusammensetzt. Je weniger Zeit bleibt, desto kleiner die Streuung
 * und desto mehr zaehlt der Stand.
 *
 * Die Konstanten sind an echten Spielzustaenden geeicht und stammen
 * unveraendert aus der laufenden Fassung:
 *   1.94  Punkte Wert des Ballbesitzes, abklingend gegen Spielende
 *   16    Umrechnung Logit -> erwarteter Punkteabstand
 *   12.82 Streuung ueber ein volles Spiel, 3.12 Sockel am Ende
 */
/**
 * Umkehrfunktion der Standardnormalverteilung, Verfahren nach Acklam.
 * Relativer Fehler unter 1,2e-9.
 */
function normInv(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const q = Math.min(Math.max(p, 1e-9), 1 - 1e-9);
  if (q < 0.02425) {
    const r = Math.sqrt(-2 * Math.log(q));
    return (((((c[0] * r + c[1]) * r + c[2]) * r + c[3]) * r + c[4]) * r + c[5]) / ((((d[0] * r + d[1]) * r + d[2]) * r + d[3]) * r + 1);
  }
  if (q > 1 - 0.02425) {
    const r = Math.sqrt(-2 * Math.log(1 - q));
    return -(((((c[0] * r + c[1]) * r + c[2]) * r + c[3]) * r + c[4]) * r + c[5]) / ((((d[0] * r + d[1]) * r + d[2]) * r + d[3]) * r + 1);
  }
  const r = q - 0.5, s = r * r;
  return (((((a[0] * s + a[1]) * s + a[2]) * s + a[3]) * s + a[4]) * s + a[5]) * r / (((((b[0] * s + b[1]) * s + b[2]) * s + b[3]) * s + b[4]) * s + 1);
}

/** Streuung des Endabstands bei noch z Anteil Restspielzeit - geeicht, siehe liveWP. */
const liveStreuung = (z) => 12.82 * Math.sqrt(z) + 3.12;

function liveWP(pPre, homeScore, awayScore, secLeft, possHome) {
  const z = Math.max(0, Math.min(1, secLeft / 3600));
  if (z === 0) return homeScore > awayScore ? 1 : homeScore < awayScore ? 0 : 0.5;
  // Vorab-Erwartung in Punkten, so gewaehlt, dass die Kurve beim Anpfiff exakt die
  // Prognose trifft: normCdf(margin0 / liveStreuung(1)) = pPre.
  //
  // Frueher stand hier 16 * log10(pPre / (1 - pPre)). Das zog jede Kurve beim
  // Anpfiff 5 bis 7 Punkte Richtung 50 % (Green Bay: Prognose 77,5 %, Kurve 70,5 %).
  // Gemessen an 269.461 Spielzustaenden aus 1594 Spielen: angepasst 2019-21,
  // geprueft 2022-24 - LogLoss 0,4735 -> 0,4679, Bootstrap ueber Spiele belegt die
  // Verbesserung (95 %: -0,0092 bis -0,0021). Die uebrigen Konstanten blieben:
  // sie neu anzupassen machte das Ergebnis ausserhalb der Stichprobe schlechter.
  const margin0 = liveStreuung(1) * normInv(pPre);
  const poss = possHome === null || possHome === undefined ? 0 : possHome ? 1.94 : -1.94;
  const erwarteterAbstand = homeScore - awayScore + margin0 * z + poss * Math.min(1, z * 3);
  const streuung = liveStreuung(z);
  return normCdf(erwarteterAbstand / streuung);
}

/** Restsekunden aus Viertel und Uhr. Verlaengerung laeuft ueber 10 Minuten. */
function restSekunden(state, period, displayClock) {
  if (state === "post") return 0;
  if (state === "pre") return 3600;
  const [m, s] = String(displayClock || "0:00").split(":").map(Number);
  const inViertel = (isNaN(m) ? 0 : m * 60) + (isNaN(s) ? 0 : s);
  return period <= 4 ? (4 - period) * 900 + inViertel : Math.min(600, inViertel);
}

const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

function useLiveSpiele(aktiv, data, model) {
  const [spiele, setSpiele] = useState([]);
  const [kurven, setKurven] = useState({});
  const [fehler, setFehler] = useState(null);
  const [stand, setStand] = useState(null);

  useEffect(() => {
    if (!aktiv) return;
    let gestoppt = false;

    /** Vorab-Wahrscheinlichkeit des Heimteams aus dem eigenen Modell. */
    /** Offener Spielplan-Eintrag zu einer ESPN-Paarung, falls es ihn gibt. */
    const imPlan = (h, a) => data.schedule.find((g) => g.h === h && g.a === a && g.hs === null)
      || data.schedule.slice().reverse().find((g) => g.h === h && g.a === a);

    /**
     * Vorab-Wahrscheinlichkeit des Heimteams. Mit Spielplan-Eintrag zaehlen
     * Ruhetage, Anstosszeit und Reise mit - genau wie in Pipeline und Spielplan.
     * Ohne Eintrag (etwa Vorbereitungsspiele) nur die Teamwerte.
     */
    const pPre = (h, a) => {
      const g = imPlan(h, a) || { h, a, hr: 7, ar: 7 };
      const p = predictHome(model, features(g, data.teams, {}));
      return p === null ? 0.5 : Math.min(0.97, Math.max(0.03, p));
    };

    /** Verlauf aus den Scoring Plays eines Spiels. */
    const holeKurve = async (sp) => {
      try {
        const r = await fetch(`${ESPN}/summary?event=${sp.id}`);
        if (!r.ok) return;
        const plays = (await r.json()).scoringPlays || [];
        const p0 = pPre(sp.h, sp.a);
        const punkte = [{ t: 0, p: liveWP(p0, 0, 0, 3600, null), label: "Kickoff", hs: 0, as: 0 }];
        for (const pl of plays) {
          const per = (pl.period && pl.period.number) || 1;
          const [m, s] = String((pl.clock && pl.clock.displayValue) || "0:00").split(":").map(Number);
          const rest = per <= 4 ? (4 - per) * 900 + ((m || 0) * 60 + (s || 0)) : 0;
          const hs = Number(pl.homeScore) || 0, as = Number(pl.awayScore) || 0;
          punkte.push({
            t: 3600 - rest, p: liveWP(p0, hs, as, rest, null),
            label: pl.text ? String(pl.text).slice(0, 70) : "", hs, as,
          });
        }
        punkte.push({
          t: 3600 - sp.secLeft, p: sp.wp,
          label: sp.state === "post" ? "Endstand" : "jetzt", hs: sp.hs, as: sp.as,
        });
        if (!gestoppt) setKurven((k) => ({ ...k, [sp.id]: punkte.sort((x, y) => x.t - y.t) }));
      } catch { /* ein fehlendes Detail darf den Rest nicht kippen */ }
    };

    const laden = async () => {
      try {
        const von = new Date(Date.now() - 4 * 864e5), bis = new Date(Date.now() + 10 * 864e5);
        const r = await fetch(`${ESPN}/scoreboard?dates=${ymd(von)}-${ymd(bis)}&limit=200`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const events = (await r.json()).events || [];

        const liste = events.map((ev) => {
          const c = ev.competitions && ev.competitions[0];
          if (!c) return null;
          const H = c.competitors.find((x) => x.homeAway === "home");
          const A = c.competitors.find((x) => x.homeAway === "away");
          if (!H || !A) return null;
          const kurz = (x) => ESPN_CODE[x.team.abbreviation] || x.team.abbreviation;
          const h = kurz(H), a = kurz(A);
          if (!data.teams[h] || !data.teams[a]) return null;

          const st = ev.status || {};
          const state = st.type ? st.type.state : "pre";
          const period = st.period || 0;
          const clock = st.displayClock || "0:00";
          const secLeft = restSekunden(state, period, clock);

          let possHome = null;
          if (c.situation && c.situation.possession) {
            possHome = c.situation.possession === H.id ? true
              : c.situation.possession === A.id ? false : null;
          }
          const hs = Number(H.score) || 0, as = Number(A.score) || 0;
          const vorbereitung = Number((ev.season && ev.season.type) || (c.type && c.type.id) || 2) === 1;

          return {
            id: ev.id, h, a, hs, as, state, period, clock, secLeft, possHome,
            pre: vorbereitung,
            ko: ev.date ? new Date(ev.date) : null,
            detail: st.type ? st.type.shortDetail : "",
            pPre: pPre(h, a),
            wp: liveWP(pPre(h, a), hs, as, state === "pre" ? 3600 : secLeft,
                       state === "in" ? possHome : null),
            plan: imPlan(h, a) || null,
          };
        }).filter(Boolean);

        if (gestoppt) return;
        setSpiele(liste);
        setFehler(null);
        setStand(new Date());

        const laufend = liste.filter((x) => x.state === "in").slice(0, 4);
        const beendet = liste.filter((x) => x.state === "post")
          .sort((x, y) => (y.ko || 0) - (x.ko || 0)).slice(0, 3);
        for (const sp of [...laufend, ...beendet]) if (sp.id) holeKurve(sp);
      } catch (e) {
        if (!gestoppt) setFehler("Live-Feed nicht erreichbar – später nochmal versuchen.");
      }
    };

    laden();
    const timer = setInterval(laden, 45000);
    const beiFokus = () => { if (document.visibilityState === "visible") laden(); };
    document.addEventListener("visibilitychange", beiFokus);
    window.addEventListener("focus", beiFokus);
    return () => {
      gestoppt = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", beiFokus);
      window.removeEventListener("focus", beiFokus);
    };
  }, [aktiv, data, model]);

  return { spiele, kurven, fehler, stand };
}

/**
 * Anstoss eines Spielplan-Eintrags als echte Uhrzeit. Die Zeiten im Spielplan
 * sind US-Ostkueste; die Sommerzeit dort beginnt am zweiten Sonntag im Maerz
 * und endet am ersten Sonntag im November - nicht am selben Tag wie in Europa.
 */
function anstoss(g) {
  const [J, M, T] = String(g.d).split("-").map(Number);
  const wt = new Date(Date.UTC(J, M - 1, T)).getUTCDay();
  const versatz = M > 3 && M < 11 ? "-04:00"
    : M < 3 || M === 12 ? "-05:00"
    : M === 3 ? (T - wt >= 8 ? "-04:00" : "-05:00")
    : (T - wt >= 1 ? "-05:00" : "-04:00");
  const [h, m] = String(g.t || "13:00").slice(0, 5).split(":").map(Number);
  const hh = String(isNaN(h) ? 13 : h).padStart(2, "0"), mm = String(isNaN(m) ? 0 : m).padStart(2, "0");
  return new Date(`${g.d}T${hh}:${mm}:00${versatz}`);
}

function bisDahin(ko, jetzt) {
  const d = ko - jetzt;
  if (d <= 0) return "läuft gleich";
  const std = Math.floor(d / 36e5), tage = Math.floor(std / 24);
  return tage >= 1 ? `in ${tage} Tag${tage > 1 ? "en" : ""}`
    : std >= 1 ? `in ${std} Std.` : `in ${Math.max(1, Math.round(d / 6e4))} Min.`;
}

/**
 * Hinweis zum juengsten Wendepunkt, wie in der alten Fassung:
 * Fuehrung gekippt, starker Schwung (18 Punkte und mehr) oder Krimi im
 * Schlussviertel. Verglichen wird der aktuelle Stand mit dem letzten Punkt,
 * an dem der Spielstand noch ein anderer war.
 */
function wendepunkt(sp, punkte) {
  if (!punkte || punkte.length < 2) return null;
  const jetzt = punkte[punkte.length - 1];
  let vorher = null;
  for (let i = punkte.length - 2; i >= 0; i--) {
    if (punkte[i].hs !== jetzt.hs || punkte[i].as !== jetzt.as) { vorher = punkte[i]; break; }
  }
  if (!vorher) return null;
  const gekippt = (vorher.p - 0.5) * (jetzt.p - 0.5) < 0;
  const schwung = jetzt.p - vorher.p;
  if (gekippt) return { stufe: "kipp", text: `Führung gekippt – jetzt ${jetzt.p >= 0.5 ? sp.h : sp.a} vorn` };
  if (Math.abs(schwung) >= 0.18) {
    return { stufe: "schwung", text: `${schwung > 0 ? sp.h : sp.a} legt stark zu (${Math.abs(schwung * 100).toFixed(0)} Punkte)` };
  }
  if (Math.abs(jetzt.p - 0.5) < 0.12 && sp.secLeft < 900) {
    return { stufe: "krimi", text: "Krimi im Schlussviertel – praktisch offen" };
  }
  return null;
}

/** Spieluhr aus der vergangenen Zeit, z. B. "Q3 07:42". */
function spieluhr(t) {
  const q = Math.min(4, Math.floor(t / 900) + 1), rest = 900 - (t % 900);
  return `Q${q} ${String(Math.floor(rest / 60)).padStart(2, "0")}:${String(rest % 60).padStart(2, "0")}`;
}

/** Verlaufskurve der Siegwahrscheinlichkeit, Flaeche ueber und unter der Mitte. */
function WPKurve({ punkte, hCode, aCode, hoehe = 130 }) {
  const [gewaehlt, setGewaehlt] = useState(null);
  if (!punkte || punkte.length < 2) return null;
  const B = 320, H = hoehe, pad = 4;
  const x = (t) => (t / 3600) * B;
  const y = (p) => pad + (1 - p) * (H - 2 * pad);
  const linie = punkte.map((pt, i) => `${i ? "L" : "M"}${x(pt.t).toFixed(1)},${y(pt.p).toFixed(1)}`).join(" ");
  const flaeche = `${linie} L${x(punkte[punkte.length - 1].t).toFixed(1)},${y(0.5).toFixed(1)} L${x(punkte[0].t).toFixed(1)},${y(0.5).toFixed(1)} Z`;

  // Fuehrungswechsel: jeder Punkt, an dem die Kurve die Mittellinie kreuzt
  const wechsel = [];
  for (let i = 1; i < punkte.length; i++) {
    if ((punkte[i - 1].p - 0.5) * (punkte[i].p - 0.5) < 0) wechsel.push(i);
  }

  // Groesste Verschiebung - ohne den letzten Punkt: "jetzt" bzw. "Endstand"
  // ist beim Schlusspfiff das Umklappen auf Gewissheit, kein Umschwung. Die
  // alte Fassung meldete hier bei jedem beendeten Spiel den Abpfiff.
  let groesst = null;
  for (let i = 1; i < punkte.length - 1; i++) {
    const d = Math.abs(punkte[i].p - punkte[i - 1].p);
    if (!groesst || d > groesst.d) groesst = { d, i };
  }

  const g = gewaehlt !== null ? punkte[gewaehlt] : null;
  const idKurve = `${hCode}-${aCode}-${punkte.length}`;

  return (
    <div>
      <svg viewBox={`0 0 ${B} ${H}`} style={{ width: "100%", height: hoehe, display: "block" }}>
        <defs>
          {/* Ueber der Mittellinie gehoert die Flaeche dem Heimteam, darunter dem Gast. */}
          <clipPath id={`oben-${idKurve}`}><rect x="0" y="0" width={B} height={y(0.5)} /></clipPath>
          <clipPath id={`unten-${idKurve}`}><rect x="0" y={y(0.5)} width={B} height={H - y(0.5)} /></clipPath>
        </defs>
        <path d={flaeche} fill={color(hCode)} opacity="0.3" clipPath={`url(#oben-${idKurve})`} />
        <path d={flaeche} fill={color(aCode)} opacity="0.3" clipPath={`url(#unten-${idKurve})`} />
        <line x1="0" y1={y(0.5)} x2={B} y2={y(0.5)} stroke={C.line2} strokeWidth="1" strokeDasharray="3 3" />
        {[900, 1800, 2700].map((t) => (
          <line key={t} x1={x(t)} y1="0" x2={x(t)} y2={H} stroke={C.line} strokeWidth="0.5" />
        ))}
        <path d={linie} fill="none" stroke={C.text} strokeWidth="1.6" strokeLinejoin="round" />
        {wechsel.map((i) => (
          <circle key={`w${i}`} cx={x(punkte[i].t)} cy={y(punkte[i].p)} r="5"
                  fill="none" stroke={C.red} strokeWidth="1.4" />
        ))}
        {groesst && groesst.d > 0.15 && (
          <circle cx={x(punkte[groesst.i].t)} cy={y(punkte[groesst.i].p)} r="3.2"
                  fill={C.gold} stroke={C.bg} strokeWidth="1" />
        )}
        {/* Unsichtbare Tippflaechen je Punkt */}
        {punkte.map((pt, i) => (
          <circle key={`t${i}`} cx={x(pt.t)} cy={y(pt.p)} r="9" fill="transparent"
                  style={{ cursor: "pointer" }} onClick={() => setGewaehlt(i === gewaehlt ? null : i)} />
        ))}
        {g && <circle cx={x(g.t)} cy={y(g.p)} r="4" fill={C.gold} />}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 9, color: C.muted3 }}>
        <span>Kickoff</span><span>Q2</span><span>Halbzeit</span><span>Q4</span><span>Ende</span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
        {g ? (
          <>
            <span style={{ color: C.gold }}>{g.t >= 3600 ? "Ende" : spieluhr(g.t)}</span>
            {" · "}{aCode} {g.as} : {g.hs} {hCode}{" · "}{pct(g.p)} f&uuml;r {hCode}
            {gewaehlt > 0 && (() => {
              const d = (g.p - punkte[gewaehlt - 1].p) * 100;
              return <span style={{ color: d >= 0 ? C.green : C.red }}> ({d >= 0 ? "+" : ""}{d.toFixed(0)} Punkte)</span>;
            })()}
            {g.label && g.label !== "jetzt" && g.label !== "Endstand" && (
              <span style={{ display: "block", color: C.muted3 }}>{g.label}</span>
            )}
          </>
        ) : (
          <>
            Punkte antippen f&uuml;r Details.
            {groesst && groesst.d > 0.15 && (
              <> Gr&ouml;&szlig;te Verschiebung: <span style={{ color: C.gold }}>{Math.round(groesst.d * 100)} Punkte</span>{" "}
                bei {spieluhr(punkte[groesst.i].t)}.</>
            )}
            {wechsel.length > 0
              ? <> <span style={{ color: C.red }}>{wechsel.length}&times; F&uuml;hrungswechsel</span> (rote Ringe).</>
              : " Kein Führungswechsel."}
          </>
        )}
      </div>
    </div>
  );
}

/** Balken zwischen beiden Teams, links Heim, rechts Gast. */
function WPBalken({ pHeim, hCode, aCode }) {
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ display: "flex", height: 7, borderRadius: 4, overflow: "hidden", background: C.line }}>
        <div style={{ width: `${pHeim * 100}%`, background: color(hCode) }} />
        <div style={{ flex: 1, background: color(aCode) }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: 10, color: C.muted, marginTop: 3 }}>
        <span>{hCode} {pct(pHeim)}</span><span>{aCode} {pct(1 - pHeim)}</span>
      </div>
    </div>
  );
}

function LiveKarte({ sp, kurve, pick }) {
  const laeuft = sp.state === "in";
  const fertig = sp.state === "post";
  const hinweis = laeuft ? wendepunkt(sp, kurve) : null;
  const sieger = fertig ? (sp.hs > sp.as ? sp.h : sp.as > sp.hs ? sp.a : null) : null;

  // Tipp-Haekchen aus dem EINGEFRORENEN Pick. Die alte Fassung rechnete den
  // Tipp nach dem Spiel mit dem Modell von heute neu aus - genau der
  // Rueckschaufehler, der die Wochenbilanz einmal auf 94 statt 75 % geschoent hat.
  const tipp = fertig && !sp.pre && pick ? pick.pick : null;

  return (
    <div style={{
      padding: "13px 14px", marginBottom: 10, borderRadius: 9,
      background: C.surface, border: `1px solid ${laeuft ? C.gold + "66" : C.line}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 10, color: laeuft ? C.gold : C.muted3 }}>
          {laeuft ? `LIVE · Q${sp.period} ${sp.clock}` : fertig ? "Endstand" : sp.detail}
          {sp.pre && " · Vorbereitung"}
        </span>
        {sp.possHome !== null && laeuft && (
          <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted3 }}>
            Ball bei {sp.possHome ? sp.h : sp.a}
          </span>
        )}
        {tipp && sieger && (
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: tipp === sieger ? C.green : C.red }}>
            {tipp === sieger ? "✓" : "✕"} Tipp {tipp}
          </span>
        )}
      </div>

      <div style={{ marginTop: 7 }}>
        <div style={{ fontSize: 14, color: C.text, fontWeight: sieger === sp.a ? 600 : 400 }}>
          {name(sp.a)} <span style={{ fontFamily: FONT.mono, color: C.muted }}>{sp.as}</span>
        </div>
        <div style={{ fontSize: 14, color: C.text, fontWeight: sieger === sp.h ? 600 : 400 }}>
          bei {name(sp.h)} <span style={{ fontFamily: FONT.mono, color: C.muted }}>{sp.hs}</span>
        </div>
      </div>

      {(laeuft || fertig) && <WPBalken pHeim={sp.wp} hCode={sp.h} aCode={sp.a} />}

      {hinweis && (
        <div style={{
          marginTop: 9, padding: "7px 10px", borderRadius: 6, fontFamily: FONT.mono, fontSize: 11,
          border: `1px solid ${hinweis.stufe === "kipp" ? C.red : C.gold}66`,
          color: hinweis.stufe === "kipp" ? C.red : C.gold,
        }}>
          &#9889; {hinweis.text}
        </div>
      )}

      {kurve && (laeuft || fertig) && (
        <div style={{ marginTop: 10 }}>
          <WPKurve punkte={kurve} hCode={sp.h} aCode={sp.a} />
        </div>
      )}

      {sp.pre && (
        <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 8, lineHeight: 1.6 }}>
          Vorbereitungsspiel: keine Prognose, sondern ein Test der Live-Mechanik &ndash;
          reagiert der Balken richtig auf Spielstand, Restzeit und Ballbesitz? Auf dem
          Feld stehen ueberwiegend Ersatzspieler; nichts davon fliesst in Elo, Modell
          oder Bilanz.
        </p>
      )}
    </div>
  );
}

/** Kompakte Zeile fuer ein kommendes Spiel mit Vorab-Prognose. */
function KommendZeile({ k, jetzt }) {
  const fav = k.p === null ? null : k.p >= 0.5 ? k.h : k.a;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", marginBottom: 6,
      borderRadius: 8, background: C.surface, border: `1px solid ${C.line}`,
    }}>
      <span style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: fav ? color(fav) : C.line2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.text }}>{k.a} @ {k.h}</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 2 }}>
          {k.ko.toLocaleString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
          {" · "}{bisDahin(k.ko, jetzt)}
          {k.pre && " · Vorbereitung"}
        </div>
      </div>
      {fav && (
        <span style={{ fontFamily: FONT.mono, fontSize: 13, color: C.gold }}>
          {fav} {pct(Math.max(k.p, 1 - k.p))}
        </span>
      )}
    </div>
  );
}

function LiveTab({ data, model }) {
  const { spiele, kurven, fehler, stand } = useLiveSpiele(true, data, model);
  const jetzt = stand || new Date();
  const pickFuer = (sp) => {
    const g = sp.plan;
    return g ? data.picks[`${g.w}-${g.a}-${g.h}`] || null : null;
  };

  const laufend = spiele.filter((s) => s.state === "in");
  const beendet = spiele.filter((s) => s.state === "post")
    .sort((a, b) => (b.ko || 0) - (a.ko || 0)).slice(0, 6);

  // Kommende Spiele: was ESPN kennt, ergaenzt um den eigenen Spielplan - der
  // Feed reicht nur zehn Tage voraus und kennt Nachholspiele manchmal spaet.
  const kommend = useMemo(() => {
    const ausFeed = spiele.filter((s) => s.state === "pre" && s.ko).map((s) => {
      const pk = pickFuer(s);
      const p = s.pre ? null : pk ? (pk.pick === s.h ? pk.p : 1 - pk.p) : s.pPre;
      return { h: s.h, a: s.a, ko: s.ko, pre: s.pre, p };
    });
    const bekannt = new Set(ausFeed.map((k) => k.h + k.a));
    const ausPlan = data.schedule
      .filter((g) => g.hs === null && !bekannt.has(g.h + g.a))
      .map((g) => {
        const pk = data.picks[`${g.w}-${g.a}-${g.h}`];
        const pH = pk ? (pk.pick === g.h ? pk.p : 1 - pk.p)
          : predictHome(model, features(g, data.teams, {}));
        return { h: g.h, a: g.a, ko: anstoss(g), pre: false, p: pH };
      })
      .filter((k) => k.ko > jetzt);
    return [...ausFeed, ...ausPlan].sort((a, b) => a.ko - b.ko).slice(0, 8);
  }, [spiele, data, model, stand]);

  return (
    <div style={{ padding: "14px 16px 40px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginBottom: 12,
      }}>
        <span>Aktualisiert sich alle 45 Sekunden</span>
        <span>{stand ? `zuletzt ${stand.toLocaleTimeString("de-DE")}` : "…"}</span>
      </div>

      {fehler && (
        <div style={{
          padding: "11px 13px", borderRadius: 8, marginBottom: 12,
          background: "rgba(224,104,92,0.09)", border: `1px solid ${C.red}55`,
          fontFamily: FONT.mono, fontSize: 11, color: C.red,
        }}>
          {fehler}
        </div>
      )}

      {laufend.length > 0 && (
        <Abschnitt titel="L&auml;uft jetzt" hinweis="Die Kurve zeigt den Verlauf der Siegwahrscheinlichkeit. Rote Ringe markieren F&uuml;hrungswechsel, der Goldpunkt den gr&ouml;&szlig;ten Umschwung.">
          {laufend.map((s) => <LiveKarte key={s.id} sp={s} kurve={kurven[s.id]} pick={pickFuer(s)} />)}
        </Abschnitt>
      )}

      {kommend.length > 0 && (
        <Abschnitt titel="Als N&auml;chstes">
          {kommend.map((k) => <KommendZeile key={k.h + k.a + k.ko.getTime()} k={k} jetzt={jetzt} />)}
        </Abschnitt>
      )}

      {beendet.length > 0 && (
        <Abschnitt titel="Zuletzt gelaufen" hinweis="H&auml;kchen nur bei Pflichtspielen, und immer gegen den eingefrorenen Tipp vor Anpfiff.">
          {beendet.map((s) => <LiveKarte key={s.id} sp={s} kurve={kurven[s.id]} pick={pickFuer(s)} />)}
        </Abschnitt>
      )}

      {!fehler && spiele.length === 0 && kommend.length === 0 && (
        <p style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted3 }}>
          Gerade keine Spiele im Zeitfenster.
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- Tippschein */

/**
 * Poisson-Binomial-Verteilung: Wahrscheinlichkeit fuer genau k Treffer bei n
 * unabhaengigen Tipps mit je eigener Trefferchance.
 *
 * Die uebliche Binomialformel taugt hier nicht - sie setzt fuer alle Tipps
 * dieselbe Wahrscheinlichkeit voraus. Ein Schein aus 85 % und 52 % ist aber
 * etwas voellig anderes als zweimal 68 %, obwohl der Schnitt gleich ist.
 */
function poissonBinomial(ps) {
  let dist = [1];
  for (const p of ps) {
    const next = new Array(dist.length + 1).fill(0);
    for (let k = 0; k < dist.length; k++) {
      next[k] += dist[k] * (1 - p);
      next[k + 1] += dist[k] * p;
    }
    dist = next;
  }
  return dist;
}

/** Risikoklasse nach Quotenniveau - nicht nach Abweichung vom Markt. */
function risikoKlasse(quote) {
  if (quote < 1.6) return { id: "fav", label: "Favorit", farbe: C.blue };
  if (quote <= 2.3) return { id: "mid", label: "Mittel", farbe: C.gold };
  return { id: "out", label: "Aussenseiter", farbe: C.red };
}

function TippscheinTab({ data, model }) {
  const wochen = useMemo(
    () => [...new Set(data.schedule.filter((g) => g.hs === null).map((g) => g.w))].sort((a, b) => a - b),
    [data]
  );
  const [woche, setWoche] = useState(() => currentWeek(data.schedule));

  /** Alle offenen Spiele der Woche als moegliche Legs, inklusive Quote und EV. */
  const legs = useMemo(() => {
    return data.schedule
      .filter((g) => g.w === woche && g.hs === null)
      .map((g) => {
        const key = `${g.w}-${g.a}-${g.h}`;
        const pick = data.picks[key];
        const pHome = predictHome(model, features(g, data.teams, data.kiadj));
        const tipp = pick ? pick.pick : pHome === null ? null : pHome >= 0.5 ? g.h : g.a;
        const p = pick ? pick.p : pHome === null ? null : Math.max(pHome, 1 - pHome);
        const quote = tipp === g.h ? g.mh : tipp === g.a ? g.ma : null;
        if (!tipp || p === null || !quote) return null;
        return { key, g, tipp, p, quote, ev: p * quote - 1, risiko: risikoKlasse(quote) };
      })
      .filter(Boolean)
      .sort((a, b) => b.ev - a.ev);
  }, [data, model, woche]);

  const [gewaehlt, setGewaehlt] = useState(() => new Set());
  const [nurPositiv, setNurPositiv] = useState(true);

  const umschalten = (k) => setGewaehlt((s) => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  /** Vorschlag nach Buraks Mischung: Aussenseiter und Favoriten, nur positiver EV. */
  const mischen = (nOut, nFav) => {
    const brauchbar = legs.filter((l) => l.ev > 0);
    const out = brauchbar.filter((l) => l.risiko.id === "out").slice(0, nOut);
    const fav = brauchbar.filter((l) => l.risiko.id !== "out").slice(0, nFav);
    setGewaehlt(new Set([...out, ...fav].map((l) => l.key)));
  };

  const schein = legs.filter((l) => gewaehlt.has(l.key));
  const gesamtQuote = schein.reduce((q, l) => q * l.quote, 1);
  const verteilung = useMemo(() => poissonBinomial(schein.map((l) => l.p)), [schein]);
  const alleTreffen = verteilung.length ? verteilung[verteilung.length - 1] : 0;
  const erwartet = schein.reduce((s, l) => s + l.p, 0);
  const scheinEV = alleTreffen * gesamtQuote - 1;
  const sichtbar = nurPositiv ? legs.filter((l) => l.ev > 0 || gewaehlt.has(l.key)) : legs;
  const versteckt = legs.length - sichtbar.length;

  const positive = legs.filter((l) => l.ev > 0).length;

  return (
    <div style={{ padding: "14px 16px 40px" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {wochen.slice(0, 8).map((w) => (
          <button key={w} onClick={() => { setWoche(w); setGewaehlt(new Set()); }} style={{
            width: 36, height: 30, borderRadius: 5, cursor: "pointer",
            border: `1px solid ${w === woche ? C.gold : C.line}`,
            background: w === woche ? "rgba(217,164,65,0.12)" : C.surface,
            color: w === woche ? C.gold : C.muted, fontFamily: FONT.mono, fontSize: 12,
          }}>
            {w}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, margin: "0 0 12px", lineHeight: 1.7 }}>
        Woche {woche} &middot; {legs.length} offene Spiele, davon {positive} mit positivem
        Erwartungswert. Der Erwartungswert je Tipp ist
        Wahrscheinlichkeit mal Quote minus eins. Ein Spiel mit 80 % bei Quote 1,12 hat
        einen EV von &minus;0,10 &ndash; hohe Trefferchance, trotzdem ein Verlustgeschaeft.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[["2 Aussenseiter + 4 Favoriten", 2, 4], ["1 + 3", 1, 3], ["3 + 3", 3, 3]].map(([l, o, f]) => (
          <button key={l} onClick={() => mischen(o, f)} style={{
            padding: "6px 11px", borderRadius: 5, cursor: "pointer",
            border: `1px solid ${C.line}`, background: C.surface, color: C.text2,
            fontFamily: FONT.mono, fontSize: 11,
          }}>
            {l}
          </button>
        ))}
        {gewaehlt.size > 0 && (
          <button onClick={() => setGewaehlt(new Set())} style={{
            padding: "6px 11px", borderRadius: 5, cursor: "pointer",
            border: `1px solid ${C.line}`, background: "transparent", color: C.muted3,
            fontFamily: FONT.mono, fontSize: 11,
          }}>
            leeren
          </button>
        )}
      </div>

      {/* Auswertung des Scheins */}
      {schein.length > 0 && (
        <div style={{
          padding: "13px 15px", marginBottom: 14, borderRadius: 9,
          background: C.surface2, border: `1px solid ${scheinEV > 0 ? C.green + "66" : C.line}`,
        }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontFamily: FONT.mono, fontSize: 12 }}>
            <span style={{ color: C.text }}>
              {schein.length} Tipps &middot; Gesamtquote{" "}
              <strong style={{ color: C.gold }}>{gesamtQuote.toFixed(2)}</strong>
            </span>
            <span style={{ color: C.muted }}>
              alle treffen: {pct(alleTreffen, 1)}
            </span>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, marginTop: 7, lineHeight: 1.8 }}>
            Erwartete Treffer: {erwartet.toFixed(1)} von {schein.length}<br />
            Erwartungswert des Scheins:{" "}
            <span style={{ color: scheinEV > 0 ? C.green : C.red }}>
              {scheinEV > 0 ? "+" : ""}{scheinEV.toFixed(2)} je eingesetztem Euro
            </span>
          </div>

          {/* Der EV steht und faellt mit der Frage, ob die Modellwahrscheinlichkeit
              besser ist als die des Marktes. Die Bilanz sagt dazu bisher: nein.
              Ohne diesen Hinweis liest sich "+1,91 je Euro" wie eine Zusage. */}
          {scheinEV > 0 && data.duel && data.duel.clv && (
            <div style={{
              marginTop: 11, padding: "10px 12px", borderRadius: 7,
              background: "rgba(217,164,65,0.07)", border: `1px solid ${C.gold}44`,
              fontFamily: FONT.mono, fontSize: 10, color: C.text2, lineHeight: 1.75,
            }}>
              <strong style={{ color: C.gold }}>Was dieser Erwartungswert voraussetzt:</strong>{" "}
              dass die Modellwahrscheinlichkeit naeher an der Wahrheit liegt als die Quote.
              Genau das ist bisher nicht belegt. Das Modell steht bei{" "}
              {data.duel.m}/{data.duel.n} gegen {data.duel.v}/{data.duel.n} fuer den Markt,
              bei Uneinigkeit {data.duel.dis_m}/{data.duel.dis_n}, und die Quote bewegt sich
              nur in {data.duel.clv.pos} % der Faelle nach dem Tipp in unsere Richtung.
              <br /><br />
              Ein positiver EV entsteht rechnerisch immer dort, wo das Modell vom Markt
              abweicht. Ob die Abweichung Wissen ist oder blosse Vorsicht, entscheidet
              nicht diese Zahl, sondern die Bilanz im Vegas-Duell.
            </div>
          )}

          {/* Trefferverteilung */}
          <div style={{ marginTop: 11 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginBottom: 5 }}>
              Verteilung der Treffer
            </div>
            {/* Auf den hoechsten Balken normiert, nicht auf 1 - sonst sind alle
                Balken bei sechs Tipps so flach, dass man nichts erkennt. */}
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 62 }}>
              {(() => {
                const maxP = Math.max(...verteilung);
                return verteilung.map((p, k) => (
                  <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 8, color: C.muted3, textAlign: "center" }}>
                      {p >= 0.05 ? Math.round(p * 100) : ""}
                    </div>
                    <div style={{
                      height: Math.max(2, (p / maxP) * 40), borderRadius: "2px 2px 0 0",
                      background: k === verteilung.length - 1 ? C.green : C.line2,
                    }} />
                    <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted3, textAlign: "center", marginTop: 3 }}>
                      {k}
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.muted3, marginTop: 4 }}>
              wahrscheinlichste Zahl:{" "}
              {verteilung.indexOf(Math.max(...verteilung))} Treffer
            </div>
          </div>
        </div>
      )}

      <label style={{
        display: "flex", alignItems: "center", gap: 7, marginBottom: 10,
        fontFamily: FONT.mono, fontSize: 11, color: C.muted, cursor: "pointer",
      }}>
        <input type="checkbox" checked={nurPositiv} onChange={(e) => setNurPositiv(e.target.checked)} />
        nur Tipps mit positivem Erwartungswert zeigen
        {versteckt > 0 && <span style={{ color: C.muted3 }}>({versteckt} ausgeblendet)</span>}
      </label>

      {sichtbar.map((l) => {
        const an = gewaehlt.has(l.key);
        return (
          <button
            key={l.key}
            onClick={() => umschalten(l.key)}
            style={{
              display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left",
              padding: "10px 12px", marginBottom: 6, borderRadius: 8, cursor: "pointer",
              background: an ? "rgba(217,164,65,0.09)" : C.surface,
              border: `1px solid ${an ? C.gold : C.line}`,
            }}
          >
            <span style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: color(l.tipp) }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: C.text }}>{name(l.tipp)}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 2 }}>
                gegen {name(l.tipp === l.g.h ? l.g.a : l.g.h)}
                {" · "}
                <span style={{ color: l.risiko.farbe }}>{l.risiko.label}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.text }}>
                {pct(l.p)} &middot; {l.quote.toFixed(2)}
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: l.ev > 0 ? C.green : C.red }}>
                EV {l.ev > 0 ? "+" : ""}{l.ev.toFixed(2)}
              </div>
            </div>
          </button>
        );
      })}

      {sichtbar.length === 0 && (
        <div style={{
          padding: "13px 15px", borderRadius: 8, background: C.surface,
          border: `1px solid ${C.line}`, fontFamily: FONT.mono, fontSize: 11,
          color: C.muted, lineHeight: 1.8,
        }}>
          {legs.length === 0
            ? "Keine offenen Spiele mit Quote in dieser Woche."
            : <>
                Kein einziger der {legs.length} Tipps hat einen positiven Erwartungswert.
                Der Markt zahlt diese Woche schlechter, als das Modell die Spiele einschaetzt.
                <br /><br />
                <span style={{ color: C.text2 }}>Das ist eine Aussage, kein Fehler:</span> nicht
                zu spielen ist hier die rechnerisch beste Entscheidung. Wer trotzdem sehen will,
                was es gaebe, blendet oben die Filterung aus.
              </>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Matchup */

const MERKMAL_LABEL = {
  elo_diff: "Elo / Form", qb_diff: "QB-Rating", off_diff: "Offense-EPA",
  def_diff: "Defense-EPA", cpoe_diff: "CPOE", rest_diff: "Ruhetage",
  inj_diff: "Verletzungen", qb_new_diff: "QB ohne Historie", bye_diff: "Bye-Woche",
  tz_shift_away: "Zeitzonenwechsel", west_early_away: "Westkueste, frueher Anstoss",
};

/**
 * Gegenueberstellung eines Teamwerts.
 *
 * Die Balken werden gegen die gesamte Liga normiert, nicht gegeneinander.
 * Gegeneinander normiert sahen 1410 und 1513 Elo fast gleich aus - beide
 * Balken bei rund der Haelfte, weil die Absolutwerte nah beieinander liegen.
 * Gegen die Liga gemessen ist der eine das untere Drittel und der andere die
 * Spitzengruppe, und genau das soll man sehen. Der Rang steht dabei.
 */
function VergleichsZeile({ label, aWert, hWert, aCode, hCode, fmt, liga, hoeherIstBesser = true }) {
  const { min, max, werte } = liga;
  const spanne = max - min || 1;
  const anteil = (v) => Math.min(1, Math.max(0.03, hoeherIstBesser ? (v - min) / spanne : (max - v) / spanne));
  const rang = (v) => {
    const s = [...werte].sort((x, y) => (hoeherIstBesser ? y - x : x - y));
    return s.findIndex((x) => x === v) + 1;
  };
  const aBesser = hoeherIstBesser ? aWert > hWert : aWert < hWert;

  const Seite = ({ v, code, rechts }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, alignItems: rechts ? "flex-end" : "flex-start" }}>
      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: (rechts ? !aBesser : aBesser) ? C.text : C.muted3 }}>
        {fmt(v)}
        <span style={{ color: C.muted3, fontSize: 9, marginLeft: 4 }}>{rang(v)}.</span>
      </span>
      <div style={{
        width: "100%", height: 4, background: C.line, borderRadius: 2,
        display: "flex", justifyContent: rechts ? "flex-start" : "flex-end",
      }}>
        <div style={{
          width: `${anteil(v) * 100}%`, height: "100%", borderRadius: 2,
          background: color(code), opacity: (rechts ? !aBesser : aBesser) ? 1 : 0.4,
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11 }}>
      <Seite v={aWert} code={aCode} rechts={false} />
      <span style={{
        fontFamily: FONT.mono, fontSize: 9, color: C.muted, minWidth: 74,
        textAlign: "center", paddingTop: 2,
      }}>
        {label}
      </span>
      <Seite v={hWert} code={hCode} rechts />
    </div>
  );
}

function gruppenArt(name) {
  const n = String(name).toLowerCase();
  if (n.includes("special")) return "st";
  return /\bd$|defen|3-4|4-3|nickel|dime|46/.test(n) ? "def" : "off";
}

const VERLETZT_FARBE = { O: C.red, D: "#E08A5C", Q: C.gold };

function VerletztMarke({ i }) {
  if (!i) return null;
  const f = VERLETZT_FARBE[i] || C.muted;
  return (
    <span style={{
      fontFamily: FONT.mono, fontSize: 9, color: f, border: `1px solid ${f}`,
      borderRadius: 3, padding: "0 3px", marginLeft: 5,
    }}>
      {i}
    </span>
  );
}

/** Eine Seite des Duells: die Offense oder Defense eines Teams, Starter mit Backup. */
function DuellSeite({ code, depth, art, rechts }) {
  const gruppe = depth && depth.groups
    ? Object.entries(depth.groups).find(([k]) => gruppenArt(k) === art) : null;
  return (
    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
        justifyContent: rechts ? "flex-end" : "flex-start",
      }}>
        <span style={{ width: 3, height: 16, borderRadius: 2, background: color(code) }} />
        <span style={{ fontFamily: FONT.head, fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: C.text }}>
          {name(code)} <span style={{ color: C.muted }}>&middot; {art === "off" ? "Offense" : "Defense"}</span>
        </span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.line2, marginBottom: 4 }}>
        {gruppe ? gruppe[0] : ""}
      </div>
      {!gruppe && <div style={{ fontSize: 12, color: C.muted3 }}>Keine Daten</div>}
      {gruppe && gruppe[1].map((reihe, i) => {
        const [st, bu] = reihe.players;
        return (
          <div key={reihe.pos + i} style={{
            display: "flex", alignItems: "baseline", gap: 8, padding: "4px 0",
            borderBottom: `1px solid ${C.surface2}`,
          }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, width: 30, flexShrink: 0 }}>
              {reihe.pos}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, color: C.text }}>{st ? st.n : "–"}</span>
              {st && <VerletztMarke i={st.i} />}
              {bu && (
                <span style={{
                  display: "block", fontSize: 11, color: C.muted3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  &#8627; {bu.n}{bu.i ? ` (${bu.i})` : ""}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Aufstellungs-Duell: die Offense des einen gegen die Defense des anderen, so wie
 * sie auf dem Feld aufeinandertreffen. "Seiten tauschen" zeigt die andere Paarung.
 */
function AufstellungsDuell({ data, heim, gast }) {
  const [getauscht, setGetauscht] = useState(false);
  useEffect(() => setGetauscht(false), [heim, gast]);
  if (!data.depth || (!data.depth[heim] && !data.depth[gast])) return null;
  const angriff = getauscht ? gast : heim, abwehr = getauscht ? heim : gast;
  const stand = (data.depth[heim] || data.depth[gast] || {}).stamp;
  const injH = (data.teams[heim] && data.teams[heim].inj) || 0;
  const injA = (data.teams[gast] && data.teams[gast].inj) || 0;

  return (
    <section style={{
      marginTop: 22, padding: 15, borderRadius: 10,
      background: C.surface, border: `1px solid ${C.line}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: FONT.head, fontSize: 17, letterSpacing: "0.08em", textTransform: "uppercase", color: C.text }}>
          Aufstellungs-Duell
        </span>
        <button onClick={() => setGetauscht(!getauscht)} style={{
          background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 6,
          padding: "6px 12px", cursor: "pointer",
          fontFamily: FONT.head, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          &#8644; Seiten tauschen
        </button>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
        <DuellSeite code={angriff} depth={data.depth[angriff]} art="off" />
        <div style={{
          width: 2, alignSelf: "stretch", minHeight: 120, borderRadius: 1,
          background: `linear-gradient(${C.line}, ${C.gold}, ${C.line})`,
        }} />
        <DuellSeite code={abwehr} depth={data.depth[abwehr]} art="def" rechts />
      </div>
      {(injH > 0 || injA > 0) && (
        <div style={{ marginTop: 10, fontSize: 12, color: C.red }}>
          Ausfall-Last: {name(heim)} {injH.toFixed(1)} &middot; {name(gast)} {injA.toFixed(1)} (positionsgewichtet)
        </div>
      )}
      <p style={{ marginTop: 10, fontSize: 11, color: C.muted3, lineHeight: 1.5 }}>
        Offizielle Depth Charts{stand ? ` · Stand ${stand}` : ""} &ndash; gegen&uuml;bergestellt, wie
        sie auf dem Feld aufeinandertreffen: die Offense des einen gegen die Defense des anderen.
        Unter jedem Starter steht sein Backup (&#8627;). K&uuml;rzel: O = Out, D = Doubtful,
        Q = Questionable laut Injury Report.
      </p>
    </section>
  );
}

function MatchupTab({ data, model, ki }) {
  const wochen = useMemo(
    () => [...new Set(data.schedule.map((g) => g.w))].sort((a, b) => a - b),
    [data]
  );
  const [woche, setWoche] = useState(() => currentWeek(data.schedule));
  const spiele = useMemo(() => data.schedule.filter((g) => g.w === woche), [data, woche]);
  const [idx, setIdx] = useState(0);
  const g = spiele[Math.min(idx, spiele.length - 1)];

  // Ligaspanne je Merkmal - Bezugsgroesse fuer Balken und Rang im Vergleich
  const liga = useMemo(() => {
    const felder = ["elo", "off_epa", "def_epa", "cpoe", "qb"];
    const out = {};
    for (const f of felder) {
      const werte = Object.values(data.teams).map((t) => t[f]).filter((v) => typeof v === "number");
      out[f] = { min: Math.min(...werte), max: Math.max(...werte), werte };
    }
    return out;
  }, [data]);

  useEffect(() => setIdx(0), [woche]);

  if (!g) return <p style={{ padding: 24, color: C.muted3 }}>keine Spiele</p>;

  const key = `${g.w}-${g.a}-${g.h}`;
  const an = data.analysis[key];
  const pick = data.picks[key];
  const pModelHome = predictHome(model, features(g, data.teams, data.kiadj));
  const pMarktHome = marketHome(g);
  const ta = data.teams[g.a], th = data.teams[g.h];
  const zeigtHeim = pick ? pick.pick === g.h : (pModelHome ?? 0.5) >= 0.5;
  const pTipp = pick ? pick.p : pModelHome === null ? null : Math.max(pModelHome, 1 - pModelHome);

  const teile = (an && an.edge && an.edge.parts) || [];
  const maxTeil = Math.max(...teile.map(([, w]) => Math.abs(w)), 0.001);
  const vertrauen = an && an.edge ? an.edge.trust : null;

  return (
    <div style={{ padding: "14px 16px 40px" }}>
      <WochenWahl wochen={wochen} woche={woche} setWoche={setWoche} />

      <select
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        style={{
          width: "100%", padding: "9px 11px", marginBottom: 14, borderRadius: 7,
          background: C.surface, color: C.text, border: `1px solid ${C.line}`,
          fontFamily: FONT.body, fontSize: 13,
        }}
      >
        {spiele.map((s, i) => (
          <option key={`${s.a}-${s.h}`} value={i}>
            {name(s.a)} bei {name(s.h)}
          </option>
        ))}
      </select>

      {/* Prognose */}
      <div style={{
        padding: "14px 15px", background: C.surface,
        border: `1px solid ${C.line}`, borderRadius: 9,
      }}>
        <div style={{ fontSize: 15, color: C.text, marginBottom: 8 }}>
          Modell sieht{" "}
          <strong style={{ color: color(zeigtHeim ? g.h : g.a) === "#0A0D16" ? C.gold : C.text }}>
            {name(zeigtHeim ? g.h : g.a)}
          </strong>{" "}
          vorn &mdash;{" "}
          <span style={{ fontFamily: FONT.mono, color: C.gold }}>{pTipp === null ? "?" : pct(pTipp, 1)}</span>
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, lineHeight: 1.8 }}>
          Markt: {pMarktHome === null ? "keine Quote" :
            `${pMarktHome >= 0.5 ? g.h : g.a} ${pct(Math.max(pMarktHome, 1 - pMarktHome), 1)}`}
          {an && an.edge ? <><br />Abstand zum Markt: {an.edge.edge > 0 ? "+" : ""}{an.edge.edge} Punkte</> : null}
          {an ? <><br />Streuung der Prognose: &plusmn;{an.sd} &middot; Vertrauen {an.conf}</> : null}
          {pick && pick.st === "fix" ? <><br />Pick eingefroren &ndash; wird nicht mehr neu gerechnet</> : null}
        </div>
      </div>

      {/* Woher die Abweichung kommt */}
      {teile.length > 0 && (
        <Abschnitt
          titel="Woher die Abweichung kommt"
          hinweis="Anteil jedes Merkmals am Unterschied zwischen Modell und Markt. Nach rechts spricht fuer das Heimteam."
        >
          {teile.map(([f, w]) => (
            <div key={f} style={{ marginBottom: 8 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: FONT.mono, fontSize: 11, marginBottom: 3,
              }}>
                <span style={{ color: C.text2 }}>{MERKMAL_LABEL[f] || f}</span>
                <span style={{ color: w >= 0 ? C.green : C.red }}>{w >= 0 ? "+" : ""}{w.toFixed(3)}</span>
              </div>
              <div style={{ display: "flex", height: 4, background: C.line, borderRadius: 2 }}>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                  {w < 0 && <div style={{ width: `${(Math.abs(w) / maxTeil) * 100}%`, background: C.red, borderRadius: 2 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  {w >= 0 && <div style={{ width: `${(w / maxTeil) * 100}%`, background: C.green, borderRadius: 2 }} />}
                </div>
              </div>
            </div>
          ))}

          {vertrauen === "niedrig" && (
            <div style={{
              marginTop: 10, padding: "9px 12px", borderRadius: 7,
              background: "rgba(224,104,92,0.09)", border: `1px solid ${C.red}55`,
              fontFamily: FONT.mono, fontSize: 10, color: C.red, lineHeight: 1.7,
            }}>
              Vorsicht: Haupttreiber ist &bdquo;{an.edge.src_label}&ldquo;, und dieses Merkmal
              trifft historisch kaum besser als ein Muenzwurf. Die Abweichung vom Markt
              ruht hier auf duennem Eis.
            </div>
          )}
        </Abschnitt>
      )}

      {/* Was die Recherche gefunden hat */}
      {ki && ki.games && ki.games[key] && (
        <Abschnitt
          titel="KI-Kontext"
          hinweis={`Recherchierte Nachrichtenlage, Stand ${ki.games[key].date || ki.generated}. Die Werte sind Elo-Anpassungen, 0 bedeutet: nichts Relevantes gefunden.`}
        >
          <div style={{
            padding: "11px 13px", background: C.surface,
            border: `1px solid ${C.line}`, borderRadius: 8,
          }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, marginBottom: 7 }}>
              {g.h} {ki.games[key].ha > 0 ? "+" : ""}{ki.games[key].ha}
              {" · "}
              {g.a} {ki.games[key].aa > 0 ? "+" : ""}{ki.games[key].aa}
              {!ki.games[key].ha && !ki.games[key].aa && (
                <span style={{ color: C.muted3 }}> &ndash; keine Anpassung</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.7 }}>
              {ki.games[key].summary}
            </div>
            {(ki.games[key].factors || []).length > 0 && (
              <ul style={{ margin: "8px 0 0", paddingLeft: 17 }}>
                {ki.games[key].factors.map((f, i) => (
                  <li key={i} style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted, lineHeight: 1.7 }}>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Abschnitt>
      )}

      {/* Wohin sich die Quote bewegt hat */}
      {data.line_moves && data.line_moves[key] && (
        <Abschnitt
          titel="Marktbewegung"
          hinweis="Wie sich die Marktwahrscheinlichkeit des Heimteams seit Eroeffnung der Quote veraendert hat. Eine grosse Bewegung heisst: der Markt hat dazugelernt."
        >
          {(() => {
            const lm = data.line_moves[key];
            return (
              <div style={{
                padding: "11px 13px", background: C.surface,
                border: `1px solid ${C.line}`, borderRadius: 8,
                fontFamily: FONT.mono, fontSize: 11, color: C.muted, lineHeight: 1.9,
              }}>
                Eroeffnet {lm.open.toFixed(1)} % &rarr; jetzt {lm.now.toFixed(1)} % fuer {g.h}
                <br />
                Bewegung{" "}
                <span style={{ color: Math.abs(lm.move) >= 5 ? C.gold : C.text2 }}>
                  {lm.move > 0 ? "+" : ""}{lm.move.toFixed(1)} Punkte
                </span>{" "}
                in {lm.steps} Schritten seit {lm.since}
                {Math.abs(lm.move) >= 8 && (
                  <><br /><span style={{ color: C.gold }}>
                    Auffaellig grosse Bewegung &ndash; hier ist im Markt etwas passiert.
                  </span></>
                )}
              </div>
            );
          })()}
        </Abschnitt>
      )}

      {/* Teamvergleich */}
      {ta && th && (
        <Abschnitt titel="Direkter Vergleich">
          <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: 10,
            fontSize: 12, color: C.text2,
          }}>
            <span>{name(g.a)}</span>
            <span style={{ color: C.muted3, fontFamily: FONT.mono, fontSize: 10 }}>auswaerts / heim</span>
            <span>{name(g.h)}</span>
          </div>
          {[
            ["Elo", "elo", (v) => v.toFixed(0), true],
            ["Offense-EPA", "off_epa", (v) => v.toFixed(3), true],
            ["Defense-EPA", "def_epa", (v) => v.toFixed(3), false],
            ["CPOE", "cpoe", (v) => v.toFixed(2), true],
            ["QB-Rating", "qb", (v) => v.toFixed(3), true],
          ].map(([label, feld, fmt, hoch]) => (
            <VergleichsZeile
              key={feld}
              label={label}
              aWert={ta[feld]} hWert={th[feld]}
              aCode={g.a} hCode={g.h}
              fmt={fmt} hoeherIstBesser={hoch}
              liga={liga[feld]}
            />
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 10,
            fontFamily: FONT.mono, fontSize: 11, color: C.muted,
          }}>
            <span>{ta.qb_name || "QB unbekannt"}</span>
            <span>{th.qb_name || "QB unbekannt"}</span>
          </div>
        </Abschnitt>
      )}

      {/* Archetypen */}
      {an && an.tags && an.tags.length > 0 && (
        <Abschnitt
          titel="Spieltyp"
          hinweis="Wie gut das Modell bei Spielen dieser Art historisch lag."
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {an.tags.map((t) => {
              const a = data.archetypes[t];
              return (
                <span key={t} style={{
                  padding: "5px 10px", borderRadius: 999, background: C.surface,
                  border: `1px solid ${C.line}`, fontFamily: FONT.mono, fontSize: 11, color: C.text2,
                }}>
                  {t}
                  {a && <span style={{ color: a.hit >= 65 ? C.green : C.muted3, marginLeft: 6 }}>
                    {a.hit.toFixed(1)} % &middot; n={a.n}
                  </span>}
                </span>
              );
            })}
          </div>
        </Abschnitt>
      )}

      <AufstellungsDuell data={data} heim={g.h} gast={g.a} />
    </div>
  );
}

/* -------------------------------------------------------- Elo-Ranking */

/** Nach welcher Spalte sortiert wird. `hoeherIstBesser` steuert die Richtung. */
const RANG_SPALTEN = [
  { id: "elo", label: "Elo", feld: (t) => t.elo, fmt: (v) => v.toFixed(0), hoeherIstBesser: true },
  { id: "off", label: "Offense", feld: (t) => t.off_epa, fmt: (v) => v.toFixed(3), hoeherIstBesser: true },
  { id: "def", label: "Defense", feld: (t) => t.def_epa, fmt: (v) => v.toFixed(3), hoeherIstBesser: false },
  { id: "qb", label: "QB", feld: (t) => t.qb, fmt: (v) => v.toFixed(3), hoeherIstBesser: true },
];

function Balken({ anteil, farbe }) {
  return (
    <div style={{ height: 3, background: C.line, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(2, anteil * 100)}%`, height: "100%", background: farbe }} />
    </div>
  );
}

/** Elo-Verlauf eines Teams als kleine Linie, skaliert auf die eigene Spanne. */
function EloVerlauf({ punkte, farbe, breite = 74, hoehe = 22 }) {
  if (!punkte || punkte.length < 2) return null;
  const werte = punkte.map((p) => p.elo);
  const lo = Math.min(...werte), hi = Math.max(...werte), spanne = hi - lo || 1;
  const d = punkte.map((p, i) => {
    const x = (i / (punkte.length - 1)) * breite;
    const y = hoehe - 2 - ((p.elo - lo) / spanne) * (hoehe - 4);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const trend = werte[werte.length - 1] - werte[0];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <svg viewBox={`0 0 ${breite} ${hoehe}`} style={{ width: breite, height: hoehe }}>
        <path d={d} fill="none" stroke={farbe} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: FONT.mono, fontSize: 9, color: trend >= 0 ? C.green : C.red }}>
        {trend >= 0 ? "+" : ""}{trend.toFixed(0)}
      </span>
    </span>
  );
}

function EloRankingTab({ data, eloHist }) {
  const [sortId, setSortId] = useState("elo");
  const spalte = RANG_SPALTEN.find((s) => s.id === sortId);

  const reihen = useMemo(() => {
    const rs = Object.entries(data.teams).map(([code, t]) => ({ code, t, v: spalte.feld(t) }));
    rs.sort((a, b) => (spalte.hoeherIstBesser ? b.v - a.v : a.v - b.v));
    return rs;
  }, [data, spalte]);

  const werte = reihen.map((r) => r.v);
  const lo = Math.min(...werte), hi = Math.max(...werte);
  const anteil = (v) => (hi === lo ? 1 : spalte.hoeherIstBesser ? (v - lo) / (hi - lo) : (hi - v) / (hi - lo));

  return (
    <div style={{ padding: "14px 16px 40px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {RANG_SPALTEN.map((s) => (
          <button
            key={s.id}
            onClick={() => setSortId(s.id)}
            style={{
              padding: "6px 12px", borderRadius: 5, cursor: "pointer",
              border: `1px solid ${s.id === sortId ? C.gold : C.line}`,
              background: s.id === sortId ? "rgba(217,164,65,0.12)" : C.surface,
              color: s.id === sortId ? C.gold : C.muted,
              fontFamily: FONT.head, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, margin: "0 0 10px", lineHeight: 1.6 }}>
        Offense und QB: hoeher ist besser. Defense: niedriger ist besser, weil sie
        gegnerische Punkterwartung je Spielzug misst. Projektion aus {data.season}.
      </p>

      {reihen.map((r, i) => (
        <div key={r.code} style={{
          display: "flex", alignItems: "center", gap: 11, padding: "9px 12px",
          background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 5,
        }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted3, width: 20, textAlign: "right" }}>
            {i + 1}
          </span>
          <span style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: color(r.code) }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: C.text }}>{name(r.code)}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 2 }}>
              {r.t.qb_name || "QB unbekannt"}
              {r.t.qb_new ? " · ohne Historie" : ""}
              {data.proj[r.code] ? ` · ${data.proj[r.code].w.toFixed(1)} Siege erwartet` : ""}
            </div>
            <div style={{ marginTop: 8 }}>
              <Balken anteil={anteil(r.v)} farbe={color(r.code)} />
            </div>
          </div>
          {sortId === "elo" && eloHist && eloHist[r.code] && (
            <EloVerlauf punkte={eloHist[r.code]} farbe={color(r.code)} />
          )}
          <span style={{ fontFamily: FONT.mono, fontSize: 14, color: C.text, minWidth: 54, textAlign: "right" }}>
            {spalte.fmt(r.v)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------- Vegas-Duell */

function Kachel({ titel, wert, unter, farbe = C.text }) {
  return (
    <div style={{
      flex: "1 1 140px", padding: "12px 14px", borderRadius: 8,
      background: C.surface, border: `1px solid ${C.line}`,
    }}>
      <div style={{
        fontFamily: FONT.head, fontSize: 12, letterSpacing: "0.09em",
        textTransform: "uppercase", color: C.muted3, marginBottom: 5,
      }}>
        {titel}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 21, color: farbe }}>{wert}</div>
      {unter && (
        <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 3 }}>{unter}</div>
      )}
    </div>
  );
}

function Abschnitt({ titel, children, hinweis }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{
        margin: "0 0 4px", fontFamily: FONT.head, fontSize: 16, fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase", color: C.text2,
      }}>
        {titel}
      </h2>
      {hinweis && (
        <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, margin: "0 0 9px", lineHeight: 1.6 }}>
          {hinweis}
        </p>
      )}
      {children}
    </section>
  );
}

const VERTRAUEN = { hoch: C.green, mittel: C.gold, niedrig: C.red };

function VegasDuellTab({ data }) {
  const d = data.duel || {};
  const quote = (k, n) => (n ? `${k}/${n}` : "–");

  // Der beste Call gegen den Markt: groesste Abweichung, die aufging.
  const bester = useMemo(() => {
    let best = null;
    for (const g of data.schedule) {
      if (g.hs === null || g.as === null || g.hs === g.as) continue;
      const p = data.picks[`${g.w}-${g.a}-${g.h}`];
      if (!p || !p.vp || p.pick === p.vp) continue;
      const sieger = g.hs > g.as ? g.h : g.a;
      if (p.pick !== sieger) continue;
      const abstand = Math.abs((p.p ?? 0.5) - (1 - (p.pm ?? 0.5)));
      if (!best || abstand > best.abstand) best = { g, p, abstand, sieger };
    }
    return best;
  }, [data]);

  const vorne = d.m > d.v ? C.green : d.m < d.v ? C.red : C.gold;

  return (
    <div style={{ padding: "14px 16px 40px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Kachel titel="Modell" wert={quote(d.m, d.n)} farbe={vorne}
                unter={d.n ? pct(d.m / d.n, 1) : null} />
        <Kachel titel="Vegas" wert={quote(d.v, d.n)}
                unter={d.n ? pct(d.v / d.n, 1) : null} />
        <Kachel titel="Bei Uneinigkeit" wert={quote(d.dis_m, d.dis_n)}
                unter={d.dis_n ? `${d.dis_n} von ${d.n} Spielen` : "noch keine"} />
      </div>

      {d.clv && (
        <Abschnitt
          titel="Closing Line Value"
          hinweis="Bewegt sich die Quote nach dem Tipp in unsere Richtung? Der Profimassstab: unter 50 % positiv heisst, der Markt hat recht behalten."
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Kachel titel="positiv" wert={`${d.clv.pos} %`}
                    farbe={d.clv.pos >= 50 ? C.green : C.red} unter={`${d.clv.n} Tipps`} />
            <Kachel titel="im Schnitt" wert={`${d.clv.avg > 0 ? "+" : ""}${d.clv.avg} Pkt`} />
          </div>
        </Abschnitt>
      )}

      {d.cal && (
        <Abschnitt
          titel="Kalibrierung"
          hinweis="Stimmt die versprochene Sicherheit? Bei so wenigen Spielen sind Abweichungen meist Zufall - erst ab etwa hundert Spielen je Band aussagekraeftig."
        >
          {Object.entries(d.cal).map(([band, v]) => {
            const ab = v.real - v.pred;
            // Abweichung nur dann hervorheben, wenn sie den Zufall ueberlebt.
            const p = binomP(Math.round((v.real / 100) * v.n), v.n, v.pred / 100);
            const echt = p < 0.05;
            return (
              <div key={band} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 5,
                fontFamily: FONT.mono, fontSize: 12, flexWrap: "wrap",
              }}>
                <span style={{ color: C.text2, width: 62 }}>{band} %</span>
                <span style={{ color: C.muted3, width: 42 }}>n={v.n}</span>
                <span style={{ color: C.muted, flex: 1 }}>gesagt {v.pred} %</span>
                <span style={{ color: C.text }}>real {v.real} %</span>
                <span style={{ color: echt ? C.gold : C.muted3, width: 52, textAlign: "right" }}>
                  {ab > 0 ? "+" : ""}{ab.toFixed(1)}
                </span>
                <span style={{
                  flexBasis: "100%", fontSize: 10,
                  color: echt ? C.gold : C.muted3, paddingTop: 2,
                }}>
                  {echt
                    ? `auffaellig (p = ${p.toFixed(2)})`
                    : `im Rahmen des Zufalls (p = ${p.toFixed(2)}) – keine Aussage`}
                </span>
              </div>
            );
          })}
        </Abschnitt>
      )}

      <Abschnitt
        titel="Modell gegen Modell+KI"
        hinweis="Die KI-Recherche fliesst nicht in die offiziellen Tipps ein. Zum selben Zeitpunkt wird aber festgehalten, was das Modell mit ihren Anpassungen getippt haette. Gezaehlt werden nur Spiele, an denen die KI etwas geaendert hat."
      >
        {d.ki ? (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Kachel titel="Modell" wert={`${d.ki.m}/${d.ki.n}`} unter={`LogLoss ${d.ki.ll_m}`} />
              <Kachel titel="Modell+KI" wert={`${d.ki.k}/${d.ki.n}`} unter={`LogLoss ${d.ki.ll_k}`}
                      farbe={d.ki.k > d.ki.m ? C.green : d.ki.k < d.ki.m ? C.red : C.text} />
              <Kachel titel="Tipp gedreht" wert={String(d.ki.wechsel)}
                      unter={d.ki.wechsel ? `danach richtig: ${d.ki.wechsel_k}` : "noch nie"} />
            </div>
            <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 8, lineHeight: 1.6 }}>
              Zwischenstand. Ein Urteil gibt es erst ab etwa 60 Spielen mit KI-Anpassung
              {d.ki.n < 60 ? ` – noch ${60 - d.ki.n} Spiele` : ""}. Entscheidend ist dann nicht,
              ob Modell+KI besser trifft als das Modell, sondern ob die KI etwas weiss, das die
              Quote nicht schon enthaelt (<code>ki_test.py</code>).
            </p>
          </>
        ) : (
          <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, lineHeight: 1.6 }}>
            Noch kein abgerechnetes Spiel. Die Messung laeuft seit Woche 3.
          </p>
        )}
      </Abschnitt>

      {data.edge_sources && (
        <Abschnitt
          titel="Welches Merkmal traegt"
          hinweis="Trefferquote, wenn dieses Merkmal der Hauptgrund fuer die Abweichung vom Markt war. Ueber mehrere Saisons gemessen."
        >
          {Object.values(data.edge_sources)
            .sort((a, b) => b.hit - a.hit)
            .map((s) => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 5,
              }}>
                <span style={{ flex: 1, fontSize: 13, color: C.text }}>{s.label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3 }}>n={s.n}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 14, color: VERTRAUEN[s.trust] || C.text, minWidth: 56, textAlign: "right" }}>
                  {s.hit.toFixed(1)} %
                </span>
              </div>
            ))}
          <p style={{ fontFamily: FONT.mono, fontSize: 10, color: C.muted3, marginTop: 7, lineHeight: 1.6 }}>
            Rot heisst: ueber die gemessene Zahl an Spielen nicht von einem Muenzwurf
            zu unterscheiden. Solche Merkmale sollten die Prognose kaum bewegen.
          </p>
        </Abschnitt>
      )}

      {bester && (
        <Abschnitt titel="Bester Call gegen den Markt">
          <div style={{
            padding: "11px 13px", background: C.surface,
            border: `1px solid ${C.green}44`, borderRadius: 8,
          }}>
            <div style={{ fontSize: 13, color: C.text }}>
              {name(bester.g.a)} bei {name(bester.g.h)}
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.muted, marginTop: 5, lineHeight: 1.7 }}>
              Woche {bester.g.w} &middot; Modell auf {bester.p.pick} mit {pct(bester.p.p)},
              der Markt auf {bester.p.vp}.<br />
              Endstand {bester.g.as}:{bester.g.hs} &ndash;{" "}
              <span style={{ color: C.green }}>{bester.sieger} gewinnt.</span>
            </div>
          </div>
        </Abschnitt>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ App */

function App() {
  const { status, data, model, ki, eloHist, err } = useGridironData();
  const [tab, setTab] = useState("sched");
  const FERTIG = ["sched", "live", "match", "slip", "duel", "rank"];

  if (status === "laedt") {
    return (
      <Rahmen>
        <p style={{ padding: 24, fontFamily: FONT.mono, fontSize: 12, color: C.muted3 }}>
          Daten werden geladen&hellip;
        </p>
      </Rahmen>
    );
  }

  if (status === "fehler") {
    return (
      <Rahmen>
        <p style={{ padding: 24, fontFamily: FONT.mono, fontSize: 12, color: C.red }}>
          Daten nicht erreichbar &mdash; {err}
        </p>
      </Rahmen>
    );
  }

  return (
    <Rahmen generated={data.generated} ki={ki} woche={currentWeek(data.schedule)}>
      <TabLeiste aktiv={tab} setAktiv={setTab} fertig={FERTIG} />
      {tab === "sched" && <SpielplanTab data={data} model={model} ki={ki} />}
      {tab === "match" && <MatchupTab data={data} model={model} ki={ki} />}
      {tab === "live" && <LiveTab data={data} model={model} />}
      {tab === "slip" && <TippscheinTab data={data} model={model} />}
      {tab === "duel" && <VegasDuellTab data={data} />}
      {tab === "rank" && <EloRankingTab data={data} eloHist={eloHist} />}
    </Rahmen>
  );
}

function Rahmen({ children, generated, ki, woche }) {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: FONT.body }}>
      <Kopf generated={generated} ki={ki} woche={woche} />
      <main style={{ maxWidth: 760, margin: "0 auto" }}>{children}</main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
