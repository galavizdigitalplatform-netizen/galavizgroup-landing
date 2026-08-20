"use client";

/**
 * /registro/apartar — el formulario del evento.
 *
 * ⚠️ Esto NO es el formulario de leads. Quien lo llena está apartando lugar en
 * un evento gratuito, no pidiendo asesoría. Por eso:
 *   - No manda `lead_type`. No aplica.
 *   - No manda el bloque `lpmama`. Preguntar enganche y preaprobación para
 *     entrar a un evento gratis es exactamente el formulario de lead que este
 *     cambio quita. (Esto NO toca la llave `preapproved_or_cash` donde vive.)
 *   - Postea a /api/evento, que debe llegar a un endpoint de registro de
 *     eventos en Rita OS — contacto sí, oportunidad no.
 *
 * ⚠️ El bloque TCPA SÍ/NO es el opt-in declarado en la campaña A2P 10DLC
 * CM16c56ebcf8ca44f44b7695ba9f6bf98d, y es lo que habilita el recordatorio del
 * evento por mensaje. Jamás colapsarlo a un checkbox genérico.
 *
 * ⚠️ Los errores NO usan el rojo de marca. El botón de avanzar es rojo; si
 * los errores también lo fueran, el mismo formulario tendría el color de
 * *avanzar* y el de *algo salió mal* casi idénticos y a centímetros. Usan
 * `--alert` más un ícono, para no depender solo del color.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ⚠️ NO se renombra aunque el copy ya no diga "taller". Es identificador, no
 * texto: es la llave con la que se correlacionan los registros ya enviados.
 */
const EVENT_SLUG = "taller-2026-09-12";

/**
 * ⚠️ ESTO NO ES COPY. Es el texto del consentimiento TCPA: describe qué acepta
 * recibir la persona, y es lo que queda como evidencia junto con
 * `sms_consent_ip`. Tiene que coincidir con el programa registrado en la
 * campaña A2P 10DLC CM16c56ebcf8ca44f44b7695ba9f6bf98d de Twilio.
 *
 * ⚠️ POR ESO ESTÁ AQUÍ SUELTO Y NO INTERPOLA `EVENTO.tipo`.
 *
 * Durante un rato sí lo interpolaba, y eso convertía "cambiar el sustantivo del
 * evento es una línea" en una trampa: esa línea también reescribía el
 * consentimiento, sin avisar y sin dar error. Un cambio de copy no puede mover
 * un registro legal de rebote.
 *
 * Tampoco nombra el evento a propósito. Lo que Twilio registra es un PROGRAMA
 * de mensajes, no un evento: redactado así sobrevive al siguiente sin volver a
 * tocarse. Si alguien le vuelve a meter el nombre del evento, cada evento nuevo
 * obliga a revisar la campaña.
 *
 * ⚠️ "Responde STOP" no se toca: es requisito, no cortesía.
 *
 * Si Twilio tiene registrado otro texto, MANDA TWILIO — se cambia aquí para
 * igualarlo, no al revés.
 */
const TEXTO_CONSENTIMIENTO_SMS =
    "Confirmación y recordatorios de tu registro con Galaviz Group. " +
    "Pueden aplicar tarifas de tu compañía. Responde STOP para darte de baja " +
    "en cualquier momento.";

type Interes = "buy" | "invest" | "info" | "";
type Sms = "yes" | "no" | "";

type Campo =
    | "first_name"
    | "last_name"
    | "email"
    | "phone"
    | "interest"
    | "sms_consent";

const ERRORES: Record<Campo, string> = {
    first_name: "Escribe tu nombre",
    last_name: "Escribe tu apellido",
    email: "Revisa tu correo",
    phone: "Revisa tu teléfono",
    interest: "Elige una opción",
    sms_consent: "Elige una de las dos opciones",
};

const OPCIONES: { valor: Exclude<Interes, "">; titulo: string; nota: string }[] = [
    {
        valor: "buy",
        titulo: "Quiero comprar mi primera casa",
        nota: "Todavía no sé por dónde empezar",
    },
    {
        valor: "invest",
        titulo: "Quiero invertir o crecer mi patrimonio",
        nota: "Ya compré antes y quiero el siguiente paso",
    },
    {
        valor: "info",
        titulo: "Todavía estoy explorando",
        nota: "Vengo a entender qué es posible",
    },
];

