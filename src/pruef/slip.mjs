import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { const p = q.url === "/" ? "/src/pruef/index.html" : q.url;
  try { r.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(readFileSync(".." + p)); }
  catch { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await br.newPage({ viewport: { width: 430, height: 1500 } });
const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push("console: " + m.text()); });
await page.route("**/raw.githubusercontent.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: readFileSync(r.request().url().endsWith("model.json") ? "pruef/model.json" : "pruef/app_data.json", "utf8") }));
await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("nav button");
await page.getByRole("button", { name: "TIPPSCHEIN" }).click();
await page.waitForTimeout(400);
console.log("### vor der Auswahl ###");
console.log((await page.evaluate(() => document.body.innerText)).split("\n").slice(7).join("\n").slice(0, 700));
await page.getByRole("button", { name: "3", exact: true }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "2 Aussenseiter + 4 Favoriten" }).click();
await page.waitForTimeout(400);
console.log("\n### Woche 3, nach 2+4 ###");
console.log((await page.evaluate(() => document.body.innerText)).split("\n").slice(7).join("\n").slice(0, 800));
await page.screenshot({ path: "pruef/slip.png" });
console.log("\n" + (fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler."));
await br.close(); srv.close();
