/* ════════════════════════════════════════════════════════════
   BABUINOS INC — Política de Tratamiento de Datos Personales

   Estructura basada en la Ley 1581 de 2012 y el Decreto 1377 de 2013
   (Colombia). El contenido vive acá y no dentro del componente para
   poder ajustar el texto sin tocar la maquetación.

   ⚠️ REVISAR CON UN ABOGADO ANTES DE OPERAR EN SERIO. Los campos
   marcados con "PENDIENTE" necesitan los datos legales reales de
   Juan: razón social, NIT, domicilio y correo de atención.
   ════════════════════════════════════════════════════════════ */

import { BRAND } from "./brand";

/** Datos del Responsable del Tratamiento (art. 17 Ley 1581). */
export const RESPONSABLE = {
  nombre: BRAND.nombre,
  /** PENDIENTE: razón social y NIT reales si se factura. */
  razonSocial: null as string | null,
  nit: null as string | null,
  ciudad: `${BRAND.ciudadReal}, ${BRAND.pais}`,
  /** PENDIENTE: correo dedicado para consultas y reclamos de datos. */
  correo: null as string | null,
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573504444668",
};

/** Fecha de la última actualización de esta política. */
export const VIGENCIA = "4 de agosto de 2026";

export interface Seccion {
  titulo: string;
  parrafos?: string[];
  lista?: string[];
}

export const POLITICA: Seccion[] = [
  {
    titulo: "1. Quién trata tus datos",
    parrafos: [
      `${RESPONSABLE.nombre} es el Responsable del Tratamiento de los datos personales que nos entregas a través de esta tienda. Operamos desde ${RESPONSABLE.ciudad}.`,
      "El único canal de contacto y de atención de solicitudes sobre tus datos es nuestro WhatsApp, el mismo por el que se coordinan los pedidos.",
    ],
  },
  {
    titulo: "2. Qué datos recogemos",
    parrafos: [
      "Solo pedimos lo mínimo para poder despacharte un pedido y responderte. No usamos formularios de pago en la página ni pedimos datos financieros.",
    ],
    lista: [
      "Nombre y apellido.",
      "Número de teléfono (para contactarte por WhatsApp).",
      "Ciudad y, si nos la das en la nota, la dirección de entrega.",
      "La nota que escribas en el pedido.",
      "Tu correo, únicamente si te inscribes al Club Babuinos.",
      "Las piezas y tallas que agregaste a la mochila.",
    ],
  },
  {
    titulo: "3. Para qué los usamos (finalidades)",
    lista: [
      "Contactarte para coordinar precio, pago y envío del pedido.",
      "Preparar, despachar y hacer seguimiento a tu compra.",
      "Atender preguntas, cambios y reclamos.",
      "Si te inscribiste al Club: avisarte de drops, preventas y lanzamientos. Puedes salirte cuando quieras.",
      "Cumplir obligaciones legales y contables cuando apliquen.",
    ],
    parrafos: [
      "No vendemos, arrendamos ni cedemos tus datos a terceros con fines comerciales.",
    ],
  },
  {
    titulo: "4. Tus derechos como Titular",
    parrafos: [
      "El artículo 8 de la Ley 1581 de 2012 te da estos derechos, y los puedes ejercer gratis:",
    ],
    lista: [
      "Conocer, actualizar y rectificar tus datos.",
      "Solicitar prueba de la autorización que nos diste.",
      "Ser informado del uso que le hemos dado a tus datos.",
      "Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.",
      "Revocar la autorización y solicitar la supresión de tus datos, cuando no exista un deber legal o contractual que nos obligue a conservarlos.",
      "Acceder de forma gratuita a los datos que tengamos sobre ti.",
    ],
  },
  {
    titulo: "5. Cómo ejercerlos",
    parrafos: [
      "Escríbenos por WhatsApp indicando tu nombre, el número con el que hiciste el pedido y qué necesitas (conocer, actualizar, rectificar o suprimir tus datos).",
      "Los plazos que fija la ley y que respetamos: las CONSULTAS se atienden en máximo diez (10) días hábiles, prorrogables por cinco (5) más avisándote el motivo. Los RECLAMOS en máximo quince (15) días hábiles, prorrogables por ocho (8) más.",
    ],
  },
  {
    titulo: "6. Autorización",
    parrafos: [
      "Antes de enviar tu pedido te pedimos marcar de forma expresa que autorizas el tratamiento de tus datos para las finalidades de arriba. La casilla no viene marcada y sin ella no se envía el pedido.",
      "Guardamos el registro de esa autorización junto con el pedido, precisamente para poder darte prueba de ella si la pides.",
    ],
  },
  {
    titulo: "7. Datos sensibles y menores de edad",
    parrafos: [
      "No pedimos datos sensibles (salud, origen étnico, datos biométricos, convicciones políticas o religiosas, ni orientación sexual). Si nos los envías por tu cuenta en una nota, no los usaremos para nada.",
      "No tratamos datos de menores de edad de forma deliberada. Si eres menor, un adulto responsable debe hacer la compra.",
    ],
  },
  {
    titulo: "8. Seguridad y conservación",
    parrafos: [
      "Los pedidos se guardan en una base de datos con acceso restringido, y el panel de administración está protegido con usuario y clave.",
      "Conservamos los datos el tiempo necesario para cumplir con el pedido y con las obligaciones legales que apliquen. Cuando dejan de ser necesarios, se eliminan.",
      "Ningún sistema es infalible: aplicamos medidas razonables, pero no podemos garantizar seguridad absoluta.",
    ],
  },
  {
    titulo: "9. Cambios a esta política",
    parrafos: [
      `Si cambiamos esta política lo reflejaremos en esta misma página con una nueva fecha de vigencia. Versión vigente desde el ${VIGENCIA}.`,
    ],
  },
];
