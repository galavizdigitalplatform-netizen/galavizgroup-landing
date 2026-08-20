import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/evento — registro al taller. **No es captura de leads.**
 *
 * Quien llena este formulario está apartando lugar en un evento gratuito. Si
 * cayera por `/api/contact`, nacería como OPORTUNIDAD en Rita OS
 * (`/api/public/opportunities/capture`), con SLA corriendo, asignación y
 * notificaciones — cuarenta relojes de SLA que el equipo debe sin deberlos.
 * Es el mismo daño que arregló #157, pero hecho a propósito.
 *
 * Tampoco puede irse fuera de Rita OS: `contacts.sms_consent_ip` es la
 * evidencia TCPA de la campaña A2P 10DLC CM16c56ebcf8ca44f44b7695ba9f6bf98d, y
 * los recordatorios del taller salen por Twilio desde ahí. **Contacto sí,
 * oportunidad no.**
 *
 * ── Dos caminos, y cuál está activo depende de una variable de entorno ──────
 *
 *   RITA_OS_EVENT_URL definida  → camino bueno. Endpoint de registro de
 *                                 eventos: contacto + fila en
 *                                 event_registrations, sin oportunidad.
 *
 *   RITA_OS_EVENT_URL vacía     → PUENTE. Cae al capture de siempre marcando
 *                                 `lead_source: "evento-taller-2026-09-12"`
 *                                 para que rita-os pueda excluir esa fuente.
 *
 * ⚠️ El puente es DEUDA, no una solución. La exclusión tendría que vivir en
 * tres lugares (SLA, asignación, notificaciones) y **el que se olvide falla en
 * silencio** — la enfermedad de "una regla, muchas implementaciones" que ya
 * está documentada en este proyecto. Existe para no perder el evento si el
 * endpoint no llega a tiempo, no para quedarse.
 */

const RITA_OS_EVENT_URL = process.env.RITA_OS_EVENT_URL || "";
const RITA_OS_CAPTURE_URL =
    process.env.RITA_OS_CAPTURE_URL ||
    "https://os.galavizgroup.com/api/public/opportunities/capture";

const INTERESES = ["buy", "invest", "info"] as const;
type Interes = (typeof INTERESES)[number];

/** Etiqueta en inglés — los metadatos del lead siempre van en inglés. */
const ETIQUETA: Record<Interes, string> = {
    buy: "First-time buyer",
    invest: "Investing",
    info: "Just exploring",
};

interface Cuerpo {
    first_name?: unknown;
    last_name?: unknown;
    email?: unknown;
    phone?: unknown;
    event_slug?: unknown;
    interest?: unknown;
    note?: unknown;
    invited_by?: unknown;
    sms_consent?: unknown;
    marketing_email_consent?: unknown;
    website?: unknown;
}

const texto = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

