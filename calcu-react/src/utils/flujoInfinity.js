export function flujoInfinity(datos) {
  const muroInfinity  = parseFloat(datos.largoInfinity) || 0;
  const profCortina   = parseFloat(datos.profCortina)   || 0;

  if (muroInfinity <= 0 || profCortina <= 0) return 0;

  const gpm = parseFloat(
    (36 * (muroInfinity / 0.3048) * Math.pow(profCortina / 25.4, 1.5)).toFixed(1)
  );

  return gpm;
}