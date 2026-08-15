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
          }
        : {
              // ── PUENTE ── ver la nota de arriba. Va marcado por fuente para
              // que rita-os pueda excluirlo del SLA mientras exista.
              ...comun,
              lead_type: "buyer" as const,
              lead_source: `evento-${eventSlug}`,
              message: [
                  `[Event: ${eventSlug}]`,
                  `[Interest: ${ETIQUETA[interes]}]`,
                  nota,
              ]
                  .filter(Boolean)
                  .join("\n"),
          };

    // La IP real del visitante viaja para que Rita OS la guarde como evidencia
    // TCPA en contacts.sms_consent_ip. Sin esto quedaría la IP de Vercel.
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
                    ...(ip ? { "x-forwarded-for": ip } : {}),
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
        console.error(
            "[api/evento] Rita OS rechazó el registro:",
            res.status,
            cuerpo,
            usandoEndpointDeEventos ? "(endpoint de eventos)" : "(puente)",
        );
        return NextResponse.json(
            {
                error:
                    (cuerpo as { error?: string }).error ||
                    "No pudimos apartar tu lugar. Inténtalo otra vez.",
            },
            { status: res.status >= 500 ? 502 : res.status },
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
}
