/* eslint-disable @next/next/no-img-element -- esto lo dibuja next/og (Satori), no el
   navegador: next/image no aplica y <img> es lo que el generador entiende. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import sharp from "sharp";
import { formatCOP, getColeccion, getProduct, type Product } from "@/lib/products";

/**
 * La imagen que sale al compartir UNA ficha (WhatsApp, Instagram, X…).
 *
 * Antes toda ficha compartida mostraba la misma og.png de la marca, con el
 * título genérico y el enlace al home: quien recibía el enlace no veía la
 * camisa hasta abrirlo. Ahora ve la prenda, el nombre y el precio en el propio
 * chat, que es donde se decide si se abre.
 *
 * Mismo lenguaje que el sitio: la selva de cemento oscurecida de fondo, Anton
 * para el nombre, Space Mono para lo demás y la casilla beige del catálogo. En
 * las estampadas va la ESPALDA, que es donde vive el gráfico; en las básicas,
 * el frente.
 *
 * Las fuentes son las mismas del sitio en TTF (`assets/fonts`, ver su README):
 * el generador de Next no lee woff2.
 */

const TAMANO = { width: 1200, height: 630 };

// Lo que no depende de la pieza se lee una vez, al cargar el módulo.
const raiz = process.cwd();
const [anton, monoBold, monoRegular, logo, selva] = await Promise.all([
  readFile(join(raiz, "assets/fonts/Anton-Regular.ttf")),
  readFile(join(raiz, "assets/fonts/SpaceMono-Bold.ttf")),
  readFile(join(raiz, "assets/fonts/SpaceMono-Regular.ttf")),
  readFile(join(raiz, "public/brand/logo-cream.png")),
  readFile(join(raiz, "public/brand/jungle/concrete-jungle.webp")),
]);
/**
 * WebP → JPEG antes de dibujar. Las fotos del sitio son WebP, y el generador de
 * next/og RECONOCE el formato (lee el tamaño) pero no lo pinta: sale el hueco
 * vacío, sin ningún error. Lo convierte sharp, el mismo que usa Next para
 * optimizar imágenes.
 */
