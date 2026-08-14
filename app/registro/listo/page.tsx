import type { Metadata } from "next";
import Link from "next/link";
import {
    BarraAnuncio,
    EVENTO,
    LogoLockup,
} from "@/components/registro/taller-ui";

const SITE_URL = "https://galavizgroup.com";

export const metadata: Metadata = {
    title: "Tu lugar está apartado · Taller del 12 de septiembre",
    description: "Confirmación de registro al taller del 12 de septiembre.",
    alternates: { canonical: `${SITE_URL}/registro/listo` },
    robots: { index: false, follow: false },
};

/**
 * /registro/listo — confirmación.
 *
 * ⚠️ Esto es una PÁGINA, no un estado dentro del formulario, y esa es la razón
 * de que exista. El píxel de conversión de los anuncios necesita una URL a la
 * que solo se llega después de registrarse; un `div` que cambia de estado no
 * dispara nada confiable y deja los anuncios optimizando a ciegas.
 *
 * Consecuencia: si alguien "simplifica" esto de vuelta a un estado del
 * formulario, rompe la medición de la campaña sin romper nada visible.
 */
export default function ListoPage() {
    return (
        <div className="registro-root pagina-form">
            <BarraAnuncio />

            <header className="header">
                <div className="wrap header-row">
                    <LogoLockup soloClaro />
                    <Link className="back" href="/registro">
                        ← Volver <span className="solo-ancho">al taller</span>
                    </Link>
                </div>
            </header>

            <main className="form-main">
                <div className="wrap listo">
                    <div className="ok" aria-hidden="true">
                        ✓
                    </div>
                    <h1>Tu lugar está apartado</h1>
                    <p className="sub">
                        Te llega la confirmación por correo. Nos vemos el sábado.
                    </p>

                    <div className="recap">
                        <div>
                            <b>{EVENTO.fecha}</b>
                            <small>{EVENTO.horarioLargo}</small>
                        </div>
                        <div>
                            <b>{EVENTO.calle}</b>
                            <small>{EVENTO.ciudad}</small>
                        </div>
                        <div>
                            <b>Entrada gratis · En español</b>
                            <small>Llega diez minutos antes</small>
                        </div>
                    </div>

                    <div className="después">
                        <p>
                            <a
                                href={EVENTO.mapa}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver cómo llegar en Google Maps →
                            </a>
                        </p>
                        <p>
                            ¿Conoces a alguien a quien le serviría? Pásale{" "}
                            <Link href="/registro">la página del taller</Link>.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
