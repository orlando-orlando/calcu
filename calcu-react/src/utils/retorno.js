export function fix2(v) {
  return (parseFloat(v) || 0).toFixed(2);
}

export function retorno(flujoMaximo, tipoRetorno, datos) {
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

  const numRetornos = Math.ceil(flujoMaximo / (tipoRetorno === "2.0" ? 40 : 26));
  const flujoPorRetorno = flujoMaximo / numRetornos;
  const longitudTotal = Math.sqrt(area) * 3.5;
  const longitudEntreRetornos = longitudTotal / numRetornos;
  const resultadoR = [];
  let sumaCargaTramos = 0;
  let flujoRestante = flujoMaximo;
  let diametroAnterior = null;

  const profMin = parseFloat(datos.profMin) || 0;
  const profMax = parseFloat(datos.profMax) || 0;
  const profundidad = Math.max(profMin, profMax);
  const longitudDisparo = (profundidad / 2) + 1;
  const longitudDisparoFt = longitudDisparo / 0.3048;
  const tuberiaDisparo = tipoRetorno === "2.0" ? "tuberia 2.00" : "tuberia 1.50";

  const cargaDisparoBase =
    10.536 * 100 * Math.pow(flujoPorRetorno, 1.852) /
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
  const resumenTramosR = {};
  const resumenDisparosR = {};
  const addDiam = (obj, d) => {
    if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };

  const raizArea = Math.sqrt(area);
  let sumaLongitudes = 0;
  let siguienteUmbral = raizArea;

  // --- Tramo especial: distancia al cuarto de máquinas ---
  const distanciaCM = parseFloat(datos.distCuarto) || 0;
  let tablaDistanciaCM = null;

  if (distanciaCM > 0) {
    let flujoCM = flujoMaximo;
    let diametroCM = null;
    let velocidadCM = -Infinity;
    let cargaCM = null;
    let mejorTubCM = null;
    let mejorVelCM = null;
    let mejorCargaCM = null;

    for (let tub in diametros) {
      const d = diametros[tub];
      const vel = flujoCM * 0.408498 / (d * d);
      mejorTubCM = tub;
      mejorVelCM = vel;
      mejorCargaCM =
        10.536 * 100 * Math.pow(flujoCM, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

      if (vel <= 6.5 && vel > velocidadCM) {
        diametroCM = tub;
        velocidadCM = vel;
        cargaCM = mejorCargaCM;
      }
    }

    if (!diametroCM) {
      diametroCM = mejorTubCM;
      velocidadCM = mejorVelCM;
      cargaCM = mejorCargaCM;
    }

    const longitudCM_ft = distanciaCM * 3.281;
    const cargaTramoCM = (longitudCM_ft * cargaCM) / 100;
    const cantidadCodosCM = 1;
    const longEqCodoCM = codo[diametroCM];
    const cargaCodoCM = (longEqCodoCM * cargaCM) / 100;
    const cargaTotalCM = cargaTramoCM + cargaCodoCM;

    tablaDistanciaCM = {
      distanciaCM: fix2(distanciaCM),
      flujoCM: fix2(flujoCM),
      tuberiaCM: diametroCM,
      velocidadCM: fix2(velocidadCM),
      cargaBaseCM: fix2(cargaCM),
      cargaTramoCM: fix2(cargaTramoCM),
      cantidadCodosCM: cantidadCodosCM,
      longEqCodoCM: fix2(longEqCodoCM),
      cargaCodoCM: fix2(cargaCodoCM),
      cargaTotalCM: fix2(cargaTotalCM)
    };

    if (!resumenTramosR[diametroCM])
      resumenTramosR[diametroCM] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosR[diametroCM].tuberia_m += distanciaCM;
    resumenTramosR[diametroCM].codos += cantidadCodosCM;
  }

  // --- Ciclo principal de tramos ---
  for (let i = 0; i < numRetornos; i++) {
    let flujoActual = flujoRestante;

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

      if (velocidad <= 6.5 && velocidad > velocidadSeleccionada) {
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

    // Forzar diámetro del último tramo según tipoRetorno
    if (i === numRetornos - 1) {
      diametroSeleccionado = tipoRetorno === "2.0" ? "tuberia 2.00" : "tuberia 1.50";
      const d = diametros[diametroSeleccionado];
      velocidadSeleccionada = flujoActual * 0.408498 / (d * d);
      cargaSeleccionada =
        10.536 * 100 * Math.pow(flujoActual, 1.852) /
        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
    }

    const tipoAccesorio = i === numRetornos - 1 ? "codo" : "tee";

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
    const cargaTramoRow = (longitudEntreRetornos / 0.3048) * (cargaSeleccionada / 100);

    // Codos extra por múltiplos de √area
    sumaLongitudes += longitudEntreRetornos;
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
    addDiam(resumenTramosR, diametroSeleccionado);
    resumenTramosR[diametroSeleccionado].tuberia_m += longitudEntreRetornos;
    if (tipoAccesorio === "tee") resumenTramosR[diametroSeleccionado].tees += 1;
    else resumenTramosR[diametroSeleccionado].codos += 1;
    resumenTramosR[diametroSeleccionado].codos += extraCount;
    if (longitudEqReduccion > 0) resumenTramosR[diametroSeleccionado].reducciones += 1;

    // Resumen disparos
    addDiam(resumenDisparosR, tuberiaDisparo);
    resumenDisparosR[tuberiaDisparo].tuberia_m += longitudDisparo;
    resumenDisparosR[tuberiaDisparo].codos += 1;
    if (diametroSeleccionado !== tuberiaDisparo)
      resumenDisparosR[tuberiaDisparo].reducciones += 1;

    let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
    if (diametroMax > dDisparo) {
      longEqReduccionDisparo = reduccion[tuberiaDisparo];
      cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
    } else {
      longEqReduccionDisparo = 0;
      cargaDisparoReduccion = 0;
    }

    resultadoR.push({
      tramo: i + 1,
      flujo: fix2(flujoActual),
      tuberia: diametroSeleccionado || "Ninguna cumple",
      velocidad: fix2(velocidadSeleccionada),

      cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
      cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
      longitud: fix2(longitudEntreRetornos),

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

      flujoDisparo: flujoPorRetorno,
      diametroDisparo: tuberiaDisparo,
      velocidadDisparo:
        flujoPorRetorno * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
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
    flujoRestante -= flujoPorRetorno;
    if (flujoRestante < 0) flujoRestante = 0;
    diametroAnterior = diametroSeleccionado;
  }

  const cargaCM = tablaDistanciaCM ? parseFloat(tablaDistanciaCM.cargaTotalCM) : 0;
  const sumaFinal = sumaCargaTramos + cargaDisparoTotal + cargaCM;

  return { resultadoR, sumaFinal, resumenTramosR, resumenDisparosR, tablaDistanciaCM };
}