import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./registro.css";

/**
 * Layout de /registro — carga las fuentes de la landing.
 *
 * ⚠️ Por qué existe este archivo: `app/registro/registro.css` pedía "Fraunces"
 * y "Hanken Grotesk" por nombre desde el primer día, y NADIE las cargaba —
 * `app/layout.tsx` solo trae Playfair e Inter, y no hay `@font-face` en ningún
 * CSS del repo. Durante meses todos los `h1/h2/h3` de esta ruta renderizaron en
 * **Georgia**, el fallback, sin dar error.
 *
 * Van aquí y no en el layout raíz a propósito: la home no las usa y no tiene
 * por qué pagar su descarga.
 *
 * El CSS también se importa aquí y no en cada página, para que /registro,
 * /registro/apartar y /registro/listo compartan una sola hoja.
 */

/**
 * ⚠️ `axes: ["opsz"]` no es opcional. Fraunces es una fuente con eje óptico: sin
 * él, `next/font` sirve el corte para texto chico —más ancho y de menos
 * contraste— y el titular del hero se parte en cuatro líneas en vez de tres.
 * Con el eje incluido, `font-optical-sizing: auto` (por defecto en CSS) elige
 * el corte de display en los tamaños grandes.
 */
const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
    style: ["normal", "italic"],
    axes: ["opsz"],
    display: "swap",
});

const hanken = Hanken_Grotesk({
    variable: "--font-hanken",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export default function RegistroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${fraunces.variable} ${hanken.variable}`}>
            {children}
        </div>
    );
}
