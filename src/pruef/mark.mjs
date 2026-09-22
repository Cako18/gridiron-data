import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { const p = q.url === "/" ? "/src/pruef/index.html" : q.url;
  try { r.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(readFileSync(".." + p)); }
  catch { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await br.newPage({ viewport: { width: 430, height: 2400 } });
const fehler = [];
page.on("pageerror", (e) => fehler.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push(m.text()); });
await page.route("**/raw.githubusercontent.com/**", (r) => { const u = r.request().url();
  const f = u.endsWith("model.json") ? "pruef/model.json" : u.endsWith("ai_context.json") ? "pruef/ai_context.json"
          : u.endsWith("elo_history.csv") ? "pruef/elo_history.csv" : "pruef/app_data.json";
  r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: readFileSync(f, "utf8") }); });
await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("section");
await page.click("summary");
await page.waitForTimeout(300);
const t = await page.evaluate(() => document.querySelector("main").innerText);
const chips = await page.evaluate(() => [...document.querySelectorAll("section span")]
  .map((s) => s.innerText).filter((x) => /^(BANK|MÜNZWURF|GEGEN DEN MARKT|Bank|Münzwurf|Gegen den Markt)$/i.test(x)));
const zaehl = {}; chips.forEach((c) => zaehl[c.toUpperCase()] = (zaehl[c.toUpperCase()] || 0) + 1);
console.log("Markierungen in Woche 3:", JSON.stringify(zaehl));
const i = t.indexOf("WOCHE 3"); console.log(t.slice(i, i + 700));
console.log("\n" + (fehler.length ? "FEHLER: " + fehler.join(" | ") : "Keine Konsolenfehler."));
await page.screenshot({ path: "pruef/markierungen.png" });
await br.close(); srv.close();
