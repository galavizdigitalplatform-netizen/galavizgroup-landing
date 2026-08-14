"use client";

/**
 * /registro — landing del taller del 12 de septiembre.
 *
 * Reemplaza a la landing de captura de leads (LAND-001). Diferencias que NO son
 * cosméticas y que conviene entender antes de tocar nada:
 *
 *   - **Aquí no hay formulario.** Vive en /registro/apartar. Decisión de Xavi:
 *     la gente lee la información completa y el formulario es una página
 *     dedicada. Además hace medible el embudo para los anuncios de Facebook.
 *   - **Español fijo.** El toggle EN/ES salió, pero `registro-i18n.ts` se
 *     conserva intacto a propósito: puede hacer falta para otro evento.
 *   - **Sin LPMAMA.** Preguntar enganche y preaprobación para apartar lugar en
 *     un taller gratis es el formulario de lead que este cambio quita.
 *
 * Reglas de copy que no se negocian (ver Taller-12Sep-Copy-y-Decisiones.md):
 *   - Nada de "agente desde 2012": la bio dice 20 años, una sola cifra.
 *   - Nada de "la gente como nosotros" ni de asignarle historia migratoria a
 *     nadie. El público es la comunidad latina pero no toda es migrante. La
 *     página habla de CREENCIAS, que no son una clase protegida. Esto baja el
 *     riesgo de vivienda justa; que nadie lo reintroduzca.
 *   - Habla el equipo, nunca "Rita personalmente".
 *   - Nunca implicar que todos califican (ADRE). De ahí el bloque "lo que este
 *     taller no es".
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CuentaRegresiva } from "./cuenta-regresiva";
import {
    BarraAnuncio,
    EVENTO,
    IconoBoleto,
    IconoCalendario,
    IconoPin,
    LogoLockup,
    PieTaller,
} from "./taller-ui";

/**
 * Las seis creencias. Tres tienen respaldo documentado en la investigación sobre
 * barreras de acceso a la vivienda en la comunidad hispana —"hay que dar un
 * enganche grande", "toda deuda es mala", "esto no es para mí"— y la del
 * regreso la aporta Rita de lo que escucha en su oficina.
 *
 * ⚠️ Están escritas en PRIMERA PERSONA a propósito: es la voz de quien lee,
 * no una descripción de "cómo son ellos". Esa diferencia es la que mantiene la
 * página del lado correcto de vivienda justa.
 */
const CREENCIAS = [
    "Cuando junte un poco más, entonces sí.",
    "Con mi crédito, mejor ni pregunto.",
    "Al final me voy a regresar. ¿Para qué comprar aquí?",
    "Eso es para gente que sabe de esto.",
    "Ya lo intenté una vez y me dijeron que no.",
    "Primero que los niños estén más grandes.",
];

const MOMENTOS = [
    {
        hora: "Primeros minutos",
        titulo: "Dónde estás hoy",
        texto:
            "Un ejercicio corto y honesto. Sin juicios y sin que tengas que contarle tu situación a nadie.",
    },
    {
        hora: "Lo que creo",
        titulo: "De dónde salió esa idea",
        texto:
            "Lo que aprendiste sobre el dinero, la deuda y el riesgo antes de tener edad para cuestionarlo. Por qué esas ideas se sienten tan ciertas, cuáles todavía te sirven y cuáles solo te están frenando.",
    },
    {
        hora: "Sobre la mesa",
        titulo: "Los números reales",
        texto:
            "Qué se necesita hoy para comprar o para invertir: enganche, crédito, ingresos, tiempos. Lo que sí aplica y lo que ya es mito. Cada caso es distinto: aquí se explica el panorama, no se aprueba a nadie.",
    },
    {
        hora: "Antes de las 12:00",
        titulo: "Tu siguiente paso",
        texto:
            "No un plan a diez años. El paso concreto que sí puedes dar esta semana, escrito y en tus manos antes de salir de la sala.",
    },
];

