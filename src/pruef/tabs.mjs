import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const srv = createServer((req, res) => {
  const p = req.url === "/" ? "/src/pruef/index.html" : req.url;
  try {
    const body = readFileSync(".." + p);
    res.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(8099, r));

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 430, height: 1400 } });
const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("favicon")) fehler.push("console: " + m.text()); });

await page.route("**/raw.githubusercontent.com/**", (route) => route.fulfill({
  status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" },
  body: readFileSync(route.request().url().endsWith("model.json") ? "pruef/model.json" : "pruef/app_data.json", "utf8"),
}));

await page.goto("http://localhost:8099/src/pruef/index.html");
await page.waitForSelector("section, div[style*='marginBottom']", { timeout: 15000 });

for (const [label, datei] of [["VEGAS-DUELL", "duell"], ["ELO-RANKING", "elo"]]) {
  await page.getByRole("button", { name: label }).click();
  await page.waitForTimeout(350);
  const info = await page.evaluate(() => ({
    zeilen: document.querySelectorAll("main div[style*='border-radius: 8px']").length,
    text: document.body.innerText.slice(0, 800),
  }));
  console.log(`\n########## ${label} — ${info.zeilen} Kacheln/Zeilen ##########`);
  console.log(info.text.split("\n").slice(3).join("\n").slice(0, 700));
  await page.screenshot({ path: `pruef/${datei}.png` });
}
console.log("\n" + (fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler."));
await browser.close(); srv.close();
