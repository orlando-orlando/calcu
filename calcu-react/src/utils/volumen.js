export function volumen(datos, volumenCalculado = null) {
  // Si se pasó un volumen ya calculado (equivalente al window.valoresGlobales), usarlo primero
  if (volumenCalculado != null && !isNaN(volumenCalculado)) {
    const volGlobal = parseFloat(volumenCalculado);
    if (volGlobal > 0) return volGlobal;
  }

  // Si no, calcular desde las dimensiones
  const area   = parseFloat(datos.area)   || 0;
  const profMin = parseFloat(datos.profMin) || 0;
  const profMax = parseFloat(datos.profMax) || 0;

  let profProm = 0;
  if (profMin > 0 && profMax > 0) {
    profProm = (profMin + profMax) / 2;
  } else if (profMin > 0) {
    profProm = profMin;
  } else if (profMax > 0) {
    profProm = profMax;
  }

  return parseFloat((area * profProm).toFixed(1));
}