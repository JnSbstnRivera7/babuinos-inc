// Mide lo que de verdad se baja una página: cada petición por tipo, con los
// prefetch de los <Link> incluidos, en un Chrome sin ventana y con perfil
// limpio (sin caché ni service worker).
//
//   node scripts/medir-pagina.mjs https://babuinos-inc.vercel.app/tienda
//   node scripts/medir-pagina.mjs http://localhost:3061/tienda --escritorio
//
// Opciones: --escritorio (1440x900; por defecto un celular de 375x812),
// --segundos N (cuánto esperar, 12 por defecto), --scroll (baja la página
// mientras espera, para que entren más enlaces en pantalla).
//
// Por qué no el panel del navegador de Claude: está oculto y no corre frames,
// así que IntersectionObserver nunca dispara y Next no precarga nada. Ahí la
// tienda medía 605 KB de JS cuando un celular real se bajaba 870.
//
// Las cifras son en CRUDO (descomprimido), que es lo que el navegador tiene
// que leer. Ojo: el prefetch solo existe en producción (`next start` o Vercel);
// contra `next dev` no hay nada que medir.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.error("Uso: node scripts/medir-pagina.mjs <url> [--escritorio] [--segundos N] [--scroll]");
  process.exit(1);
}
const opcion = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const escritorio = args.includes("--escritorio");
const segundos = Number(opcion("--segundos", 12));
const scroll = args.includes("--scroll");
const [ancho, alto] = escritorio ? [1440, 900] : [375, 812];

const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const puerto = 9300 + Math.floor(Math.random() * 500);
const perfil = mkdtempSync(join(tmpdir(), "medir-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${puerto}`,
  `--user-data-dir=${perfil}`,
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  `--window-size=${ancho},${alto}`,
  "about:blank",
]);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try {
    const pags = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json();
    wsUrl = pags.find((p) => p.type === "page")?.webSocketDebuggerUrl;
  } catch {}
  if (!wsUrl) await espera(200);
}
if (!wsUrl) throw new Error("Chrome no abrió el puerto de depuración (¿está en la ruta de CHROME?)");

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pendientes = new Map();
const eventos = [];
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pendientes.has(msg.id)) {
    pendientes.get(msg.id)(msg.result);
    pendientes.delete(msg.id);
  } else if (msg.method) eventos.push(msg);
});
const cmd = (method, params = {}) =>
  new Promise((r) => {
    const i = ++id;
    pendientes.set(i, r);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await cmd("Network.enable");
await cmd("Page.enable");
await cmd("Network.setCacheDisabled", { cacheDisabled: true });
await cmd("Emulation.setDeviceMetricsOverride", {
  width: ancho,
  height: alto,
  deviceScaleFactor: escritorio ? 1 : 2,
  mobile: !escritorio,
});
if (!escritorio) {
  await cmd("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await cmd("Network.setUserAgentOverride", {
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  });
}

await cmd("Page.navigate", { url });
for (let s = 0; s < segundos; s++) {
  await espera(1000);
  if (scroll && s >= 3 && s < segundos - 2) {
    await cmd("Runtime.evaluate", { expression: "window.scrollBy(0, 700)" });
  }
}

// Juntar cada petición con lo que se descargó de ella.
const pedidos = new Map();
for (const { method, params: p } of eventos) {
  if (method === "Network.requestWillBeSent") {
    const h = p.request.headers;
    pedidos.set(p.requestId, {
      url: p.request.url,
      tipo: p.type,
      t: p.timestamp,
      rsc: Boolean(h.RSC || h.rsc),
      prefetch: Boolean(h["Next-Router-Prefetch"] || h["next-router-prefetch"]),
      bytes: 0,
    });
  } else if (method === "Network.responseReceived" && pedidos.has(p.requestId)) {
    pedidos.get(p.requestId).tipo = p.type;
  } else if (method === "Network.dataReceived" && pedidos.has(p.requestId)) {
    pedidos.get(p.requestId).bytes += p.dataLength;
  }
}
const lista = [...pedidos.values()].filter((r) => r.url.startsWith("http"));
const clase = (r) => (r.rsc ? (r.prefetch ? "RSC prefetch" : "RSC") : r.tipo);
const kb = (b) => (b / 1024).toFixed(1).padStart(8);

const totales = {};
for (const r of lista) {
  const k = clase(r);
  totales[k] ??= { n: 0, bytes: 0 };
  totales[k].n++;
  totales[k].bytes += r.bytes;
}
console.log(`\n${url}  (${escritorio ? "escritorio" : "celular"}, ${segundos} s${scroll ? ", con scroll" : ""})\n`);
console.log("tipo             pedidos   KB crudo");
for (const [k, v] of Object.entries(totales).sort((a, b) => b[1].bytes - a[1].bytes)) {
  console.log(`${k.padEnd(16)} ${String(v.n).padStart(7)} ${kb(v.bytes)}`);
}
const n = lista.length;
const total = lista.reduce((a, r) => a + r.bytes, 0);
console.log(`${"TOTAL".padEnd(16)} ${String(n).padStart(7)} ${kb(total)}`);

const t0 = Math.min(...lista.map((r) => r.t));
console.log("\nJS y RSC, en el orden en que llegaron:");
for (const r of lista.filter((r) => r.tipo === "Script" || r.rsc).sort((a, b) => a.t - b.t)) {
  const u = new URL(r.url);
  const ms = String(Math.round((r.t - t0) * 1000)).padStart(6);
  console.log(`  ${ms} ms  ${clase(r).padEnd(13)} ${kb(r.bytes)} KB  ${(u.pathname + u.search).slice(0, 70)}`);
}

ws.close();
chrome.kill();
await espera(400);
try {
  rmSync(perfil, { recursive: true, force: true });
} catch {}
process.exit(0);
