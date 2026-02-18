export function qRadiacion(datos) {
  const sigma      = 5.67e-8; // Constante de Stefan-Boltzmann (W/m²K⁴)
  const emisividad = 0.95;

  const tempAguaC = parseFloat(datos.tempDeseada) || 0;
  const area      = parseFloat(datos.area)        || 0;

  if (!tempAguaC || !area) return 0;

  // Convertir a Kelvin
  const T_agua       = tempAguaC + 273;
  const T_cerramiento = (tempAguaC - 1) + 273;

  // Pérdida por radiación (W)
  const Qrad_W = sigma * emisividad * (Math.pow(T_agua, 4) - Math.pow(T_cerramiento, 4)) * area;

  // Convertir a BTU/h
  const Qrad_BTUh = Qrad_W * 3.412142;

  return Qrad_BTUh;
}