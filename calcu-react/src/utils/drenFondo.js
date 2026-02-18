export function fix2(v) {
  return (parseFloat(v) || 0).toFixed(2);
}

export function drenFondo(flujoMaximo, tipoDrenFondo, datos) {
  const area = parseFloat(datos.area) || 0;

  const diametros = {
    "tuberia 1.50": 1.61,
    "tuberia 2.00": 2.07,
    "tuberia 2.50": 2.47,
    "tuberia 3.00": 3.07,
    "tuberia 4.00": 4.03,
    "tuberia 6.00": 6.07,
    "tuberia 8.00": 7.98,
    "tuberia 10.00": 9.98,
    "tuberia 12.00": 11.89,
    "tuberia 14.00": 13.13,
    "tuberia 16.00": 14.94,
    "tuberia 18.00": 16.81
  };

  const teeLinea = {
    "tuberia 1.50": 5.60,
    "tuberia 2.00": 7.70,
    "tuberia 2.50": 9.30,
    "tuberia 3.00": 12.0,
    "tuberia 4.00": 2.80,
    "tuberia 6.00": 3.80,
    "tuberia 8.00": 4.70,
    "tuberia 10.00": 5.20,
    "tuberia 12.00": 6.00,
    "tuberia 14.00": 6.00,
    "tuberia 16.00": 6.00,
    "tuberia 18.00": 6.00
  };

  const teeBranch = {
    "tuberia 1.50": 9.90,
    "tuberia 2.00": 12.0,
    "tuberia 2.50": 13.0,
    "tuberia 3.00": 17.0,
    "tuberia 4.00": 12.0,
    "tuberia 6.00": 18.0,
    "tuberia 8.00": 24.0,
    "tuberia 10.00": 30.0,
    "tuberia 12.00": 34.0,
    "tuberia 14.00": 34.0,
    "tuberia 16.00": 34.0,
    "tuberia 18.00": 34.0
  };

  const codo = {
    "tuberia 1.50": 7.40,
    "tuberia 2.00": 8.50,
    "tuberia 2.50": 9.30,
    "tuberia 3.00": 11.0,
    "tuberia 4.00": 5.90,
    "tuberia 6.00": 8.90,
    "tuberia 8.00": 12.0,
    "tuberia 10.00": 14.0,
    "tuberia 12.00": 17.0,
    "tuberia 14.00": 17.0,
    "tuberia 16.00": 17.0,
    "tuberia 18.00": 17.0
  };

  const reduccion = {
    "tuberia 1.50": 10.0,
    "tuberia 2.00": 12.0,
    "tuberia 2.50": 12.0,
    "tuberia 3.00": 15.0,
    "tuberia 4.00": 20.0,
    "tuberia 6.00": 25.0,
    "tuberia 8.00": 30.0,
    "tuberia 10.00": 35.0,
    "tuberia 12.00": 40.0,
    "tuberia 14.00": 45.0,
    "tuberia 16.00": 50.0,
    "tuberia 18.00": 55.0
  };

  // === Capacidad del dren según tipo ===
  let capacidadDren = 0;
  if (tipoDrenFondo === "1.5")       capacidadDren = 50;
  else if (tipoDrenFondo === "2.0")  capacidadDren = 95;
  else if (tipoDrenFondo === "7.5")  capacidadDren = 125;
  else if (tipoDrenFondo === "8.0")  capacidadDren = 130;
  else if (tipoDrenFondo === "9.0")  capacidadDren = 135;
  else if (tipoDrenFondo === "12.0") capacidadDren = 235;
  else if (tipoDrenFondo === "18.0") capacidadDren = 450;

  // === Número de drenes ===
  let numDrenFondoFinal = Math.ceil((flujoMaximo * 2) / capacidadDren);
  if (numDrenFondoFinal % 2 !== 0) numDrenFondoFinal++;

  // === Cálculos básicos ===
  const raizArea = Math.sqrt(area);
  const flujoPorDren = flujoMaximo / numDrenFondoFinal;
  const longitudEntreDrenes = raizArea / (numDrenFondoFinal + 1);
  const resultadoDF = [];
  let sumaCargaTramos = 0;
  let flujoRestante = flujoMaximo;
  let diametroAnterior = null;

  const profMin = parseFloat(datos.profMin) || 0;
  const profMax = parseFloat(datos.profMax) || 0;
  const profundidad = Math.max(profMin, profMax);
  let diametroMax = 0;

  // === Resumen por diámetro ===
  const resumenTramosDF = {};
  const addDiam = (obj, d) => {
    if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };

  // --- Tramo especial: distancia al cuarto de máquinas ---
  const distanciaCMDF = parseFloat(datos.distCuarto) || 0;
  let tablaDistanciaCMDF = null;

  if (distanciaCMDF > 0) {
    let flujoCMDF = flujoMaximo;
    let diametroCMDF = null;
    let velocidadCMDF = -Infinity;
    let cargaCMDF = null;
    let mejorTubCMDF = null;
    let mejorVelCMDF = null;
    let mejorCargaCMDF = null;

    for (let tub in diametros) {
      const d = diametros[tub];
      const vel = flujoCMDF * 0.408498 / (d * d);
      mejorTubCMDF = tub;
      mejorVelCMDF = vel;
      mejorCargaCMDF =
        10.536 * 100 * Math.pow(flujoCMDF, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

      if (vel <= 4.5 && vel > velocidadCMDF) {
        diametroCMDF = tub;
        velocidadCMDF = vel;
        cargaCMDF = mejorCargaCMDF;
      }
    }

    if (!diametroCMDF) {
      diametroCMDF = mejorTubCMDF;
      velocidadCMDF = mejorVelCMDF;
      cargaCMDF = mejorCargaCMDF;
    }

    const longitudCMDF_ft = distanciaCMDF * 3.281;
    const cargaTramoCMDF = (longitudCMDF_ft * cargaCMDF) / 100;
    const cantidadCodosCMDF = 1;
    const longEqCodoCMDF = codo[diametroCMDF];
    const cargaCodoCMDF = (longEqCodoCMDF * cargaCMDF) / 100;
    const cargaTotalCMDF = cargaTramoCMDF + cargaCodoCMDF;

    tablaDistanciaCMDF = {
      distanciaCMDF: fix2(distanciaCMDF),
      flujoCMDF: fix2(flujoCMDF),
      tuberiaCMDF: diametroCMDF,
      velocidadCMDF: fix2(velocidadCMDF),
      cargaBaseCMDF: fix2(cargaCMDF),
      cargaTramoCMDF: fix2(cargaTramoCMDF),
      cantidadCodosCMDF: cantidadCodosCMDF,
      longEqCodoCMDF: fix2(longEqCodoCMDF),
      cargaCodoCMDF: fix2(cargaCodoCMDF),
      cargaTotalCMDF: fix2(cargaTotalCMDF)
    };

    if (!resumenTramosDF[diametroCMDF])
      resumenTramosDF[diametroCMDF] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosDF[diametroCMDF].tuberia_m += distanciaCMDF;
    resumenTramosDF[diametroCMDF].codos += cantidadCodosCMDF;
  }

  // --- Ciclo principal de tramos ---
  for (let i = 0; i < numDrenFondoFinal; i++) {
    let flujoActual = flujoRestante;

    // Elegir diámetro que dé velocidad ≤ 4.5 ft/s
    let diametroSeleccionado = null;
    let velocidadSeleccionada = -Infinity;
    let cargaSeleccionada = null;
    let mejorTub = null;
    let mejorVel = null;
    let mejorCarga = null;

    for (let tub in diametros) {
      const d = diametros[tub];
      const velocidad = flujoActual * 0.408498 / (d * d);
      mejorTub = tub;
      mejorVel = velocidad;
      mejorCarga =
        10.536 * 100 * Math.pow(flujoActual, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

      if (velocidad <= 4.5 && velocidad > velocidadSeleccionada) {
        velocidadSeleccionada = velocidad;
        diametroSeleccionado = tub;
        cargaSeleccionada = mejorCarga;
      }
    }

    if (!diametroSeleccionado) {
      diametroSeleccionado = mejorTub;
      velocidadSeleccionada = mejorVel;
      cargaSeleccionada = mejorCarga;
    }

    let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
    if (dPulgadas > diametroMax) diametroMax = dPulgadas;

    const tipoAccesorio = i === numDrenFondoFinal - 1 ? "codo" : "tee";

    // Tee
    let longEqTeeRow = 0;
    let cargaTeeRow = 0;
    if (tipoAccesorio === "tee") {
      longEqTeeRow = teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"];
      cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
    }

    // Codo base
    const longEqCodoUnit = codo[diametroSeleccionado] || codo["tuberia 18.00"];
    let longEqCodoBaseRow = tipoAccesorio === "codo" ? longEqCodoUnit : 0;
    let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

    // Reducción entre tramos
    let longitudEqReduccion = 0;
    let cargaReduccion = 0;
    if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
      longitudEqReduccion = reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"];
      cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
    }

    // Carga por tubería del tramo
    const cargaTramoRow = (longitudEntreDrenes / 0.3048) * (cargaSeleccionada / 100);

    const cantidadTees = tipoAccesorio === "tee" ? 1 : 0;
    const codosBase = tipoAccesorio === "codo" ? 1 : 0;
    const totalCodosFila = codosBase + 0; // sin codos extra por √area en dren fondo
    const cantidadReducciones = longitudEqReduccion > 0 ? 1 : 0;
    const longEqCodoExtraRow = 1 * longEqCodoUnit;
    const cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;
    const longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
    const cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

    const cargaTotalFilaNum = +(
      cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion
    ).toFixed(2);

    const cargaTotal2 = cargaTotalFilaNum + 0;

    // Resumen tramos
    addDiam(resumenTramosDF, diametroSeleccionado);
    resumenTramosDF[diametroSeleccionado].tuberia_m += longitudEntreDrenes;
    if (tipoAccesorio === "tee") resumenTramosDF[diametroSeleccionado].tees += 1;
    else resumenTramosDF[diametroSeleccionado].codos += 1;
    if (longitudEqReduccion > 0) resumenTramosDF[diametroSeleccionado].reducciones += 1;

    resultadoDF.push({
      tramo: i + 1,
      flujo: fix2(flujoActual),
      tuberia: diametroSeleccionado || "Ninguna cumple",
      velocidad: fix2(velocidadSeleccionada),

      cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
      cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
      longitud: fix2(longitudEntreDrenes),

      cantidadTees: cantidadTees,
      longEqTee: fix2(longEqTeeRow),
      cargaTee: fix2(cargaTeeRow),

      cantidadCodos: totalCodosFila,
      longEqCodo: fix2(longEqCodoUnit),
      cargaCodo: fix2(cargaCodoTotalRow),

      cantidadReducciones: cantidadReducciones,
      longEqReduccion: fix2(longitudEqReduccion),
      cargaReduccion: fix2(cargaReduccion),

      cargaTotal: fix2(cargaTotalFilaNum),

      cargaTotal2: cargaTotal2
    });

    sumaCargaTramos += cargaTotalFilaNum;
    flujoRestante -= flujoPorDren;
    if (flujoRestante < 0) flujoRestante = 0;
    diametroAnterior = diametroSeleccionado;
  }

  const cargaCMDF = tablaDistanciaCMDF ? parseFloat(tablaDistanciaCMDF.cargaTotalCMDF) : 0;
  const sumaFinal = sumaCargaTramos + cargaCMDF;

  return { resultadoDF, sumaFinal, resumenTramosDF, tablaDistanciaCMDF };
}