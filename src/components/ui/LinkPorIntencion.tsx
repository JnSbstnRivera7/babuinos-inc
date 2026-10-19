"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";

/**
 * Un `<Link>` que precarga su ruta solo cuando hay INTENCIÓN de ir: el mouse
 * encima, el foco del teclado o el dedo que empieza a tocar. Nunca por el solo
 * hecho de aparecer en pantalla, que es lo que hace Next por defecto.
 *
 * Por qué existe: el logo del menú enlaza al home y está en pantalla en todas
 * las páginas, así que CADA visita a la tienda se bajaba el código del intro
 * —framer-motion, lenis y el hero, 188 KB— aunque nadie fuera a volver al
 * inicio. Con el corazón de favoritos y los enlaces de Nosotros/Club pasaba lo
 * mismo. Medido el 19-oct en producción: de los 870 KB de JS de /tienda en
 * celular, 219 eran precargas de rutas que casi nadie abre desde ahí.
 *
 * Regla de uso: va en la navegación general (menú, footer, migas) hacia rutas
 * FUERA de la tienda. Los enlaces a /tienda y a las fichas siguen con el
 * prefetch de siempre, porque ese es el camino de la compra y ahí la
 * navegación instantánea sí vale lo que pesa. Y los enlaces que solo aparecen
 * con un menú abierto tampoco lo necesitan: abrir el menú ya es intención.
 *
 * Es el patrón de la guía de prefetch de Next 16: `prefetch={false}` hasta el
 * primer gesto y el comportamiento normal después.
 */
export function LinkPorIntencion({
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [conIntencion, setConIntencion] = useState(false);

  return (
    <Link
      {...props}
      prefetch={conIntencion ? null : false}
      onMouseEnter={(e) => {
        setConIntencion(true);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        setConIntencion(true);
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        setConIntencion(true);
        onTouchStart?.(e);
      }}
    />
  );
}
