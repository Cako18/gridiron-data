import { useState, useMemo, useEffect } from "react";

/* ==== Mini-CSV-Parser (mit Quote-Handling) ==== */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (ch !== "\r") field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length === header.length).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

/* ==== Elo live aus allen gespielten Spielen berechnen (identisch zum Python-Training) ==== */
function computeLiveElo(games) {
  const K = 20, HOME_ADV = 48, START = 1500, REG = 0.33;
  const elo = {};
  const get = (t) => (elo[t] === undefined ? START : elo[t]);
  let curSeason = null;
  const played = games.filter((g) => g.home_score !== "" && g.away_score !== "");
  played.sort((a, b) => (a.season - b.season) || (a.gameday < b.gameday ? -1 : a.gameday > b.gameday ? 1 : 0));
  for (const g of played) {
    const season = Number(g.season);
    if (season !== curSeason) {
      if (curSeason !== null) for (const t in elo) elo[t] += REG * (START - elo[t]);
      curSeason = season;
    }
    const h = g.home_team, a = g.away_team;
    const hs = Number(g.home_score), as = Number(g.away_score);
    const d = get(h) + HOME_ADV - get(a);
    const p = 1 / (1 + Math.pow(10, -d / 400));
    const act = hs > as ? 1 : hs === as ? 0.5 : 0;
    const pd = hs - as;
    const wd = hs > as ? d : -d;
    const mult = pd !== 0 ? Math.log(Math.abs(pd) + 1) * (2.2 / (wd * 0.001 + 2.2)) : 1;
    const shift = K * mult * (act - p);
    elo[h] = get(h) + shift; elo[a] = get(a) - shift;
  }
  return elo;
}

/* ==== Modell-Export aus Python (Logit auf 4.100+ Spielen, Walk-Forward-validiert) ==== */
const DATA = {"teams":{"ARI":{"elo":1336.4,"off_epa":-0.0216,"def_epa":0.1396,"cpoe":-1.828,"qb":-0.0251,"qb_new":0},"ATL":{"elo":1457.4,"off_epa":0.0338,"def_epa":0.0016,"cpoe":-2.11,"qb":0.0649,"qb_new":0},"BAL":{"elo":1562.0,"off_epa":0.0986,"def_epa":-0.0091,"cpoe":4.724,"qb":0.1148,"qb_new":0},"BUF":{"elo":1653.2,"off_epa":0.1333,"def_epa":-0.0471,"cpoe":5.707,"qb":0.1183,"qb_new":0},"CAR":{"elo":1393.8,"off_epa":-0.0751,"def_epa":0.048,"cpoe":3.394,"qb":-0.066,"qb_new":0},"CHI":{"elo":1541.7,"off_epa":0.0937,"def_epa":0.0756,"cpoe":-2.696,"qb":0.0974,"qb_new":0},"CIN":{"elo":1467.3,"off_epa":0.0889,"def_epa":0.0882,"cpoe":4.458,"qb":0.1395,"qb_new":0},"CLE":{"elo":1381.4,"off_epa":-0.2014,"def_epa":-0.0946,"cpoe":-2.663,"qb":-0.1502,"qb_new":0},"DAL":{"elo":1433.6,"off_epa":0.091,"def_epa":0.1925,"cpoe":-0.396,"qb":0.1262,"qb_new":0},"DEN":{"elo":1659.5,"off_epa":0.0161,"def_epa":-0.0842,"cpoe":-1.852,"qb":0.0808,"qb_new":0},"DET":{"elo":1579.5,"off_epa":0.0085,"def_epa":0.0279,"cpoe":-1.848,"qb":0.1448,"qb_new":0},"GB":{"elo":1536.3,"off_epa":0.032,"def_epa":0.0614,"cpoe":2.657,"qb":0.2662,"qb_new":0},"HOU":{"elo":1654.5,"off_epa":-0.0189,"def_epa":-0.1804,"cpoe":-2.607,"qb":-0.026,"qb_new":0},"IND":{"elo":1446.6,"off_epa":-0.0376,"def_epa":0.0626,"cpoe":-2.798,"qb":0.0368,"qb_new":0},"JAX":{"elo":1599.0,"off_epa":0.0818,"def_epa":-0.1713,"cpoe":3.031,"qb":0.1666,"qb_new":0},"KC":{"elo":1483.7,"off_epa":-0.0696,"def_epa":0.01,"cpoe":-3.146,"qb":0.048,"qb_new":0},"LA":{"elo":1660.2,"off_epa":0.1161,"def_epa":-0.0032,"cpoe":-2.78,"qb":0.2285,"qb_new":0},"LAC":{"elo":1536.1,"off_epa":-0.1006,"def_epa":-0.1306,"cpoe":-0.023,"qb":-0.0334,"qb_new":0},"LV":{"elo":1272.7,"off_epa":-0.2156,"def_epa":0.0534,"cpoe":2.311,"qb":-0.1307,"qb_new":0},"MIA":{"elo":1432.9,"off_epa":0.0247,"def_epa":0.0412,"cpoe":1.899,"qb":0.043,"qb_new":0},"MIN":{"elo":1576.2,"off_epa":-0.138,"def_epa":-0.1837,"cpoe":-3.474,"qb":-0.1737,"qb_new":0},"NE":{"elo":1638.7,"off_epa":0.0352,"def_epa":-0.195,"cpoe":3.501,"qb":0.0233,"qb_new":0},"NO":{"elo":1405.7,"off_epa":0.007,"def_epa":-0.1176,"cpoe":4.538,"qb":0.0886,"qb_new":0},"NYG":{"elo":1385.4,"off_epa":0.0012,"def_epa":0.0326,"cpoe":-2.218,"qb":-0.0717,"qb_new":0},"NYJ":{"elo":1290.2,"off_epa":-0.1897,"def_epa":0.1783,"cpoe":-6.082,"qb":-0.2928,"qb_new":0},"PHI":{"elo":1581.6,"off_epa":0.0071,"def_epa":-0.1306,"cpoe":2.444,"qb":0.0978,"qb_new":0},"PIT":{"elo":1512.1,"off_epa":0.0305,"def_epa":0.0093,"cpoe":-0.991,"qb":-0.0533,"qb_new":0},"SEA":{"elo":1761.4,"off_epa":0.0824,"def_epa":-0.1427,"cpoe":5.25,"qb":0.141,"qb_new":0},"SF":{"elo":1582.9,"off_epa":0.0752,"def_epa":0.0644,"cpoe":6.078,"qb":0.0866,"qb_new":0},"TB":{"elo":1465.6,"off_epa":-0.0085,"def_epa":0.0719,"cpoe":-1.664,"qb":0.0244,"qb_new":0},"TEN":{"elo":1285.0,"off_epa":-0.0896,"def_epa":0.0926,"cpoe":-1.08,"qb":-0.2108,"qb_new":0},"WAS":{"elo":1440.2,"off_epa":-0.0125,"def_epa":0.1813,"cpoe":-0.095,"qb":0.0053,"qb_new":0}},"model":{"features":["elo_diff","qb_diff","off_diff","def_diff","cpoe_diff","rest_diff","inj_diff","qb_new_diff","bye_diff","tz_shift_away","west_early_away"],"mean":[50.59475,0.00141,0.00204,0.00046,-0.00415,-0.0025,0.24564,-0.001,0.00875,0.88594,0.07204],"scale":[134.1331,0.19309,0.12681,0.10672,5.18651,2.53035,5.9039,0.32871,0.33575,0.96305,0.25855],"coef":[0.49047,0.24685,0.03171,0.08456,0.06752,0.00861,0.16899,0.07766,0.05257,-0.06212,-0.02193],"intercept":0.25394,"home_adv_elo":48,"qb_repl":-0.06}};