export function TallerForm() {
    const router = useRouter();
    const [enviando, setEnviando] = useState(false);
    const [errores, setErrores] = useState<Partial<Record<Campo, boolean>>>({});
    const [fallo, setFallo] = useState<string | null>(null);
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        note: "",
        invited_by: "",
        interest: "" as Interes,
        sms_consent: "" as Sms,
        marketing_email_consent: false,
        website: "", // honeypot
    });

    const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    async function enviar(e: React.FormEvent) {
        e.preventDefault();
        const malos: Partial<Record<Campo, boolean>> = {
            first_name: !form.first_name.trim(),
            last_name: !form.last_name.trim(),
            email: !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(form.email.trim()),
            phone: form.phone.replace(/\D/g, "").length < 10,
            interest: !form.interest,
            sms_consent: !form.sms_consent,
        };
        setErrores(malos);
        if (Object.values(malos).some(Boolean)) {
            document
                .querySelector(".registro-root .err-msg.show")
                ?.scrollIntoView({ block: "center", behavior: "smooth" });
            return;
        }

        setEnviando(true);
        setFallo(null);
        try {
            const res = await fetch("/api/evento", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    event_slug: EVENT_SLUG,
                    interest: form.interest,
                    note: form.note.trim() || undefined,
                    invited_by: form.invited_by.trim() || undefined,
                    sms_consent: form.sms_consent,
                    marketing_email_consent: form.marketing_email_consent,
                    website: form.website,
                }),
            });
            if (!res.ok) {
                const cuerpo = (await res.json().catch(() => ({}))) as {
                    error?: string;
                };
                throw new Error(cuerpo.error || "No pudimos apartar tu lugar.");
            }
            router.push("/registro/listo");
        } catch (err) {
            setFallo(
                err instanceof Error
                    ? err.message
                    : "No pudimos apartar tu lugar. Inténtalo otra vez.",
            );
            setEnviando(false);
        }
    }

    /* Función, no componente: declarar un componente dentro del render lo
       remonta en cada pintada y pierde su estado (react-hooks/static-components). */
    const err = (campo: Campo) => (
        <p className={errores[campo] ? "err-msg show" : "err-msg"}>
            {ERRORES[campo]}
        </p>
    );

    return (
        <div className="card">
            <h2>Apartar mi lugar</h2>
            <p className="sub">Nombre, correo y teléfono. Nada más.</p>

            <form onSubmit={enviar} noValidate>
                <div className="form-row">
                    <div className="field">
                        <label htmlFor="fn">
                            Nombre <span className="req">*</span>
                        </label>
                        <input
                            id="fn"
                            autoComplete="given-name"
                            value={form.first_name}
                            onChange={(e) => set("first_name", e.target.value)}
                        />
                        {err("first_name")}
                    </div>
                    <div className="field">
                        <label htmlFor="ln">
                            Apellido <span className="req">*</span>
                        </label>
                        <input
                            id="ln"
                            autoComplete="family-name"
                            value={form.last_name}
                            onChange={(e) => set("last_name", e.target.value)}
                        />
                        {err("last_name")}
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="em">
                        Correo electrónico <span className="req">*</span>
                    </label>
                    <input
                        id="em"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                    />
                    {err("email")}
                </div>

                <div className="field">
                    <label htmlFor="ph">
                        Teléfono celular <span className="req">*</span>
                    </label>
                    <input
                        id="ph"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(602) 555-0134"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                    />
                    {err("phone")}
                </div>

                <div className="field">
                    <label style={{ marginBottom: ".6rem" }}>
                        ¿Qué te trae al encuentro? <span className="req">*</span>
                    </label>
                    <div className="seg">
                        {OPCIONES.map((o) => (
                            <div key={o.valor} style={{ display: "contents" }}>
                                <input
                                    type="radio"
                                    name="interest"
                                    id={`i-${o.valor}`}
                                    checked={form.interest === o.valor}
                                    onChange={() => set("interest", o.valor)}
                                />
                                <label className="opt" htmlFor={`i-${o.valor}`}>
                                    <b>{o.titulo}</b>
                                    <span>{o.nota}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    {err("interest")}
                </div>

                <div className="field">
                    <label htmlFor="note">
                        ¿Algo que quieras que Rita sepa antes del encuentro?{" "}
                        <span className="opt-lbl">(opcional)</span>
                    </label>
                    <textarea
                        id="note"
                        placeholder="Lo que quieras contarle. Lo lee antes del sábado."
                        value={form.note}
                        onChange={(e) => set("note", e.target.value)}
                    />
                </div>

                {/* ⚠️ Bloque TCPA — no se toca */}
                <div className="consent-block">
                    <h4>Mensajes de texto</h4>
                    <p className="cs-note">
                        Queremos mandarte la confirmación y un recordatorio antes del
                        encuentro. Tú decides:
                    </p>
                    <fieldset className="cs-fieldset">
                        <legend>
                            ¿Podemos enviarte mensajes de texto?{" "}
                            <span className="req">*</span>
                        </legend>
                        <div className="seg">
                            <input
                                type="radio"
                                name="sms_consent"
                                id="s-yes"
                                checked={form.sms_consent === "yes"}
                                onChange={() => set("sms_consent", "yes")}
                            />
                            <label className="opt" htmlFor="s-yes">
                                <b>Sí, acepto recibir mensajes</b>
                                <span>{TEXTO_CONSENTIMIENTO_SMS}</span>
                            </label>
                            <input
                                type="radio"
                                name="sms_consent"
                                id="s-no"
                                checked={form.sms_consent === "no"}
                                onChange={() => set("sms_consent", "no")}
                            />
                            <label className="opt" htmlFor="s-no">
                                <b>No, prefiero solo correo</b>
                                <span>
                                    Te mandamos la confirmación y los recordatorios por correo
                                    electrónico.
                                </span>
                            </label>
                        </div>
                    </fieldset>
                    {err("sms_consent")}
                    <label className="consent">
                        <input
                            type="checkbox"
                            checked={form.marketing_email_consent}
                            onChange={(e) =>
                                set("marketing_email_consent", e.target.checked)
                            }
                        />
                        {/*
                          * "eventos" en genérico, y NO el sustantivo del evento:
                          * esta casilla habla de lo que venga después, y lo que
                          * venga puede no ser un encuentro. Igual que el bloque
                          * de SMS, no depende de `EVENTO.tipo` — es una
                          * suscripción de marketing, no una frase de campaña.
                          */}
                        <span>
                            También quiero recibir por correo información sobre próximos
                            eventos y oportunidades de bienes raíces.
                        </span>
                    </label>
                </div>

                {/*
                  * ⚠️ ÚLTIMO CAMPO, Y FUERA DEL BLOQUE TCPA A PROPÓSITO.
                  *
                  * Va después del consentimiento porque no es parte de él: meterlo
                  * dentro de la tarjeta blanca lo haría parecer una condición del
                  * registro, y no lo es.
                  *
                  * ⚠️ NO ENTRA EN `Campo` NI EN `ERRORES`, y eso es el diseño: es
                  * el único campo del formulario que no puede detener un envío.
                  * Quien no sepa qué poner lo deja vacío y aparta su lugar igual.
                  *
                  * `maxLength` recorta en el navegador; el proxy vuelve a recortar
                  * y rita-os otra vez. Ninguna de las tres capas puede confiar en
                  * las otras dos, y ninguna rechaza: un texto de más nunca puede
                  * costar el registro entero.
                  */}
                <div className="field">
                    <label htmlFor="inv">
                        ¿Quién te invitó? <span className="opt-lbl">(opcional)</span>
                    </label>
                    <input
                        id="inv"
                        type="text"
                        maxLength={200}
                        placeholder="Nombre de la persona que te invitó"
                        value={form.invited_by}
                        onChange={(e) => set("invited_by", e.target.value)}
                    />
                </div>

                {/* honeypot */}
                <input
                    className="hp-field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                />

                <button
                    className="btn btn-burgundy btn-block"
                    type="submit"
                    aria-busy={enviando}
                    disabled={enviando}
                >
                    {enviando ? "Apartando…" : "Apartar mi lugar"}
                </button>

                {fallo && <p className="err-msg show form-level">{fallo}</p>}

                <p className="form-meta">
                    Al registrarte aceptas nuestro{" "}
                    <a href="/privacy-policy">Aviso de privacidad</a> y los{" "}
                    <a href="/terms">Términos</a>.
                    <br />
                    Registrarte no es un compromiso de compra.
                </p>
            </form>
        </div>
    );
}
