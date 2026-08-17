import type { Metadata } from "next";
import { TallerLanding } from "@/components/registro/taller-landing";

const SITE_URL = "https://galavizgroup.com";

/*
 * ⚠️ Dos títulos a propósito, y hay que entender por qué antes de "unificarlos".
 *
 * El layout raíz define `title.template = "%s · Galaviz Group"`, así que la
 * marca se pega SOLA al `<title>`. Si `TITULO` la trae escrita, sale dos veces
 * en la pestaña y en Google. Ya pasó.
 *
 * Pero `openGraph` y `twitter` NO pasan por el template: lo que se escribe ahí
 * es literal. Si les damos el título sin marca, la tarjeta de WhatsApp y
 * Facebook sale sin "Galaviz Group".
 *
 * Por eso son dos constantes y no una.
 */
const TITULO = "Si un sueño te trajo hasta aquí, ahora constrúyelo · 12 de septiembre";
const TITULO_SOCIAL = `${TITULO} · Galaviz Group`;
const DESCRIPCION =
    "Encuentro presencial y gratuito en Phoenix con Rita Galaviz. Dos horas sobre las creencias que te han detenido y lo que de verdad se necesita hoy para tu primera casa o tu siguiente propiedad. Sábado 12 de septiembre, 10 a 12. Cupo limitado.";

/*
 * ⚠️ UNA sola constante para las dos etiquetas, y por eso existe.
 *
 * `og:image` y `twitter:image` son dos campos distintos que tienen que apuntar
 * al mismo archivo. Escribirlo dos veces es cómo uno de los dos se queda atrás:
 * la tarjeta se ve bien en WhatsApp y sale con la imagen vieja en X, o al
 * revés, y nadie lo nota porque cada quien comparte por un canal.
 *
 * Esta es la pieza del TALLER. No sustituye a `/og-galaviz.png`, que sigue
 * siendo la institucional del sitio y la que usan todas las demás páginas desde
 * el layout raíz — sólo /registro apunta aquí.
 *
 * Ruta relativa a propósito: el layout raíz declara `metadataBase`, así que
 * Next la vuelve absoluta (https://galavizgroup.com/…). Los rastreadores de
 * Facebook y WhatsApp NO resuelven rutas relativas.
 *
 * ⚠️ Y es JPEG a propósito, no por descuido. El PNG original pesaba 679 KB;
 * éste, con los mismos 1200×630 píxeles, pesa 247 KB. Facebook (8 MB) y X
 * (5 MB) se tragaban el PNG sin problema, pero WhatsApp —el canal principal de
 * esta campaña— tiene un límite práctico reportado cerca de los 600 KB para la
 * miniatura del enlace, y una tarjeta sin imagen cuesta más que la nitidez que
 * se gana. Decisión de Xavi con los dos números delante.
 *
 * Si alguien vuelve a subir la pieza, que la suba en JPEG y que mire el peso.
 * Y que la extensión coincida con el contenido: el Content-Type sale de la
 * extensión, y un .png sirviendo bytes JPEG lo rechazan algunos rastreadores.
 */
const IMAGEN_SOCIAL = "/og-taller-2026-09-12.jpg";

export const metadata: Metadata = {
    title: TITULO,
    description: DESCRIPCION,
    alternates: { canonical: `${SITE_URL}/registro` },
    /*
     * ⚠️ `openGraph` y `twitter` REEMPLAZAN los bloques del layout raíz — no se
     * fusionan. Los dos van escritos aquí a propósito: sin `images` esta página
     * salió sin og:image y cayó al twitter:image de la raíz (la foto de la
     * familia), y sin bloque `twitter` su tarjeta llevaba el título y la
     * descripción de la HOME. Si agregas un campo a uno, agrégalo al otro.
     */
    openGraph: {
        type: "website",
        url: `${SITE_URL}/registro`,
        title: TITULO_SOCIAL,
        description: DESCRIPCION,
        siteName: "Galaviz Group",
        locale: "es_MX",
        images: [
            {
                url: IMAGEN_SOCIAL,
                width: 1200,
                height: 630,
                alt: "Encuentro de bienes raíces con Rita Galaviz, sábado 12 de septiembre de 10 a 12, en 1427 N 3rd St Suite 105, Phoenix. Entrada gratis, en español, cupo limitado.",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: TITULO_SOCIAL,
        description: DESCRIPCION,
        images: [IMAGEN_SOCIAL],
    },
};

/**
 * /registro — landing del taller del 12 de septiembre.
 *
 * Se renderiza sin el Nav/Footer del sitio a propósito: la página tiene
 * exactamente una cosa que hacer. Trae su propio header y su propio pie.
 */
export default function RegistroPage() {
    return <TallerLanding />;
}
