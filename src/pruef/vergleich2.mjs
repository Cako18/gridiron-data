import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { let body;
  try { body = readFileSync(".." + q.url.split("?")[0]); } catch { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "content-type": q.url.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(body); });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
async function lauf(seite) {
  const page = await br.newPage({ viewport: { width: 430, height: 3000 } });
  const fehler = [];
  page.on("pageerror", (e) => fehler.push(e.message.slice(0, 140)));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.route("**/raw.githubusercontent.com/**", (r) => { const u = r.request().url();
    const f = u.includes("nflverse") ? "../games.csv" : u.endsWith("model.json") ? "pruef/model.json"
      : u.endsWith("ai_context.json") ? "pruef/ai_context.json" : u.endsWith(".csv") ? "pruef/elo_history.csv" : "pruef/app_data.json";
    r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: readFileSync(f, "utf8") }); });
  await page.route("**/site.api.espn.com/**", (r) => r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" },
    body: readFileSync(r.request().url().includes("/summary?") ? "pruef/espn_summary.json" : "pruef/espn_scoreboard.json", "utf8") }));
  await page.goto(`http://localhost:8099${seite}`);
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "Live", exact: true }).first().click();
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body.innerText.replace(/ /g, " "));
  await page.screenshot({ path: `pruef/v2_${seite.includes("alt") ? "alt" : "neu"}.png`, fullPage: true });
  await page.close();
  return { text, fehler };
}
const alt = await lauf("/src/pruef/index_alt.html");
const neu = await lauf("/src/pruef/index.html");

const pruefe = [
  ["Laufend KC-BUF: Heimbalken", /KC\s*(\d+)\s*%/],
  ["Laufend: Kipp-Hinweis", /(F.hrung gekippt[^\n]*)/],
  ["Vorbereitung WAS-NYG: Heimbalken", /WAS\s*(\d+)\s*%/],
  ["Kurve: Fuehrungswechsel", /(\d+)\s*.\s*F.hrungswechsel/],
  ["Als Naechstes LA@SF", /LA @ SF[\s\S]{0,80}?SF\s*(\d+)\s*%/],
  ["Als Naechstes ATL@GB", /ATL @ GB[\s\S]{0,80}?GB\s*(\d+)\s*%/],
  ["Als Naechstes LAC@BUF", /LAC @ BUF[\s\S]{0,80}?BUF\s*(\d+)\s*%/],
  ["Als Naechstes KC@MIA", /KC @ MIA[\s\S]{0,80}?KC\s*(\d+)\s*%/],
  ["Beendet DAL-PHI: Tipp", /([✓✕]\s*Tipp\s*\w+)/],
];
console.log("Pruefpunkt".padEnd(36), "alt".padEnd(30), "neu");
for (const [nm, re] of pruefe) {
  const a = (alt.text.match(re) || [, "-"])[1], n = (neu.text.match(re) || [, "-"])[1];
  console.log(nm.padEnd(36), String(a).slice(0, 28).padEnd(30), n, a === n ? "" : "  <-- abweichend");
}
console.log("\nFehler alt:", alt.fehler.length ? alt.fehler : "keine", "| neu:", neu.fehler.length ? neu.fehler : "keine");
await br.close(); srv.close();
