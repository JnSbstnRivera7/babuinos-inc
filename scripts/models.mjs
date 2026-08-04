#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Normalizador de fotos de modelo

   Toma las fotos crudas (camisa puesta) y las deja listas para la
   tienda: 4:5, 900x1125, WebP, fondo crema, sin canal alfa.

     entrada  MATERIAL/models-in/<Colorway> - <Género> <Ángulo>.png
     salida   public/brand/models/<slug>/<genero>-<angulo>.webp

   Uso:
     npm run models                     # procesa MATERIAL/models-in
     npm run models -- <carpeta>        # otra carpeta de entrada
     npm run models -- --dry-run        # solo dice qué haría
     npm run models -- --force          # rehace las que ya existen
     npm run models -- --out <carpeta>  # escribe en otro lado (para probar)

   Los nombres se leen sin importar acentos, mayúsculas ni separadores:
   "Lila Manada - Hombre Frontal.png", "lila_hombre_frente.jpg" y
   "lila-manada hombre espalda.png" son todos válidos.

   MODO LÁMINA (--grid): si tienes las 6 fotos en UNA sola imagen —la típica
   cuadrícula de 3 columnas (frontal/lateral/espalda) × 2 filas (hombre/mujer)—
   basta nombrar el archivo con la pieza y correr:

     npm run models -- --grid

   El archivo "Negro Attitude.png" sale partido en las 6 de negro-attitude. Se
   corta buscando las calles blancas entre fotos, no en partes iguales, así que
   aguanta márgenes desiguales. Otra cuadrícula: --grid 2x3.
   ════════════════════════════════════════════════════════════ */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

/* ─── Formato de salida (igual al del set original) ─── */
const W = 900;
const H = 1125; // 4:5
const CREAM = "#ECEAE6"; // Papiro, el fondo de estudio de la marca
const QUALITY = 82;

const ROOT = path.resolve(import.meta.dirname, "..");
const DEFAULT_IN = path.join(ROOT, "MATERIAL", "models-in");
const DEFAULT_OUT = path.join(ROOT, "public", "brand", "models");

const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".bmp"]);

/* ─── Vocabulario: cómo se llaman las cosas en los archivos crudos ─── */

/** slug del producto → alias que pueden aparecer en el nombre del archivo */
const SLUG_ALIASES = {
  "lila-manada": ["lila manada", "lila", "lilac", "lila polvo"],
  "marfil-expedicion": ["marfil expedicion", "marfil", "white", "blanco", "ivory"],
  "negro-tono": ["negro tono", "negro tonal", "black tonal", "tonal"],
  "gris-heritage": ["gris heritage", "gris", "gris jaspe", "grey gold", "grey"],
  "negro-oro": ["negro oro", "negro dorado", "black gold", "oro"],
};

const GENERO_ALIASES = {
  hombre: ["hombre", "hombres", "male", "man", "men", "h", "m-h"],
  mujer: ["mujer", "mujeres", "female", "woman", "women", "fem", "f"],
};

const ANGULO_ALIASES = {
  frontal: ["frontal", "frente", "front", "delante", "adelante"],
  lateral: ["lateral", "lado", "side", "perfil"],
  espalda: ["espalda", "atras", "back", "detras", "posterior", "trasera"],
};

const ANGULOS = Object.keys(ANGULO_ALIASES);
const GENEROS = Object.keys(GENERO_ALIASES);

/* ─── Utilidades ─── */

