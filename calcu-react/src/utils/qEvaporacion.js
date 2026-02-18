import { calorVaporizacion, humedadAbsoluta } from "../data/clima";

export function qEvaporacion(datos, mesMasFrio) {
  // Validación: necesitamos el mes más frío con datos climáticos
  if (!mesMasFrio?.tProm) return 0;

  // Lectura de datos
  const area        = parseFloat(datos.area)        || 0;
  const tempDeseada = parseFloat(datos.tempDeseada) || 0;
  const techada     = datos.techada  === true || datos.techada  === "si";
  const cubierta    = datos.cubierta === true || datos.cubierta === "si";

  // Constantes
  const b = 6.9;
  const n = area / 5.6;

  // Datos climáticos del mes más frío
  const tProm    = mesMasFrio.tProm;
  const velViento = techada ? 0 : mesMasFrio.viento;
  const ga        = mesMasFrio.humedad / 100;

  // Calor de vaporización (primer tempC >= tempDeseada)
  const calorVapObj =
    calorVaporizacion.find(c => tempDeseada <= c.tempC) ??
    calorVaporizacion[calorVaporizacion.length - 1];
  const calorVap = calorVapObj.whKg;

  // Humedad absoluta We (a temp deseada) y Was (a temp ambiente)
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
    (((area * 16) + (133 * n)) * (we - ga * was) * calorVap / 1000 * 3412.14) *
    ((b * velViento / 100) + 1);

  // Reducción por cubierta térmica
  if (cubierta) qEvap *= 0.5;

  return qEvap;
}