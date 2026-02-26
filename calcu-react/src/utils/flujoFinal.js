// utils/flujoFinal.js
import { flujoPorVolumen } from "./flujoVolumen";
import { volumenPorCircuito } from "./volumenPorCircuito";

export function flujoFinal(datos) {
  if (!datos?.cuerpos) return 0;

  const { general, jacuzzis } = volumenPorCircuito(datos.cuerpos);
  const flujos = [];

  // 🔹 Circuito general (alberca + chapoteadero + asoleadero)
  if (general > 0 && Number.isFinite(Number(datos.tasaGeneral))) {
    const flujoGeneral = flujoPorVolumen(
      general,
      Number(datos.tasaGeneral)
    );
    if (flujoGeneral > 0) flujos.push(flujoGeneral);
  }

  // 🔹 Cada jacuzzi es un circuito independiente
  if (Number.isFinite(Number(datos.tasaJacuzzi))) {
    jacuzzis.forEach((volJacuzzi) => {
      const flujoJacuzzi = flujoPorVolumen(
        volJacuzzi,
        Number(datos.tasaJacuzzi)
      );
      if (flujoJacuzzi > 0) flujos.push(flujoJacuzzi);
    });
  }

  return flujos.length ? Math.max(...flujos) : 0;
}