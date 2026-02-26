// volumenPorCircuito.js
export function volumenPorCircuito(cuerpos) {
  let volumenGeneral = 0;
  const jacuzzis = [];

  cuerpos.forEach((c) => {
    const v = Number(c.volumen);
    if (!Number.isFinite(v) || v <= 0) return;

    // 🔹 TODO cuerpo aporta a la filtración general
    volumenGeneral += v;

    // 🔹 Jacuzzis además tienen circuito de hidromasaje
    if (c.tipo === "jacuzzi") {
      jacuzzis.push(v);
    }
  });

  return {
    general: parseFloat(volumenGeneral.toFixed(1)),
    jacuzzis, // volúmenes individuales por jacuzzi
  };
}