async function aJpeg(webp: Buffer, ancho: number, alto: number) {
  const jpeg = await sharp(webp).resize({ width: ancho, height: alto, fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
const selvaSrc = await aJpeg(selva, 1200, 630);

const TINTA = "#1e2021";
const PAPIRO = "#f3e9e2";
const ORO = "#cda214";
const CASILLA = "#eceae6";

/**
 * Sale en JPEG, no en el PNG de next/og: con la foto de fondo el PNG pesaba
 * unos 850 KB, y WhatsApp se salta las vistas previas pesadas. En JPEG queda
 * en una fracción de eso.
 */
async function enJpeg(respuesta: ImageResponse) {
  const png = Buffer.from(await respuesta.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  return [
    {
      id: "ficha",
      size: TAMANO,
      contentType: "image/jpeg",
      alt: p ? `${p.name}, ${p.colorway}: camisa de Babuinos Inc` : "Babuinos Inc",
    },
  ];
}

/** La foto de la casilla: la espalda si es estampada, el frente si es básica. */
function fotoDe(p: Product): { ruta: string; cara: string } {
  if (p.category === "estampada" && p.images[0]) return { ruta: p.images[0], cara: "Espalda" };
  return { ruta: p.image, cara: "Frente" };
}

/** Anton es condensada, pero un nombre de 23 letras igual no cabe a 112 px. */
function tamanoNombre(nombre: string) {
  if (nombre.length <= 12) return 112;
  if (nombre.length <= 18) return 96;
  return 84;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);

  const fuentes = [
    { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
    { name: "Space Mono", data: monoRegular, weight: 400 as const, style: "normal" as const },
    { name: "Space Mono", data: monoBold, weight: 700 as const, style: "normal" as const },
  ];

  const fondo = (
    <>
      <img
        alt=""
        src={selvaSrc}
        width={TAMANO.width}
        height={TAMANO.height}
        style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: TAMANO.width,
          height: TAMANO.height,
          backgroundImage:
            "linear-gradient(90deg, rgba(10,15,13,0.94) 0%, rgba(10,15,13,0.82) 52%, rgba(10,15,13,0.6) 100%)",
        }}
      />
    </>
  );

  // Una ruta que no es pieza: la imagen de la marca, para no devolver un error.
  if (!p) {
    return enJpeg(
      new ImageResponse(
        (
          <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", alignItems: "center", justifyContent: "center", background: TINTA }}>
            {fondo}
            <img alt="" src={logoSrc} width={530} height={240} />
          </div>
        ),
        { ...TAMANO, fonts: fuentes },
      ),
    );
  }

  const foto = fotoDe(p);
  // La carpeta va ESCRITA y solo el nombre del archivo es variable. Con
  // `join(raiz, "public", foto.ruta)` el rastreador de archivos de Next no sabe
  // qué se va a leer y mete TODO `public` en la función (música y videos
  // incluidos). Las fotos de prenda de las 24 piezas viven en esta carpeta.
  const fotoData = await readFile(join(raiz, "public/brand/products", basename(foto.ruta)));
  // Las fotos de prenda son cuadradas: a 860 px quedan nítidas en la casilla de 470.
  const fotoSrc = await aJpeg(fotoData, 860, 860);
  const coleccion = getColeccion(p.coleccion);
  // En las básicas el nombre ES el color ("Arena Páramo"), así que debajo va
  // la etiqueta; en las estampadas, el corte y el color de la prenda.
  const corte = p.tag.split("·")[0]?.trim() || "Oversize";
  const debajo = p.category === "basica" ? p.tag : `${corte} · ${p.colorway}`;

  return enJpeg(new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: TINTA,
          fontFamily: "Space Mono",
        }}
      >
        {fondo}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: TAMANO.width,
            height: TAMANO.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "56px 64px",
          }}
        >
          {/* Izquierda: marca, colección, nombre, color y precio */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: 560 }}>
            <img alt="" src={logoSrc} width={150} height={68} />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 5, color: ORO, textTransform: "uppercase" }}>
                {`Colección ${coleccion.label}`}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 14,
                  fontFamily: "Anton",
                  fontSize: tamanoNombre(p.name),
                  // En Anton las mayúsculas con tilde suben mucho: con el
                  // interlineado normal, la de "PÁRAMO" se montaba sobre la R
                  // de "ARENA". Solo esos nombres llevan el aire extra.
                  lineHeight: /[ÁÉÍÓÚÑ]/i.test(p.name) ? 1.18 : 1.04,
                  color: PAPIRO,
                  textTransform: "uppercase",
                }}
              >
                {/* "Free Palestine · Victoria": el punto medio quedaba al final
                    de la primera línea y se leía como un guion. Se parte ahí. */}
                {p.name.split(" · ").map((parte) => (
                  <div key={parte} style={{ display: "flex" }}>
                    {parte}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", marginTop: 18, fontSize: 24, color: "rgba(243,233,226,0.78)" }}>
                {debajo}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              {typeof p.price === "number" && (
                <div
                  style={{
                    display: "flex",
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: ORO,
                    color: TINTA,
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {formatCOP(p.price)}
                </div>
              )}
              <div style={{ display: "flex", marginLeft: 22, fontSize: 20, color: "rgba(243,233,226,0.6)" }}>
                babuinos-inc.vercel.app
              </div>
            </div>
          </div>

          {/* Derecha: la prenda en la casilla del catálogo. La foto ocupa la
              casilla ENTERA: más chica, su fondo y el de la casilla no
              coincidían del todo y se veía un cuadrado más claro adentro. */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: 470,
              height: 470,
              borderRadius: 28,
              overflow: "hidden",
              background: CASILLA,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            <img alt="" src={fotoSrc} width={470} height={470} style={{ objectFit: "cover" }} />
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: 22,
                bottom: 20,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(30,32,33,0.08)",
                color: "rgba(30,32,33,0.7)",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {foto.cara}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...TAMANO, fonts: fuentes },
  ));
}
