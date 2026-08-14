import Image from "next/image";
import Link from "next/link";

/**
 * Piezas compartidas entre la landing del taller y la página del formulario.
 *
 * ⚠️ El header admite exactamente tres cosas: wordmark, divisor y HomeSmart
 * (más, en escritorio, el botón). `.logo-lockup` es `flex:none` — nada encoge
 * solo. Se desbordó en celular tres veces en la historia de esta ruta. Si
 * alguien le agrega un cuarto elemento, hay que volver a medir a 320px.
 */

export const EVENTO = {
    /**
     * ⚠️ El sustantivo del evento vive aquí y en ningún otro lado. Se usa con
     * artículo alrededor ("al {tipo}", "antes del {tipo}"), así que cambiarlo
     * por "taller", "sesión" o lo que sea es UNA línea.
     * `event_slug` NO cambia: es identificador, no copy.
     */
    tipo: "encuentro",
    fecha: "Sábado 12 de septiembre de 2026",
    fechaCorta: "Sábado 12 de septiembre",
    horario: "10:00 a 12:00",
    horarioLargo: "10:00 a 12:00 de la mañana",
    calle: "1427 N 3rd Street, Suite 105",
    ciudad: "Phoenix, AZ 85004",
    mapa:
        "https://maps.google.com/?q=1427+N+3rd+St+Suite+105+Phoenix+AZ+85004",
} as const;

export function IconoCalendario() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
    );
}

export function IconoPin() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.6" />
        </svg>
    );
}

export function IconoBoleto() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9.5V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 0 5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a2.5 2.5 0 0 0 0-5Z" />
            <path d="M14 6v12" />
        </svg>
    );
}

export function BarraAnuncio() {
    return (
        <div className="announce">
            <div className="wrap">
                <span>
                    <b>{EVENTO.fechaCorta}</b>
                </span>
                <span className="sep">·</span>
                <span className="solo-ancho">{EVENTO.horario}</span>
                <span className="sep solo-ancho">·</span>
                <span className="solo-ancho">Phoenix</span>
                <span className="sep">·</span>
                <span>
                    <b>Entrada gratis</b>
                </span>
            </div>
        </div>
    );
}

export function LogoLockup({ soloClaro = false }: { soloClaro?: boolean }) {
    return (
        <div className="logo-lockup">
            <Link className="logo-link" href="/registro" aria-label="Galaviz Group">
                <Image
                    className="logo-on-dark"
                    src="/brand/logo-negative.svg"
                    alt="Galaviz Group"
                    width={260}
                    height={62}
                    priority
                />
                {!soloClaro && (
                    <Image
                        className="logo-on-light"
                        src="/brand/logo-primary.svg"
                        alt=""
                        aria-hidden="true"
                        width={260}
                        height={62}
                    />
                )}
            </Link>
            <span className="logo-div" />
            <Image
                className="hs-logo logo-on-dark"
                src="/homesmart-logo-white.svg"
                alt="HomeSmart"
                width={120}
                height={21}
            />
            {!soloClaro && (
                <Image
                    className="hs-logo logo-on-light"
                    src="/brand/homesmart-logo.svg"
                    alt=""
                    aria-hidden="true"
                    width={120}
                    height={21}
                />
            )}
        </div>
    );
}

export function PieTaller() {
    return (
        <footer className="footer grad dark">
            <div className="wrap">
                <div className="footer-grid">
                    <div>
                        <Image
                            src="/brand/logo-negative.svg"
                            alt="Galaviz Group"
                            width={200}
                            height={46}
                        />
                        <p>
                            Galaviz Group es un equipo de bienes raíces en HomeSmart,
                            sirviendo al área metropolitana de Phoenix.
                        </p>
                        {/*
                          * ⚠️ Esto es el ESLOGAN de vivienda justa, textual y en
                          * inglés. Así se queda.
                          *
                          * HUD definió tres piezas intercambiables: el logotipo
                          * (la casita), la declaración larga ("We are pledged to
                          * the letter and spirit of U.S. policy…") y el eslogan.
                          * Para un espacio chico como este pie, el eslogan es
                          * exactamente la pieza que corresponde.
                          *
                          * ⚠️ NO traducirlo y NO acompañarlo de una frase
                          * inventada. Aquí estuvo "Vivienda justa para todos":
                          * suena bien y no existe — no es de HUD ni de nadie. Lo
                          * que tiene reconocimiento es la frase en inglés, literal;
                          * una traducción libre al lado la debilita en vez de
                          * aclararla.
                          *
                          * Si algún día se quiere el logotipo (la casita), va el
                          * archivo oficial de HUD — nunca un carácter ⌂ ni un
                          * dibujo parecido. Media casita hecha a mano se lee como
                          * marca mal copiada, que es peor que no ponerla.
                          */}
                        <p className="ft-vivienda">Equal Housing Opportunity</p>
                    </div>
                    <div>
                        <h4>El {EVENTO.tipo}</h4>
                        <ul>
                            <li>
                                <Link href="/registro/apartar">Apartar mi lugar</Link>
                            </li>
                            <li>
                                <Link href="/registro">Programa</Link>
                            </li>
                            <li>
                                <a
                                    href={EVENTO.mapa}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Cómo llegar
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>Legal</h4>
                        <ul>
                            <li>
                                <Link href="/privacy-policy">Aviso de privacidad</Link>
                            </li>
                            <li>
                                <Link href="/terms">Términos</Link>
                            </li>
                            <li>
                                <a
                                    href="https://homesmart.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    HomeSmart
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} Galaviz Group</span>
                    <span>Tu próxima propiedad, tu siguiente nivel.</span>
                </div>
            </div>
        </footer>
    );
}
