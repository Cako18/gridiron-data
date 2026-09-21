/* =====================================================================
   Cako's NFL World - Frontend
   =====================================================================

   Neuaufbau der verlorenen Quelle. Stand: Geruest.

   Fertig:  Datenschicht, Modellrechnung, Rahmen, Tab "Spielplan"
   Offen:   Live, Matchup, Tippschein, Vegas-Duell, Elo-Ranking

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

/** Merkmalsvektor eines Spiels aus den Teamwerten. */
function features(game, teams, kiadj = {}) {
  const h = teams[game.h], a = teams[game.a];
  if (!h || !a) return null;
  const k = kiadj[`${game.w}-${game.a}-${game.h}`] || { ha: 0, aa: 0 };
  return {
    elo_diff: h.elo + 48 + (k.ha || 0) - (a.elo + (k.aa || 0)),
    qb_diff: h.qb - a.qb,
    off_diff: h.off_epa - a.off_epa,
    def_diff: a.def_epa - h.def_epa,
    cpoe_diff: h.cpoe - a.cpoe,
    rest_diff: (game.hr ?? 7) - (game.ar ?? 7),
    inj_diff: (a.inj ?? 0) - (h.inj ?? 0),
    qb_new_diff: (h.qb_new ?? 0) - (a.qb_new ?? 0),
    bye_diff: ((game.hr ?? 7) >= 13 ? 1 : 0) - ((game.ar ?? 7) >= 13 ? 1 : 0),
    tz_shift_away: 0,
    west_early_away: 0,
  };
}

/** Marktwahrscheinlichkeit Heimteam, Buchmachermarge herausgerechnet. */
function marketHome(game) {
  const { mh, ma } = game;
  if (!mh || !ma) return null;
  const ih = 1 / mh, ia = 1 / ma;
  return ih / (ih + ia);
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

function useGridironData() {
  const [state, setState] = useState({ status: "laedt", data: null, model: null, err: null });

  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      try {
        const [rd, rm] = await Promise.all([
          fetch(`${BASE}/app_data.json`, { cache: "no-store" }),
          fetch(`${BASE}/model.json`, { cache: "no-store" }),
        ]);
        if (!rd.ok) throw new Error(`app_data.json: HTTP ${rd.status}`);
        const data = await rd.json();
        const model = rm.ok ? await rm.json() : null;
        if (!abgebrochen) setState({ status: "bereit", data, model, err: null });
      } catch (e) {
        if (!abgebrochen) setState({ status: "fehler", data: null, model: null, err: String(e) });
      }
    })();
    return () => { abgebrochen = true; };
  }, []);

  return state;
}

/* ----------------------------------------------------------- Bausteine */

function Kopf({ generated }) {
  return (
    <header style={{ borderBottom: `1px solid ${C.line}`, padding: "20px 16px 14px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{
          margin: 0, fontFamily: FONT.head, fontSize: 30, letterSpacing: "0.04em",
          textTransform: "uppercase", color: C.text, fontWeight: 600,
        }}>
          Cako&rsquo;s <span style={{ color: C.gold }}>NFL World</span>
        </h1>
        <p style={{ margin: "4px 0 0", fontFamily: FONT.mono, fontSize: 11, color: C.muted3 }}>
          {generated ? `Daten vom ${new Date(generated).toLocaleString("de-DE")}` : " "}
        </p>
      </div>
    </header>
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

/** Ein Spiel: Teams, Modellprognose, Markt, Status. */
function SpielZeile({ game, pick, pModel, pMarkt }) {
  const gespielt = game.hs !== null && game.as !== null;
  const sieger = gespielt ? (game.hs > game.as ? game.h : game.as > game.hs ? game.a : null) : null;

  // Eingefrorener Pick hat Vorrang vor der Neuberechnung - so misst die
  // Bilanz das Modell zum Zeitpunkt des Locks, nicht das von heute.
  const tipp = pick ? pick.pick : pModel === null ? null : pModel >= 0.5 ? game.h : game.a;
  const p = pick ? pick.p : pModel === null ? null : Math.max(pModel, 1 - pModel);
  const marktTipp = pick && pick.vp ? pick.vp : pMarkt === null ? null : pMarkt >= 0.5 ? game.h : game.a;
  const uneinig = tipp && marktTipp && tipp !== marktTipp;

  const treffer = gespielt && tipp ? tipp === sieger : null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 6,
    }}>
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
          {uneinig ? " · gegen den Markt" : ""}
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
  );
}

function SpielplanTab({ data, model }) {
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

/* ------------------------------------------------------------------ App */

function App() {
  const { status, data, model, err } = useGridironData();
  const [tab, setTab] = useState("sched");
  const FERTIG = ["sched"];

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
    <Rahmen generated={data.generated}>
      <TabLeiste aktiv={tab} setAktiv={setTab} fertig={FERTIG} />
      {tab === "sched" && <SpielplanTab data={data} model={model} />}
    </Rahmen>
  );
}

function Rahmen({ children, generated }) {
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: FONT.body }}>
      <Kopf generated={generated} />
      <main style={{ maxWidth: 760, margin: "0 auto" }}>{children}</main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
