# Fuentes para las imágenes de compartir

Las usa `src/app/producto/[slug]/opengraph-image.tsx`. Son las mismas del sitio
(Anton y Space Mono), pero en **TTF**: el generador de imágenes de Next
(`next/og`) solo lee TTF, OTF o WOFF, y `next/font` las baja en WOFF2.

Se sacaron el 19-oct-2026 del subconjunto latino que `next/font/google` ya había
bajado a `.next/static/media`, convertidas con fontTools (`flavor = None`). Por
eso cubren lo que hace falta en español (tildes, ñ, ¿, ·, —) y nada más.

| Archivo | Fuente | Licencia |
| --- | --- | --- |
| `Anton-Regular.ttf` | Anton — © 2020 The Anton Project Authors | SIL Open Font License 1.1 |
| `SpaceMono-Bold.ttf` | Space Mono — © 2016 The Space Mono Project Authors | SIL Open Font License 1.1 |
| `SpaceMono-Regular.ttf` | Space Mono — © 2016 The Space Mono Project Authors | SIL Open Font License 1.1 |

El aviso de copyright y el enlace a la licencia van dentro de cada archivo (tabla
`name`). Texto de la licencia: https://openfontlicense.org
