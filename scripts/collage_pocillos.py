"""Junta los tres diseños de clientes en UNA imagen: tres láminas en zigzag,
un poco giradas y con sombra, sobre fondo transparente (lo pone la página).

Uso: py -I scripts/collage_pocillos.py   (desde la raíz del repo, o pasándole la ruta del repo)
Escribe public/brand/pocillos/disenos/collage.webp e imprime, en porcentaje,
la caja de cada lámina para los botones que abren cada diseño en grande.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

REPO = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETA = os.path.join(REPO, "public", "brand", "pocillos", "disenos")
# key, posición x de la lámina (0 = izquierda, 1 = derecha), giro en grados
LAMINAS = [("retrato-mascota", 0, -2.6), ("album-magico", 1, 2.2), ("collage-stickers", 0, -1.4)]

W = 1680          # ancho del lienzo
M = 46            # margen para el giro y la sombra
ANCHO = 980       # ancho de cada lámina
PASO = 0.64       # cuánto baja cada lámina, en altos de lámina (el resto se monta)
RADIO = 22

laminas = []
for key, lado, giro in LAMINAS:
    im = Image.open(os.path.join(CARPETA, f"{key}.webp")).convert("RGB")
    im = im.resize((ANCHO, round(im.height * ANCHO / im.width)), Image.LANCZOS)
    mascara = Image.new("L", im.size, 0)
    ImageDraw.Draw(mascara).rounded_rectangle([0, 0, im.width - 1, im.height - 1], RADIO, fill=255)
    tarjeta = im.convert("RGBA")
    tarjeta.putalpha(mascara)
    laminas.append((key, lado, giro, tarjeta))

alto_lamina = max(t.height for *_, t in laminas)
H = round(2 * M + alto_lamina * (1 + PASO * (len(laminas) - 1)))
lienzo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
zonas = []
for i, (key, lado, giro, tarjeta) in enumerate(laminas):
    girada = tarjeta.rotate(giro, resample=Image.BICUBIC, expand=True)
    cx = M + ANCHO / 2 if lado == 0 else W - M - ANCHO / 2
    cy = M + tarjeta.height / 2 + i * alto_lamina * PASO
    x, y = round(cx - girada.width / 2), round(cy - girada.height / 2)
    # Sombra: el contorno de la lámina, corrido hacia abajo y desenfocado.
    sombra = Image.new("RGBA", girada.size, (0, 0, 0, 0))
    sombra.putalpha(girada.getchannel("A").point(lambda a: a * 0.55))
    capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    capa.paste(sombra, (x, y + 16))
    capa = capa.filter(ImageFilter.GaussianBlur(18))
    lienzo = Image.alpha_composite(lienzo, capa)
    lienzo.alpha_composite(girada, (x, y))
    zonas.append((key, x, y, girada.width, girada.height))

salida = os.path.join(CARPETA, "collage.webp")
lienzo.save(salida, quality=84, method=6)
print(f"{W}x{H}  {os.path.getsize(salida) // 1024} KB")
for key, x, y, w, h in zonas:
    print(f'  {{ key: "{key}", x: {100 * x / W:.1f}, y: {100 * y / H:.1f}, w: {100 * w / W:.1f}, h: {100 * h / H:.1f} }},')
