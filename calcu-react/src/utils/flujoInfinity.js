export function flujoInfinity(datos) {
  const muroInfinity  = parseFloat(datos.largoInfinity)   || 0;
  const alturaCortina = parseFloat(datos.alturaDesborde)  || 0;

  const gpm = parseFloat(
    (36 * (muroInfinity / 0.3048) * Math.pow(alturaCortina / 25.4, 1.5)).toFixed(1)
  );

  return gpm;
}