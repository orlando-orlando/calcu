export function qRadiacion(datos, mesMasFrio) {
  const sigma = 5.67e-8; // W/m²·K⁴
  const emisividad = 0.95;

  const area = parseFloat(datos.area) || 0;
  const tempAguaC = parseFloat(datos.tempDeseada) || 0;
  const techada = datos.techada === true || datos.techada === "si";

  if (!area || !tempAguaC) return 0;

  // Temperatura ambiente (°C)
  const tempAmbC = mesMasFrio?.tProm ?? tempAguaC;
  
  // Convertir a Kelvin
  const T_agua = tempAguaC + 273.15;
  const T_entorno = (tempAmbC - 1) + 273.15;

  const delta = Math.pow(T_agua, 4) - Math.pow(T_entorno, 4);
  if (delta <= 0) return 0;

  // Reducción por techado
  const factorTechado = techada ? 0.2 : 1.0;

  // Radiación (W)
  const Qrad_W = sigma * emisividad * delta * area * factorTechado;

  // Convertir a BTU/h
  const Qrad_BTUh = Qrad_W * 3.412142;

  /* =========================
     DEBUG
  ========================== */
  console.group("☀️ qRadiacion DEBUG");
  console.table({
    area_m2: area,
    tempAgua_C: tempAguaC,
    tempAmb_C: tempAmbC,
    techada,
    factorTechado,
    Qrad_W,
    Qrad_BTUh
  });
  console.groupEnd();
  /* ========================= */

  return Qrad_BTUh;
}