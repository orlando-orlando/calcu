import { volumen } from "./volumen";

/*
 * flujoVolumen
 * ─────────────────────────────────────────────────────────────────
 * Calcula el flujo en GPM para el sistema.
 *
 * Con la nueva estructura de datos, el campo `tasaRotacion` ya no existe.
 * Ahora hay dos grupos:
 *
 *   datos.tasaGeneral  → tasa (h) para los cuerpos NO-jacuzzi  ("4" | "6" | "8")
 *   datos.tasaJacuzzi  → tasa (h) para los jacuzzis            ("0.5" | "1")
 *
 * El parámetro `grupo` indica cuál flujo calcular:
 *   "general"  → usa tasaGeneral  + volumen de cuerpos no-jacuzzi
 *   "jacuzzi"  → usa tasaJacuzzi  + volumen de cuerpos jacuzzi
 *
 * Si el sistema no tiene jacuzzi (tasaJacuzzi === null), solo hay un flujo
 * y se llama con grupo = "general".
 *
 * Para sistemas mixtos, se comparan ambos flujos y se usa el mayor.
 * ─────────────────────────────────────────────────────────────────
 */
export function flujoVolumen(datos, grupo = "general", volumenCalculado = null) {
  const vol = volumen(datos, volumenCalculado, grupo);

  let tasa;
  if (grupo === "jacuzzi") {
    tasa = parseFloat(datos.tasaJacuzzi);
  } else {
    tasa = parseFloat(datos.tasaGeneral);
  }

  // Guardia: si por algún motivo la tasa no es válida, lanza error en lugar
  // de silenciosamente usar 6h y dar resultados incorrectos.
  if (!tasa || isNaN(tasa) || tasa <= 0) {
    console.warn(`flujoVolumen: tasa inválida para grupo "${grupo}"`, datos);
    return 0;
  }

  // Volumen en m³ → litros → litros/min → GPM
  const lpm = parseFloat((vol * 1000 / 60 / tasa).toFixed(1));
  const gpm = parseFloat((lpm / 3.7854).toFixed(1));

  return gpm;
}

/*
 * flujoFinal
 * ─────────────────────────────────────────────────────────────────
 * Para sistemas mixtos (alberca + jacuzzi), calcula ambos flujos
 * y devuelve el mayor — ese es el que determina la bomba principal.
 * ─────────────────────────────────────────────────────────────────
 */
export function flujoFinal(datos, volumenCalculado = null) {
  const tieneJacuzzi = datos?.tasaJacuzzi !== null && datos?.tasaJacuzzi !== undefined;
  const tieneGeneral = datos?.tasaGeneral !== null && datos?.tasaGeneral !== undefined;

  if (tieneGeneral && tieneJacuzzi) {
    const gpmGeneral  = flujoVolumen(datos, "general",  volumenCalculado);
    const gpmJacuzzi  = flujoVolumen(datos, "jacuzzi",  volumenCalculado);
    return Math.max(gpmGeneral, gpmJacuzzi);
  }

  if (tieneJacuzzi) return flujoVolumen(datos, "jacuzzi", volumenCalculado);
  return flujoVolumen(datos, "general", volumenCalculado);
}