/* ==== NFL-Spielplan 2026 (272 Spiele, Wochen 1-18, rd = Ruhetage-Differenz Heim-Auswaerts) ==== */
const SCHEDULE = [{"w":1,"d":"2026-09-09","t":"20:20","a":"NE","h":"SEA","rd":0,"dv":0},{"w":1,"d":"2026-09-10","t":"20:35","a":"SF","h":"LA","rd":0,"dv":1},{"w":1,"d":"2026-09-13","t":"13:00","a":"CHI","h":"CAR","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"TB","h":"CIN","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"NO","h":"DET","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"BUF","h":"HOU","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"BAL","h":"IND","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"CLE","h":"JAX","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"ATL","h":"PIT","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"13:00","a":"NYJ","h":"TEN","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"16:25","a":"ARI","h":"LAC","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"16:25","a":"MIA","h":"LV","rd":0,"dv":0},{"w":1,"d":"2026-09-13","t":"16:25","a":"GB","h":"MIN","rd":0,"dv":1},{"w":1,"d":"2026-09-13","t":"16:25","a":"WAS","h":"PHI","rd":0,"dv":1},{"w":1,"d":"2026-09-13","t":"20:20","a":"DAL","h":"NYG","rd":0,"dv":1},{"w":1,"d":"2026-09-14","t":"20:15","a":"DEN","h":"KC","rd":0,"dv":1},{"w":2,"d":"2026-09-17","t":"20:15","a":"DET","h":"BUF","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"CAR","h":"ATL","rd":0,"dv":1},{"w":2,"d":"2026-09-20","t":"13:00","a":"NO","h":"BAL","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"MIN","h":"CHI","rd":0,"dv":1},{"w":2,"d":"2026-09-20","t":"13:00","a":"CIN","h":"HOU","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"PIT","h":"NE","rd":4,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"GB","h":"NYJ","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"CLE","h":"TB","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"13:00","a":"PHI","h":"TEN","rd":0,"dv":0},{"w":2,"d":"2026-09-20","t":"16:05","a":"JAX","h":"DEN","rd":-1,"dv":0},{"w":2,"d":"2026-09-20","t":"16:05","a":"LV","h":"LAC","rd":0,"dv":1},{"w":2,"d":"2026-09-20","t":"16:25","a":"SEA","h":"ARI","rd":-4,"dv":1},{"w":2,"d":"2026-09-20","t":"16:25","a":"WAS","h":"DAL","rd":0,"dv":1},{"w":2,"d":"2026-09-20","t":"16:25","a":"MIA","h":"SF","rd":3,"dv":0},{"w":2,"d":"2026-09-20","t":"20:20","a":"IND","h":"KC","rd":-1,"dv":0},{"w":2,"d":"2026-09-21","t":"20:15","a":"NYG","h":"LA","rd":3,"dv":0},{"w":3,"d":"2026-09-24","t":"20:15","a":"ATL","h":"GB","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"LAC","h":"BUF","rd":3,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"CAR","h":"CLE","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"NYJ","h":"DET","rd":3,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"HOU","h":"IND","rd":0,"dv":1},{"w":3,"d":"2026-09-27","t":"13:00","a":"NE","h":"JAX","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"KC","h":"MIA","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"TEN","h":"NYG","rd":-1,"dv":0},{"w":3,"d":"2026-09-27","t":"13:00","a":"CIN","h":"PIT","rd":0,"dv":1},{"w":3,"d":"2026-09-27","t":"13:00","a":"SEA","h":"WAS","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"16:05","a":"ARI","h":"SF","rd":0,"dv":1},{"w":3,"d":"2026-09-27","t":"16:05","a":"MIN","h":"TB","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"16:25","a":"BAL","h":"DAL","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"16:25","a":"LV","h":"NO","rd":0,"dv":0},{"w":3,"d":"2026-09-27","t":"20:20","a":"LA","h":"DEN","rd":1,"dv":0},{"w":3,"d":"2026-09-28","t":"20:15","a":"PHI","h":"CHI","rd":0,"dv":0},{"w":4,"d":"2026-10-01","t":"20:15","a":"PIT","h":"CLE","rd":0,"dv":1},{"w":4,"d":"2026-10-04","t":"09:30","a":"IND","h":"WAS","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"TEN","h":"BAL","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"NE","h":"BUF","rd":0,"dv":1},{"w":4,"d":"2026-10-04","t":"13:00","a":"NYJ","h":"CHI","rd":-1,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"JAX","h":"CIN","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"DAL","h":"HOU","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"ARI","h":"NYG","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"LA","h":"PHI","rd":-1,"dv":0},{"w":4,"d":"2026-10-04","t":"13:00","a":"GB","h":"TB","rd":-3,"dv":0},{"w":4,"d":"2026-10-04","t":"16:05","a":"MIA","h":"MIN","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"16:25","a":"KC","h":"LV","rd":0,"dv":1},{"w":4,"d":"2026-10-04","t":"16:25","a":"LAC","h":"SEA","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"16:25","a":"DEN","h":"SF","rd":0,"dv":0},{"w":4,"d":"2026-10-04","t":"20:20","a":"DET","h":"CAR","rd":0,"dv":0},{"w":4,"d":"2026-10-05","t":"20:15","a":"ATL","h":"NO","rd":-3,"dv":1},{"w":5,"d":"2026-10-08","t":"20:15","a":"TB","h":"DAL","rd":0,"dv":0},{"w":5,"d":"2026-10-11","t":"09:30","a":"PHI","h":"JAX","rd":0,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"CIN","h":"MIA","rd":0,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"LV","h":"NE","rd":0,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"MIN","h":"NO","rd":-1,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"CLE","h":"NYJ","rd":-3,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"IND","h":"PIT","rd":3,"dv":0},{"w":5,"d":"2026-10-11","t":"13:00","a":"HOU","h":"TEN","rd":0,"dv":1},{"w":5,"d":"2026-10-11","t":"13:00","a":"NYG","h":"WAS","rd":0,"dv":1},{"w":5,"d":"2026-10-11","t":"16:05","a":"DEN","h":"LAC","rd":0,"dv":1},{"w":5,"d":"2026-10-11","t":"16:25","a":"DET","h":"ARI","rd":0,"dv":0},{"w":5,"d":"2026-10-11","t":"16:25","a":"CHI","h":"GB","rd":0,"dv":1},{"w":5,"d":"2026-10-11","t":"16:25","a":"SF","h":"SEA","rd":0,"dv":1},{"w":5,"d":"2026-10-11","t":"20:20","a":"BAL","h":"ATL","rd":-1,"dv":0},{"w":5,"d":"2026-10-12","t":"20:15","a":"BUF","h":"LA","rd":0,"dv":0},{"w":6,"d":"2026-10-15","t":"20:15","a":"SEA","h":"DEN","rd":0,"dv":0},{"w":6,"d":"2026-10-18","t":"09:30","a":"HOU","h":"JAX","rd":0,"dv":1},{"w":6,"d":"2026-10-18","t":"13:00","a":"CHI","h":"ATL","rd":0,"dv":0},{"w":6,"d":"2026-10-18","t":"13:00","a":"BAL","h":"CLE","rd":0,"dv":1},{"w":6,"d":"2026-10-18","t":"13:00","a":"TEN","h":"IND","rd":0,"dv":1},{"w":6,"d":"2026-10-18","t":"13:00","a":"NYJ","h":"NE","rd":0,"dv":1},{"w":6,"d":"2026-10-18","t":"13:00","a":"NO","h":"NYG","rd":0,"dv":0},{"w":6,"d":"2026-10-18","t":"13:00","a":"CAR","h":"PHI","rd":-7,"dv":0},{"w":6,"d":"2026-10-18","t":"13:00","a":"PIT","h":"TB","rd":3,"dv":0},{"w":6,"d":"2026-10-18","t":"16:05","a":"ARI","h":"LA","rd":-1,"dv":1},{"w":6,"d":"2026-10-18","t":"16:25","a":"LAC","h":"KC","rd":7,"dv":1},{"w":6,"d":"2026-10-18","t":"16:25","a":"BUF","h":"LV","rd":1,"dv":0},{"w":6,"d":"2026-10-18","t":"20:20","a":"DAL","h":"GB","rd":-3,"dv":0},{"w":6,"d":"2026-10-19","t":"20:15","a":"WAS","h":"SF","rd":0,"dv":0},{"w":7,"d":"2026-10-22","t":"20:15","a":"NE","h":"CHI","rd":0,"dv":0},{"w":7,"d":"2026-10-25","t":"09:30","a":"PIT","h":"NO","rd":0,"dv":0},{"w":7,"d":"2026-10-25","t":"13:00","a":"SF","h":"ATL","rd":1,"dv":0},{"w":7,"d":"2026-10-25","t":"13:00","a":"CIN","h":"BAL","rd":-7,"dv":1},{"w":7,"d":"2026-10-25","t":"13:00","a":"TB","h":"CAR","rd":0,"dv":1},{"w":7,"d":"2026-10-25","t":"13:00","a":"NYG","h":"HOU","rd":0,"dv":0},{"w":7,"d":"2026-10-25","t":"13:00","a":"IND","h":"MIN","rd":7,"dv":0},{"w":7,"d":"2026-10-25","t":"13:00","a":"MIA","h":"NYJ","rd":-7,"dv":1},{"w":7,"d":"2026-10-25","t":"13:00","a":"CLE","h":"TEN","rd":0,"dv":0},{"w":7,"d":"2026-10-25","t":"16:05","a":"DEN","h":"ARI","rd":-3,"dv":0},{"w":7,"d":"2026-10-25","t":"16:25","a":"GB","h":"DET","rd":7,"dv":1},{"w":7,"d":"2026-10-25","t":"16:25","a":"LA","h":"LV","rd":0,"dv":0},{"w":7,"d":"2026-10-25","t":"20:20","a":"KC","h":"SEA","rd":3,"dv":0},{"w":7,"d":"2026-10-26","t":"20:15","a":"DAL","h":"PHI","rd":0,"dv":1},{"w":8,"d":"2026-10-29","t":"20:15","a":"CAR","h":"GB","rd":0,"dv":0},{"w":8,"d":"2026-11-01","t":"13:00","a":"BAL","h":"BUF","rd":7,"dv":0},{"w":8,"d":"2026-11-01","t":"13:00","a":"TEN","h":"CIN","rd":0,"dv":0},{"w":8,"d":"2026-11-01","t":"13:00","a":"ARI","h":"DAL","rd":-1,"dv":0},{"w":8,"d":"2026-11-01","t":"13:00","a":"MIN","h":"DET","rd":0,"dv":1},{"w":8,"d":"2026-11-01","t":"13:00","a":"IND","h":"JAX","rd":7,"dv":1},{"w":8,"d":"2026-11-01","t":"13:00","a":"LV","h":"NYJ","rd":0,"dv":0},{"w":8,"d":"2026-11-01","t":"13:00","a":"CLE","h":"PIT","rd":0,"dv":1},{"w":8,"d":"2026-11-01","t":"13:00","a":"ATL","h":"TB","rd":0,"dv":1},{"w":8,"d":"2026-11-01","t":"16:05","a":"LAC","h":"LA","rd":-7,"dv":0},{"w":8,"d":"2026-11-01","t":"16:25","a":"KC","h":"DEN","rd":0,"dv":1},{"w":8,"d":"2026-11-01","t":"16:25","a":"NE","h":"MIA","rd":-3,"dv":1},{"w":8,"d":"2026-11-01","t":"20:20","a":"PHI","h":"WAS","rd":7,"dv":1},{"w":8,"d":"2026-11-02","t":"20:15","a":"CHI","h":"SEA","rd":-3,"dv":0},{"w":9,"d":"2026-11-05","t":"20:15","a":"JAX","h":"BAL","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"09:30","a":"CIN","h":"ATL","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"DEN","h":"CAR","rd":3,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"DAL","h":"IND","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"NYJ","h":"KC","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"DET","h":"MIA","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"CLE","h":"NO","rd":7,"dv":0},{"w":9,"d":"2026-11-08","t":"13:00","a":"NYG","h":"PHI","rd":-7,"dv":1},{"w":9,"d":"2026-11-08","t":"13:00","a":"LA","h":"WAS","rd":0,"dv":0},{"w":9,"d":"2026-11-08","t":"16:05","a":"HOU","h":"LAC","rd":-7,"dv":0},{"w":9,"d":"2026-11-08","t":"16:05","a":"LV","h":"SF","rd":7,"dv":0},{"w":9,"d":"2026-11-08","t":"16:25","a":"GB","h":"NE","rd":-3,"dv":0},{"w":9,"d":"2026-11-08","t":"16:25","a":"ARI","h":"SEA","rd":-1,"dv":1},{"w":9,"d":"2026-11-08","t":"20:20","a":"TB","h":"CHI","rd":-1,"dv":0},{"w":9,"d":"2026-11-09","t":"20:15","a":"BUF","h":"MIN","rd":0,"dv":0},{"w":10,"d":"2026-11-12","t":"20:15","a":"WAS","h":"NYG","rd":0,"dv":1},{"w":10,"d":"2026-11-15","t":"09:30","a":"NE","h":"DET","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"13:00","a":"KC","h":"ATL","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"13:00","a":"HOU","h":"CLE","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"13:00","a":"MIN","h":"GB","rd":1,"dv":1},{"w":10,"d":"2026-11-15","t":"13:00","a":"MIA","h":"IND","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"13:00","a":"CAR","h":"NO","rd":0,"dv":1},{"w":10,"d":"2026-11-15","t":"13:00","a":"BUF","h":"NYJ","rd":1,"dv":1},{"w":10,"d":"2026-11-15","t":"13:00","a":"JAX","h":"TEN","rd":4,"dv":1},{"w":10,"d":"2026-11-15","t":"16:05","a":"LA","h":"ARI","rd":0,"dv":1},{"w":10,"d":"2026-11-15","t":"16:05","a":"SEA","h":"LV","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"16:25","a":"SF","h":"DAL","rd":0,"dv":0},{"w":10,"d":"2026-11-15","t":"20:20","a":"PIT","h":"CIN","rd":-7,"dv":1},{"w":10,"d":"2026-11-16","t":"20:15","a":"LAC","h":"BAL","rd":3,"dv":0},{"w":11,"d":"2026-11-19","t":"20:15","a":"IND","h":"HOU","rd":0,"dv":1},{"w":11,"d":"2026-11-22","t":"13:00","a":"MIA","h":"BUF","rd":0,"dv":1},{"w":11,"d":"2026-11-22","t":"13:00","a":"BAL","h":"CAR","rd":1,"dv":0},{"w":11,"d":"2026-11-22","t":"13:00","a":"NO","h":"CHI","rd":7,"dv":0},{"w":11,"d":"2026-11-22","t":"13:00","a":"TEN","h":"DAL","rd":0,"dv":0},{"w":11,"d":"2026-11-22","t":"13:00","a":"TB","h":"DET","rd":-7,"dv":0},{"w":11,"d":"2026-11-22","t":"13:00","a":"ARI","h":"KC","rd":0,"dv":0},{"w":11,"d":"2026-11-22","t":"13:00","a":"JAX","h":"NYG","rd":3,"dv":0},{"w":11,"d":"2026-11-22","t":"16:05","a":"NYJ","h":"LAC","rd":-1,"dv":0},{"w":11,"d":"2026-11-22","t":"16:25","a":"LV","h":"DEN","rd":7,"dv":1},{"w":11,"d":"2026-11-22","t":"16:25","a":"PIT","h":"PHI","rd":7,"dv":0},{"w":11,"d":"2026-11-22","t":"20:20","a":"MIN","h":"SF","rd":0,"dv":0},{"w":11,"d":"2026-11-23","t":"20:15","a":"CIN","h":"WAS","rd":3,"dv":0},{"w":12,"d":"2026-11-25","t":"20:00","a":"GB","h":"LA","rd":0,"dv":0},{"w":12,"d":"2026-11-26","t":"13:00","a":"CHI","h":"DET","rd":0,"dv":1},{"w":12,"d":"2026-11-26","t":"16:30","a":"PHI","h":"DAL","rd":0,"dv":1},{"w":12,"d":"2026-11-26","t":"20:20","a":"KC","h":"BUF","rd":0,"dv":0},{"w":12,"d":"2026-11-27","t":"15:00","a":"DEN","h":"PIT","rd":0,"dv":0},{"w":12,"d":"2026-11-29","t":"13:00","a":"NO","h":"CIN","rd":-1,"dv":0},{"w":12,"d":"2026-11-29","t":"13:00","a":"LV","h":"CLE","rd":7,"dv":0},{"w":12,"d":"2026-11-29","t":"13:00","a":"BAL","h":"HOU","rd":3,"dv":0},{"w":12,"d":"2026-11-29","t":"13:00","a":"NYG","h":"IND","rd":3,"dv":0},{"w":12,"d":"2026-11-29","t":"13:00","a":"NYJ","h":"MIA","rd":0,"dv":1},{"w":12,"d":"2026-11-29","t":"13:00","a":"ATL","h":"MIN","rd":-7,"dv":0},{"w":12,"d":"2026-11-29","t":"16:05","a":"TEN","h":"JAX","rd":0,"dv":1},{"w":12,"d":"2026-11-29","t":"16:25","a":"WAS","h":"ARI","rd":1,"dv":0},{"w":12,"d":"2026-11-29","t":"16:25","a":"SEA","h":"SF","rd":-7,"dv":1},{"w":12,"d":"2026-11-29","t":"20:20","a":"NE","h":"LAC","rd":-7,"dv":0},{"w":12,"d":"2026-11-30","t":"20:15","a":"CAR","h":"TB","rd":0,"dv":1},{"w":13,"d":"2026-12-03","t":"20:15","a":"KC","h":"LA","rd":1,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"DET","h":"ATL","rd":-3,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"JAX","h":"CHI","rd":3,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"CIN","h":"CLE","rd":0,"dv":1},{"w":13,"d":"2026-12-06","t":"13:00","a":"GB","h":"NO","rd":-4,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"SF","h":"NYG","rd":0,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"LAC","h":"TB","rd":-1,"dv":0},{"w":13,"d":"2026-12-06","t":"13:00","a":"WAS","h":"TEN","rd":0,"dv":0},{"w":13,"d":"2026-12-06","t":"16:05","a":"PHI","h":"ARI","rd":-3,"dv":0},{"w":13,"d":"2026-12-06","t":"16:05","a":"MIA","h":"DEN","rd":2,"dv":0},{"w":13,"d":"2026-12-06","t":"16:25","a":"CAR","h":"MIN","rd":1,"dv":0},{"w":13,"d":"2026-12-06","t":"16:25","a":"BUF","h":"NE","rd":-3,"dv":1},{"w":13,"d":"2026-12-06","t":"20:20","a":"HOU","h":"PIT","rd":2,"dv":0},{"w":13,"d":"2026-12-07","t":"20:15","a":"DAL","h":"SEA","rd":-3,"dv":0},{"w":14,"d":"2026-12-10","t":"20:15","a":"MIN","h":"NE","rd":0,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"TB","h":"BAL","rd":7,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"NO","h":"CAR","rd":0,"dv":1},{"w":14,"d":"2026-12-13","t":"13:00","a":"ATL","h":"CLE","rd":0,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"TEN","h":"DET","rd":0,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"CHI","h":"MIA","rd":0,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"DEN","h":"NYJ","rd":7,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"IND","h":"PHI","rd":-7,"dv":0},{"w":14,"d":"2026-12-13","t":"13:00","a":"HOU","h":"WAS","rd":0,"dv":0},{"w":14,"d":"2026-12-13","t":"16:05","a":"LAC","h":"LV","rd":7,"dv":1},{"w":14,"d":"2026-12-13","t":"16:25","a":"KC","h":"CIN","rd":-3,"dv":0},{"w":14,"d":"2026-12-13","t":"16:25","a":"NYG","h":"SEA","rd":-1,"dv":0},{"w":14,"d":"2026-12-13","t":"16:25","a":"LA","h":"SF","rd":-3,"dv":1},{"w":14,"d":"2026-12-13","t":"20:20","a":"BUF","h":"GB","rd":0,"dv":0},{"w":14,"d":"2026-12-14","t":"20:15","a":"PIT","h":"JAX","rd":0,"dv":0},{"w":15,"d":"2026-12-17","t":"20:15","a":"SF","h":"LAC","rd":0,"dv":0},{"w":15,"d":"2026-12-19","t":"17:00","a":"SEA","h":"PHI","rd":0,"dv":0},{"w":15,"d":"2026-12-19","t":"20:20","a":"CHI","h":"BUF","rd":0,"dv":0},{"w":15,"d":"2026-12-20","t":"13:00","a":"CIN","h":"CAR","rd":0,"dv":0},{"w":15,"d":"2026-12-20","t":"13:00","a":"MIA","h":"GB","rd":0,"dv":0},{"w":15,"d":"2026-12-20","t":"13:00","a":"JAX","h":"HOU","rd":1,"dv":1},{"w":15,"d":"2026-12-20","t":"13:00","a":"CLE","h":"NYG","rd":0,"dv":0},{"w":15,"d":"2026-12-20","t":"13:00","a":"BAL","h":"PIT","rd":-1,"dv":1},{"w":15,"d":"2026-12-20","t":"13:00","a":"NO","h":"TB","rd":0,"dv":1},{"w":15,"d":"2026-12-20","t":"13:00","a":"IND","h":"TEN","rd":0,"dv":1},{"w":15,"d":"2026-12-20","t":"13:00","a":"ATL","h":"WAS","rd":0,"dv":0},{"w":15,"d":"2026-12-20","t":"16:05","a":"NYJ","h":"ARI","rd":7,"dv":0},{"w":15,"d":"2026-12-20","t":"16:25","a":"DAL","h":"LA","rd":-6,"dv":0},{"w":15,"d":"2026-12-20","t":"16:25","a":"DEN","h":"LV","rd":0,"dv":1},{"w":15,"d":"2026-12-20","t":"20:20","a":"DET","h":"MIN","rd":3,"dv":1},{"w":15,"d":"2026-12-21","t":"20:15","a":"NE","h":"KC","rd":-3,"dv":0},{"w":16,"d":"2026-12-24","t":"20:15","a":"HOU","h":"PHI","rd":1,"dv":0},{"w":16,"d":"2026-12-25","t":"13:00","a":"GB","h":"CHI","rd":1,"dv":1},{"w":16,"d":"2026-12-25","t":"16:30","a":"BUF","h":"DEN","rd":-1,"dv":0},{"w":16,"d":"2026-12-25","t":"20:15","a":"LA","h":"SEA","rd":1,"dv":1},{"w":16,"d":"2026-12-27","t":"13:00","a":"TB","h":"ATL","rd":0,"dv":1},{"w":16,"d":"2026-12-27","t":"13:00","a":"CLE","h":"BAL","rd":0,"dv":1},{"w":16,"d":"2026-12-27","t":"13:00","a":"CIN","h":"IND","rd":0,"dv":0},{"w":16,"d":"2026-12-27","t":"13:00","a":"LAC","h":"MIA","rd":-3,"dv":0},{"w":16,"d":"2026-12-27","t":"13:00","a":"WAS","h":"MIN","rd":0,"dv":0},{"w":16,"d":"2026-12-27","t":"13:00","a":"ARI","h":"NO","rd":0,"dv":0},{"w":16,"d":"2026-12-27","t":"13:00","a":"NE","h":"NYJ","rd":1,"dv":1},{"w":16,"d":"2026-12-27","t":"13:00","a":"CAR","h":"PIT","rd":0,"dv":0},{"w":16,"d":"2026-12-27","t":"16:05","a":"TEN","h":"LV","rd":0,"dv":0},{"w":16,"d":"2026-12-27","t":"16:25","a":"SF","h":"KC","rd":-4,"dv":0},{"w":16,"d":"2026-12-27","t":"20:20","a":"JAX","h":"DAL","rd":0,"dv":0},{"w":16,"d":"2026-12-28","t":"20:15","a":"NYG","h":"DET","rd":0,"dv":0},{"w":17,"d":"2026-12-31","t":"20:15","a":"BAL","h":"CIN","rd":0,"dv":1},{"w":17,"d":"2027-01-03","t":"13:00","a":"NO","h":"ATL","rd":0,"dv":1},{"w":17,"d":"2027-01-03","t":"13:00","a":"SEA","h":"CAR","rd":-2,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"IND","h":"CLE","rd":0,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"NYG","h":"DAL","rd":1,"dv":1},{"w":17,"d":"2027-01-03","t":"13:00","a":"WAS","h":"JAX","rd":0,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"KC","h":"LAC","rd":0,"dv":1},{"w":17,"d":"2027-01-03","t":"13:00","a":"BUF","h":"MIA","rd":-2,"dv":1},{"w":17,"d":"2027-01-03","t":"13:00","a":"DEN","h":"NE","rd":-2,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"MIN","h":"NYJ","rd":0,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"LA","h":"TB","rd":-2,"dv":0},{"w":17,"d":"2027-01-03","t":"13:00","a":"PIT","h":"TEN","rd":0,"dv":0},{"w":17,"d":"2027-01-03","t":"16:05","a":"LV","h":"ARI","rd":0,"dv":0},{"w":17,"d":"2027-01-03","t":"16:25","a":"DET","h":"CHI","rd":3,"dv":1},{"w":17,"d":"2027-01-03","t":"20:20","a":"PHI","h":"SF","rd":-3,"dv":0},{"w":17,"d":"2027-01-04","t":"20:15","a":"HOU","h":"GB","rd":-1,"dv":0},{"w":18,"d":"2027-01-10","t":"13:00","a":"SF","h":"ARI","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"PIT","h":"BAL","rd":3,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"NYJ","h":"BUF","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"ATL","h":"CAR","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"CLE","h":"CIN","rd":3,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"LAC","h":"DEN","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"DET","h":"GB","rd":-1,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"TEN","h":"HOU","rd":-1,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"JAX","h":"IND","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"LV","h":"KC","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"SEA","h":"LA","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"CHI","h":"MIN","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"MIA","h":"NE","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"TB","h":"NO","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"PHI","h":"NYG","rd":0,"dv":1},{"w":18,"d":"2027-01-10","t":"13:00","a":"DAL","h":"WAS","rd":0,"dv":1}];