/** Minúsculas, sin acentos, separadores a espacio. "Lila_Manada-Frente" → "lila manada frente" */
function normalize(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Busca el alias más largo que aparezca en el texto (el más largo gana: "negro oro" antes que "negro"). */
function matchAlias(text, table) {
  let best = null;
  let bestLen = 0;
  for (const [key, aliases] of Object.entries(table)) {
    for (const alias of [key, ...aliases]) {
      const a = normalize(alias);
      const re = new RegExp(`(^|\\s)${a.replace(/\s+/g, "\\s+")}($|\\s)`);
      if (re.test(text) && a.length > bestLen) {
        best = key;
        bestLen = a.length;
      }
    }
  }
  return best;
}

function parseName(file) {
  const text = normalize(path.parse(file).name);
  return {
    slug: matchAlias(text, SLUG_ALIASES),
    genero: matchAlias(text, GENERO_ALIASES),
    angulo: matchAlias(text, ANGULO_ALIASES),
  };
}

/* ─── Motor de conversión ───────────────────────────────────
   Pillow es el que hizo el set original y respeta 900x1125 exacto.
   ffmpeg queda como respaldo, pero su encoder webp exige altura PAR y
   recorta 1125 → 1124 (un píxel; los assets quedarían desparejos). ───── */

const PY_HELPER = path.join(import.meta.dirname, "models_convert.py");
const PY_GRID = path.join(import.meta.dirname, "models_grid.py");

/** Primer lanzador de Python que tenga Pillow, o null. */
function findPython() {
  const cands = process.platform === "win32" ? ["py", "python", "python3"] : ["python3", "python"];
  for (const cmd of cands) {
    const r = spawnSync(cmd, ["-c", "import PIL"], { windowsHide: true, stdio: "ignore" });
    if (r.status === 0) return cmd;
  }
  return null;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { windowsHide: true });
    let err = "";
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${path.basename(cmd)} salió con ${code}: ${err.trim()}`))
    );
  });
}

/** Igual que run(), pero devuelve el stdout (el modo lámina reporta cada recorte). */
function runCapturando(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { windowsHide: true });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d.toString()));
    p.stderr.on("data", (d) => (err += d.toString()));
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${path.basename(cmd)} salió con ${code}: ${err.trim()}`))
    );
  });
}

/** Escala la foto para que quepa en WxH y la centra sobre lienzo crema (aplana la transparencia). */
function convert(src, dest, engine) {
  if (engine.kind === "pillow") {
    return run(engine.cmd, [PY_HELPER, src, dest, String(W), String(H), CREAM, String(QUALITY)]);
  }
  return run(ffmpeg, [
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-f", "lavfi",
    "-i", `color=c=${CREAM.replace("#", "0x")}:s=${W}x${H}`,
    "-i", src,
    "-filter_complex",
    `[1:v]scale=${W}:${H}:force_original_aspect_ratio=decrease[fg];` +
      `[0:v][fg]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[out]`,
    "-map", "[out]",
    "-frames:v", "1",
    "-c:v", "libwebp",
    "-quality", String(QUALITY),
    "-compression_level", "6",
    dest,
  ]);
}

const kb = (f) => `${Math.round(statSync(f).size / 1024)} KB`;

/** Ruta corta si está dentro del repo; absoluta si no (para no imprimir "../../Users/..."). */
function show(p) {
  const rel = path.relative(ROOT, p);
  return rel.startsWith("..") ? p : rel.replace(/\\/g, "/");
}

/* ─── Modo lámina: una imagen con toda la cuadrícula por pieza ─── */

const FILAS = "hombre,mujer";
const COLUMNAS = "frontal,lateral,espalda";

