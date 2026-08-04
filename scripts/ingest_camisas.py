"""
BABUINOS INC — Ingesta de la Colección Fundadores + Básicas.

Toma las carpetas que dejó Juan en MATERIAL/Camisas y produce todos los assets:

    <grilla 3x2>  ->  public/brand/models/<slug>/<genero>-<angulo>.webp   (6)
    <prenda sola> ->  public/brand/products/<slug>-{espalda,frente}.webp  (2)

Cada pieza trae DOS archivos y el sufijo no dice cuál es cuál (en BASICAS el
"N.png" es la grilla, en Fundadores es la prenda), así que se clasifican por
PROPORCIÓN: ~1.25 = grilla de modelos, ~1.78 = prenda sola.

En la prenda sola el orden izquierda/derecha tampoco es fijo. Se probó deducirlo
por cobertura de tinta y por profundidad del escote, pero ninguna sirve: en las
prendas negras y lavadas la sombra de la tela pesa más que el estampado. Como es
una ingesta de UNA vez, el lado va en la tabla ESPALDA_IZQ, revisado a ojo sobre
las láminas.

    py scripts/ingest_camisas.py [--dry-run]
"""

import glob
import os
import sys

from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

RAIZ = os.path.join(os.path.dirname(__file__), "..")
FUENTE = os.path.join(RAIZ, "MATERIAL", "Camisas")
OUT_MODELS = os.path.join(RAIZ, "public", "brand", "models")
OUT_PRODUCTS = os.path.join(RAIZ, "public", "brand", "products")

W, H = 900, 1125          # 4:5 para las fotos de modelo
PW, PH = 1000, 1000       # 1:1 para la prenda sola
CREMA = "#ECEAE6"
Q = 82

CALLE = 246
MIN_BANDA = 0.04

# número de archivo -> slug
BASICAS = {
    1: "base-teal-expedicion",
    2: "base-tinta-explorador",
    3: "base-pardo-tostado",
    4: "base-ocre-dorado",
    5: "base-papiro",
}
FUNDADORES = {
    1: "wear-your-attitude",
    2: "guns-roses-red",
    3: "the-mills",
    4: "free-palestine",
    5: "rootwailer",
    6: "brave-dog",
    7: "babuinos-lila",
    8: "offline-pleasure",
    9: "asian-tengu-mask",
    10: "california-rasta-kid",
}

GENEROS = ["hombre", "mujer"]
ANGULOS = ["frontal", "lateral", "espalda"]

# Slugs cuya lámina de prenda trae la ESPALDA a la IZQUIERDA. El resto la trae a
# la derecha (frente-izquierda, espalda-derecha).
ESPALDA_IZQ = {"wear-your-attitude"}


def promedios(gris, horizontal):
    w, h = gris.size
    tira = gris.resize((w, 1) if horizontal else (1, h), Image.BOX)
    px = tira.load()
    return [px[i, 0] if horizontal else px[0, i] for i in range(w if horizontal else h)]


def bandas(gris, horizontal):
    vals = promedios(gris, horizontal)
    minimo = len(vals) * MIN_BANDA
    out, ini = [], None
    for i, v in enumerate(vals):
        if v < CALLE:
            if ini is None:
                ini = i
        elif ini is not None:
            if i - ini >= minimo:
                out.append((ini, i))
            ini = None
    if ini is not None and len(vals) - ini >= minimo:
        out.append((ini, len(vals)))
    return out


def partes_iguales(largo, n):
    paso = largo / n
    borde = max(1, round(paso * 0.01))
    return [(round(i * paso) + borde, round((i + 1) * paso) - borde) for i in range(n)]