const TEAM_META = {
  ARI:["Arizona Cardinals","#97233F"], ATL:["Atlanta Falcons","#A71930"], BAL:["Baltimore Ravens","#241773"],
  BUF:["Buffalo Bills","#00338D"], CAR:["Carolina Panthers","#0085CA"], CHI:["Chicago Bears","#C83803"],
  CIN:["Cincinnati Bengals","#FB4F14"], CLE:["Cleveland Browns","#FF3C00"], DAL:["Dallas Cowboys","#003594"],
  DEN:["Denver Broncos","#FB4F14"], DET:["Detroit Lions","#0076B6"], GB:["Green Bay Packers","#203731"],
  HOU:["Houston Texans","#03202F"], IND:["Indianapolis Colts","#002C5F"], JAX:["Jacksonville Jaguars","#006778"],
  KC:["Kansas City Chiefs","#E31837"], LA:["Los Angeles Rams","#003594"], LAC:["Los Angeles Chargers","#0080C6"],
  LV:["Las Vegas Raiders","#A5ACAF"], MIA:["Miami Dolphins","#008E97"], MIN:["Minnesota Vikings","#4F2683"],
  NE:["New England Patriots","#002244"], NO:["New Orleans Saints","#D3BC8D"], NYG:["New York Giants","#0B2265"],
  NYJ:["New York Jets","#125740"], PHI:["Philadelphia Eagles","#004C54"], PIT:["Pittsburgh Steelers","#FFB612"],
  SEA:["Seattle Seahawks","#69BE28"], SF:["San Francisco 49ers","#AA0000"], TB:["Tampa Bay Buccaneers","#D50A0A"],
  TEN:["Tennessee Titans","#4B92DB"], WAS:["Washington Commanders","#5A1414"],
};
const CODES = Object.keys(TEAM_META).sort();

