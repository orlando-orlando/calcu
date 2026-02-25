import { volumenPorGrupo } from "./volumenPorGrupo";

// flujoVolumen.js
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

// flujoFinal.js
import { volumenPorCircuito } from "./volumenPorCircuito";
import { flujoPorVolumen } from "./flujoVolumen";

export function flujoFinal(datos) {
  if (!datos?.cuerpos) return 0;

  const { general, jacuzzis } = volumenPorCircuito(datos.cuerpos);

  const flujos = [];

  // 🔹 Circuito general (alberca + chapoteadero)
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

  if (!flujos.length) return 0;

  return Math.max(...flujos);
}