export function qTransmision(datos, mesMasFrio) {
  const C_T        = 1.5; // W/m²°C
  const area       = parseFloat(datos.area)        || 0;
  const profMax    = parseFloat(datos.profMax)     || 0;
  const tempDeseada = parseFloat(datos.tempDeseada) || 0;

  const tempExterior = mesMasFrio?.tProm ?? 0;

  if (area <= 0 || tempDeseada <= 0 || !mesMasFrio?.tProm) return 0;

  // Superficie de cerramiento
  const S = area + (Math.sqrt(area) * 4) * profMax;

  // Pérdida por transmisión (W)
  const Q = C_T * S * (tempDeseada - tempExterior);

  // Convertir a BTU/h
  const Q_BTU_h = Q * 3.412;

  return Q_BTU_h;
}