export function TallerLanding() {
    const headerRef = useRef<HTMLElement | null>(null);
    const mctaRef = useRef<HTMLDivElement | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const mediaRef = useRef<HTMLDivElement | null>(null);

    /**
     * Estado del header y del CTA inferior.
     *
     * ⚠️ El header queda transparente SOLO mientras hay foto detrás. En celular
     * la foto ocupa la franja de arriba y el texto va debajo: si el header
     * siguiera transparente, el logo BLANCO quedaría sobre fondo claro y
     * desaparecería sin dar error. En escritorio la foto acompaña todo el hero,
     * así que ahí manda el sentinel.
     */
    useEffect(() => {
        const hdr = headerRef.current;
        const mcta = mctaRef.current;
        const sentinel = sentinelRef.current;
        const media = mediaRef.current;
        if (!hdr || !mcta || !sentinel || !media) return;

        const sync = () => {
            const apilado = window.matchMedia("(max-width:860px)").matches;
            const pasoHero = sentinel.getBoundingClientRect().top <= 0;
            const pasoFoto =
                media.getBoundingClientRect().bottom <= hdr.offsetHeight;
            hdr.classList.toggle("solid", apilado ? pasoFoto : pasoHero);
            mcta.classList.toggle("show", pasoHero);
        };

        sync();
        window.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        return () => {
            window.removeEventListener("scroll", sync);
            window.removeEventListener("resize", sync);
        };
    }, []);

    /**
     * Resaltado del programa sin cursor.
     *
     * ⚠️ En celular no hay `:hover`, y ahí va a estar la mayoría del tráfico de
     * los anuncios: un efecto que solo existe en escritorio es un efecto que
     * casi nadie ve. En pantallas táctiles se marca la ficha más cercana al
     * centro de la pantalla conforme se hace scroll.
     *
     * ⚠️ El guardia `(hover:none)` importa: en escritorio una ficha marcada
     * sola pelearía con la que el usuario está señalando con el cursor.
     */
    useEffect(() => {
        if (!window.matchMedia("(hover:none)").matches) return;
        const fichas = Array.from(
            document.querySelectorAll<HTMLElement>(".registro-root .mom"),
        );
        if (!fichas.length) return;

        const marcar = () => {
            const centro = window.innerHeight * 0.45;
            let mejor: HTMLElement | null = null;
            let dist = Infinity;
            for (const f of fichas) {
                const r = f.getBoundingClientRect();
                if (r.bottom < 0 || r.top > window.innerHeight) continue;
                const d = Math.abs(r.top + r.height / 2 - centro);
                if (d < dist) {
                    dist = d;
                    mejor = f;
                }
            }
            for (const f of fichas) f.classList.toggle("is-active", f === mejor);
        };

        marcar();
        window.addEventListener("scroll", marcar, { passive: true });
        window.addEventListener("resize", marcar);
        return () => {
            window.removeEventListener("scroll", marcar);
            window.removeEventListener("resize", marcar);
        };
    }, []);

    return (
        <div className="registro-root">
            <BarraAnuncio />

            <header className="header" ref={headerRef}>
                <div className="wrap header-row">
                    <LogoLockup />
                    <Link className="btn btn-burgundy header-cta" href="/registro/apartar">
                        Apartar mi lugar
                    </Link>
                </div>
            </header>

            {/* ══ Hero ══ */}
            <section className="hero" id="top">
                <div className="hero-media" ref={mediaRef}>
                    {/* ⚠️ `priority`: es el LCP de la página. Sin él la primera
                        pantalla carga en blanco en celular. */}
                    <Image
                        src="/rita-taller-hero.jpg"
                        alt="Rita Galaviz"
                        fill
                        priority
                        sizes="(max-width:860px) 100vw, 47vw"
                    />
                </div>
                {/* Degradado de celular. ⚠️ El primer tramo oscuro NO es
                    decorativo: el logo blanco del header cae justo sobre el fondo
                    claro del estudio y sin él no se lee. */}
                <div className="hero-scrim" />
                <div className="wrap hero-inner">
                    <span className="eyebrow light">Tu próxima propiedad, tu siguiente nivel</span>
                    <h1>
                        Si un sueño te trajo hasta aquí,<em>ahora constrúyelo</em>
                    </h1>
                    <p className="lede">
                        Dos horas con Rita Galaviz para revisar las creencias que te han
                        estado deteniendo y ver, con números reales, qué se necesita hoy
                        para tu primera casa o para tu siguiente propiedad.
                    </p>
                    <div className="hero-meta">
                        <span className="chip">
                            <IconoCalendario />
                            {EVENTO.fechaCorta} · 10 a 12
                        </span>
                        <span className="chip">
                            <IconoPin />
                            1427 N 3rd St, Suite 105 · Phoenix
                        </span>
                        <span className="chip free">Entrada gratis · Cupo limitado</span>
                    </div>
                    <CuentaRegresiva />
                    <Link className="btn btn-burgundy" href="/registro/apartar">
                        Apartar mi lugar
                    </Link>
                    <p className="cta-note light">
                        Registrarte no es un compromiso de compra. El {EVENTO.tipo} es en español.
                    </p>
                </div>
            </section>
            <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

            {/* ══ ¿Te suena? ══ */}
            <section className="section suena grad light">
                <div className="wrap">
                    <div className="suena-head">
                        <span className="eyebrow">Antes de hablar de casas</span>
                        <h2 className="title">
                            ¿Te has dicho <em>alguna de estas frases</em>?
                        </h2>
                        <p className="suena-close">
                            Fíjate en algo: ninguna de esas frases es una cifra. Son
                            creencias.{" "}
                            <b>Y una creencia sí se puede cambiar.</b>
                        </p>
                    </div>
                    <div className="quotes">
                        {CREENCIAS.map((c) => (
                            <div className="q" key={c}>
                                “{c}”
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ Puente ══ */}
            <section className="section puente grad dark">
                <div className="wrap">
                    <div className="puente-head">
                        <span className="eyebrow light">De qué se trata</span>
                        <h2>De eso vamos a hablar</h2>
                    </div>
                    <div className="puente-body">
                        <p>
                            Este {EVENTO.tipo} no es una plática de motivación ni una junta
                            de ventas. Son dos horas para hacer conciencia: de dónde vienen esas
                            ideas, cuáles ya no te sirven, y qué es lo que de verdad se
                            necesita hoy, no lo que te contaron hace diez años.
                        </p>
                        <p className="punch">
                            Vamos a hablar de bienes raíces. También vamos a hablar de las
                            creencias que hacen que ni siquiera preguntes.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══ CTA 2 ══ */}
            <section className="band grad burg">
                <div className="wrap">
                    <h3>El cupo es limitado y la entrada es gratis</h3>
                    <Link className="btn" href="/registro/apartar">
                        Apartar mi lugar
                    </Link>
                    <p className="fine">
                        {EVENTO.fechaCorta} · {EVENTO.horario} · Phoenix
                    </p>
                </div>
            </section>

            {/* ══ Programa ══ */}
            <section className="section momentos grad light">
                <div className="wrap">
                    <span className="eyebrow">El programa</span>
                    <h2 className="title">
                        Dos horas, <em>cuatro momentos</em>
                    </h2>
                    <div className="prog-rail">
                        <span>10:00 → 12:00</span>
                    </div>
                    <div className="mom-grid">
                        {MOMENTOS.map((m, i) => (
                            <div
                                className={i === MOMENTOS.length - 1 ? "mom final" : "mom"}
                                key={m.titulo}
                            >
                                <span className="n">{i + 1}</span>
                                <div className="body">
                                    <div className="hora">{m.hora}</div>
                                    <h3>{m.titulo}</h3>
                                    <p>{m.texto}</p>
                                </div>
                                <span className="ghost" aria-hidden="true">
                                    {i + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ Quién lo imparte ══ */}
            <section className="section rita grad light">
                <div className="wrap">
                    <span className="eyebrow">Quién lo imparte</span>
                    <h2 className="title">
                        Rita Galaviz
                    </h2>

                    <div className="rita-grid">
                        <figure className="rita-photo" style={{ margin: 0 }}>
                            <Image
                                src="/rita-retrato.jpg"
                                alt="Rita Galaviz, de Galaviz Group"
                                width={760}
                                height={950}
                                sizes="(max-width:980px) 100vw, 34vw"
                            />
                            <figcaption>
                                <b>Rita Galaviz</b>
                                Galaviz Group · un equipo de bienes raíces con HomeSmart
                            </figcaption>
                        </figure>
                        <div className="rita-bio">
                            <p>
                                Con <b>20 años de experiencia en bienes raíces y
                                financiamiento</b>, Rita ha sido Top Producer siete años
                                consecutivos. Está reconocida a nivel nacional entre los Top
                                250 Producers y entre los Top 50 de NAHREP, la Asociación
                                Nacional de Profesionales Hispanos de Bienes Raíces.
                            </p>
                            <p className="turn">
                                Pero su mayor credencial es su historia.
                            </p>
                            <p>
                                De raíces humildes en México, sabe lo que significa empezar
                                con poco, vencer miedos y construir paso a paso. Hoy acompaña
                                a otras familias a descubrir que su historia no determina
                                hasta dónde pueden llegar.
                            </p>
                            <div className="creds">
                                <span className="cred">20 años en bienes raíces</span>
                                <span className="cred">Top Producer · 7 años</span>
                                <span className="cred">Top 250 nacional</span>
                                <span className="cred">Top 50 NAHREP</span>
                            </div>
                        </div>
                    </div>

                    {/*
                      * ⚠️ PENDIENTE — invitado especial (loan officer).
                      * Faltan tres cosas para publicarlo: foto vertical, nombre con
                      * su compañía, y dos o tres líneas de bio.
                      *
                      * ⚠️ Y una advertencia que no es de diseño: si el invitado es
                      * originador de préstamos, lo que diga en la sala cae bajo reglas
                      * distintas a las de un agente. Nada de tasas, montos ni "usted
                      * califica" sin las salvedades que su compañía exija. Vale la pena
                      * que él revise su propio bloque antes de publicarlo.
                      */}
                    <div className="invitado">
                        <span className="eyebrow">Invitado especial</span>
                        <div className="invitado-grid">
                            <div className="invitado-foto" aria-hidden="true">
                                <span>Falta la foto</span>
                            </div>
                            <div className="invitado-bio">
                                <h3>Por confirmar</h3>
                                <p className="rol">Loan officer</p>
                                <p>
                                    El bloque de los números reales lo acompaña un
                                    especialista en financiamiento: qué se necesita hoy para
                                    calificar, qué programas existen y qué es mito. Cada caso
                                    es distinto: aquí se explica el panorama, no se aprueba
                                    a nadie.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ Qué te llevas ══ */}
            <section className="section llevas grad light">
                <div className="wrap">
                    <span className="eyebrow">Expectativas claras</span>
                    <h2 className="title">
                        Qué te llevas, y <em>qué no</em>
                    </h2>
                    <div className="llevas-grid">
                        <div className="panel yes">
                            <h3>Al salir vas a tener</h3>
                            <ul>
                                <li>
                                    Claridad sobre qué te ha estado deteniendo, con nombre y
                                    no como sensación.
                                </li>
                                <li>
                                    Un panorama real de lo que se requiere hoy para comprar o
                                    para invertir.
                                </li>
                                <li>Un siguiente paso concreto, escrito, que depende de ti.</li>
                                <li>Con quién preguntar cuando estés listo.</li>
                            </ul>
                        </div>
                        {/* ⚠️ Este bloque no es relleno: es lo que mantiene la página del
                            lado correcto de ADRE. No prometer que alguien califica. */}
                        <div className="panel no">
                            <h3>Lo que este {EVENTO.tipo} no es</h3>
                            <ul>
                                <li>No es una asesoría individual ni una preaprobación.</li>
                                <li>
                                    No es una promesa de que vas a calificar. Eso depende de tu
                                    caso y de tu prestamista.
                                </li>
                                <li>No es una junta para venderte una propiedad.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ Invitación — el formulario vive en /registro/apartar ══ */}
            <section className="section registro grad dark" id="apartar">
                <div className="wrap reg-grid">
                    <div>
                        <span className="eyebrow light">Cupo limitado</span>
                        <h2>Aparta tu lugar</h2>
                        <p className="lede">
                            La entrada es gratis y el cupo es limitado. Te confirmamos por
                            mensaje y correo, y te mandamos un recordatorio antes del {EVENTO.tipo}.
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
                                    <small>El {EVENTO.tipo} es en español</small>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="invite">
                        <span className="invite-badge">Entrada gratis</span>
                        <h3>Son tres minutos</h3>
                        <p>
                            Nombre, correo y teléfono. Nada más. Te llega la confirmación con
                            la dirección y un recordatorio antes del sábado.
                        </p>
                        <CuentaRegresiva etiqueta={`Faltan para el ${EVENTO.tipo}`} />
                        <Link
                            className="btn btn-burgundy btn-block"
                            href="/registro/apartar"
                        >
                            Apartar mi lugar
                        </Link>
                        <p className="invite-note">
                            Registrarte no es un compromiso de compra.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══ Detalles ══ */}
            <section className="section detalles grad light">
                <div className="wrap">
                    <span className="eyebrow">Logística</span>
                    <h2 className="title">Los detalles</h2>
                    <div className="det-grid">
                        <div className="det">
                            <div className="k">Cuándo</div>
                            <div className="v">
                                {EVENTO.fechaCorta}
                                <small>{EVENTO.horario}</small>
                            </div>
                        </div>
                        <div className="det">
                            <div className="k">Dónde</div>
                            <div className="v">
                                {EVENTO.calle}
                                <small>{EVENTO.ciudad}</small>
                            </div>
                        </div>
                        <div className="det">
                            <div className="k">Costo</div>
                            <div className="v">
                                Entrada gratis
                                <small>Cupo limitado</small>
                            </div>
                        </div>
                        <div className="det">
                            <div className="k">Idioma</div>
                            <div className="v">
                                Español
                                <small>El {EVENTO.tipo} completo</small>
                            </div>
                        </div>
                    </div>
                    <p className="maplink">
                        <a href={EVENTO.mapa} target="_blank" rel="noopener noreferrer">
                            Ver cómo llegar en Google Maps →
                        </a>
                    </p>
                </div>
            </section>

            {/* ══ CTA final ══ */}
            <section className="band grad burg">
                <div className="wrap">
                    {/*
                      * ⚠️ `light` NO es opcional dentro de una banda burgundy.
                      * `.eyebrow` a secas pinta el texto de var(--burgundy), o
                      * sea el mismo color del fondo: contraste 1.00, invisible.
                      * La variante `light` lo pasa a oro (4.75 sobre #990000).
                      * De los eyebrows de la página, este es el único que vive
                      * sobre burgundy — los demás están sobre índigo o marfil.
                      */}
                    <span className="eyebrow light">Nos vemos el sábado</span>
                    <h3 style={{ marginTop: "1.1rem" }}>
                        Si un sueño te trajo hasta aquí, ahora constrúyelo
                    </h3>
                    <Link className="btn" href="/registro/apartar">
                        Apartar mi lugar
                    </Link>
                    <p className="fine">Entrada gratis · Cupo limitado · En español</p>
                </div>
            </section>

            <PieTaller />

            {/* ⚠️ El CTA de celular va abajo: el renglón del header no da para un
                botón (el lockup mide 218px a 320px de ancho). */}
            <div className="mobile-cta" ref={mctaRef}>
                <Link className="btn btn-burgundy" href="/registro/apartar">
                    Apartar mi lugar
                </Link>
                <p className="mc-note">
                    {EVENTO.fechaCorta} · Entrada gratis · Cupo limitado
                </p>
            </div>
        </div>
    );
}
