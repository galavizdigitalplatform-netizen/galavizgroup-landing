import { Newsreader } from "next/font/google";
import "./registro.css";

/**
 * Layout de /registro — carga la tipografía de títulos de la landing.
 *
 * **Newsreader** para los títulos y **Inter** para el texto — elección de Rita.
 * Inter NO se carga aquí: el layout raíz ya la expone como `--font-inter` en el
 * `<html>`, así que /registro la consume y el navegador la descarga una vez.
 *
 * ⚠️ `axes: ["opsz"]` no es opcional. Newsreader tiene eje óptico: sin
 * declararlo, `next/font` sirve el corte para texto chico —más ancho y de menos
 * contraste— y el titular del hero gana una línea.
 *
 * ⚠️ El CSS se importa aquí y no en cada página, para que /registro,
 * /registro/apartar y /registro/listo compartan una sola hoja.
 */
const newsreader = Newsreader({
    variable: "--font-newsreader",
    subsets: ["latin"],
    style: ["normal", "italic"],
    axes: ["opsz"],
    display: "swap",
});

export default function RegistroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={newsreader.variable}>{children}</div>;
}
