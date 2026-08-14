"use client";

import { useSyncExternalStore } from "react";

/**
 * Cuenta regresiva al taller — días : horas : minutos.
 *
 * Tres trampas, resueltas a propósito:
 *
 * 1. **Zona horaria.** El taller es a las 10:00 de Phoenix. Arizona NO observa
 *    horario de verano, así que es UTC−7 todo el año y el instante se fija con
 *    offset explícito. Escribirlo sin offset lo interpretaría en la zona de
 *    quien mira la página: alguien en Ciudad de México vería una hora menos y
 *    alguien en Los Ángeles una más.
 *
 * 2. **Hidratación.** Si el HTML del servidor trajera un número, el del cliente
 *    sería otro medio segundo después y React tiraría un error de hidratación.
 *    Se resuelve con `useSyncExternalStore`, que es el primitivo hecho para
 *    leer un valor mutable de fuera de React —aquí, el reloj—: su
 *    `getServerSnapshot` devuelve `null`, así que el servidor y el primer
 *    render del cliente pintan el mismo hueco vacío (con el alto reservado para
 *    que no salte el diseño) y el número aparece en el render siguiente.
 *    Hacerlo con `useState` + `useEffect` funcionaría, pero además de disparar
 *    la regla `react-hooks/set-state-in-effect` obliga a un render extra.
 *
 * 3. **Después del evento.** Nunca muestra negativos: pasado el instante, el
 *    componente no renderiza nada. Una cuenta en −3 días es peor que no tener
 *    cuenta.
 */

/** 12 de septiembre de 2026, 10:00 en Phoenix (Arizona = UTC−7 todo el año). */
export const INICIO_TALLER = "2026-09-12T10:00:00-07:00";

type Restante = { dias: number; horas: number; minutos: number };

function calcular(hasta: number): Restante | null {
    const ms = hasta - Date.now();
    if (ms <= 0) return null;
    const min = Math.floor(ms / 60000);
    return {
        dias: Math.floor(min / 1440),
        horas: Math.floor((min % 1440) / 60),
        minutos: min % 60,
    };
}

/**
 * Cada 20 s: los minutos cambian cada 60, así que el número nunca se ve
 * atrasado más de un tercio de minuto, y no se gasta un intervalo por segundo.
 */
function suscribir(avisar: () => void) {
    const id = window.setInterval(avisar, 20_000);
    return () => window.clearInterval(id);
}

/** Cubeta de 20 s: valor estable entre ticks, como exige getSnapshot. */
const cubeta = () => Math.floor(Date.now() / 20_000);
const enServidor = () => null;

export function CuentaRegresiva({ etiqueta }: { etiqueta?: string }) {
    const tick = useSyncExternalStore(suscribir, cubeta, enServidor);

    // Servidor y primer render del cliente: hueco con el alto reservado.
    if (tick === null) {
        return <div className="cuenta-wrap" data-vacio="1" aria-hidden="true" />;
    }

    const r = calcular(new Date(INICIO_TALLER).getTime());

    // El taller ya pasó: no se muestra nada.
    if (!r) return null;

    const unidades: [number, string][] = [
        [r.dias, r.dias === 1 ? "día" : "días"],
        [r.horas, r.horas === 1 ? "hora" : "horas"],
        [r.minutos, r.minutos === 1 ? "minuto" : "minutos"],
    ];

    const legible = `Faltan ${r.dias} días, ${r.horas} horas y ${r.minutos} minutos para el taller`;

    return (
        <div className="cuenta-wrap">
            <p className="cuenta-lbl">{etiqueta ?? "Faltan"}</p>
            {/*
             * `aria-label` con el texto completo y el resto oculto al lector:
             * leer "12 : 04 : 37" número por número no significa nada. Sin
             * `aria-live`, a propósito — un cambio anunciado cada minuto sería
             * una interrupción constante.
             */}
            <div className="cuenta" role="timer" aria-label={legible}>
                {unidades.map(([valor, nombre], i) => (
                    <div key={nombre} style={{ display: "contents" }}>
                        {i > 0 && (
                            <span className="sep" aria-hidden="true">
                                :
                            </span>
                        )}
                        <div className="u" aria-hidden="true">
                            <b>{String(valor).padStart(2, "0")}</b>
                            <span>{nombre}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
