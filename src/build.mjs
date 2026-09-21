/* Baut nfl-predictor.jsx zu einem eigenstaendigen Bundle.
 *
 *   node build.mjs            -> ../app_next.js   (Probe, nicht verlinkt)
 *   node build.mjs app27.js   -> ../app27.js      (scharf)
 *
 * Der Dateiname wechselt bei jeder Version absichtlich: Safari haelt
 * gleichnamige Bundles hartnaeckig im Cache. index.html muss dann auf den
 * neuen Namen zeigen.
 */
import { build } from "esbuild";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const ziel = process.argv[2] || "app_next.js";

const res = await build({
  entryPoints: [resolve(hier, "nfl-predictor.jsx")],
  outfile: resolve(hier, "..", ziel),
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
  jsx: "automatic",          // ohne das fehlt React zur Laufzeit
  logLevel: "info",
  metafile: true,
});

const bytes = Object.values(res.metafile.outputs)[0].bytes;
console.log(`\n${ziel}: ${(bytes / 1024).toFixed(0)} kB`);
console.log("Wenn scharf gebaut: index.html auf den neuen Dateinamen zeigen lassen.");
