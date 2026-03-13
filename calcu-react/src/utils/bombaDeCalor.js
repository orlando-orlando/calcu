import { bombasCalor } from "../data/bombasDeCalor";

/* ================================================================
   TABLAS HAZEN-WILLIAMS
   ================================================================ */
const DIAMETROS = {
  "tuberia 1.50":  1.61,
  "tuberia 2.00":  2.07,
  "tuberia 2.50":  2.47,
  "tuberia 3.00":  3.07,
  "tuberia 4.00":  4.03,
  "tuberia 6.00":  6.07,
  "tuberia 8.00":  7.98,
  "tuberia 10.00": 9.98,
  "tuberia 12.00": 11.89,
  "tuberia 14.00": 13.13,
  "tuberia 16.00": 14.94,
  "tuberia 18.00": 16.81,
};

const CODO = {
  "tuberia 1.50":  7.40,
  "tuberia 2.00":  8.50,
  "tuberia 2.50":  9.30,
  "tuberia 3.00":  11.0,
  "tuberia 4.00":  5.90,
  "tuberia 6.00":  8.90,
  "tuberia 8.00":  12.0,
  "tuberia 10.00": 14.0,
  "tuberia 12.00": 17.0,
  "tuberia 14.00": 17.0,
  "tuberia 16.00": 17.0,
  "tuberia 18.00": 17.0,
};

const TEE_LINEA = {
  "tuberia 1.50":  5.60,
  "tuberia 2.00":  7.70,
  "tuberia 2.50":  9.30,
  "tuberia 3.00":  12.0,
  "tuberia 4.00":  2.80,
  "tuberia 6.00":  3.80,
  "tuberia 8.00":  4.70,
  "tuberia 10.00": 5.20,
  "tuberia 12.00": 6.00,
  "tuberia 14.00": 6.00,
  "tuberia 16.00": 6.00,
  "tuberia 18.00": 6.00,
};

const REDUCCION = {
  "tuberia 1.50":  10.0,
  "tuberia 2.00":  12.0,
  "tuberia 2.50":  12.0,
  "tuberia 3.00":  15.0,
  "tuberia 4.00":  20.0,
  "tuberia 6.00":  25.0,
  "tuberia 8.00":  30.0,
  "tuberia 10.00": 35.0,
  "tuberia 12.00": 40.0,
  "tuberia 14.00": 45.0,
  "tuberia 16.00": 50.0,
  "tuberia 18.00": 55.0,
};

/* ================================================================
   HELPERS
   ================================================================ */
const fix2 = (v) => (parseFloat(v) || 0).toFixed(2);

