import { volumen } from "./volumen";

export function flujoVolumen(datos, volumenCalculado = null) {
  const vol       = volumen(datos, volumenCalculado);
  const rotacion  = parseFloat(datos.tasaRotacion) || 6; // default 6h si no hay selección

  // Litros/min → galones/min
  const lpm = parseFloat((vol * 1000 / 60 / rotacion).toFixed(1));
  const gpm = parseFloat((lpm / 3.7854).toFixed(1));

  return gpm;
}