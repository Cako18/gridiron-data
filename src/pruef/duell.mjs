import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { let b; try { b = readFileSync(".." + q.url.split("?")[0]); } catch { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "content-type": q.url.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(b); });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await br.newPage({ viewport: { width: 430, height: 2600 } });
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" })); // Schriften: im Test-Container gesperrt
const fehler = []; page.on("pageerror", (e) => fehler.push(e.message));
await page.route("**/raw.githubusercontent.com/**", (r) => { const u = r.request().url();
  const f = u.endsWith("model.json") ? "pruef/model.json" : u.endsWith("ai_context.json") ? "pruef/ai_context.json" : u.endsWith(".csv") ? "pruef/elo_history.csv" : "pruef/app_data.json";
  r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: readFileSync(f, "utf8") }); });
await page.goto("http://localhost:8099/src/pruef/index.html");
await page.getByRole("button", { name: "Matchup", exact: true }).click();
await page.waitForTimeout(500);
const lies = () => page.evaluate(() => { const s = [...document.querySelectorAll("section")].find((x) => x.innerText.includes("AUFSTELLUNGS-DUELL"));
  return s ? s.innerText.split("\n").filter(Boolean).slice(0, 9).join(" | ") : "nicht gefunden"; });
console.log("VORHER:  " + await lies());
await page.getByRole("button", { name: /Seiten tauschen/ }).click(); await page.waitForTimeout(200);
console.log("GETAUSCHT: " + await lies());
await page.getByRole("button", { name: /Seiten tauschen/ }).click();
const sec = await page.$("section:has-text('Aufstellungs-Duell')"); if (sec) await sec.screenshot({ path: "pruef/duell.png" });
console.log(fehler.length ? "FEHLER " + fehler : "Keine Konsolenfehler.");
await br.close(); srv.close();
