import { volumen } from "./volumen";

const tasasPorUso = {
  residencial: 8,
  publica: 6,
  competencia: 6,
  hidromasaje: 0.5,
  parque: 4
};

export function flujoSistema(datos) {
  if (!datos?.cuerpos?.length) return 0;

  // 🔹 calcular flujo por cuerpo
  const flujos = datos.cuerpos.map((cuerpo) => {
    if (!cuerpo.uso) return 0;

    const vol = volumen(cuerpo);
    const tasa = tasasPorUso[cuerpo.uso] ?? 6;

    const gpm = (vol * 1000 / 60 / tasa) / 3.7854;
    return Number(gpm.toFixed(1));
  });

  // 🔹 el flujo del sistema es el MAYOR
  return Math.max(...flujos);
}