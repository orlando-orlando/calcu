export function qCanal(datos, mesMasFrio) {
  if (!mesMasFrio) return 0;

  const profMaxTotal  = 0.3; // profundidad fija del canal perimetral
  const largoCanal    = parseFloat(datos.largoCanal)   || 0;
  const tempDeseada   = parseFloat(datos.tempDeseada)  || 0;

  const tempProm  = parseFloat(mesMasFrio.tProm)  || 0;
  let velViento   = parseFloat(mesMasFrio.viento) || 0;
  if (mesMasFrio.vientoUnidad === "mph") velViento *= 1.60934;

  if (largoCanal <= 0 || tempDeseada === 0) return 0;

  // Área de la cortina en ft²
  const areaCortina = (largoCanal / 0.3048) * (profMaxTotal / 0.3048);

  // Tabla de factores de pérdida (igual que qInfinity)
  const factores = [
    { tAire: 26.7, tAgua: 26.7, vel: 0,    factor: 17   },
    { tAire: 26.7, tAgua: 26.7, vel: 0.5,  factor: 34   },
    { tAire: 26.7, tAgua: 26.7, vel: 1.1,  factor: 40   },
    { tAire: 26.7, tAgua: 26.7, vel: 2.2,  factor: 49   },
    { tAire: 26.7, tAgua: 26.7, vel: 5.5,  factor: 60   },
    { tAire: 26.7, tAgua: 26.7, vel: 11.0, factor: 106  },
    { tAire: 26.7, tAgua: 26.7, vel: 21.9, factor: 185  },
    { tAire: 26.7, tAgua: 26.7, vel: 54.9, factor: 330  },
    { tAire: 26.7, tAgua: 37.8, vel: 0,    factor: 50   },
    { tAire: 26.7, tAgua: 37.8, vel: 0.5,  factor: 96   },
    { tAire: 26.7, tAgua: 37.8, vel: 1.1,  factor: 113  },
    { tAire: 26.7, tAgua: 37.8, vel: 2.2,  factor: 135  },
    { tAire: 26.7, tAgua: 37.8, vel: 5.5,  factor: 186  },
    { tAire: 26.7, tAgua: 37.8, vel: 11.0, factor: 280  },
    { tAire: 26.7, tAgua: 37.8, vel: 21.9, factor: 460  },
    { tAire: 26.7, tAgua: 37.8, vel: 54.9, factor: 920  },
    { tAire: 26.7, tAgua: 43.3, vel: 0,    factor: 210  },
    { tAire: 26.7, tAgua: 43.3, vel: 0.5,  factor: 265  },
    { tAire: 26.7, tAgua: 43.3, vel: 1.1,  factor: 320  },
    { tAire: 26.7, tAgua: 43.3, vel: 2.2,  factor: 380  },
    { tAire: 26.7, tAgua: 43.3, vel: 5.5,  factor: 540  },
    { tAire: 26.7, tAgua: 43.3, vel: 11.0, factor: 780  },
    { tAire: 26.7, tAgua: 43.3, vel: 21.9, factor: 1250 },
    { tAire: 26.7, tAgua: 43.3, vel: 54.9, factor: 2550 },

    { tAire: 21.1, tAgua: 26.7, vel: 0,    factor: 47   },
    { tAire: 21.1, tAgua: 26.7, vel: 0.5,  factor: 72   },
    { tAire: 21.1, tAgua: 26.7, vel: 1.1,  factor: 82   },
    { tAire: 21.1, tAgua: 26.7, vel: 2.2,  factor: 99   },
    { tAire: 21.1, tAgua: 26.7, vel: 5.5,  factor: 129  },
    { tAire: 21.1, tAgua: 26.7, vel: 11.0, factor: 210  },
    { tAire: 21.1, tAgua: 26.7, vel: 21.9, factor: 347  },
    { tAire: 21.1, tAgua: 26.7, vel: 54.9, factor: 690  },
    { tAire: 21.1, tAgua: 37.8, vel: 0,    factor: 127  },
    { tAire: 21.1, tAgua: 37.8, vel: 0.5,  factor: 163  },
    { tAire: 21.1, tAgua: 37.8, vel: 1.1,  factor: 216  },
    { tAire: 21.1, tAgua: 37.8, vel: 2.2,  factor: 242  },
    { tAire: 21.1, tAgua: 37.8, vel: 5.5,  factor: 342  },
    { tAire: 21.1, tAgua: 37.8, vel: 11.0, factor: 495  },
    { tAire: 21.1, tAgua: 37.8, vel: 21.9, factor: 806  },
    { tAire: 21.1, tAgua: 37.8, vel: 54.9, factor: 1610 },
    { tAire: 21.1, tAgua: 43.3, vel: 0,    factor: 250  },
    { tAire: 21.1, tAgua: 43.3, vel: 0.5,  factor: 327  },
    { tAire: 21.1, tAgua: 43.3, vel: 1.1,  factor: 370  },
    { tAire: 21.1, tAgua: 43.3, vel: 2.2,  factor: 430  },
    { tAire: 21.1, tAgua: 43.3, vel: 5.5,  factor: 632  },
    { tAire: 21.1, tAgua: 43.3, vel: 11.0, factor: 690  },
    { tAire: 21.1, tAgua: 43.3, vel: 21.9, factor: 1425 },
    { tAire: 21.1, tAgua: 43.3, vel: 54.9, factor: 2925 },

    { tAire: 15.6, tAgua: 26.7, vel: 0,    factor: 70   },
    { tAire: 15.6, tAgua: 26.7, vel: 0.5,  factor: 140  },
    { tAire: 15.6, tAgua: 26.7, vel: 1.1,  factor: 125  },
    { tAire: 15.6, tAgua: 26.7, vel: 2.2,  factor: 160  },
    { tAire: 15.6, tAgua: 26.7, vel: 5.5,  factor: 210  },
    { tAire: 15.6, tAgua: 26.7, vel: 11.0, factor: 315  },
    { tAire: 15.6, tAgua: 26.7, vel: 21.9, factor: 510  },
    { tAire: 15.6, tAgua: 26.7, vel: 54.9, factor: 1050 },
    { tAire: 15.6, tAgua: 37.8, vel: 0,    factor: 205  },
    { tAire: 15.6, tAgua: 37.8, vel: 0.5,  factor: 270  },
    { tAire: 15.6, tAgua: 37.8, vel: 1.1,  factor: 320  },
    { tAire: 15.6, tAgua: 37.8, vel: 2.2,  factor: 350  },
    { tAire: 15.6, tAgua: 37.8, vel: 5.5,  factor: 480  },
    { tAire: 15.6, tAgua: 37.8, vel: 11.0, factor: 710  },
    { tAire: 15.6, tAgua: 37.8, vel: 21.9, factor: 1150 },
    { tAire: 15.6, tAgua: 37.8, vel: 54.9, factor: 2300 },
    { tAire: 15.6, tAgua: 43.3, vel: 0,    factor: 290  },
    { tAire: 15.6, tAgua: 43.3, vel: 0.5,  factor: 370  },
    { tAire: 15.6, tAgua: 43.3, vel: 1.1,  factor: 420  },
    { tAire: 15.6, tAgua: 43.3, vel: 2.2,  factor: 480  },
    { tAire: 15.6, tAgua: 43.3, vel: 5.5,  factor: 670  },
    { tAire: 15.6, tAgua: 43.3, vel: 11.0, factor: 1000 },
    { tAire: 15.6, tAgua: 43.3, vel: 21.9, factor: 1600 },
    { tAire: 15.6, tAgua: 43.3, vel: 54.9, factor: 3300 },

    { tAire: 10.0, tAgua: 26.7, vel: 0,    factor: 106 },
    { tAire: 10.0, tAgua: 26.7, vel: 0.5,  factor: 140  },
    { tAire: 10.0, tAgua: 26.7, vel: 1.1,  factor: 160  },
    { tAire: 10.0, tAgua: 26.7, vel: 2.2,  factor: 187  },
    { tAire: 10.0, tAgua: 26.7, vel: 5.5,  factor: 260  },
    { tAire: 10.0, tAgua: 26.7, vel: 11.0, factor: 382  },
    { tAire: 10.0, tAgua: 26.7, vel: 21.9, factor: 615  },
    { tAire: 10.0, tAgua: 26.7, vel: 54.9, factor: 1255 },
    { tAire: 10.0, tAgua: 37.8, vel: 0,    factor: 232  },
    { tAire: 10.0, tAgua: 37.8, vel: 0.5,  factor: 292  },
    { tAire: 10.0, tAgua: 37.8, vel: 1.1,  factor: 340  },
    { tAire: 10.0, tAgua: 37.8, vel: 2.2,  factor: 385  },
    { tAire: 10.0, tAgua: 37.8, vel: 5.5,  factor: 540  },
    { tAire: 10.0, tAgua: 37.8, vel: 11.0, factor: 785  },
    { tAire: 10.0, tAgua: 37.8, vel: 21.9, factor: 1275 },
    { tAire: 10.0, tAgua: 37.8, vel: 54.9, factor: 2550 },
    { tAire: 10.0, tAgua: 43.3, vel: 0,    factor: 320  },
    { tAire: 10.0, tAgua: 43.3, vel: 0.5,  factor: 395  },
    { tAire: 10.0, tAgua: 43.3, vel: 1.1,  factor: 445  },
    { tAire: 10.0, tAgua: 43.3, vel: 2.2,  factor: 515  },
    { tAire: 10.0, tAgua: 43.3, vel: 5.5,  factor: 670  },
    { tAire: 10.0, tAgua: 43.3, vel: 11.0, factor: 1065 },
    { tAire: 10.0, tAgua: 43.3, vel: 21.9, factor: 1740 },
    { tAire: 10.0, tAgua: 43.3, vel: 54.9, factor: 3500 }
  ];

  // ================================
  // 🔹 Listas únicas ordenadas
  // ================================
  const tAireVals = [...new Set(factores.map(f => f.tAire))].sort((a, b) => a - b);
  const tAguaVals = [...new Set(factores.map(f => f.tAgua))].sort((a, b) => a - b);
  const velVals   = [...new Set(factores.map(f => f.vel))].sort((a, b) => a - b);

  // ================================
  // 🔹 Selección conservadora (floor)
  // ================================
  const floorMatch = (target, arr) => {
    const menores = arr.filter(v => v <= target);
    return menores.length ? Math.max(...menores) : arr[0];
  };

  const selectedTAire = floorMatch(tempProm, tAireVals);
  const selectedVel   = floorMatch(velViento, velVals);

  // ======================================================
  // 🔹 EXTRAPOLACIÓN HACIA ABAJO (< 26.7°C)
  // ======================================================
  if (tempDeseada < tAguaVals[0]) {

    const t1 = tAguaVals[0];
    const t2 = tAguaVals[1];

    const f1 = factores.find(f =>
      f.tAire === selectedTAire &&
      f.tAgua === t1 &&
      f.vel   === selectedVel
    );

    const f2 = factores.find(f =>
      f.tAire === selectedTAire &&
      f.tAgua === t2 &&
      f.vel   === selectedVel
    );

    if (!f1 || !f2) return 0;

    const pendiente = (f2.factor - f1.factor) / (t2 - t1);
    const factor = f1.factor + pendiente * (tempDeseada - t1);

    return Number((factor * areaCortina).toFixed(2));
  }

  // ======================================================
  // 🔹 INTERPOLACIÓN NORMAL
  // ======================================================
  const lowerTAgua =
    tAguaVals.filter(t => t <= tempDeseada).pop() ?? tAguaVals[0];

  const upperTAgua =
    tAguaVals.find(t => t >= tempDeseada) ??
    tAguaVals[tAguaVals.length - 1];

  const factorLower = factores.find(f =>
    f.tAire === selectedTAire &&
    f.tAgua === lowerTAgua &&
    f.vel   === selectedVel
  );

  const factorUpper = factores.find(f =>
    f.tAire === selectedTAire &&
    f.tAgua === upperTAgua &&
    f.vel   === selectedVel
  );

  if (!factorLower && !factorUpper) return 0;

  let factor;

  if (lowerTAgua === upperTAgua || !factorUpper) {
    factor = factorLower?.factor ?? factorUpper?.factor ?? 0;
  } else {
    const ratio =
      (tempDeseada - lowerTAgua) /
      (upperTAgua - lowerTAgua);

    factor =
      factorLower.factor +
      ratio * (factorUpper.factor - factorLower.factor);
  }

    return Number((factor * areaCortina).toFixed(2));
}