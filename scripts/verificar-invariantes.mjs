#!/usr/bin/env node
/**
 * Invariantes de /registro que rompen SIN dar error.
 *
 * Cada regla de aquí es un error que ya ocurrió una vez. No son preferencias
 * de estilo: son cosas que se ven bien, compilan, pasan el lint y están mal.
 * Por eso viven en un check y no en un comentario — un comentario no detiene a
 * nadie, una prueba en rojo sí.
 *
 * ⚠️ Esto es análisis ESTÁTICO a propósito: lee archivos y nada más. No
 * construye, no levanta servidor, no abre navegador. Corre en menos de un
 * segundo y no puede quedarse sin memoria, que es lo que hace que un check
 * siga significando algo en vez de volverse ruido que todos se saltan.
 *
 * ⚠️ Lo que NO cubre, y hay que seguir midiendo con navegador: contrastes
 * reales, desbordes horizontales, que las tipografías carguen de verdad en vez
 * de caer al fallback. Eso necesita render. Que este script pase NO quiere
 * decir que la página esté bien — quiere decir que no volvió ninguno de estos
 * errores concretos.
 *
 * Uso:  npm run verify
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const leer = (p) => readFileSync(join(RAIZ, p), "utf8");

let fallas = 0;
const ok = (cond, regla, porque) => {
    if (cond) {
        console.log(`  ok    ${regla}`);
    } else {
        fallas++;
        console.log(`  FALLA ${regla}`);
        console.log(`        └─ ${porque}`);
    }
};

/** Quita comentarios para que una advertencia que menciona el error no cuente como el error. */
const sinComentarios = (s) =>
    s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const form = leer("components/registro/taller-form.tsx");
const ui = leer("components/registro/taller-ui.tsx");
const landing = leer("components/registro/taller-landing.tsx");
const css = leer("app/registro/registro.css");
const layout = leer("app/registro/layout.tsx");
const pagina = leer("app/registro/page.tsx");
const apartar = leer("app/registro/apartar/page.tsx");

const formLimpio = sinComentarios(form);
const uiLimpio = sinComentarios(ui);
const landingLimpio = sinComentarios(landing);

console.log("\n═══ CONSENTIMIENTO TCPA ═══");

ok(
    !/import\s*\{[^}]*\bEVENTO\b[^}]*\}\s*from/.test(formLimpio),
    "el formulario no importa EVENTO",
    "Si el consentimiento interpola EVENTO.tipo, cambiar el sustantivo del " +
        "evento reescribe de rebote el texto que se guarda como evidencia TCPA " +
        "junto con sms_consent_ip. Un cambio de copy no puede mover un registro legal.",
);

const consentimiento = (formLimpio.match(
    /const\s+TEXTO_CONSENTIMIENTO_SMS\s*=([\s\S]*?);/,
) || [])[1];

ok(
    Boolean(consentimiento),
    "TEXTO_CONSENTIMIENTO_SMS existe y vive suelto",
    "El texto del consentimiento tiene que ser una constante nombrada, no " +
        "estar incrustado en el JSX donde se edita como si fuera copy.",
);

ok(
    consentimiento && !/encuentro|taller|sesión|\bevento\b/i.test(consentimiento),
    "el consentimiento no nombra el evento",
    "Twilio registra un PROGRAMA de mensajes, no un evento. Si la frase nombra " +
        "el evento, cada evento nuevo obliga a revisar la campaña A2P 10DLC.",
);

ok(
    consentimiento && /Responde STOP/.test(consentimiento),
    'el consentimiento conserva "Responde STOP"',
    "Es requisito de la campaña A2P, no cortesía.",
);

ok(
    /const\s+EVENT_SLUG\s*=\s*"taller-2026-09-12"/.test(formLimpio),
    'EVENT_SLUG sigue siendo "taller-2026-09-12"',
    "Es identificador, no copy. Renombrarlo rompe la correlación con los " +
        "registros ya enviados, aunque la página ya no diga «taller».",
);

console.log("\n═══ COPY ═══");

/* «taller» sí puede aparecer en nombres de archivo (taller-form.tsx),
   en el slug (taller-2026-09-12) y en rutas; lo que no puede es aparecer
   como palabra suelta en texto visible. */
const palabraTaller = /(?<![-\w/])tallere?s?(?![-\w])/i;
for (const [nombre, src] of [
    ["taller-landing.tsx", landingLimpio],
    ["taller-ui.tsx", uiLimpio],
    ["taller-form.tsx", formLimpio],
]) {
    ok(
        !palabraTaller.test(src),
        `sin la palabra «taller» en ${nombre}`,
        'El sustantivo del evento vive en EVENTO.tipo. Un «taller» suelto es ' +
            "copy que no se va a mover cuando cambie el evento. Y «taller» " +
            "implica instrucción, que es justo lo que conviene no decir.",
    );
}

