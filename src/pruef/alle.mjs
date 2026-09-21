import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { const p = q.url === "/" ? "/src/pruef/index.html" : q.url;
  try { r.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(readFileSync(".." + p)); }
  catch { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await br.newPage({ viewport: { width: 430, height: 1600 } });
const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push("console: " + m.text()); });

await page.route("**/raw.githubusercontent.com/**", (r) => {
  const u = r.request().url();
  const f = u.endsWith("model.json") ? "pruef/model.json"
          : u.endsWith("ai_context.json") ? "pruef/ai_context.json"
          : u.endsWith("elo_history.csv") ? "pruef/elo_history.csv"
          : "pruef/app_data.json";
  r.fulfill({ status: 200, contentType: u.endsWith(".csv") ? "text/csv" : "application/json",
    headers: { "access-control-allow-origin": "*" }, body: readFileSync(f, "utf8") });
});
await page.route("**/site.api.espn.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: readFileSync(r.request().url().includes("/summary?") ? "pruef/espn_summary.json" : "pruef/espn_scoreboard.json", "utf8") }));

await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("nav button");
console.log("KOPFZEILE:", (await page.evaluate(() => document.querySelector("header").innerText)).replace(/\n/g, " | "));

for (const t of ["Spielplan", "Live", "Matchup", "Tippschein", "Vegas-Duell", "Elo-Ranking"]) {
  await page.getByRole("button", { name: t, exact: true }).click();
  await page.waitForTimeout(t === "Live" ? 1200 : 400);
  const n = await page.evaluate(() => ({
    knoten: document.querySelectorAll("main *").length,
    text: document.querySelector("main").innerText.length,
    svg: document.querySelectorAll("main svg").length,
  }));
  console.log(`  ${t.padEnd(12)} ${String(n.knoten).padStart(5)} Knoten, ${String(n.text).padStart(5)} Zeichen, ${n.svg} SVG`);
  await page.screenshot({ path: `pruef/tab_${t.toLowerCase().replace("-", "")}.png` });
}
console.log("\n" + (fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler in allen sechs Tabs."));
await br.close(); srv.close();