function seleccionarDiametro(flujoGPM) {
  let mejorTub = null;
  let mejorVel = -Infinity;
  let fallbackTub = null;
  let fallbackVel = Infinity;

  for (const tub in DIAMETROS) {
    const d = DIAMETROS[tub];
    const vel = flujoGPM * 0.408498 / (d * d);

    if (vel < fallbackVel) {
      fallbackVel = vel;
      fallbackTub = tub;
    }

    if (vel <= 6.5 && vel > mejorVel) {
      mejorVel = vel;
      mejorTub = tub;
    }
  }

  const tubSeleccionado = mejorTub ?? fallbackTub;
  const d = DIAMETROS[tubSeleccionado];
  const vel = flujoGPM * 0.408498 / (d * d);
  const cargaBase =
    10.536 * 100 * Math.pow(flujoGPM, 1.852) /
    (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

  return { tuberia: tubSeleccionado, velocidad: vel, cargaBase };
}

function cargaTramo(longMetros, cargaBase) {
  return (longMetros * 3.28084 * cargaBase) / 100;
}

/* ================================================================
   SELECCIÓN ÓPTIMA DE BOMBAS DE CALOR
   Criterio:
     1. Minimizar cantidad de equipos.
     2. Misma cantidad → menor exceso de capacidad.
     3. Mismo exceso → menor flujo por unidad.
   ================================================================ */
function seleccionarBombas(perdidaTotalBTU) {
  const catalogo = bombasCalor.filter((b) => b.metadata.activo);
  let mejorOpcion = null;

  for (const bomba of catalogo) {
    const capUnitaria = bomba.specs.capacidadCalentamiento;
    if (capUnitaria <= 0) continue;

    const cantidad = Math.ceil(perdidaTotalBTU / capUnitaria);
    const capTotal = cantidad * capUnitaria;
    const exceso   = capTotal - perdidaTotalBTU;

    if (!mejorOpcion) {
      mejorOpcion = { bomba, cantidad, capTotal, exceso };
      continue;
    }

    const mejorCantidad = mejorOpcion.cantidad;
    const mejorExceso   = mejorOpcion.exceso;

    if (cantidad < mejorCantidad) {
      mejorOpcion = { bomba, cantidad, capTotal, exceso };
    } else if (cantidad === mejorCantidad) {
      if (exceso < mejorExceso) {
        mejorOpcion = { bomba, cantidad, capTotal, exceso };
      } else if (exceso === mejorExceso) {
        if (bomba.specs.flujo < mejorOpcion.bomba.specs.flujo) {
          mejorOpcion = { bomba, cantidad, capTotal, exceso };
        }
      }
    }
  }

  return mejorOpcion;
}

/* ================================================================
   FUNCIÓN PRINCIPAL: bombaDeCalor()
   ================================================================ */
export function bombaDeCalor(perdidaTotalBTU, distanciaCM, alturaVertical) {

  /* ── 1. Selección de equipos ── */
  const seleccion = seleccionarBombas(perdidaTotalBTU);
  if (!seleccion) {
    return { error: "Catálogo de bombas de calor vacío o sin equipos activos." };
  }

  const { bomba, cantidad } = seleccion;
  const flujoPorBomba = bomba.specs.flujo;

  /* ── 2. Tramos de 1m entre BDC ──────────────────────────────────
     resumen         → incluye tramos BDC + CM + altura (para carga hidráulica)
     resumenTuberia  → solo CM + altura (para pérdida de calor en qTuberia)
  ─────────────────────────────────────────────────────────────── */
  const tablaTramos = [];
  let cargaAcumuladaTramos = 0;

  const resumen = {};
  const resumenTuberia = {};

  const addDiam = (d) => {
    if (!resumen[d]) resumen[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };
  const addDiamTuberia = (d) => {
    if (!resumenTuberia[d]) resumenTuberia[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
  };

  let tubAnterior = null;

  // Solo corre si hay más de 1 equipo (con 1 BDC no hay tramos entre equipos)
  for (let i = 0; i < cantidad && cantidad > 1; i++) {
    const flujoActual = (cantidad - i) * flujoPorBomba;
    const esUltimo    = i === cantidad - 1;
    const { tuberia, velocidad, cargaBase } = seleccionarDiametro(flujoActual);

    const cargaTramoBDC = cargaTramo(1, cargaBase);

    const cantTees  = esUltimo ? 0 : 2;
    const cantCodos = esUltimo ? 2 : 0;

    const longEqTee  = TEE_LINEA[tuberia] ?? TEE_LINEA["tuberia 18.00"];
    const longEqCodo = CODO[tuberia]      ?? CODO["tuberia 18.00"];

    const cargaTees  = (cantTees  * longEqTee  * cargaBase) / 100;
    const cargaCodos = (cantCodos * longEqCodo * cargaBase) / 100;

    let cargaRed = 0;
    let longEqRed = 0;
    let cantRed   = 0;
    if (tubAnterior && tubAnterior !== tuberia) {
      longEqRed = REDUCCION[tuberia] ?? REDUCCION["tuberia 18.00"];
      cargaRed  = (longEqRed * cargaBase) / 100;
      cantRed   = 1;
    }

    const cargaFilaTotal = cargaTramoBDC + cargaTees + cargaCodos + cargaRed;
    cargaAcumuladaTramos += cargaFilaTotal;

    console.log(`%c── BDC Tramo ${i + 1} ──────────────────────────────`, "color:#38bdf8;font-weight:bold");
    console.log(`  Flujo en tramo             : ${fix2(flujoActual)} GPM`);
    console.log(`  Tubería seleccionada        : ${tuberia}`);
    console.log(`  Carga base (Hazen-Williams) : ${fix2(cargaBase)} ft/100ft`);
    console.log(`  Longitud de tubería         : 1.00 m`);
    console.log(`  Carga por tubería           : ${fix2(cargaTramoBDC)} ft`);
    console.log(`  Núm. tees                   : ${cantTees}`);
    console.log(`  Long. eq. tee               : ${fix2(cantTees  > 0 ? longEqTee  : 0)} ft`);
    console.log(`  Carga por tees              : ${fix2(cargaTees)} ft`);
    console.log(`  Núm. codos                  : ${cantCodos}`);
    console.log(`  Long. eq. codo              : ${fix2(cantCodos > 0 ? longEqCodo : 0)} ft`);
    console.log(`  Carga por codos             : ${fix2(cargaCodos)} ft`);
    console.log(`  Núm. reducciones            : ${cantRed}`);
    console.log(`  Carga por reducción         : ${fix2(cargaRed)} ft`);
    console.log(`  CARGA TOTAL TRAMO           : ${fix2(cargaFilaTotal)} ft`);

    tablaTramos.push({
      tramo:      i + 1,
      flujo:      fix2(flujoActual),
      tuberia,
      velocidad:  fix2(velocidad),
      longitud_m: "1.00",
      cargaBase:  fix2(cargaBase),
      cargaTramo: fix2(cargaTramoBDC),
      cantTees,
      longEqTee:  fix2(cantTees  > 0 ? longEqTee  : 0),
      cargaTees:  fix2(cargaTees),
      cantCodos,
      longEqCodo: fix2(cantCodos > 0 ? longEqCodo : 0),
      cargaCodos: fix2(cargaCodos),
      cantRed,
      longEqRed:  fix2(longEqRed),
      cargaRed:   fix2(cargaRed),
      cargaTotal: fix2(cargaFilaTotal),
    });

    // Solo en resumen hidráulico, NO en resumenTuberia
    addDiam(tuberia);
    resumen[tuberia].tuberia_m   += 1;
    resumen[tuberia].tees        += cantTees;
    resumen[tuberia].codos       += cantCodos;
    resumen[tuberia].reducciones += cantRed;

    tubAnterior = tuberia;
  }

  /* ── 3. Tramo distancia cuarto de máquinas — IDA y REGRESO ── */
  const flujoTotalBDC = cantidad * flujoPorBomba;
  const { tuberia: tubCM, velocidad: velCM, cargaBase: cargaBaseCM } =
    seleccionarDiametro(flujoTotalBDC);

  const distCM_ft      = distanciaCM * 3.28084;
  const longEqCodoCM   = CODO[tubCM] ?? CODO["tuberia 18.00"];

  // ── IDA ──
  const cargaTuberiaIda  = (distCM_ft * cargaBaseCM) / 100;
  const cargaCodoIda     = (longEqCodoCM * cargaBaseCM) / 100;
  const cargaTotalIda    = cargaTuberiaIda + cargaCodoIda;

  console.log("%c── TRAMO CUARTO DE MÁQUINAS — IDA ─────────────────", "color:#f59e0b;font-weight:bold");
  console.log(`  Distancia (metros)          : ${fix2(distanciaCM)} m`);
  console.log(`  Distancia (pies)            : ${fix2(distCM_ft)} ft`);
  console.log(`  Flujo                       : ${fix2(flujoTotalBDC)} GPM`);
  console.log(`  Tubería seleccionada        : ${tubCM}`);
  console.log(`  Velocidad en tubería        : ${fix2(velCM)} ft/s`);
  console.log(`  Carga base (Hazen-Williams) : ${fix2(cargaBaseCM)} ft/100ft`);
  console.log(`  Carga por tubería           : ${fix2(cargaTuberiaIda)} ft`);
  console.log(`  Long. eq. codo (1 codo)     : ${fix2(longEqCodoCM)} ft`);
  console.log(`  Carga por codo              : ${fix2(cargaCodoIda)} ft`);
  console.log(`  CARGA TOTAL IDA             : ${fix2(cargaTotalIda)} ft`);

  // ── REGRESO ──
  const cargaTuberiaRegreso = (distCM_ft * cargaBaseCM) / 100;
  const cargaCodoRegreso    = (longEqCodoCM * cargaBaseCM) / 100;
  const cargaTotalRegreso   = cargaTuberiaRegreso + cargaCodoRegreso;

  console.log("%c── TRAMO CUARTO DE MÁQUINAS — REGRESO ─────────────", "color:#fb923c;font-weight:bold");
  console.log(`  Distancia (metros)          : ${fix2(distanciaCM)} m`);
  console.log(`  Distancia (pies)            : ${fix2(distCM_ft)} ft`);
  console.log(`  Flujo                       : ${fix2(flujoTotalBDC)} GPM`);
  console.log(`  Tubería seleccionada        : ${tubCM}`);
  console.log(`  Velocidad en tubería        : ${fix2(velCM)} ft/s`);
  console.log(`  Carga base (Hazen-Williams) : ${fix2(cargaBaseCM)} ft/100ft`);
  console.log(`  Carga por tubería           : ${fix2(cargaTuberiaRegreso)} ft`);
  console.log(`  Long. eq. codo (1 codo)     : ${fix2(longEqCodoCM)} ft`);
  console.log(`  Carga por codo              : ${fix2(cargaCodoRegreso)} ft`);
  console.log(`  CARGA TOTAL REGRESO         : ${fix2(cargaTotalRegreso)} ft`);

  const cargaTotalCM = cargaTotalIda + cargaTotalRegreso;

  const tablaDistancia = {
    distancia_m:       fix2(distanciaCM),
    flujo:             fix2(flujoTotalBDC),
    tuberia:           tubCM,
    velocidad:         fix2(velCM),
    cargaBase:         fix2(cargaBaseCM),
    cargaTuberiaIda:   fix2(cargaTuberiaIda),
    cargaCodoIda:      fix2(cargaCodoIda),
    cargaTotalIda:     fix2(cargaTotalIda),
    cargaTuberiaReg:   fix2(cargaTuberiaRegreso),
    cargaCodoReg:      fix2(cargaCodoRegreso),
    cargaTotalReg:     fix2(cargaTotalRegreso),
    cantCodos:         2,
    longEqCodo:        fix2(longEqCodoCM),
    cargaTotal:        fix2(cargaTotalCM),
  };

  // Tubería CM → en ambos resúmenes (hidráulico + pérdida de calor)
  addDiam(tubCM);
  resumen[tubCM].tuberia_m += distanciaCM * 2;
  resumen[tubCM].codos     += 2;

  addDiamTuberia(tubCM);
  resumenTuberia[tubCM].tuberia_m += distanciaCM * 2;
  resumenTuberia[tubCM].codos     += 2;

  /* ── 4. Altura vertical — carga estática + fricción ── */
  const alturaVertical_ft   = alturaVertical * 3.28084;
  const cargaFriccionAltura = (alturaVertical_ft * cargaBaseCM) / 100;
  const cargaEstaticaAltura = alturaVertical_ft;
  const cargaTotalAltura    = cargaEstaticaAltura + cargaFriccionAltura;

  console.log("%c── ALTURA VERTICAL (carga estática + fricción) ────", "color:#a78bfa;font-weight:bold");
  console.log(`  Altura (metros)             : ${fix2(alturaVertical)} m`);
  console.log(`  Altura (pies)               : ${fix2(alturaVertical_ft)} ft`);
  console.log(`  Flujo                       : ${fix2(flujoTotalBDC)} GPM`);
  console.log(`  Tubería seleccionada        : ${tubCM}`);
  console.log(`  Carga base (Hazen-Williams) : ${fix2(cargaBaseCM)} ft/100ft`);
  console.log(`  Carga estática              : ${fix2(cargaEstaticaAltura)} ft`);
  console.log(`  Carga fricción tubería      : ${fix2(cargaFriccionAltura)} ft`);
  console.log(`  CARGA TOTAL ALTURA          : ${fix2(cargaTotalAltura)} ft`);

  const tablaAltura = {
    altura_m:      fix2(alturaVertical),
    altura_ft:     fix2(alturaVertical_ft),
    flujo:         fix2(flujoTotalBDC),
    tuberia:       tubCM,
    cargaBase:     fix2(cargaBaseCM),
    cargaEstatica: fix2(cargaEstaticaAltura),
    cargaFriccion: fix2(cargaFriccionAltura),
    cargaTotal:    fix2(cargaTotalAltura),
  };

  // Tubería altura → en ambos resúmenes (hidráulico + pérdida de calor)
  addDiam(tubCM);
  resumen[tubCM].tuberia_m += alturaVertical * 2;

  addDiamTuberia(tubCM);
  resumenTuberia[tubCM].tuberia_m += alturaVertical * 2;

  /* ── 5. Carga fija de 7 pies ── */
  const CARGA_FIJA_FT = 7;

  /* ── 6. Carga total ── */
  const cargaTotal =
    cargaAcumuladaTramos +
    cargaTotalCM         +
    cargaTotalAltura     +
    CARGA_FIJA_FT;

  const cargaTotalPSI = cargaTotal * 0.43353;

  console.log("%c═══ RESUMEN BOMBA DE CALOR ═══════════════════════", "color:#34d399;font-weight:bold");
  console.log(`  Suma carga tramos BDC      : ${fix2(cargaAcumuladaTramos)} ft`);
  console.log(`  Carga cuarto máq. (ida)    : ${fix2(cargaTotalIda)} ft`);
  console.log(`  Carga cuarto máq. (regreso): ${fix2(cargaTotalRegreso)} ft`);
  console.log(`  Carga altura (estática)    : ${fix2(cargaEstaticaAltura)} ft`);
  console.log(`  Carga altura (fricción)    : ${fix2(cargaFriccionAltura)} ft`);
  console.log(`  Carga fija global (7 pies) : ${CARGA_FIJA_FT} ft`);
  console.log(`  ──────────────────────────────────────────`);
  console.log(`  CARGA TOTAL                : ${fix2(cargaTotal)} ft  /  ${fix2(cargaTotalPSI)} PSI`);

  /* ── 7. Resumen de materiales ── */
  const resumenMateriales = Object.entries(resumen).map(([diam, vals]) => ({
    tuberia:     diam,
    tuberia_m:   fix2(vals.tuberia_m),
    tees:        vals.tees,
    codos:       vals.codos,
    reducciones: vals.reducciones,
  }));

  // Solo CM + altura: para pérdida de calor en qTuberia (sin tramos entre BDC)
  const resumenMaterialesTuberia = Object.entries(resumenTuberia).map(([diam, vals]) => ({
    tuberia:     diam,
    tuberia_m:   fix2(vals.tuberia_m),
    tees:        vals.tees,
    codos:       vals.codos,
    reducciones: vals.reducciones,
  }));

  return {
    seleccion: {
      marca:         bomba.marca,
      modelo:        bomba.modelo,
      cantidad,
      flujoPorBomba: fix2(flujoPorBomba),
      flujoTotal:    fix2(flujoTotalBDC),
      capUnitaria:   bomba.specs.capacidadCalentamiento,
      capTotal:      seleccion.capTotal,
      exceso:        fix2(seleccion.exceso),
      velocidad:     bomba.specs.velocidad,
    },
    tablaTramos,
    tablaDistancia,
    tablaAltura,
    cargaFija_ft:        CARGA_FIJA_FT,
    cargaTramos:         fix2(cargaAcumuladaTramos),
    cargaDistanciaIda:   fix2(cargaTotalIda),
    cargaDistanciaReg:   fix2(cargaTotalRegreso),
    cargaEstatica:       fix2(cargaEstaticaAltura),
    cargaFriccionAltura: fix2(cargaFriccionAltura),
    cargaTotal:          fix2(cargaTotal),
    cargaTotalPSI:       fix2(cargaTotalPSI),
    resumenMateriales,           // completo — para explosión de materiales
    resumenMaterialesTuberia,    // solo CM + altura — para qTuberia
  };
}