/* Rita no quiere el guion largo en la página. ⚠️ Nótese que se revisa sobre el
   código SIN comentarios: los comentarios sí lo usan, y no se ven. */
for (const [nombre, src] of [
    ["taller-landing.tsx", landingLimpio],
    ["taller-ui.tsx", uiLimpio],
    ["taller-form.tsx", formLimpio],
    ["apartar/page.tsx", sinComentarios(apartar)],
    ["listo/page.tsx", sinComentarios(leer("app/registro/listo/page.tsx"))],
    /* ⚠️ El CSS también cuenta: la viñeta de la columna «no» era un guion largo
       vía content:"—", y se veía en cada renglón. Y el `alt` del og:image lo
       lee el lector de pantalla aunque no se vea. */
    ["registro.css", sinComentarios(css)],
    ["page.tsx", sinComentarios(pagina)],
    /* ⚠️ cuenta-regresiva.tsx también renderiza en /registro. Hoy no tiene
       guiones largos visibles, pero estaba fuera de la lista: una vista que
       pinta texto y no está aquí es un hueco esperando. */
    ["cuenta-regresiva.tsx", sinComentarios(leer("components/registro/cuenta-regresiva.tsx"))],
]) {
    ok(
        !/—/.test(src),
        `sin guion largo (—) en ${nombre}`,
        "Rita pidió quitarlo de toda la página. ⚠️ No se borra y ya: cada uno " +
            "se sustituye por el signo que sostenga la misma pausa (dos puntos, " +
            "coma o punto). Borrarlo a secas deja las frases pegadas.",
    );
}

ok(
    /<h2[^>]*>\s*Rita Galaviz\s*<\/h2>/.test(landingLimpio),
    "el título de la sección de Rita es solo su nombre",
    "Rita lo pidió así. El invitado especial tiene su propio bloque más abajo, " +
        "con su propio eyebrow.",
);

ok(
    !/Y no llega sola/.test(landingLimpio),
    'sin el párrafo "Y no llega sola"',
    "Rita lo quitó. Además era el único lugar que prometía que el equipo " +
        "estaría en la sala, lo que obligaba a conseguir una foto del equipo.",
);

console.log("\n═══ CREDENCIALES Y LICENCIAS ═══");

ok(
    !/Top Producer(?!\s+(?:de\s+)?HomeSmart)/.test(landingLimpio),
    'ningún "Top Producer" sin decir quién lo otorga',
    "Una afirmación de producción sin dueño es lo primero que revisa un broker " +
        "designado. Quien lo otorga es HomeSmart y así tiene que decirlo, en el " +
        "párrafo y en las fichas.",
);

ok(
    !/NAHREP|Top 250/i.test(landingLimpio),
    "sin NAHREP ni Top 250",
    "⚠️ Van juntos: el «Top 250» ES un premio de NAHREP (NAHREP Top 250 Latino " +
        "Agents Awards). Con NAHREP fuera por decisión de Rita, dejar «Top 250» " +
        "sería citar a NAHREP sin nombrarlo — una credencial sin fuente. Se " +
        "regresan los dos o ninguno.",
);

/* Bloque del invitado: mientras diga "Por confirmar" no hay nada que exigir.
   En cuanto lleve un nombre real, el nombre no viaja solo. */
const invitado = (landingLimpio.match(
    /className="invitado"[\s\S]*?<\/section>/,
) || [""])[0];
const invitadoConNombre = /<h3>(?!\s*Por confirmar)[^<]+<\/h3>/.test(invitado);
ok(
    !invitadoConNombre || /NMLS#\s*\d{4,}/.test(invitado),
    "si el invitado tiene nombre, tiene NMLS",
    "⚠️ Un originador de crédito nombrado en publicidad va con su NMLS y su " +
        "compañía: es el identificador con el que cualquiera lo verifica en NMLS " +
        "Consumer Access. Los tres juntos o ninguno.",
);
ok(
    !invitadoConNombre || !/\b(desde el? \d{4}|\d+ años)\b/i.test(invitado),
    "la bio del invitado no afirma años de experiencia sin confirmar",
    "⚠️ Los datos que llegaron se contradecían: «desde 2025» junto a «los " +
        "últimos 12 años». Puestos uno al lado del otro dan a entender doce " +
        "años originando crédito, y eso es una afirmación de experiencia, no un " +
        "adorno. Se agrega cuando Santos confirme en qué capacidad son.",
);
ok(
    !invitadoConNombre || !/refinanci|consolidar deuda|reducir (los )?pagos/i.test(invitado),
    "la bio del invitado no promete refinanciar ni bajar pagos",
    "⚠️ Consolidar deuda con un refinanciamiento es de lo más regulado en " +
        "publicidad hipotecaria: insinuar ahorro sin las advertencias completas " +
        "es justo lo que se sanciona. Y no es de lo que trata este encuentro.",
);
ok(
    !invitadoConNombre || /New American Funding|Compañía/i.test(invitado),
    "si el invitado tiene nombre, dice para quién trabaja",
    "⚠️ Su compañía es distinta de HomeSmart, y eso es justo lo que el lector " +
        "necesita saber. Además el marketing conjunto entre una correduría y un " +
        "prestamista cae bajo RESPA §8: esconder la afiliación es lo contrario " +
        "de lo que conviene.",
);

