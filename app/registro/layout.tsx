import "./registro.css";

/**
 * Layout de /registro — solo la hoja de estilos compartida.
 *
 * Ya no se carga ninguna fuente aquí. El layout raíz expone
 * `--font-source-serif` y `--font-inter` en el `<html>`, así que /registro las
 * hereda y el navegador las descarga una vez para todo el sitio. Antes esta
 * ruta cargaba **Newsreader** por su cuenta para los títulos; se unificó con la
 * home en Source Serif 4 y con ello desapareció la segunda descarga.
 *
 * ⚠️ El eje óptico y la itálica no se perdieron en la mudanza: viven ahora en
 * la declaración de `Source_Serif_4` del layout raíz, y `/registro` los
 * necesita igual (el `<em>` del titular, y el número a 7.5rem).
 *
 * ⚠️ El CSS se importa aquí y no en cada página, para que /registro,
 * /registro/apartar y /registro/listo compartan una sola hoja.
 *
 * ⚠️ Se conserva el `<div>` envolvente aunque ya no lleve clase de fuente: el
 * `<body>` es `flex flex-col`, así que quitarlo ascendería `.registro-root` a
 * hijo flex directo. Es un cambio de layout que este sprint no necesita.
 */
export default function RegistroLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
