const sigmoid = (z) => 1 / (1 + Math.exp(-z));

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

const ZEITZONE = {
  BUF: 0, MIA: 0, NE: 0, NYJ: 0, NYG: 0, PHI: 0, PIT: 0, BAL: 0, CIN: 0, CLE: 0,
  WAS: 0, CAR: 0, ATL: 0, JAX: 0, TB: 0, IND: 0, DET: 0,
  CHI: -1, GB: -1, MIN: -1, DAL: -1, HOU: -1, TEN: -1, NO: -1, KC: -1,
  DEN: -2, ARI: -2,
  SEA: -3, SF: -3, LA: -3, LAC: -3, LV: -3,
};

function features(game, teams, kiadj = {}) {
  const h = teams[game.h], a = teams[game.a];
  if (!h || !a) return null;
  const k = kiadj[`${game.w}-${game.a}-${game.h}`] || { ha: 0, aa: 0 };
  const tzH = ZEITZONE[game.h] || 0, tzA = ZEITZONE[game.a] || 0;
  const stunde = game.t ? parseInt(String(game.t).slice(0, 2), 10) : NaN;
  // Ruhetage: die Pipeline liefert die Differenz als "rd"; sonst aus hr/ar, auf +-7 begrenzt
  const rd = game.rd !== undefined && game.rd !== null
    ? game.rd : (game.hr ?? 7) - (game.ar ?? 7);
  return {
    elo_diff: h.elo + 48 + (k.ha || 0) - (a.elo + (k.aa || 0)),
    qb_diff: h.qb - a.qb,
    off_diff: h.off_epa - a.off_epa,
    def_diff: a.def_epa - h.def_epa,
    cpoe_diff: h.cpoe - a.cpoe,
    rest_diff: Math.max(-7, Math.min(7, rd)),
    inj_diff: (a.inj ?? 0) - (h.inj ?? 0),
    qb_new_diff: (h.qb_new ?? 0) - (a.qb_new ?? 0),
    bye_diff: ((game.hr ?? 7) >= 13 ? 1 : 0) - ((game.ar ?? 7) >= 13 ? 1 : 0),
    // wie viele Zeitzonen das Gastteam wechselt
    tz_shift_away: Math.abs(tzH - tzA),
    // Gast mindestens zwei Zonen westlich und Anstoss um 13 Uhr ET oder frueher
    west_early_away: tzA - tzH <= -2 && !isNaN(stunde) && stunde <= 13 ? 1 : 0,
  };
}

module.exports={predictHome,features};