ok(
    !/Vivienda justa para todos/.test(uiLimpio) && !/⌂/.test(uiLimpio),
    "vivienda justa: solo el eslogan, sin traducción ni casita dibujada",
    '"Vivienda justa para todos" es una frase inventada: no es de HUD ni de ' +
        "nadie. Y una casita hecha con el carácter ⌂ se lee como marca mal " +
        "copiada. Si hace falta el logotipo, va el archivo oficial de HUD.",
);

ok(
    /Equal Housing Opportunity/.test(uiLimpio),
    "el eslogan de vivienda justa sigue en el pie",
    "La página se dirige de forma explícita a la comunidad latina y el origen " +
        "nacional es clase protegida.",
);

console.log("\n═══ PUENTE DE REGISTROS ═══");

const evento = leer("app/api/evento/route.ts");
const eventoLimpio = sinComentarios(evento);
/* Medidos contra el endpoint real, no supuestos. Si rita-os amplía el enum,
   se amplía aquí — pero NO se inventa un valor: uno que el esquema no acepta
   tumba cada registro con 400 y no se guarda nada. Ya pasó, en producción. */
const FUENTES_VALIDAS = ["website","referral","open_house","zillow","sign_call",
    "paid_ads","social_media","sphere","other"];
const fuente = (eventoLimpio.match(/lead_source:\s*"([^"]+)"/) || [])[1];
ok(
    Boolean(fuente) && FUENTES_VALIDAS.includes(fuente),
    `el puente usa un lead_source que rita-os acepta (${fuente ?? "ninguno"})`,
    "`lead_source` es un ENUM en rita-os. Un valor fuera de la lista hace que " +
        "CADA registro muera con 400 y no se guarde nada — sin error visible " +
        "para nadie más que la persona que llenó el formulario. Valores " +
        "válidos: " + FUENTES_VALIDAS.join(" · "),
);
ok(
    /\[Event: \$\{eventSlug\}\]/.test(eventoLimpio),
    "el puente conserva la marca [Event: …] en el mensaje",
    "Como la marca ya no puede viajar en `lead_source` (es enum), el prefijo " +
        "del mensaje es lo ÚNICO que identifica estos registros como del " +
        "evento. Sin él no hay forma de separarlos ni de excluirlos del SLA.",
);
ok(
    !/error:\s*\n?\s*\(cuerpo as/.test(eventoLimpio),
    "el error de rita-os no se le muestra a la persona",
    "Se reenviaba tal cual y la persona vio «Invalid form data» en inglés, en " +
        "una página en español, describiendo un problema entre servidores que " +
        "ella no puede arreglar. Va al log; ella recibe una salida.",
);

console.log("\n═══ TÍTULOS ═══");

ok(
    /const TITULO = "[^"]*"/.test(pagina) &&
        !/const TITULO = "[^"]*Galaviz Group"/.test(pagina),
    "TITULO no trae la marca escrita",
    "El layout raíz define title.template = «%s · Galaviz Group», así que la " +
        "marca se pega sola. Si TITULO también la trae, sale dos veces en la " +
        "pestaña y en Google.",
);

ok(
    /const TITULO_SOCIAL = `\$\{TITULO\} · Galaviz Group`/.test(pagina) &&
        /title: TITULO_SOCIAL/.test(pagina),
    "openGraph y twitter usan TITULO_SOCIAL",
    "openGraph y twitter NO pasan por el template: lo que se escribe ahí es " +
        "literal. Sin la marca explícita, la tarjeta de WhatsApp sale sin marca.",
);

console.log("\n═══ MARCA Y COLOR ═══");

