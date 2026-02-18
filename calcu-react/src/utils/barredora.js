export function fix2(v) {
  return (parseFloat(v) || 0).toFixed(2);
}

export function barredora(flujoMaximo, tipoBarredora, datos) {
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

  // === Cálculo de barredoras ===
  const mangueraBarredora = parseFloat(datos.mangueraBarredora) || 7.5;
  const largoMangueraFinal = mangueraBarredora - (mangueraBarredora * 0.05);
  const areaSemiCirculo = (Math.PI * Math.pow(largoMangueraFinal, 2)) / 2;
  let numBarredoraA = area / areaSemiCirculo;
  let numBarredoraB = Math.sqrt(area) / (largoMangueraFinal * 2);

  let numBarredoras;
  if (largoMangueraFinal > Math.sqrt(area)) {
    numBarredoras = numBarredoraB;
  } else {
    numBarredoras = numBarredoraA;
  }
  numBarredoras = Math.ceil(numBarredoras);

  const flujoMaximoAjustado = flujoMaximo > 120 ? 120 : flujoMaximo;
  const flujoPorBarredora = flujoMaximoAjustado / numBarredoras;
  const longitudTotal = Math.sqrt(area) * 3.5;
  const longitudEntreBarredoras = longitudTotal / numBarredoras;
  const resultadoB = [];
  let sumaCargaTramos = 0;
  let flujoRestante = flujoMaximoAjustado;
  let diametroAnterior = null;

  const profMin = parseFloat(datos.profMin) || 0;
  const profMax = parseFloat(datos.profMax) || 0;
  const profundidad = Math.max(profMin, profMax);
  let diametroMax = 0;

  const longitudDisparo = (profundidad - 0.3) + 1;
  const longitudDisparoFt = longitudDisparo / 0.3048;

  // === Selección del diámetro del disparo con restricción de velocidad ≤ 8 ft/s ===
  let tuberiaDisparo = null;
  let velocidadDisparoSel = -Infinity;
  let cargaDisparoSel = null;

  for (let tub in diametros) {
    const d = diametros[tub];
    const vel = flujoPorBarredora * 0.408498 / (d * d);
    const carga =
      10.536 * 100 * Math.pow(flujoPorBarredora, 1.852) /
      (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

    if (vel <= 8.0 && vel > velocidadDisparoSel) {
      tuberiaDisparo = tub;
      velocidadDisparoSel = vel;
      cargaDisparoSel = carga;
    }
  }

  if (!tuberiaDisparo) {
    tuberiaDisparo = "tuberia 18.00";
    const d = diametros[tuberiaDisparo];
    velocidadDisparoSel = flujoPorBarredora * 0.408498 / (d * d);
    cargaDisparoSel =
      10.536 * 100 * Math.pow(flujoPorBarredora, 1.852) /
      (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
  }

  // === Cálculo de cargas del disparo ===
  const cargaDisparoBase = cargaDisparoSel;
  const cargaDisparoTramo = (longitudDisparoFt * cargaDisparoBase) / 100;
  const cargaDisparoCodo = (codo[tuberiaDisparo] * cargaDisparoBase) / 100;
  let cargaDisparoReduccion = 0;
  let longEqReduccionDisparo = 0;

  if (diametroAnterior && diametroAnterior !== tuberiaDisparo) {
    longEqReduccionDisparo = reduccion[tuberiaDisparo];
    cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
  }

  const cargaDisparoTotal = cargaDisparoTramo + cargaDisparoCodo + cargaDisparoReduccion;

  // === Resumen por diámetro ===
  const resumenTramosB = {};
  const resumenDisparosB = {};
  const addDiam = (obj, d) => {
    if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };

  const raizArea = Math.sqrt(area);
  let sumaLongitudes = 0;
  let siguienteUmbral = raizArea;

  // --- Tramo especial: distancia al cuarto de máquinas ---
  const distanciaCMB = parseFloat(datos.distCuarto) || 0;
  let tablaDistanciaCMB = null;

  if (distanciaCMB > 0) {
    let flujoCMB = flujoMaximoAjustado;
    let diametroCMB = null;
    let velocidadCMB = -Infinity;
    let cargaCMB = null;
    let mejorTubCMB = null;
    let mejorVelCMB = null;
    let mejorCargaCMB = null;

    for (let tub in diametros) {
      const d = diametros[tub];
      const vel = flujoCMB * 0.408498 / (d * d);
      mejorTubCMB = tub;
      mejorVelCMB = vel;
      mejorCargaCMB =
        10.536 * 100 * Math.pow(flujoCMB, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

      if (vel <= 8.0 && vel > velocidadCMB) {
        diametroCMB = tub;
        velocidadCMB = vel;
        cargaCMB = mejorCargaCMB;
      }
    }

    if (!diametroCMB) {
      diametroCMB = mejorTubCMB;
      velocidadCMB = mejorVelCMB;
      cargaCMB = mejorCargaCMB;
    }

    const longitudCMB_ft = distanciaCMB * 3.281;
    const cargaTramoCMB = (longitudCMB_ft * cargaCMB) / 100;
    const cantidadCodosCMB = 1;
    const longEqCodoCMB = codo[diametroCMB];
    const cargaCodoCMB = (longEqCodoCMB * cargaCMB) / 100;
    const cargaTotalCMB = cargaTramoCMB + cargaCodoCMB;

    tablaDistanciaCMB = {
      distanciaCMB: fix2(distanciaCMB),
      flujoCMB: fix2(flujoCMB),
      tuberiaCMB: diametroCMB,
      velocidadCMB: fix2(velocidadCMB),
      cargaBaseCMB: fix2(cargaCMB),
      cargaTramoCMB: fix2(cargaTramoCMB),
      cantidadCodosCMB: cantidadCodosCMB,
      longEqCodoCMB: fix2(longEqCodoCMB),
      cargaCodoCMB: fix2(cargaCodoCMB),
      cargaTotalCMB: fix2(cargaTotalCMB)
    };

    if (!resumenTramosB[diametroCMB])
      resumenTramosB[diametroCMB] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosB[diametroCMB].tuberia_m += distanciaCMB;
    resumenTramosB[diametroCMB].codos += cantidadCodosCMB;
  }

  // --- Ciclo principal de tramos ---
  for (let i = 0; i < numBarredoras; i++) {
    let flujoActual = flujoRestante;

    // Elegir diámetro que dé velocidad ≤ 8.0 ft/s
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

      if (velocidad <= 8.0 && velocidad > velocidadSeleccionada) {
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

    const tipoAccesorio = i === numBarredoras - 1 ? "codo" : "tee";

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
    const cargaTramoRow = (longitudEntreBarredoras / 0.3048) * (cargaSeleccionada / 100);

    // Codos extra por múltiplos de √area
    sumaLongitudes += longitudEntreBarredoras;
    let extraCount = 0;
    while (sumaLongitudes >= siguienteUmbral) {
      extraCount += 1;
      siguienteUmbral += raizArea;
    }

    const cantidadTees = tipoAccesorio === "tee" ? 1 : 0;
    const codosBase = tipoAccesorio === "codo" ? 1 : 0;
    const totalCodosFila = codosBase + extraCount;
    const cantidadReducciones = longitudEqReduccion > 0 ? 1 : 0;
    const longEqCodoExtraRow = extraCount * longEqCodoUnit;
    const cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;
    const longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
    const cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

    const cargaTotalFilaNum = +(
      cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion
    ).toFixed(2);

    const cargaTotal2 = cargaTotalFilaNum + cargaDisparoTotal;

    // Resumen tramos
    addDiam(resumenTramosB, diametroSeleccionado);
    resumenTramosB[diametroSeleccionado].tuberia_m += longitudEntreBarredoras;
    if (tipoAccesorio === "tee") resumenTramosB[diametroSeleccionado].tees += 1;
    else resumenTramosB[diametroSeleccionado].codos += 1;
    resumenTramosB[diametroSeleccionado].codos += extraCount;
    if (longitudEqReduccion > 0) resumenTramosB[diametroSeleccionado].reducciones += 1;

    // Resumen disparos
    addDiam(resumenDisparosB, tuberiaDisparo);
    resumenDisparosB[tuberiaDisparo].tuberia_m += longitudDisparo;
    resumenDisparosB[tuberiaDisparo].codos += 1;
    if (diametroSeleccionado !== tuberiaDisparo)
      resumenDisparosB[tuberiaDisparo].reducciones += 1;

    let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
    if (diametroMax > dDisparo) {
      longEqReduccionDisparo = reduccion[tuberiaDisparo];
      cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
    } else {
      longEqReduccionDisparo = 0;
      cargaDisparoReduccion = 0;
    }

    resultadoB.push({
      tramo: i + 1,
      flujo: fix2(flujoActual),
      tuberia: diametroSeleccionado || "Ninguna cumple",
      velocidad: fix2(velocidadSeleccionada),

      cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
      cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
      longitud: fix2(longitudEntreBarredoras),

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

      flujoDisparo: flujoPorBarredora,
      diametroDisparo: tuberiaDisparo,
      velocidadDisparo:
        flujoPorBarredora * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
      cargaBaseDisparo: cargaDisparoBase,
      cargaDisparo: cargaDisparoTramo,
      longitudDisparo: longitudDisparo,
      longEqCodoDisparo: codo[tuberiaDisparo],
      cargaCodoDisparo: cargaDisparoCodo,
      longEqReduccionDisparo: longEqReduccionDisparo,
      cargaReduccionDisparo: cargaDisparoReduccion,
      cargaDisparoTotal: cargaDisparoTotal,

      cargaTotal2: cargaTotal2
    });

    sumaCargaTramos += cargaTotalFilaNum;
    flujoRestante -= flujoPorBarredora;
    if (flujoRestante < 0) flujoRestante = 0;
    diametroAnterior = diametroSeleccionado;
  }

  const cargaCMB = tablaDistanciaCMB ? parseFloat(tablaDistanciaCMB.cargaTotalCMB) : 0;
  const sumaFinal = sumaCargaTramos + cargaDisparoTotal + cargaCMB;

  return { resultadoB, sumaFinal, resumenTramosB, resumenDisparosB, tablaDistanciaCMB };
}