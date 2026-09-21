import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const srv = createServer((req, res) => {
  const p = req.url === "/" ? "/src/pruef/index.html" : req.url;
  try { res.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" });
        res.end(readFileSync(".." + p)); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(8099, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 430, height: 1500 } });
const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push("console: " + m.text()); });
await page.route("**/raw.githubusercontent.com/**", (r) => r.fulfill({
  status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" },
  body: readFileSync(r.request().url().endsWith("model.json") ? "pruef/model.json" : "pruef/app_data.json", "utf8") }));

await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("nav button");
await page.getByRole("button", { name: "MATCHUP" }).click();
await page.waitForTimeout(400);

// Woche 3 waehlen: dort ist "Verletzungen" Haupttreiber mit niedrigem Vertrauen
await page.getByRole("button", { name: "3", exact: true }).click();
await page.waitForTimeout(300);
const opts = await page.$$eval("select option", (o) => o.map((x) => x.textContent));
const i = opts.findIndex((t) => t.includes("Atlanta"));
if (i >= 0) { await page.selectOption("select", String(i)); await page.waitForTimeout(400); }

console.log("Spiele in Woche 3:", opts.length, "| gewaehlt:", opts[i >= 0 ? i : 0]);
console.log("\n" + (await page.evaluate(() => document.body.innerText)).split("\n").slice(8).join("\n").slice(600, 1500));
await page.screenshot({ path: "pruef/matchup.png" });
console.log("\n" + (fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler."));
await browser.close(); srv.close();
