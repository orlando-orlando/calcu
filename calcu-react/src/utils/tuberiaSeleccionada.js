export function tuberiaSeleccionada(velocidades, tipo) {
  const limite = tipo === "succion" ? 4.5 : 6.5;

  let mejorTuberia   = null;
  let mejorVelocidad = -Infinity;

  for (let tuberia in velocidades) {
    const velocidad = velocidades[tuberia];
    if (velocidad <= limite && velocidad > mejorVelocidad) {
      mejorVelocidad = velocidad;
      mejorTuberia   = tuberia;
    }
  }

  return mejorTuberia
    ? `${mejorTuberia} (${mejorVelocidad.toFixed(2)} ft/s)`
    : "Ninguna cumple";
}