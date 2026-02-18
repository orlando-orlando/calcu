export function qConveccion(datos, mesMasFrio) {
  if (!mesMasFrio?.tProm) return 0;

  const constante = 0.6246;
  const area = parseFloat(datos.area) || 0;

  if (!area) return 0;

  // Temperaturas en °C
  const T_agua = mesMasFrio.tProm - 3;
  const T_aire = mesMasFrio.tProm;

  // Pérdida por convección (W)
  const Qconv_W = (constante * Math.pow(T_aire - T_agua, 4 / 3)) * area;

  // Convertir a BTU/h
  const Qconv_BTUh = Qconv_W * 3.412142;

  return Qconv_BTUh;
}