def normalizar(tile, w, h, dest):
    tile = tile.convert("RGBA")
    escala = min(w / tile.width, h / tile.height)
    size = (max(1, round(tile.width * escala)), max(1, round(tile.height * escala)))
    fg = tile.resize(size, Image.LANCZOS)
    lienzo = Image.new("RGB", (w, h), CREMA)
    lienzo.paste(fg, ((w - size[0]) // 2, (h - size[1]) // 2), fg)
    lienzo.save(dest, "WEBP", quality=Q, method=6)
    return os.path.getsize(dest) // 1024


def clasificar(carpeta):
    """{numero: {"grilla": ruta, "plana": ruta}} por proporción, no por nombre."""
    out = {}
    for f in glob.glob(os.path.join(carpeta, "*.png")):
        num = int(os.path.basename(f).split(".")[0])
        with Image.open(f) as im:
            tipo = "plana" if im.width / im.height > 1.5 else "grilla"
        out.setdefault(num, {})[tipo] = f
    return out


def cortar_grilla(src, slug, dry):
    dest_dir = os.path.join(OUT_MODELS, slug)
    if not dry:
        os.makedirs(dest_dir, exist_ok=True)
    with Image.open(src) as im:
        im = im.convert("RGB")
        gris = im.convert("L")
        cx = bandas(gris, True)
        cy = bandas(gris, False)
        aviso = ""
        if len(cx) != 3:
            cx = partes_iguales(im.width, 3)
            aviso += " [columnas por partes iguales]"
        if len(cy) != 2:
            cy = partes_iguales(im.height, 2)
            aviso += " [filas por partes iguales]"
        if dry:
            return f"6 recortes{aviso}"
        pesos = []
        for fila, (y0, y1) in enumerate(cy):
            for col, (x0, x1) in enumerate(cx):
                dest = os.path.join(dest_dir, f"{GENEROS[fila]}-{ANGULOS[col]}.webp")
                pesos.append(normalizar(im.crop((x0, y0, x1, y1)), W, H, dest))
        return f"6 fotos de modelo, {min(pesos)}-{max(pesos)} KB{aviso}"


def cortar_plana(src, slug, dry):
    if not dry:
        os.makedirs(OUT_PRODUCTS, exist_ok=True)
    with Image.open(src) as im:
        im = im.convert("RGB")
        cx = bandas(im.convert("L"), True)
        aviso = ""
        if len(cx) != 2:
            cx = partes_iguales(im.width, 2)
            aviso += " [mitades iguales]"
        izq = im.crop((cx[0][0], 0, cx[0][1], im.height))
        der = im.crop((cx[1][0], 0, cx[1][1], im.height))
        lado = "izq" if slug in ESPALDA_IZQ else "der"
        espalda, frente = (izq, der) if lado == "izq" else (der, izq)
        if dry:
            return f"espalda={lado}{aviso}"
        a = normalizar(espalda, PW, PH, os.path.join(OUT_PRODUCTS, f"{slug}-espalda.webp"))
        b = normalizar(frente, PW, PH, os.path.join(OUT_PRODUCTS, f"{slug}-frente.webp"))
        return f"prenda sola: espalda {a} KB ({lado}) + frente {b} KB{aviso}"


def main():
    dry = "--dry-run" in sys.argv
    print(f"\n  BABUINOS · ingesta de camisas{'  (simulación)' if dry else ''}\n")

    for carpeta, mapa, etiqueta in [
        ("BASICAS", BASICAS, "Básicas"),
        ("Coleccion Fundadores", FUNDADORES, "Fundadores"),
    ]:
        ruta = os.path.join(FUENTE, carpeta)
        if not os.path.isdir(ruta):
            print(f"  falta la carpeta {ruta}")
            continue
        encontrados = clasificar(ruta)
        print(f"  ── {etiqueta} ──")
        for num in sorted(mapa):
            slug = mapa[num]
            par = encontrados.get(num, {})
            if "grilla" not in par or "plana" not in par:
                print(f"  ! {num:2d} {slug:24s} incompleto: {sorted(par)}")
                continue
            g = cortar_grilla(par["grilla"], slug, dry)
            p = cortar_plana(par["plana"], slug, dry)
            print(f"  + {num:2d} {slug:24s} {g}")
            print(f"       {' ':27s}{p}")
        print()


if __name__ == "__main__":
    main()
