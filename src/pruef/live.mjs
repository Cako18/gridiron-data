import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const srv = createServer((q, r) => { const p = q.url === "/" ? "/src/pruef/index.html" : q.url;
  try { r.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" }); r.end(readFileSync(".." + p)); }
  catch { r.writeHead(404); r.end(); } });
await new Promise((r) => srv.listen(8099, r));
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await br.newPage({ viewport: { width: 430, height: 1500 } });
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" })); // Schriften: im Test-Container gesperrt
const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push("console: " + m.text()); });

await page.route("**/raw.githubusercontent.com/**", (r) => r.fulfill({ status: 200, contentType: "application/json",
  headers: { "access-control-allow-origin": "*" },
  body: readFileSync(r.request().url().endsWith("model.json") ? "pruef/model.json" : "pruef/app_data.json", "utf8") }));
await page.route("**/site.api.espn.com/**", (r) => {
  const datei = r.request().url().includes("/summary?") ? "pruef/espn_summary.json" : "pruef/espn_scoreboard.json";
  r.fulfill({ status: 200, contentType: "application/json",
    headers: { "access-control-allow-origin": "*" }, body: readFileSync(datei, "utf8") });
});

await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("nav button");
await page.getByRole("button", { name: "LIVE" }).click();
await page.waitForTimeout(1200);
const info = await page.evaluate(() => ({
  text: document.body.innerText,
  kurven: document.querySelectorAll("svg path").length,
  pfade: [...document.querySelectorAll("svg path")].map((p) => (p.getAttribute("d") || "").slice(0, 40)),
}));
console.log(info.text.split("\n").slice(7).join("\n").slice(0, 1200));
console.log("\nSVG-Pfade gerendert:", info.kurven);
await page.screenshot({ path: "pruef/live.png" });
console.log("\n" + (fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler."));
await br.close(); srv.close();
