import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { let b; try { b = readFileSync(".." + q.url.split("?")[0]); } catch { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "content-type": q.url.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(b); });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const datei of ["pruef/app_data.json", "pruef/app_data_ki.json"]) {
  const page = await br.newPage({ viewport: { width: 430, height: 1400 } });
  const fehler = []; page.on("pageerror", (e) => fehler.push(e.message));
  await page.route("**/raw.githubusercontent.com/**", (r) => { const u = r.request().url();
    const f = u.endsWith("model.json") ? "pruef/model.json" : u.endsWith("ai_context.json") ? "pruef/ai_context.json"
      : u.endsWith(".csv") ? "pruef/elo_history.csv" : datei;
    r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, body: readFileSync(f, "utf8") }); });
  await page.goto("http://localhost:8099/src/pruef/index.html");
  await page.getByRole("button", { name: "Vegas-Duell", exact: true }).click();
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => document.querySelector("main").innerText);
  const i = t.indexOf("MODELL GEGEN MODELL+KI");
  console.log(`### ${datei}\n` + t.slice(i, i + 420).replace(/\n+/g, " | ") + (fehler.length ? "\nFEHLER " + fehler : ""));
  await page.close();
}
await br.close(); srv.close();