async function modoLamina({ files, inDir, OUT_ROOT, gridSize, engine, dryRun, force }) {
  const [cols, rows] = gridSize.split("x").map(Number);

  if (engine.kind !== "pillow") {
    console.error(`  El modo lámina necesita Pillow:  py -m pip install pillow\n`);
    process.exit(1);
  }

  const generos = FILAS.split(",").slice(0, rows);
  const angulos = COLUMNAS.split(",").slice(0, cols);
  console.log(`  Lámina ${cols}×${rows} → filas ${generos.join("/")} · columnas ${angulos.join("/")}\n`);

  let hechas = 0;
  for (const file of files) {
    /* El nombre del archivo solo tiene que decir la PIEZA. */
    const slug = matchAlias(normalize(path.parse(file).name), SLUG_ALIASES);
    if (!slug) {
      console.log(`  ! ${file}  —  no reconocí la pieza`);
      continue;
    }
    const dir = path.join(OUT_ROOT, slug);
    const yaEstan = generos.every((g) => angulos.every((a) => existsSync(path.join(dir, `${g}-${a}.webp`))));
    if (yaEstan && !force) {
      console.log(`  = ${file}  →  ${show(dir)}/  (ya están las ${rows * cols}, usa --force)`);
      continue;
    }
    if (dryRun) {
      console.log(`  · ${file}  →  ${show(dir)}/  (${rows * cols} recortes)`);
      continue;
    }

    mkdirSync(dir, { recursive: true });
    const salida = await runCapturando(engine.cmd, [
      PY_GRID, path.join(inDir, file), dir,
      String(cols), String(rows), String(W), String(H), CREAM, String(QUALITY),
      generos.join(","), angulos.join(","),
    ]);
    console.log(`  + ${file}  →  ${show(dir)}/`);
    for (const linea of salida.trim().split("\n").filter(Boolean)) {
      const [nombre, medida] = linea.split(" ");
      if (nombre === "aviso:") console.log(`      ${linea}`);
      else console.log(`      ${nombre}.webp   recorte ${medida}   ${kb(path.join(dir, nombre + ".webp"))}`);
    }
    hechas++;
  }

  console.log(`\n  ${dryRun ? "Simulación" : "Listo"}: ${hechas} lámina(s) de ${files.length}\n`);
}

