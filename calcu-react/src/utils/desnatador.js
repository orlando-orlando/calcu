export function fix2(v) {
  return (parseFloat(v) || 0).toFixed(2);
}

export function desnatador(flujoMaximo, tipoDesnatador, datos) {
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

  let numDesnatadorInicial = Math.ceil(area / 50);
  let flujoPorDesnatador = flujoMaximo / numDesnatadorInicial;
  let numDesnatadorFinal = numDesnatadorInicial;

  if (tipoDesnatador === "2.0" && flujoPorDesnatador > 50) {
    numDesnatadorFinal = Math.ceil(flujoMaximo / 50);
  } else if (tipoDesnatador === "1.5" && flujoPorDesnatador > 35) {
    numDesnatadorFinal = Math.ceil(flujoMaximo / 35);
  }

  flujoPorDesnatador = flujoMaximo / numDesnatadorFinal;
  const longitudTotal = Math.sqrt(area) * 3.5;
  const longitudEntreDesnatadores = longitudTotal / numDesnatadorFinal;
  const resultadoD = [];
  let sumaCargaTramos = 0;
  let flujoRestante = flujoMaximo;
  let diametroAnterior = null;

  const profMin = parseFloat(datos.profMin) || 0;
  const profMax = parseFloat(datos.profMax) || 0;
  const profundidad = Math.max(profMin, profMax);
  const longitudDisparo = (profundidad - 0.5) + 1;
  const longitudDisparoFt = longitudDisparo / 0.3048;
  const tuberiaDisparo = tipoDesnatador === "2.0" ? "tuberia 2.00" : "tuberia 1.50";

  const cargaDisparoBase =
    10.536 * 100 * Math.pow(flujoPorDesnatador, 1.852) /
    (Math.pow(diametros[tuberiaDisparo], 4.8655) * Math.pow(150, 1.852));

  const cargaDisparoTramo = (longitudDisparoFt * cargaDisparoBase) / 100;
  const cargaDisparoCodo = (codo[tuberiaDisparo] * cargaDisparoBase) / 100;

  let diametroMax = 0;
  let cargaDisparoReduccion = 0;
  let longEqReduccionDisparo = 0;

  if (diametroAnterior && diametroAnterior !== tuberiaDisparo) {
    longEqReduccionDisparo = reduccion[tuberiaDisparo];
    cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
  }

  const cargaDisparoTotal = cargaDisparoTramo + cargaDisparoCodo + cargaDisparoReduccion;

  // === Resumen por diámetro ===
  const resumenTramosD = {};
  const resumenDisparosD = {};
  const addDiam = (obj, d) => {
    if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };

  const raizArea = Math.sqrt(area);
  let sumaLongitudes = 0;
  let siguienteUmbral = raizArea;

  // --- Tramo especial: distancia al cuarto de máquinas ---
  const distanciaCMD = parseFloat(datos.distCuarto) || 0;
  let tablaDistanciaCMD = null;

  if (distanciaCMD > 0) {
    let flujoCMD = flujoMaximo;
    let diametroCMD = null;
    let velocidadCMD = -Infinity;
    let cargaCMD = null;
    let mejorTubCMD = null;
    let mejorVelCMD = null;
    let mejorCargaCMD = null;

    for (let tub in diametros) {
      const d = diametros[tub];
      const vel = flujoCMD * 0.408498 / (d * d);
      mejorTubCMD = tub;
      mejorVelCMD = vel;
      mejorCargaCMD =
        10.536 * 100 * Math.pow(flujoCMD, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

      if (vel <= 4.5 && vel > velocidadCMD) {
        diametroCMD = tub;
        velocidadCMD = vel;
        cargaCMD = mejorCargaCMD;
      }
    }

    if (!diametroCMD) {
      diametroCMD = mejorTubCMD;
      velocidadCMD = mejorVelCMD;
      cargaCMD = mejorCargaCMD;
    }

    const longitudCMD_ft = distanciaCMD * 3.281;
    const cargaTramoCMD = (longitudCMD_ft * cargaCMD) / 100;
    const cantidadCodosCMD = 1;
    const longEqCodoCMD = codo[diametroCMD];
    const cargaCodoCMD = (longEqCodoCMD * cargaCMD) / 100;
    const cargaTotalCMD = cargaTramoCMD + cargaCodoCMD;

    tablaDistanciaCMD = {
      distanciaCMD: fix2(distanciaCMD),
      flujoCMD: fix2(flujoCMD),
      tuberiaCMD: diametroCMD,
      velocidadCMD: fix2(velocidadCMD),
      cargaBaseCMD: fix2(cargaCMD),
      cargaTramoCMD: fix2(cargaTramoCMD),
      cantidadCodosCMD: cantidadCodosCMD,
      longEqCodoCMD: fix2(longEqCodoCMD),
      cargaCodoCMD: fix2(cargaCodoCMD),
      cargaTotalCMD: fix2(cargaTotalCMD)
    };

    if (!resumenTramosD[diametroCMD])
      resumenTramosD[diametroCMD] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosD[diametroCMD].tuberia_m += distanciaCMD;
    resumenTramosD[diametroCMD].codos += cantidadCodosCMD;
  }

  // --- Ciclo principal de tramos ---
  for (let i = 0; i < numDesnatadorFinal; i++) {
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

    // Forzar diámetro del último tramo según tipoDesnatador
    if (i === numDesnatadorFinal - 1) {
      diametroSeleccionado = tipoDesnatador === "2.0" ? "tuberia 2.00" : "tuberia 1.50";
      const d = diametros[diametroSeleccionado];
      velocidadSeleccionada = flujoActual * 0.408498 / (d * d);
      cargaSeleccionada =
        10.536 * 100 * Math.pow(flujoActual, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
    }

    const tipoAccesorio = i === numDesnatadorFinal - 1 ? "codo" : "tee";

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
    const cargaTramoRow = (longitudEntreDesnatadores / 0.3048) * (cargaSeleccionada / 100);

    // Codos extra por múltiplos de √area
    sumaLongitudes += longitudEntreDesnatadores;
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
    addDiam(resumenTramosD, diametroSeleccionado);
    resumenTramosD[diametroSeleccionado].tuberia_m += longitudEntreDesnatadores;
    if (tipoAccesorio === "tee") resumenTramosD[diametroSeleccionado].tees += 1;
    else resumenTramosD[diametroSeleccionado].codos += 1;
    resumenTramosD[diametroSeleccionado].codos += extraCount;
    if (longitudEqReduccion > 0) resumenTramosD[diametroSeleccionado].reducciones += 1;

    // Resumen disparos
    addDiam(resumenDisparosD, tuberiaDisparo);
    resumenDisparosD[tuberiaDisparo].tuberia_m += longitudDisparo;
    resumenDisparosD[tuberiaDisparo].codos += 1;
    if (diametroSeleccionado !== tuberiaDisparo)
      resumenDisparosD[tuberiaDisparo].reducciones += 1;

    let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
    if (diametroMax > dDisparo) {
      longEqReduccionDisparo = reduccion[tuberiaDisparo];
      cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
    } else {
      longEqReduccionDisparo = 0;
      cargaDisparoReduccion = 0;
    }

    resultadoD.push({
      tramo: i + 1,
      flujo: fix2(flujoActual),
      tuberia: diametroSeleccionado || "Ninguna cumple",
      velocidad: fix2(velocidadSeleccionada),

      cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
      cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
      longitud: fix2(longitudEntreDesnatadores),

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

      flujoDisparo: flujoPorDesnatador,
      diametroDisparo: tuberiaDisparo,
      velocidadDisparo:
        flujoPorDesnatador * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
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
    flujoRestante -= flujoPorDesnatador;
    if (flujoRestante < 0) flujoRestante = 0;
    diametroAnterior = diametroSeleccionado;
  }

  const sumaFinal = sumaCargaTramos + cargaDisparoTotal;

  return { resultadoD, sumaFinal, resumenTramosD, resumenDisparosD, tablaDistanciaCMD };
}