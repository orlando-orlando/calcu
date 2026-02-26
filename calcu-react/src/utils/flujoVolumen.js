// utils/flujoVolumen.js
export function flujoPorVolumen(vol, tasa) {
  if (
    !Number.isFinite(vol) ||
    !Number.isFinite(tasa) ||
    vol <= 0 ||
    tasa <= 0
  ) {
    return 0;
  }

  // m³ → L → L/min → GPM
  const lpm = (vol * 1000) / (60 * tasa);
  const gpm = lpm / 3.7854;

  return parseFloat(gpm.toFixed(1));
}