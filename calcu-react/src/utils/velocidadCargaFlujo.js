export function velocidadCargaFlujo(flujoMaximo) {
  const diametroTuberia = {
    "tuberia 1.50":  1.61,
    "tuberia 2.00":  2.07,
    "tuberia 2.50":  2.47,
    "tuberia 3.00":  3.07,
    "tuberia 4.00":  4.03,
    "tuberia 6.00":  6.07,
    "tuberia 8.00":  7.98,
    "tuberia 10.00": 9.98,
    "tuberia 12.00": 11.89,
    "tuberia 14.00": 13.13,
    "tuberia 16.00": 14.94,
    "tuberia 18.00": 16.81
  };

  const velocidadFlujo = {};
  const cargaFlujo     = {};

  for (let tuberia in diametroTuberia) {
    const d = diametroTuberia[tuberia];

    velocidadFlujo[tuberia] =
      flujoMaximo * 0.408498 / Math.pow(d, 2);

    cargaFlujo[tuberia] =
      10.536 * 100 * Math.pow(flujoMaximo, 1.852) /
      (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
  }

  return { velocidadFlujo, cargaFlujo };
}