// volumenPorCircuito.js
export function volumenPorCircuito(cuerpos) {
  let volumenGeneral = 0;
  const jacuzzis = [];

  cuerpos.forEach((c) => {
    const v = Number(c.volumen);
    if (!Number.isFinite(v) || v <= 0) return;

    if (c.tipo === "jacuzzi") {
      // Cada jacuzzi es un circuito independiente
      jacuzzis.push(v);
    } else {
      // Alberca + chapoteadero + asoleadero se combinan
      volumenGeneral += v;
    }
  });

  return {
    general: volumenGeneral,   // un solo circuito
    jacuzzis,                  // array de circuitos
  };
}