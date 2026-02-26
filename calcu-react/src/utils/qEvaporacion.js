import { calorVaporizacion, humedadAbsoluta } from "../data/clima";

export function qEvaporacion(datos, mesMasFrio) {
  // Validación
  if (!mesMasFrio?.tProm) return 0;

  // Lectura de datos
  const area        = parseFloat(datos.area)        || 0;
  const tempDeseada = parseFloat(datos.tempDeseada) || 0;
  const techada     = datos.techada  === true || datos.techada  === "si";
  const cubierta    = datos.cubierta === true || datos.cubierta === "si";

  // Constantes
  const b = 6.9;
  const n = area / 5.6; // "nadadores equivalentes"

  // Datos climáticos
  const tProm     = mesMasFrio.tProm;
  const velViento = techada ? 0 : mesMasFrio.viento;
  const ga        = mesMasFrio.humedad / 100;

  // Calor de vaporización
  const calorVapObj =
    calorVaporizacion.find(c => tempDeseada <= c.tempC) ??
    calorVaporizacion[calorVaporizacion.length - 1];
  const calorVap = calorVapObj.whKg;

  // Humedad absoluta
  const weObj =
    humedadAbsoluta.find(h => tempDeseada <= h.tempC) ??
    humedadAbsoluta[humedadAbsoluta.length - 1];
  const wasObj =
    humedadAbsoluta.find(h => tProm <= h.tempC) ??
    humedadAbsoluta[humedadAbsoluta.length - 1];

  const we  = weObj.kgKg;
  const was = wasObj.kgKg;

  // Fórmula de evaporación
  let qEvap =
    (((area * 16) + (133 * n) *
      (we - ga * was) *
      calorVap / 1000 * 3412.14)) *
    ((b * velViento / 100) + 1);

  if (cubierta) qEvap *= 0.5;

  /* =========================
     DEBUG EN CONSOLA
  ========================== */
  console.group("🔥 qEvaporacion DEBUG");
  console.table({
    area_m2: area,
    nadadores_n: n,
    tempDeseada_C: tempDeseada,
    tempPromAmb_C: tProm,
    We_kgkg: we,
    Ga_relativa: ga,
    Was_kgkg: was,
    calorVap_Whkg: calorVap,
    b,
    viento_km: velViento,
    qEvap_BTUh: qEvap
  });
  console.groupEnd();
  /* ========================= */

  return qEvap;
}