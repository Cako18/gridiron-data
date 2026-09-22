import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

// Kleiner lokaler Server - file:// scheitert an CORS
const srv = createServer((req, res) => {
  const p = req.url === "/" ? "/src/pruef/index.html" : req.url;
  try {
    const body = readFileSync(".." + p);
    res.writeHead(200, { "content-type": p.endsWith(".js") ? "text/javascript" : "text/html" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((r) => srv.listen(8099, r));

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 430, height: 1250 } });
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: "text/css", body: "" })); // Schriften: im Test-Container gesperrt

const fehler = [];
page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") fehler.push("console: " + m.text()); });

await page.route("**/raw.githubusercontent.com/**", (route) => {
  const u = route.request().url();
  const datei = u.endsWith("model.json") ? "pruef/model.json" : "pruef/app_data.json";
  route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { "access-control-allow-origin": "*" },
    body: readFileSync(datei, "utf8"),
  });
});

await page.goto("http://localhost:8099/src/pruef/index.html");
try {
  await page.waitForSelector("section", { timeout: 15000 });
} catch {
  console.log("--- kein <section>, Seiteninhalt: ---");
  console.log((await page.evaluate(() => document.body.innerText)).slice(0, 400));
}

const bericht = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    titel: document.querySelector("h1")?.innerText,
    tage: document.querySelectorAll("section").length,
    spiele: document.querySelectorAll("section > div").length,
    tabs: [...document.querySelectorAll("nav button")].map((b) => b.innerText + (b.disabled ? "*" : "")),
    bilanzzeile: (txt.match(/Woche \d+: Modell.*/) || [""])[0],
    ersteZeile: document.querySelector("section > div")?.innerText.replace(/\n/g, " | "),
  };
});
console.log(JSON.stringify(bericht, null, 2));
await page.screenshot({ path: "pruef/geruest.png" });
console.log(fehler.length ? "FEHLER:\n" + fehler.join("\n") : "Keine Konsolenfehler.");
await browser.close(); srv.close();