/* ─── Programa ─── */

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const force = argv.includes("--force");

  const outFlag = argv.indexOf("--out");
  const OUT_ROOT = outFlag === -1 ? DEFAULT_OUT : path.resolve(argv[outFlag + 1] ?? DEFAULT_OUT);

  /* --grid [CxR]: cada imagen es una lámina con las 6 fotos. */
  const gridFlag = argv.indexOf("--grid");
  const gridArg = gridFlag === -1 ? null : (argv[gridFlag + 1] ?? "");
  const gridSize = /^\d+x\d+$/.test(gridArg ?? "") ? gridArg : gridFlag === -1 ? null : "3x2";

  /* Los valores de --out y --grid no son carpeta de entrada. */
  const consumidos = new Set([outFlag + 1, gridSize === gridArg ? gridFlag + 1 : -1]);
  const positional = argv.filter((a, i) => !a.startsWith("--") && !consumidos.has(i));
  const inDir = path.resolve(positional[0] ?? DEFAULT_IN);

  const py = findPython();
  const engine = py ? { kind: "pillow", cmd: py } : { kind: "ffmpeg" };

  console.log(`\n  BABUINOS · fotos de modelo → ${W}x${H} WebP sobre crema\n`);

  if (engine.kind === "ffmpeg") {
    console.log(`  Aviso: sin Pillow, uso ffmpeg y la altura queda en ${H - 1} (impar no soportada).`);
    console.log(`  Para que calcen con las fotos ya publicadas:  py -m pip install pillow\n`);
  }

  if (!existsSync(inDir)) {
    console.error(`  No existe la carpeta de entrada:\n    ${inDir}\n`);
    console.error(`  Crea MATERIAL/models-in y mete ahí las fotos, o pasa la ruta:`);
    console.error(`    npm run models -- "C:/ruta/a/las/fotos"\n`);
    process.exit(1);
  }

  const files = readdirSync(inDir).filter((f) => EXTS.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.error(`  No hay imágenes en ${inDir}\n`);
    process.exit(1);
  }

  console.log(`  Entrada: ${inDir}  (${files.length} imágenes)\n`);

  if (gridSize) {
    await modoLamina({ files, inDir, OUT_ROOT, gridSize, engine, dryRun, force });
    return;
  }

  const jobs = [];
  const skipped = [];

  for (const file of files) {
    const { slug, genero, angulo } = parseName(file);
    if (!slug || !genero || !angulo) {
      const falta = [!slug && "pieza", !genero && "género", !angulo && "ángulo"]
        .filter(Boolean)
        .join(" + ");
      skipped.push({ file, why: `no reconocí ${falta}` });
      continue;
    }
    jobs.push({
      file,
      src: path.join(inDir, file),
      dest: path.join(OUT_ROOT, slug, `${genero}-${angulo}.webp`),
      slug,
      genero,
      angulo,
    });
  }

  /* Dos fotos que apuntan al mismo destino = nombres ambiguos, mejor avisar. */
  const byDest = new Map();
  for (const j of jobs) {
    if (!byDest.has(j.dest)) byDest.set(j.dest, []);
    byDest.get(j.dest).push(j.file);
  }
  const clashes = [...byDest.entries()].filter(([, f]) => f.length > 1);

  let done = 0;
  const touchedSlugs = new Set();

  for (const j of jobs) {
    const rel = show(j.dest);
    const dup = byDest.get(j.dest).length > 1;

    if (dup) {
      console.log(`  ! ${j.file}  →  ${rel}   (choca con otra foto, se salta)`);
      continue;
    }
    if (existsSync(j.dest) && !force) {
      console.log(`  = ${j.file}  →  ${rel}   (ya existe, usa --force para rehacer)`);
      touchedSlugs.add(j.slug);
      continue;
    }
    if (dryRun) {
      console.log(`  · ${j.file}  →  ${rel}`);
      touchedSlugs.add(j.slug);
      continue;
    }

    mkdirSync(path.dirname(j.dest), { recursive: true });
    await convert(j.src, j.dest, engine);
    console.log(`  + ${j.file}  →  ${rel}   ${kb(j.dest)}`);
    touchedSlugs.add(j.slug);
    done++;
  }

  /* ── Reporte ── */

  if (clashes.length) {
    console.log(`\n  Nombres ambiguos (dos fotos para el mismo destino):`);
    for (const [dest, fs] of clashes) {
      console.log(`    ${path.basename(path.dirname(dest))}/${path.basename(dest)}  ←  ${fs.join(" , ")}`);
    }
    console.log(`    Renombra siguiendo: "<Pieza> - <Género> <Ángulo>.png"`);
  }

  if (skipped.length) {
    console.log(`\n  Sin procesar (${skipped.length}):`);
    for (const s of skipped) console.log(`    ${s.file}  —  ${s.why}`);
    console.log(`\n    Piezas:   ${Object.keys(SLUG_ALIASES).join(", ")}`);
    console.log(`    Géneros:  ${GENEROS.join(", ")}`);
    console.log(`    Ángulos:  ${ANGULOS.join(", ")}`);
    console.log(`\n    ¿Pieza nueva? Agrégala a SLUG_ALIASES (arriba en este script) y`);
    console.log(`    declárala en PRODUCTS de src/lib/products.ts con models: modelSet("<slug>").`);
  }

  /* Un producto necesita las 6 (2 géneros × 3 ángulos) para que la PDP no quede coja.
     En simulación cuentan también las que se escribirían. */
  const planned = new Set(jobs.map((j) => j.dest));
  const incompletos = [];
  for (const slug of [...touchedSlugs].sort()) {
    const faltan = [];
    for (const g of GENEROS) {
      for (const a of ANGULOS) {
        const f = path.join(OUT_ROOT, slug, `${g}-${a}.webp`);
        if (!existsSync(f) && !planned.has(f)) faltan.push(`${g}-${a}`);
      }
    }
    if (faltan.length) incompletos.push({ slug, faltan });
  }

  if (incompletos.length) {
    console.log(`\n  Sets incompletos (la PDP espera 6: hombre/mujer × frontal/lateral/espalda):`);
    for (const i of incompletos) console.log(`    ${i.slug}  falta  ${i.faltan.join(", ")}`);
  }

  console.log(
    `\n  ${dryRun ? "Simulación" : "Listo"}: ${dryRun ? jobs.length : done} de ${files.length} · ${[...touchedSlugs].sort().join(", ") || "—"}\n`
  );
}

main().catch((e) => {
  console.error(`\n  Falló: ${e.message}\n`);
  process.exit(1);
});
