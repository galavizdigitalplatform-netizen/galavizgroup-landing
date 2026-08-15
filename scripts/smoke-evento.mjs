#!/usr/bin/env node
/**
 * Comprueba que el payload del puente de /api/evento sea ACEPTABLE para el
 * esquema de rita-os, sin crear ningún registro.
 *
 * ⚠️ Por qué existe este archivo, y vale leerlo entero antes de borrarlo:
 *
 * Durante todo el desarrollo la regla fue "nadie llena el formulario, porque
 * crea una oportunidad real en la bandeja de Rita". La regla protegía a Rita
 * — y al mismo tiempo escondía que el formulario NO FUNCIONABA. `lead_source`
 * iba como "evento-taller-2026-09-12" y el esquema de rita-os lo rechaza con
 * `{"lead_source":["Invalid input"]}`. Cada envío moría con 400. No se
 * guardaba nada. Se descubrió con el primer registro de verdad, ya en
 * producción.
 *
 * ── El truco ──────────────────────────────────────────────────────────────
 * Se manda el payload REAL con un correo deliberadamente inválido. El esquema
 * rechaza siempre, así que no se crea nada; pero la respuesta trae `details`
 * campo por campo. Si el único campo que se queja es `email`, el resto del
 * payload es válido. Si aparece cualquier otro, ahí está la falla.
 *
 * Es la única forma de probar la forma del payload contra el servidor de
 * verdad sin ensuciar la bandeja de nadie.
 *
 * Uso:  npm run smoke:evento
 */

/*
 * ── Dos destinos, el mismo truco ──────────────────────────────────────────
 *
 * Igual que /api/evento, este guion apunta a donde apunte el proxy: si
 * `RITA_OS_EVENT_URL` está definida, prueba el endpoint de eventos con el
 * payload de eventos; si no, prueba el puente con el payload del puente.
 *
 * Es lo que hay que mantener: si el guion siguiera probando el puente cuando
 * el proxy ya usa el endpoint nuevo, estaría dando verde sobre un camino que
 * ya nadie recorre — que es exactamente la clase de "todo verde por separado"
 * que dejó el formulario días sin guardar nada.
 */
const URL_EVENTO = process.env.RITA_OS_EVENT_URL || "";
const URL_CAPTURE =
    process.env.RITA_OS_CAPTURE_URL ||
    "https://os.galavizgroup.com/api/public/opportunities/capture";

const usandoEndpointDeEventos = URL_EVENTO.length > 0;
const destino = usandoEndpointDeEventos ? URL_EVENTO : URL_CAPTURE;

/** El correo inválido es lo que garantiza que nada se guarde. NO lo arregles. */
const CORREO_CENTINELA = "invalido";

const comun = {
    first_name: "Prueba",
    last_name: "Humo",
    email: CORREO_CENTINELA,
    phone: "6025550134",
    sms_consent: "no",
    marketing_email_consent: false,
};

const payload = usandoEndpointDeEventos
    ? {
          ...comun,
          event_slug: "taller-2026-09-12",
          interest: "buy",
          note: "prueba de contrato",
      }
    : {
          ...comun,
          lead_type: "buyer",
          lead_source: "other",
          message: "[Event: taller-2026-09-12]\n[Interest: First-time buyer]",
      };

const res = await fetch(destino, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        // La misma cabecera que manda el proxy de verdad: si el endpoint
        // dejara de leerla, la evidencia TCPA se pierde en silencio.
        "x-visitor-ip": "198.51.100.24",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
});
const cuerpo = await res.json().catch(() => ({}));

if (res.ok) {
    console.error(
        "\n⚠️  El endpoint ACEPTÓ un correo inválido.\n" +
            "    Eso significa que este guion ya no es seguro: pudo haber creado\n" +
            "    un registro real. Revisa el esquema de rita-os antes de volver\n" +
            "    a correrlo.\n",
    );
    process.exit(2);
}

const detalles = cuerpo?.details ?? {};
const campos = Object.keys(detalles);
const inesperados = campos.filter((c) => c !== "email");

console.log(`\nPOST ${destino}`);
console.log(usandoEndpointDeEventos ? "  (endpoint de eventos)" : "  (puente — RITA_OS_EVENT_URL sin definir)");
console.log(`HTTP ${res.status} · campos rechazados: ${campos.join(", ") || "(ninguno)"}`);

if (!campos.includes("email")) {
    console.error(
        "\n⚠️  El correo inválido NO fue rechazado, así que esta prueba no\n" +
            "    prueba nada. Revisa que el endpoint valide el formato.\n",
    );
    process.exit(2);
}

const queCosa = usandoEndpointDeEventos ? "del registro" : "del puente";

if (inesperados.length) {
    console.error(`\n✗ El payload ${queCosa} NO es válido para rita-os.`);
    for (const c of inesperados) {
        console.error(`    ${c}: ${JSON.stringify(detalles[c])}`);
    }
    console.error(
        "\n  Con esto, cada registro real muere con 400 y no se guarda nada.\n",
    );
    process.exit(1);
}

console.log(`\n✓ El payload ${queCosa} es válido: solo se queja del correo,`);
console.log("  que es el centinela. Ningún registro fue creado.\n");
