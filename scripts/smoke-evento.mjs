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

const URL_CAPTURE =
    process.env.RITA_OS_CAPTURE_URL ||
    "https://os.galavizgroup.com/api/public/opportunities/capture";

/** El correo inválido es lo que garantiza que nada se guarde. NO lo arregles. */
const CORREO_CENTINELA = "invalido";

const payload = {
    first_name: "Prueba",
    last_name: "Humo",
    email: CORREO_CENTINELA,
    phone: "6025550134",
    lead_type: "buyer",
    lead_source: "other",
    sms_consent: "no",
    marketing_email_consent: false,
    message: "[Event: taller-2026-09-12]\n[Interest: First-time buyer]",
};

const res = await fetch(URL_CAPTURE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

console.log(`\nPOST ${URL_CAPTURE}`);
console.log(`HTTP ${res.status} · campos rechazados: ${campos.join(", ") || "(ninguno)"}`);

if (!campos.includes("email")) {
    console.error(
        "\n⚠️  El correo inválido NO fue rechazado, así que esta prueba no\n" +
            "    prueba nada. Revisa que el endpoint valide el formato.\n",
    );
    process.exit(2);
}

if (inesperados.length) {
    console.error("\n✗ El payload del puente NO es válido para rita-os.");
    for (const c of inesperados) {
        console.error(`    ${c}: ${JSON.stringify(detalles[c])}`);
    }
    console.error(
        "\n  Con esto, cada registro real muere con 400 y no se guarda nada.\n",
    );
    process.exit(1);
}

console.log("\n✓ El payload del puente es válido: solo se queja del correo,");
console.log("  que es el centinela. Ningún registro fue creado.\n");