export async function POST(req: NextRequest) {
    let body: Cuerpo;
    try {
        body = (await req.json()) as Cuerpo;
    } catch {
        return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
    }

    // Honeypot: si viene lleno, es un bot. Se descarta en silencio con 200 para
    // no darle señal de que lo detectamos.
    if (texto(body.website)) {
        return NextResponse.json({ success: true }, { status: 200 });
    }

    for (const campo of ["first_name", "last_name", "email", "phone"] as const) {
        if (!texto(body[campo])) {
            return NextResponse.json(
                { error: `Falta o es inválido: ${campo}` },
                { status: 400 },
            );
        }
    }
    if (body.sms_consent !== "yes" && body.sms_consent !== "no") {
        return NextResponse.json(
            { error: "sms_consent debe ser 'yes' o 'no'" },
            { status: 400 },
        );
    }
    const interes = INTERESES.includes(body.interest as Interes)
        ? (body.interest as Interes)
        : null;
    if (!interes) {
        return NextResponse.json(
            { error: "interest debe ser 'buy', 'invest' o 'info'" },
            { status: 400 },
        );
    }

    const eventSlug = texto(body.event_slug)
        ? body.event_slug.trim().slice(0, 80)
        : "taller-2026-09-12";
    const nota = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : "";

    /*
     * ⚠️ SE RECORTA AQUÍ, Y NO ES REDUNDANCIA CON EL FORMULARIO.
     *
     * El `maxLength` del input sólo obliga a quien usa el formulario. Esta ruta
     * acepta POST directos, y si un texto de 5 000 caracteres llegara entero a
     * rita-os su esquema lo recortaría también — pero el punto es que NADIE
     * rechace: este campo es opcional y no decide nada, así que jamás puede
     * costar el registro completo. Recortar es lo único que las tres capas
     * pueden hacer sin perder a la persona.
     */
    const invitadoPor =
        typeof body.invited_by === "string" ? body.invited_by.trim().slice(0, 200) : "";

    const comun = {
        first_name: (body.first_name as string).trim(),
        last_name: (body.last_name as string).trim(),
        email: (body.email as string).trim(),
        phone: (body.phone as string).trim(),
        sms_consent: body.sms_consent,
        marketing_email_consent: Boolean(body.marketing_email_consent),
    };

    const usandoEndpointDeEventos = RITA_OS_EVENT_URL.length > 0;

    const upstream = usandoEndpointDeEventos
        ? {
              ...comun,
              event_slug: eventSlug,
              interest: interes,
              ...(nota ? { note: nota } : {}),
              ...(invitadoPor ? { invited_by: invitadoPor } : {}),
          }
        : {
              /*
               * ── PUENTE ── ver la nota de arriba.
               *
               * ⚠️ `lead_source` es un ENUM en rita-os. Aquí decía
               * `evento-${eventSlug}` y el esquema lo rechazaba con
               * `{"lead_source":["Invalid input"]}` — o sea que TODOS los
               * registros se caían con 400 y no se guardaba ninguno. Estuvo
               * así hasta la primera prueba real.
               *
               * Valores que el esquema acepta hoy (medidos contra el endpoint,
               * no supuestos): website · referral · open_house · zillow ·
               * sign_call · paid_ads · social_media · sphere · other.
               *
               * Se usa `other` y no `open_house`: esto no es un open house, y
               * un valor semánticamente falso ensucia los reportes de origen.
               *
               * ⚠️ Consecuencia: la marca del evento ya NO viaja en
               * `lead_source`. Vive en `message`, en el prefijo `[Event: …]`.
               * Si rita-os va a excluir estos registros del SLA mientras el
               * puente exista, tiene que buscar ese prefijo, no la fuente.
               * Es una razón más para que el endpoint de eventos reemplace
               * esto pronto.
               */
              ...comun,
              lead_type: "buyer" as const,
              lead_source: "other" as const,
              /*
               * ⚠️ `invited_by` VIAJA EN `message` MIENTRAS EL PUENTE EXISTA.
               *
               * El capture de oportunidades no conoce ese campo: mandárselo
               * suelto sería, en el mejor caso, ignorado en silencio. Y si esta
               * rama corre —o sea, si `RITA_OS_EVENT_URL` todavía no está
               * definida en producción— es la ÚNICA que corre, así que "sólo lo
               * agregué al payload nuevo" significa perder el dato en cada
               * registro que entre hasta que se configure la variable.
               *
               * Va con el mismo prefijo entre corchetes que el evento y el
               * interés, por la misma razón que ellos: es lo único que sobrevive
               * al puente.
               */
              message: [
                  `[Event: ${eventSlug}]`,
                  `[Interest: ${ETIQUETA[interes]}]`,
                  invitadoPor ? `[Invitó: ${invitadoPor}]` : "",
                  nota,
              ]
                  .filter(Boolean)
                  .join("\n"),
          };

    /*
     * La IP real del visitante viaja para que Rita OS la guarde como evidencia
     * TCPA en `contacts.sms_consent_ip`.
     *
     * ⚠️ VA EN `x-visitor-ip`, NO en `x-forwarded-for`, y esto no es preferencia.
     *
     * Rita OS también corre en Vercel, y la documentación de Vercel es textual:
     * «we currently overwrite the X-Forwarded-For header and do not forward
     * external IPs. This restriction is in place to prevent IP spoofing».
     * O sea: el `x-forwarded-for` que mandábamos se descartaba en la entrada y
     * rita-os guardaba la IP de nuestra propia función.
     *
     * Consecuencias que esto tuvo mientras estuvo mal, y las dos son serias:
     *   1. `sms_consent_ip` guardó una IP de Vercel en todo lo que entró desde
     *      el 15 de agosto. Como evidencia TCPA, no sirve.
     *   2. El limitador público de rita-os cuenta por IP. Con todas las altas
     *      compartiendo una sola, el sexto registro de cada hora recibía 429 y
     *      se perdía. Con publicidad prendida, pérdida garantizada.
     *
     * `x-forwarded-for` se sigue mandando porque no estorba y sirve de respaldo
     * si algún día esto deja de correr detrás de Vercel. La fuente de verdad
     * para rita-os es `x-visitor-ip`.
     *
     * ⚠️ Un nombre de cabecera propio significa que rita-os TIENE que leerlo.
     * Si no lo lee, el dato se vuelve a perder en silencio.
     */
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "";

    let res: Response;
    try {
        res = await fetch(
            usandoEndpointDeEventos ? RITA_OS_EVENT_URL : RITA_OS_CAPTURE_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(ip
                        ? { "x-visitor-ip": ip, "x-forwarded-for": ip }
                        : {}),
                    "User-Agent": "galavizgroup-landing/1.0 (taller)",
                },
                body: JSON.stringify(upstream),
                cache: "no-store",
            },
        );
    } catch (err) {
        console.error("[api/evento] no se pudo llamar a Rita OS:", err);
        return NextResponse.json(
            {
                error:
                    "No pudimos apartar tu lugar en este momento. Inténtalo en un minuto.",
            },
            { status: 502 },
        );
    }

    const cuerpo = await res.json().catch(() => ({}));

    if (!res.ok) {
        /*
         * ⚠️ El error de arriba se REGISTRA, no se muestra.
         *
         * Antes se reenviaba tal cual al navegador y la persona vio
         * "Invalid form data": en inglés, en una página en español, y
         * describiendo un desacuerdo de esquema entre dos servidores que ella
         * no puede arreglar.
         *
         * Un rechazo de validación aquí es culpa NUESTRA por definición: el
         * formulario ya revisó lo que la persona escribió antes de llegar
         * hasta acá. Así que ella recibe una salida y el detalle se va al log.
         */
        console.error(
            "[api/evento] Rita OS rechazó el registro:",
            res.status,
            JSON.stringify(cuerpo),
            usandoEndpointDeEventos ? "(endpoint de eventos)" : "(puente)",
        );
        return NextResponse.json(
            {
                error:
                    "No pudimos apartar tu lugar en este momento. Vuelve a " +
                    "intentarlo en un minuto, o escríbenos y lo apartamos nosotros.",
            },
            { status: res.status >= 500 ? 502 : res.status },
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