for (const [nombre, src] of [
    ["registro.css", css],
    ["taller-landing.tsx", landing],
    ["taller-ui.tsx", ui],
]) {
    ok(
        !/#800020/i.test(src),
        `sin rastros del burgundy anterior en ${nombre}`,
        "El rojo de marca es #990000 (Rojo Patrimonial).",
    );
}

for (const [nombre, src] of [
    ["taller-ui.tsx", uiLimpio],
    ["registro-landing.tsx", sinComentarios(leer("components/registro/registro-landing.tsx"))],
]) {
    ok(
        !/brand\/homesmart-logo\.svg/.test(src),
        `${nombre} no usa el logo de HomeSmart a color`,
        "El rombo de HomeSmart es #CD1935 y choca con nuestro #990000 a " +
            "centímetros en el encabezado. Va en un solo color: blanco sobre " +
            "oscuro, negro sobre claro. ⚠️ Y nunca repintado de #990000: es " +
            "marca registrada.",
    );
}

for (const archivo of [
    "public/homesmart-logo-black.svg",
    "public/homesmart-logo-white.svg",
]) {
    const svg = existsSync(join(RAIZ, archivo)) ? leer(archivo) : "";
    ok(
        svg && !/#990000/i.test(svg),
        `${archivo.split("/").pop()} no está repintado con nuestro rojo`,
        "Recolorear el logo de una franquicia a nuestro color de marca es un " +
            "problema distinto y peor que el choque que resuelve.",
    );
}

/* Un .eyebrow sin `light` pinta el texto de var(--burgundy). Sobre la banda
   burgundy eso es el mismo color del fondo: contraste 1.00, invisible. Sobre
   índigo da 1.60, que el manual de paleta prohíbe.

   Se parte por <section> en vez de usar una ventana de N caracteres: una
   ventana fija se desborda a la sección siguiente y acusa eyebrows que no
   están ahí. (Pasó: la primera versión de este check daba verde con el error
   puesto, que es peor que no tenerlo.)

   ⚠️ Y la regla está INVERTIDA a propósito: se listan los fondos CLAROS y todo
   lo demás se trata como oscuro. La primera versión enumeraba los oscuros
   (`band|burg|dark`) y dejaba fuera el hero, que es `className="hero"` a
   secas: no empezaba por `section` ni traía un token oscuro, así que el
   eyebrow del hero —que va sobre índigo— no estaba cubierto. Enumerar lo
   prohibido deja huecos cada vez que aparece un caso nuevo; enumerar lo
   permitido falla del lado seguro.

   Consecuencia buscada: una sección clara NUEVA tiene que declarar
   `grad light` o este check la va a reclamar. Es lo correcto — `grad light`
   es como el sistema marca los fondos claros. */
const esClara = (s) => /^\s*className="[^"]*grad light/.test(s);
const eyebrowsSinLight = landingLimpio
    .split("<section")
    .slice(1)
    .filter((s) => !esClara(s) && /className="eyebrow"/.test(s)).length;
ok(
    eyebrowsSinLight === 0,
    "ningún .eyebrow sin `light` sobre fondo oscuro (hero, dark o banda)",
    "`.eyebrow` a secas queda burgundy: 1.00 sobre la banda burgundy " +
        "(invisible) y 1.60 sobre el índigo del hero y de las secciones dark. " +
        "La variante correcta es `eyebrow light` (oro): 4.75 sobre la banda, " +
        "7.60 sobre índigo.",
);

console.log("\n═══ TIPOGRAFÍA E IMÁGENES ═══");

ok(
    /Newsreader\(\{[\s\S]*?axes:\s*\["opsz"\]/.test(layout),
    'Newsreader declara axes: ["opsz"]',
    "Sin el eje óptico, next/font sirve el corte para texto chico y el titular " +
        "del hero gana un renglón. Ya pasó con Fraunces y costó una tarde.",
);

ok(
    /rita-retrato\.jpg/.test(landing) && /rita-avatar\.jpg/.test(apartar),
    "las dos fotos de Rita siguen separadas",
    "La tarjeta es 4:5 (cabeza a manos) y el avatar es cuadrado (rostro). El " +
        "original es un plano de tres cuartos: un solo recorte deja la cara " +
        "diminuta en /apartar o la tarjeta cortada en la landing.",
);

for (const f of ["public/rita-retrato.jpg", "public/rita-avatar.jpg"]) {
    ok(existsSync(join(RAIZ, f)), `${f} existe`, "La vista lo referencia.");
}

console.log(
    fallas
        ? `\n✗ ${fallas} invariante(s) rota(s)\n`
        : "\n✓ todas las invariantes en pie\n",
);
process.exit(fallas ? 1 : 0);
