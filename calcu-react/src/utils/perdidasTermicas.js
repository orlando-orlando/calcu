export function calcularPerdidas(datos) {
  return {
    total: 0,
    desglose: [
      { label: "Evaporación", valor: datos.evaporacion },
      { label: "Convección", valor: datos.conveccion },
      { label: "Radiación", valor: datos.radiacion },
      { label: "Transmisión", valor: datos.transmision },
      { label: "Infinity", valor: datos.infinity },
      { label: "Canal perimetral", valor: datos.canal },
      { label: "Tubería", valor: datos.tuberia }
    ]
  };
}
