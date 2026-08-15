import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TallerForm } from "@/components/registro/taller-form";
import {
    BarraAnuncio,
    EVENTO,
    IconoBoleto,
    IconoCalendario,
    IconoPin,
    LogoLockup,
} from "@/components/registro/taller-ui";

const SITE_URL = "https://galavizgroup.com";

export const metadata: Metadata = {
    title: "Apartar mi lugar · 12 de septiembre",
    description:
        "Aparta tu lugar para el sábado 12 de septiembre en Phoenix. Entrada gratis, cupo limitado.",
    alternates: { canonical: `${SITE_URL}/registro/apartar` },
    /*
     * ⚠️ `noindex` a propósito: la que tiene que posicionar y salir al
     * compartir es /registro. Una página de formulario en los resultados de
     * búsqueda canibaliza a la landing y llega sin contexto.
     */
    robots: { index: false, follow: true },
};

/**
 * /registro/apartar — el formulario, en su propia página.
 *
 * Decisión de Xavi: la gente lee la información completa en la landing y el
 * formulario es una página dedicada.
 *
 * ⚠️ La columna izquierda NO es decorativa. Cambiar de página sin llevarse la
 * fecha, la dirección y el "entrada gratis" es lo que hace que la gente
 * abandone a medio registro.
 */
export default function ApartarPage() {
    return (
        <div className="registro-root pagina-form">
            <BarraAnuncio />

            <header className="header">
                <div className="wrap header-row">
                    <LogoLockup soloClaro />
                    <Link className="back" href="/registro">
                        ← Volver <span className="solo-ancho">al encuentro</span>
                    </Link>
                </div>
            </header>

            <main className="form-main">
                <div className="wrap form-grid">
                    <div>
                        <span className="eyebrow light">Cupo limitado</span>
                        <h1>
                            Aparta tu <em>lugar</em>
                        </h1>
                        <p className="lede">
                            Son tres minutos. Te confirmamos por mensaje y correo, y te
                            mandamos un recordatorio antes del encuentro.
                        </p>

                        <div className="reg-facts">
                            <div className="rf">
                                <IconoCalendario />
                                <span>
                                    <b>{EVENTO.fecha}</b>
                                    <small>{EVENTO.horarioLargo}</small>
                                </span>
                            </div>
                            <div className="rf">
                                <IconoPin />
                                <span>
                                    <b>{EVENTO.calle}</b>
                                    <small>{EVENTO.ciudad}</small>
                                </span>
                            </div>
                            <div className="rf">
                                <IconoBoleto />
                                <span>
                                    <b>Entrada gratis</b>
                                    <small>El encuentro es en español</small>
                                </span>
                            </div>
                        </div>

                        {/*
                          * ⚠️ Asset propio, NO el mismo archivo de la tarjeta
                          * grande de la landing. Aquí el recorte es cuadrado y
                          * cerrado al rostro; el de la landing es 4:5 y llega
                          * hasta las manos. Un solo archivo para los dos deja
                          * la cara diminuta aquí o la tarjeta cortada allá.
                          */}
                        <div className="aside-photo">
                            <Image
                                src="/rita-avatar.jpg"
                                alt="Rita Galaviz"
                                width={148}
                                height={148}
                            />
                            <div className="who">
                                <b>Rita Galaviz</b>
                                <span>Con el equipo de Galaviz Group, en HomeSmart</span>
                            </div>
                        </div>
                    </div>

                    <TallerForm />
                </div>
            </main>
        </div>
    );
}
