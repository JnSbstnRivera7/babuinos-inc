"""
BABUINOS INC — Parte una lámina de contactos en las 6 fotos de modelo.

Lo invoca scripts/models.mjs con --grid; no está pensado para correrse a mano.

Recibe una imagen con la cuadrícula (por defecto 3 columnas × 2 filas:
frontal/lateral/espalda × hombre/mujer), la corta y normaliza cada recorte al
mismo formato del resto de la tienda (WxH sobre fondo crema, sin alfa).

    py scripts/models_grid.py <src> <outdir> <cols> <rows> <W> <H> <#RRGGBB>
                              <quality> <filas> <columnas>

Los cortes NO se asumen en partes iguales: primero busca las calles blancas que
separan las fotos, porque las láminas suelen traer márgenes desiguales. Si no
encuentra tantas bandas como celdas esperadas, cae a división en partes iguales.
"""

import sys

from PIL import Image

# En Windows el stdout de Python no sale en UTF-8 y los avisos con acentos
# llegaban corruptos a models.mjs, que sí lee UTF-8.
sys.stdout.reconfigure(encoding="utf-8")

# Una calle entre fotos es casi blanco puro; el fondo de estudio es gris claro
# (~217), así que este umbral los distingue.
CALLE = 246
# Descarta bandas demasiado delgadas para ser una foto (ruido, bordes, líneas).
MIN_BANDA = 0.04


def promedios(gris: Image.Image, horizontal: bool) -> list[float]:
    """Promedio de cada columna (o fila) en una sola pasada en C."""
    w, h = gris.size
    tira = gris.resize((w, 1) if horizontal else (1, h), Image.BOX)
    px = tira.load()
    return [px[i, 0] if horizontal else px[0, i] for i in range(w if horizontal else h)]


def bandas(gris: Image.Image, horizontal: bool) -> list[tuple[int, int]]:
    """Tramos contiguos que NO son calle blanca, es decir las fotos."""
    vals = promedios(gris, horizontal)
    total = len(vals)
    minimo = total * MIN_BANDA
    out: list[tuple[int, int]] = []
    ini = None
    for i, v in enumerate(vals):
        if v < CALLE:
            if ini is None:
                ini = i
        elif ini is not None:
            if i - ini >= minimo:
                out.append((ini, i))
            ini = None
    if ini is not None and total - ini >= minimo:
        out.append((ini, total))
    return out


def partes_iguales(largo: int, n: int) -> list[tuple[int, int]]:
    paso = largo / n
    # 1% de recorte a cada lado, para no arrastrar la calle vecina.
    borde = max(1, round(paso * 0.01))
    return [(round(i * paso) + borde, round((i + 1) * paso) - borde) for i in range(n)]


def normalizar(tile: Image.Image, w: int, h: int, color: str, quality: int, dest: str) -> None:
    tile = tile.convert("RGBA")
    escala = min(w / tile.width, h / tile.height)
    size = (max(1, round(tile.width * escala)), max(1, round(tile.height * escala)))
    fg = tile.resize(size, Image.LANCZOS)
    lienzo = Image.new("RGB", (w, h), color)
    lienzo.paste(fg, ((w - size[0]) // 2, (h - size[1]) // 2), fg)
    lienzo.save(dest, "WEBP", quality=quality, method=6)


def main() -> int:
    src, outdir, cols, rows, w, h, color, quality, filas, columnas = sys.argv[1:11]
    cols, rows, w, h, quality = int(cols), int(rows), int(w), int(h), int(quality)
    generos = filas.split(",")
    angulos = columnas.split(",")

    with Image.open(src) as im:
        im = im.convert("RGB")
        gris = im.convert("L")

        cortes_x = bandas(gris, True)
        cortes_y = bandas(gris, False)
        # Solo confiamos en las calles si dan exactamente la cuadrícula esperada.
        if len(cortes_x) != cols:
            cortes_x = partes_iguales(im.width, cols)
            print(f"aviso: no hallé {cols} columnas por las calles, uso partes iguales")
        if len(cortes_y) != rows:
            cortes_y = partes_iguales(im.height, rows)
            print(f"aviso: no hallé {rows} filas por las calles, uso partes iguales")

        for fila, (y0, y1) in enumerate(cortes_y):
            for col, (x0, x1) in enumerate(cortes_x):
                dest = f"{outdir}/{generos[fila]}-{angulos[col]}.webp"
                normalizar(im.crop((x0, y0, x1, y1)), w, h, color, quality, dest)
                print(f"{generos[fila]}-{angulos[col]} {x1 - x0}x{y1 - y0}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
