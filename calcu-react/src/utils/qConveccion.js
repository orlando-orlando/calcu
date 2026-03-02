export function qConveccion(datos, mesMasFrio) {
  if (!mesMasFrio?.tProm) return 0;

  const area = parseFloat(datos.area) || 0;
  if (!area) return 0;

  const techada = datos.techada === true || datos.techada === "si";

  // Constante empírica (W/m²·°C^(4/3))
  const C = 0.6246;

  // Temperaturas (°C)
  const T_agua = parseFloat(datos.tempDeseada) || mesMasFrio.tProm;
  const T_aire = mesMasFrio.tProm;

  const deltaT = Math.max(T_agua - T_aire, 0);
  if (!deltaT) return 0;

  // Reducción por techado
  const factorTechado = techada ? 0.25 : 1.0;

  // Potencia por convección (W)
  const Qconv_W = ((C * Math.pow(deltaT, 4 / 3)) * area) * factorTechado;

  // Conversión a BTU/h
  const Qconv_BTUh = Qconv_W * 3.412142;

  /* =========================
     DEBUG
  ========================== */
  console.group("🌬️ qConveccion DEBUG");
  console.table({
    area_m2: area,
    T_agua_C: T_agua,
    T_aire_C: T_aire,
    deltaT_C: deltaT,
    techada,
    factorTechado,
    Qconv_W,
    Qconv_BTUh
  });
  console.groupEnd();
  /* ========================= */

  return Qconv_BTUh;
}