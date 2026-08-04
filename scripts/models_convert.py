"""
BABUINOS INC — Conversión de una foto de modelo (motor Pillow).

Lo invoca scripts/models.mjs; no está pensado para correrse a mano.
Escala la foto para que quepa en WxH, la centra sobre un lienzo del color
dado (aplanando la transparencia) y guarda WebP.

    py scripts/models_convert.py <src> <dest> <W> <H> <#RRGGBB> <quality>
"""

import sys

from PIL import Image


def main() -> int:
    src, dest, w, h, color, quality = sys.argv[1:7]
    w, h, quality = int(w), int(h), int(quality)

    with Image.open(src) as im:
        im = im.convert("RGBA")

        # Cabe completa dentro del lienzo, sin recortar ni deformar.
        scale = min(w / im.width, h / im.height)
        size = (max(1, round(im.width * scale)), max(1, round(im.height * scale)))
        fg = im.resize(size, Image.LANCZOS)

        canvas = Image.new("RGB", (w, h), color)
        # La máscara alfa hace de recorte: el fondo crema queda donde la foto es transparente.
        canvas.paste(fg, ((w - size[0]) // 2, (h - size[1]) // 2), fg)
        canvas.save(dest, "WEBP", quality=quality, method=6)

    return 0


if __name__ == "__main__":
    sys.exit(main())