const TZ = { BUF:0,MIA:0,NE:0,NYJ:0,NYG:0,PHI:0,PIT:0,BAL:0,CIN:0,CLE:0,WAS:0,CAR:0,ATL:0,JAX:0,TB:0,IND:0,DET:0,CHI:-1,GB:-1,MIN:-1,DAL:-1,HOU:-1,TEN:-1,NO:-1,KC:-1,DEN:-2,ARI:-2,SEA:-3,SF:-3,LA:-3,LAC:-3,LV:-3 };

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

function predict(homeCode, awayCode, opts, live) {
  const M = DATA.model;
  const h = (live && live[homeCode]) || DATA.teams[homeCode];
  const a = (live && live[awayCode]) || DATA.teams[awayCode];
  const eloH = h.elo + (opts.eloAdjHome || 0);
  const eloA = a.elo + (opts.eloAdjAway || 0);
  /* QB-Ausfall = Backup auf Replacement-Level */
  const qbH = opts.qbOutHome ? M.qb_repl : (h.qb !== undefined ? h.qb : 0);
  const qbA = opts.qbOutAway ? M.qb_repl : (a.qb !== undefined ? a.qb : 0);
  const qbNewH = opts.qbOutHome ? 1 : (h.qb_new || 0);
  const qbNewA = opts.qbOutAway ? 1 : (a.qb_new || 0);
  const injH = opts.injHome !== undefined ? opts.injHome : (h.inj || 0);
  const injA = opts.injAway !== undefined ? opts.injAway : (a.inj || 0);
  /* Situations-Features */
  const hr = opts.homeRest !== undefined ? opts.homeRest : 7;
  const ar = opts.awayRest !== undefined ? opts.awayRest : 7;
  const byeDiff = (hr >= 13 ? 1 : 0) - (ar >= 13 ? 1 : 0);
  const tzShift = Math.abs((TZ[homeCode] || 0) - (TZ[awayCode] || 0));
  let hour = 99;
  if (opts.gametime) { const hh = parseInt(String(opts.gametime).slice(0, 2), 10); if (!isNaN(hh)) hour = hh; }
  const westEarly = ((TZ[awayCode] || 0) - (TZ[homeCode] || 0)) <= -2 && hour <= 13 ? 1 : 0;
  /* Reihenfolge = DATA.model.features */
  const x = [
    eloH + M.home_adv_elo - eloA,
    qbH - qbA,
    h.off_epa - a.off_epa,
    a.def_epa - h.def_epa,
    h.cpoe - a.cpoe,
    opts.restDiff || 0,
    injA - injH,
    qbNewA - qbNewH,
    byeDiff,
    tzShift,
    westEarly,
  ];
  let z = M.intercept;
  for (let i = 0; i < x.length; i++) z += M.coef[i] * ((x[i] - M.mean[i]) / M.scale[i]);
  return sigmoid(z);
}

