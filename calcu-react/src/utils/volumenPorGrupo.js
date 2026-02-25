import { volumen } from "./volumen";

export function volumenPorGrupo(datos, grupo = "general") {
  if (!datos?.cuerpos) return 0;

  const cuerposFiltrados = datos.cuerpos.filter(c =>
    grupo === "jacuzzi"
      ? c.tipo === "jacuzzi"
      : c.tipo !== "jacuzzi"
  );

  const total = cuerposFiltrados.reduce((acc, c) => {
    const v = Number(c.volumen);
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  return parseFloat(total.toFixed(1));
}