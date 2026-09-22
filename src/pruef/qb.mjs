// Render-Test QB-Ranking: mit neuem Export und mit altem (ohne "qbs")
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
// zweiter Durchlauf: dieselben Daten ohne "qbs" - so sieht die Seite vor dem ersten neuen Update aus
const ohneQbs = (() => { const d = JSON.parse(readFileSync("pruef/app_data.json", "utf8")); delete d.qbs; return JSON.stringify(d); })();
import { createServer } from "node:http";
const srv = createServer((q, r) => { const p = q.url === "/" ? "/src/pruef/index.html" : q.url;
  try { r.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(readFileSync(".." + p)); }
  catch { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const datei of ["pruef/app_data_ausfall.json", "pruef/app_data.json", "ohne qbs"]) {
  const page = await br.newPage({ viewport: { width: 390, height: 2600 } });
  const fehler = [];
  page.on("pageerror", (e) => fehler.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push(m.text()); });
  await page.route("**/raw.githubusercontent.com/**", (r) => { const u = r.request().url();
    const f = u.endsWith("model.json") ? "pruef/model.json" : u.endsWith("ai_context.json") ? "pruef/ai_context.json"
            : u.endsWith("elo_history.csv") ? "pruef/elo_history.csv" : datei;
    r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: f === "ohne qbs" ? ohneQbs : readFileSync(f, "utf8") }); });
  await page.goto("http://localhost:8099/src/pruef/index.html");
  await page.waitForSelector("nav button");
  await page.click("nav button:has-text('QB-Ranking')");
  await page.waitForTimeout(300);
  const zeilen = await page.$$("main div[style*='cursor: pointer']");
  if (zeilen.length) { await zeilen[0].click(); await page.waitForTimeout(200); }
  const t = await page.evaluate(() => document.querySelector("main").innerText);
  console.log(`--- ${datei}: ${zeilen.length} Zeilen`);
  console.log(zeilen.length ? t.slice(t.indexOf("Antippen"), t.indexOf("Antippen") + 900) : t.slice(-120));
  for (const nm of ["Penix", "Tagovailoa", "Kyler Murray", "Burrow"]) { const k = t.indexOf(nm); if (k >= 0) console.log("  >>", t.slice(k, k + 160).replace(/\n/g, " | ")); }
  if (zeilen.length) {
    await page.click("button:has-text('Ausfall')"); await page.waitForTimeout(200);
    const t2 = await page.evaluate(() => document.querySelector("main").innerText);
    const i = t2.indexOf("Antippen für Details."); console.log("[Ausfall-Sortierung]", t2.slice(i + 21, i + 260).replace(/\n/g, " | "));
    await page.click("button:has-text('Modellwert')"); await page.waitForTimeout(200);
    await page.screenshot({ path: datei.includes("ausfall") ? "pruef/qb_ausfall.png" : "pruef/qb.png", fullPage: false });
  }
  console.log(fehler.length ? "FEHLER: " + fehler.join(" | ") : "Keine Konsolenfehler.");
  await page.close();
}
await br.close(); srv.close();