/* ==== Feld-Gauge: Ball an der vorhergesagten Yard-Linie ==== */
function FieldGauge({ pHome, homeCode, awayCode }) {
  const [hn, hc] = TEAM_META[homeCode], [an, ac] = TEAM_META[awayCode];
  const pct = pHome * 100;
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 15 }}>
        <span style={{ color: hc === "#03202F" ? "#7A9CB0" : hc }}>{hn} · Heim</span>
        <span style={{ color: "#8C94A8" }}>{an} · Auswärts</span>
      </div>
      <div style={{ position: "relative", height: 74, marginTop: 8, borderRadius: 8, overflow: "hidden", background: "#17402C", border: "1px solid #26304A" }}>
        {/* Endzonen */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "8%", background: hc, opacity: 0.85 }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "8%", background: ac, opacity: 0.85 }} />
        {/* Yard-Linien */}
        {[...Array(9)].map((_, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${8 + (i + 1) * 8.4}%`, width: 1, background: "rgba(240,237,226,0.28)" }} />
        ))}
        {[...Array(9)].map((_, i) => (
          <div key={"n" + i} style={{ position: "absolute", bottom: 4, left: `${8 + (i + 1) * 8.4}%`, transform: "translateX(-50%)", fontFamily: "'IBM Plex Mono'", fontSize: 9, color: "rgba(240,237,226,0.45)" }}>
            {(i < 4 ? (i + 1) * 10 : i === 4 ? 50 : (9 - i) * 10)}
          </div>
        ))}
        {/* Ball-Marker an Gewinnwahrscheinlichkeit */}
        <div style={{ position: "absolute", top: "50%", left: `calc(8% + ${pct * 0.84}%)`, transform: "translate(-50%,-50%)", transition: "left 600ms cubic-bezier(.2,.8,.2,1)" }}>
          <div style={{ width: 26, height: 17, borderRadius: "50%", background: "#7A4A21", border: "2px solid #F0EDE2", boxShadow: "0 2px 10px rgba(0,0,0,0.6)", position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "22%", right: "22%", height: 1.5, background: "#F0EDE2", transform: "translateY(-50%)" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "'IBM Plex Mono'", fontSize: 26 }}>
        <span style={{ color: "#F0EDE2" }}>{pct.toFixed(1)}<span style={{ fontSize: 14, color: "#8C94A8" }}> %</span></span>
        <span style={{ color: "#8C94A8" }}>{(100 - pct).toFixed(1)}<span style={{ fontSize: 14 }}> %</span></span>
      </div>
    </div>
  );
}

function TeamSelect({ label, value, onChange, exclude }) {
  const color = TEAM_META[value][1];
  return (
    <div style={{ flex: 1, minWidth: 150 }}>
      <div style={{ fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 13, color: "#8C94A8", marginBottom: 6 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "12px 10px", background: "#0A0D16", color: "#F0EDE2", border: `1px solid ${color}`, borderLeft: `5px solid ${color}`, borderRadius: 6, fontSize: 15, fontFamily: "Inter" }}>
        {CODES.map((c) => (
          <option key={c} value={c} disabled={c === exclude}>{TEAM_META[c][0]}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid #26304A", borderRadius: 6, padding: "8px 10px", cursor: "pointer", color: checked ? "#E0685C" : "#8C94A8", fontSize: 13, fontFamily: "Inter" }}>
      <span style={{ width: 14, height: 14, borderRadius: 3, border: "1px solid currentColor", background: checked ? "#E0685C" : "transparent", display: "inline-block" }} />
      {label}
    </button>
  );
}

export default function App() {
  const [home, setHome] = useState("SEA");
  const [away, setAway] = useState("KC");
  const [qbOutHome, setQbOutHome] = useState(false);
  const [qbOutAway, setQbOutAway] = useState(false);
  const [restDiff, setRestDiff] = useState(0);
  const [ai, setAi] = useState(null);       // {home_adj, away_adj, summary, factors}
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [tab, setTab] = useState("sched");

  /* ==== Selbstaktualisierung: Daten aus Buraks Pipeline (gridiron-data), Fallback nflverse ==== */
  const PIPELINE_URL = "https://raw.githubusercontent.com/Cako18/gridiron-data/main/data/app_data.json";
  const [liveTeams, setLiveTeams] = useState(null);   // Teams inkl. Elo, EPA, Injuries aus Pipeline
  const [sched, setSched] = useState(SCHEDULE);
  const [dataInfo, setDataInfo] = useState("Lädt aktuelle Daten…");
  const [results26, setResults26] = useState({});     // "w-AWAY-HOME" -> {as, hs}
  const [bilanz, setBilanz] = useState(null);         // {c, t} Modell-Trefferquote
  const [upsetOnly, setUpsetOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let teams = null, schedule = SCHEDULE, resMap = {}, info = null;
      try {
        /* 1. Versuch: eigene Pipeline (Elo + EPA + Injuries, taeglich aktualisiert) */
        const res = await fetch(PIPELINE_URL);
        if (!res.ok) throw new Error("Pipeline " + res.status);
        const d = await res.json();
        teams = d.teams;
        schedule = d.schedule.map((g) => ({ ...g, rd: Math.max(-7, Math.min(7, g.rd)) }));
        for (const g of schedule) if (g.hs !== null && g.hs !== undefined) resMap[`${g.w}-${g.a}-${g.h}`] = { as: g.as, hs: g.hs };
        info = `Pipeline-Stand: ${(d.generated || "").slice(0, 10)} · letztes Ergebnis ${d.last_result} · Saison ${d.season}`;
      } catch (e1) {
        /* 2. Versuch: Elo direkt aus nflverse-Ergebnissen berechnen */
        try {
          const res = await fetch("https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv");
          const rows = parseCSV(await res.text());
          const elo = computeLiveElo(rows);
          teams = {};
          for (const c in DATA.teams) teams[c] = { ...DATA.teams[c], elo: elo[c] !== undefined ? elo[c] : DATA.teams[c].elo };
          const done = rows.filter((g) => g.season === "2026" && g.home_score !== "");
          for (const g of done) resMap[`${Number(g.week)}-${g.away_team}-${g.home_team}`] = { as: Number(g.away_score), hs: Number(g.home_score) };
          info = "nflverse-Fallback aktiv (Elo live, EPA Stand Ende 2025) – Pipeline nicht erreichbar";
        } catch (e2) {
          info = "Offline-Modus – eingebettete Ratings (Ende 2025) aktiv";
        }
      }
      if (cancelled) return;
      if (teams) setLiveTeams(teams);
      setSched(schedule);
      setResults26(resMap);
      setDataInfo(info);
      /* Picks einfrieren + Bilanz auswerten (persistenter Speicher) */
      try {
        if (typeof window !== "undefined" && window.storage) {
          let stored = {};
          try { const r = await window.storage.get("gridiron-picks"); stored = JSON.parse(r.value); } catch (e) {}
          let changed = false;
          for (const g of schedule) {
            const key = `${g.w}-${g.a}-${g.h}`;
            if (!resMap[key] && !stored[key]) {
              const pH = predict(g.h, g.a, { restDiff: g.rd, homeRest: g.hr, awayRest: g.ar, gametime: g.t }, teams);
              stored[key] = { f: pH >= 0.5 ? g.h : g.a, p: Math.round(Math.max(pH, 1 - pH) * 100) };
              changed = true;
            }
          }
          let c = 0, t = 0, ca = 0, ta = 0;
          for (const key in resMap) {
            const s = stored[key];
            if (!s) continue;
            const r = resMap[key];
            const winner = r.hs > r.as ? key.split("-")[2] : r.hs < r.as ? key.split("-")[1] : null;
            if (!winner) continue;
            if (s.f) { t++; if (winner === s.f) c++; }
            if (s.fa) { ta++; if (winner === s.fa) ca++; }
          }
          if (t > 0) setBilanz({ c, t, ca, ta });
          if (changed) { try { await window.storage.set("gridiron-picks", JSON.stringify(stored)); } catch (e) {} }
        }
      } catch (e) {}
    })();
    return () => { cancelled = true; };
  }, []);

  const ctxOpts = gameCtx ? { homeRest: gameCtx.hr, awayRest: gameCtx.ar, gametime: gameCtx.t } : {};
  const pBase = useMemo(() => predict(home, away, { qbOutHome, qbOutAway, restDiff, ...ctxOpts }, liveTeams), [home, away, qbOutHome, qbOutAway, restDiff, liveTeams, gameCtx]);
  const pAi = useMemo(() => ai ? predict(home, away, { qbOutHome, qbOutAway, restDiff, ...ctxOpts, eloAdjHome: ai.home_adj, eloAdjAway: ai.away_adj }, liveTeams) : null, [ai, home, away, qbOutHome, qbOutAway, restDiff, liveTeams, gameCtx]);
  const p = pAi ?? pBase;
  const fav = p >= 0.5 ? home : away;
  const favP = p >= 0.5 ? p : 1 - p;

  async function runClaude() {
    setAiLoading(true); setAiErr(null); setAi(null);
    const [hn] = TEAM_META[home], [an] = TEAM_META[away];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content:
`Du bist der Kontext-Layer eines statistischen NFL-Vorhersagemodells. Matchup: ${hn} (Heim) gegen ${an} (Auswärts).
Recherchiere per Websuche die AKTUELLE Lage beider Teams: Kaderveränderungen, QB-Situation, Verletzungen, Trainerwechsel, Form/News.
Übersetze deine Erkenntnisse in Elo-Anpassungen zwischen -75 und +75 pro Team (0 = keine relevanten News; nur klare, belegbare Faktoren zählen).
Antworte AUSSCHLIESSLICH mit validem JSON, ohne Markdown, ohne Erklärtext davor oder danach:
{"home_adj": <int>, "away_adj": <int>, "summary": "<2-3 Sätze auf Deutsch>", "factors": ["<Faktor 1>", "<Faktor 2>", "<Faktor 3>"]}` }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      const jsonStr = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
      const parsed = JSON.parse(jsonStr);
      const adj = {
        home_adj: Math.max(-75, Math.min(75, Number(parsed.home_adj) || 0)),
        away_adj: Math.max(-75, Math.min(75, Number(parsed.away_adj) || 0)),
        summary: parsed.summary || "",
        factors: Array.isArray(parsed.factors) ? parsed.factors.slice(0, 4) : [],
      };
      setAi(adj);
      /* Claude-Pick fuer offizielle Spiele einfrieren -> Bilanz Modell vs. Modell+Claude */
      try {
        if (gameCtx && !results26[gameCtx.key] && typeof window !== "undefined" && window.storage) {
          const pA = predict(home, away, { qbOutHome, qbOutAway, restDiff, homeRest: gameCtx.hr, awayRest: gameCtx.ar, gametime: gameCtx.t, eloAdjHome: adj.home_adj, eloAdjAway: adj.away_adj }, liveTeams);
          let stored = {};
          try { const r = await window.storage.get("gridiron-picks"); stored = JSON.parse(r.value); } catch (e) {}
          if (!stored[gameCtx.key]) stored[gameCtx.key] = {};
          if (!stored[gameCtx.key].fa) {
            stored[gameCtx.key].fa = pA >= 0.5 ? home : away;
            await window.storage.set("gridiron-picks", JSON.stringify(stored));
          }
        }
      } catch (e) {}
    } catch (e) {
      setAiErr("Analyse fehlgeschlagen. Nochmal versuchen – manchmal braucht die Websuche einen zweiten Anlauf.");
    } finally {
      setAiLoading(false);
    }
  }

  const eloOf = (c) => (liveTeams && liveTeams[c] ? liveTeams[c].elo : DATA.teams[c].elo);
  const ranking = [...CODES].sort((a, b) => eloOf(b) - eloOf(a));

  const [week, setWeek] = useState(1);
  const [gameInfo, setGameInfo] = useState(null); // z.B. "Woche 1 · Mi 09.09."
  const [gameCtx, setGameCtx] = useState(null);   // {key, hr, ar, t} des geladenen Spielplan-Spiels
  const DAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const fmtDate = (d) => { const dt = new Date(d + "T12:00:00"); return `${DAYS[dt.getDay()]} ${String(dt.getDate()).padStart(2, "0")}.${String(dt.getMonth() + 1).padStart(2, "0")}.`; };
  function loadGame(g) {
    setHome(g.h); setAway(g.a); setRestDiff(Math.max(-7, Math.min(7, g.rd)));
    setQbOutHome(!!(liveTeams && liveTeams[g.h] && liveTeams[g.h].qb_out));
    setQbOutAway(!!(liveTeams && liveTeams[g.a] && liveTeams[g.a].qb_out));
    setGameCtx({ key: `${g.w}-${g.a}-${g.h}`, hr: g.hr, ar: g.ar, t: g.t });
    setAi(null);
    setGameInfo(`Woche ${g.w} · ${fmtDate(g.d)}${g.t ? " · " + g.t.slice(0, 5) + " ET" : ""}`);
    setTab("match");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0D16", color: "#F0EDE2", fontFamily: "Inter, system-ui, sans-serif", padding: "0 0 60px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=IBM+Plex+Mono:wght@500&family=Inter:wght@400;600&display=swap');
        select:focus, button:focus { outline: 2px solid #D9A441; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }`}</style>

      {/* Header */}
      <header style={{ padding: "26px 20px 18px", borderBottom: "1px solid #26304A", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 34, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Gridiron<span style={{ color: "#D9A441" }}>&nbsp;Modell</span>
          </div>
          <div style={{ fontSize: 12.5, color: "#8C94A8", marginTop: 2 }}>
            Elo + EPA + Injuries · {dataInfo}
            {bilanz && <span style={{ color: "#D9A441" }}> · Bilanz: Modell {bilanz.c}/{bilanz.t} ({Math.round(100 * bilanz.c / bilanz.t)} %){bilanz.ta > 0 ? ` · mit Claude ${bilanz.ca}/${bilanz.ta} (${Math.round(100 * bilanz.ca / bilanz.ta)} %)` : ""}</span>}
          </div>
        </div>
        <nav style={{ display: "flex", gap: 6 }}>
          {[["sched", "Spielplan '26"], ["match", "Matchup"], ["rank", "Elo-Ranking"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ background: tab === k ? "#D9A441" : "transparent", color: tab === k ? "#0A0D16" : "#8C94A8", border: "1px solid " + (tab === k ? "#D9A441" : "#26304A"), borderRadius: 6, padding: "7px 14px", fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 14, cursor: "pointer" }}>{l}</button>
          ))}
        </nav>
      </header>

      {tab === "match" && (
        <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>
          {gameInfo && (
            <div style={{ marginBottom: 12, fontFamily: "'IBM Plex Mono'", fontSize: 12.5, color: "#D9A441" }}>{gameInfo} · Ruhetage automatisch gesetzt</div>
          )}
          {/* Team-Auswahl */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <TeamSelect label="Heimteam" value={home} onChange={(v) => { setHome(v); setGameInfo(null); setGameCtx(null); setAi(null); }} exclude={away} />
            <button onClick={() => { setHome(away); setAway(home); setGameInfo(null); setGameCtx(null); setAi(null); }}
              title="Heim und Auswärts tauschen"
              style={{ background: "transparent", border: "1px solid #26304A", color: "#D9A441", borderRadius: 6, padding: "12px 14px", cursor: "pointer", fontSize: 16 }}>⇄</button>
            <TeamSelect label="Auswärtsteam" value={away} onChange={(v) => { setAway(v); setGameInfo(null); setGameCtx(null); setAi(null); }} exclude={home} />
          </div>

          {/* Anpassungen */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
            <Toggle label={`QB ${home} fällt aus`} checked={qbOutHome} onChange={setQbOutHome} />
            <Toggle label={`QB ${away} fällt aus`} checked={qbOutAway} onChange={setQbOutAway} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #26304A", borderRadius: 6, padding: "6px 10px" }}>
              <span style={{ fontSize: 13, color: "#8C94A8" }}>Ruhetage-Differenz</span>
              <input type="range" min={-7} max={7} value={restDiff} onChange={(e) => setRestDiff(Number(e.target.value))} style={{ accentColor: "#D9A441", width: 110 }} />
              <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, width: 24, textAlign: "right" }}>{restDiff > 0 ? "+" + restDiff : restDiff}</span>
            </div>
          </div>

          <FieldGauge pHome={p} homeCode={home} awayCode={away} />

          <div style={{ marginTop: 8, fontSize: 14.5, color: "#C9CEDB" }}>
            Das Modell sieht <strong style={{ color: "#F0EDE2" }}>{TEAM_META[fav][0]}</strong> vorn – {(favP * 100).toFixed(1)} % Siegwahrscheinlichkeit
            {pAi !== null && <span style={{ color: "#D9A441" }}> (inkl. Claude-Anpassung, Basis: {(100 * (fav === home ? pBase : 1 - pBase)).toFixed(1)} %)</span>}.
          </div>

          {/* Claude-Layer */}
          <section style={{ marginTop: 26, background: "#131A2B", border: "1px solid #26304A", borderRadius: 10, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 17 }}>Claude-Kontextanalyse</div>
                <div style={{ fontSize: 12.5, color: "#8C94A8" }}>Liest aktuelle News per Websuche und passt die Elo-Werte an – der Teil, den Statistik allein nicht sieht.</div>
              </div>
              <button onClick={runClaude} disabled={aiLoading}
                style={{ background: aiLoading ? "#26304A" : "#D9A441", color: aiLoading ? "#8C94A8" : "#0A0D16", border: "none", borderRadius: 6, padding: "10px 18px", fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 15, cursor: aiLoading ? "wait" : "pointer" }}>
                {aiLoading ? "Recherchiert…" : "Analyse starten"}
              </button>
            </div>
            {aiErr && <div style={{ marginTop: 12, color: "#E0685C", fontSize: 13.5 }}>{aiErr}</div>}
            {ai && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", gap: 16, fontFamily: "'IBM Plex Mono'", fontSize: 14 }}>
                  <span>{home}: <span style={{ color: ai.home_adj >= 0 ? "#8FCB9B" : "#E0685C" }}>{ai.home_adj >= 0 ? "+" : ""}{ai.home_adj} Elo</span></span>
                  <span>{away}: <span style={{ color: ai.away_adj >= 0 ? "#8FCB9B" : "#E0685C" }}>{ai.away_adj >= 0 ? "+" : ""}{ai.away_adj} Elo</span></span>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#C9CEDB", margin: "10px 0 8px" }}>{ai.summary}</p>
                {ai.factors.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#8C94A8", lineHeight: 1.6 }}>
                    {ai.factors.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}
              </div>
            )}
          </section>

          <p style={{ marginTop: 18, fontSize: 12, color: "#5C6478", lineHeight: 1.5 }}>
            Ratings: Stand Ende Saison 2025. Backtest-Genauigkeit des Basismodells 2018–2025: ~64 %, Vegas ~66 %. Kein Wett-Tipp – ein Experiment.
          </p>
        </main>
      )}

      {tab === "sched" && (
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
              <button key={w} onClick={() => setWeek(w)}
                style={{ minWidth: 38, padding: "7px 0", background: week === w ? "#D9A441" : "transparent", color: week === w ? "#0A0D16" : "#8C94A8", border: "1px solid " + (week === w ? "#D9A441" : "#26304A"), borderRadius: 6, fontFamily: "'IBM Plex Mono'", fontSize: 13, cursor: "pointer" }}>{w}</button>
            ))}
          </div>
          <button onClick={() => setUpsetOnly(!upsetOnly)}
            style={{ marginBottom: 14, background: upsetOnly ? "#E0685C" : "transparent", color: upsetOnly ? "#0A0D16" : "#E0685C", border: "1px solid #E0685C", borderRadius: 6, padding: "7px 14px", fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 14, cursor: "pointer" }}>
            ⚠ Nur Upset-Alarm {upsetOnly ? "an" : ""}
          </button>
          {sched.filter((g) => g.w === week).map((g, i, arr) => {
            const key = `${g.w}-${g.a}-${g.h}`;
            const result = results26[key];
            const pH = predict(g.h, g.a, { restDiff: Math.max(-7, Math.min(7, g.rd)), homeRest: g.hr, awayRest: g.ar, gametime: g.t }, liveTeams);
            const favC = pH >= 0.5 ? g.h : g.a;
            const favProb = Math.max(pH, 1 - pH);
            const upset = !result && favProb < 0.58;
            const bank = !result && favProb >= 0.70;
            if (upsetOnly && !upset) return null;
            const winner = result ? (result.hs > result.as ? g.h : result.hs < result.as ? g.a : null) : null;
            const newDay = i === 0 || arr[i - 1].d !== g.d;
            return (
              <div key={g.h + g.a}>
                {newDay && !upsetOnly && (
                  <div style={{ fontFamily: "'Barlow Condensed'", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 13, color: "#5C6478", margin: "16px 0 6px" }}>{fmtDate(g.d)}</div>
                )}
                <button onClick={() => loadGame(g)}
                  style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, background: "#131A2B", border: "1px solid " + (upset ? "#5A3A38" : "#26304A"), borderRadius: 8, padding: "11px 12px", marginBottom: 6, cursor: "pointer", color: "#F0EDE2", fontFamily: "Inter" }}>
                  <span style={{ width: 4, alignSelf: "stretch", background: TEAM_META[winner || favC][1], borderRadius: 2 }} />
                  <span style={{ flex: 1, fontSize: 14.5 }}>
                    <span style={{ fontWeight: (winner || favC) === g.a ? 600 : 400 }}>{TEAM_META[g.a][0]}</span>
                    <span style={{ color: "#5C6478" }}> @ </span>
                    <span style={{ fontWeight: (winner || favC) === g.h ? 600 : 400 }}>{TEAM_META[g.h][0]}</span>
                    {g.dv === 1 && <span style={{ marginLeft: 6, fontSize: 10.5, color: "#8C94A8", border: "1px solid #26304A", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle" }}>DIV</span>}
                    {upset && <span style={{ marginLeft: 6, fontSize: 10.5, color: "#E0685C", border: "1px solid #5A3A38", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle", fontWeight: 600 }}>⚠ UPSET-ALARM</span>}
                    {bank && <span style={{ marginLeft: 6, fontSize: 10.5, color: "#8FCB9B", border: "1px solid #2E4A38", borderRadius: 3, padding: "1px 4px", verticalAlign: "middle", fontWeight: 600 }}>BANK</span>}
                  </span>
                  {result ? (
                    <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13.5, color: "#C9CEDB", whiteSpace: "nowrap" }}>{result.as}:{result.hs}</span>
                  ) : (
                    <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13.5, color: upset ? "#E0685C" : bank ? "#8FCB9B" : "#D9A441", whiteSpace: "nowrap" }}>{favC} {(favProb * 100).toFixed(0)} %</span>
                  )}
                </button>
              </div>
            );
          })}
          {upsetOnly && sched.filter((g) => g.w === week && !results26[`${g.w}-${g.a}-${g.h}`] && Math.max(predict(g.h, g.a, { restDiff: Math.max(-7, Math.min(7, g.rd)), homeRest: g.hr, awayRest: g.ar, gametime: g.t }, liveTeams), 1 - predict(g.h, g.a, { restDiff: Math.max(-7, Math.min(7, g.rd)), homeRest: g.hr, awayRest: g.ar, gametime: g.t }, liveTeams)) < 0.58).length === 0 && (
            <p style={{ fontSize: 13.5, color: "#8C94A8" }}>Kein Upset-Alarm in Woche {week} – das Modell sieht überall klare Favoriten. Wähl eine andere Woche.</p>
          )}
          <p style={{ marginTop: 14, fontSize: 12, color: "#5C6478", lineHeight: 1.5 }}>Offizieller Spielplan 2026. Tiers aus 8 Jahren Backtest: BANK (≥70 %) traf 74,6 %, ⚠ Upset-Alarm (unter 58 %) ist praktisch ein Münzwurf (53,7 %). Gespielte Partien zeigen das Endergebnis. Antippen lädt das Spiel ins Matchup.</p>
        </main>
      )}

      {tab === "rank" && (
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px" }}>
          {ranking.map((c, i) => {
            const e = eloOf(c), [name, color] = TEAM_META[c];
            const w = Math.max(2, Math.min(100, ((e - 1240) / (1790 - 1240)) * 100));
            return (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid #1A2033" }}>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, color: "#5C6478", width: 22, textAlign: "right" }}>{i + 1}</span>
                <span style={{ width: 4, alignSelf: "stretch", background: color, borderRadius: 2 }} />
                <span style={{ flex: 1, fontSize: 14.5 }}>{name}</span>
                <div style={{ width: 110, height: 6, background: "#1A2033", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${w}%`, height: "100%", background: "#D9A441" }} />
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13.5, width: 46, textAlign: "right" }}>{Math.round(e)}</span>
              </div>
            );
          })}
          <p style={{ marginTop: 14, fontSize: 12, color: "#5C6478" }}>Elo-Ratings nach Abschluss der Saison 2025, inkl. Playoffs. Saisonübergreifend werden Ratings zu ⅓ Richtung 1500 regressiert.</p>
        </main>
      )}
    </div>
  );
}
