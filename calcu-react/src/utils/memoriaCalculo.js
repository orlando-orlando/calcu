import { volumen }               from "./volumen";
import { flujoVolumen }          from "./flujoVolumen";
import { flujoInfinity }         from "./flujoInfinity";
import { flujoMaximo }           from "./flujoMaximo";
import { velocidadCargaFlujo }   from "./velocidadCargaFlujo";
import { tuberiaSeleccionada }   from "./tuberiaSeleccionada";
import { retorno }               from "./retorno";
import { desnatador }            from "./desnatador";
import { drenFondo }             from "./drenFondo";
import { drenCanal }             from "./drenCanal";
import { barredora }             from "./barredora";

export function memoriaCalculo(datos, volumenCalculado = null) {
  // ── Flujos generales ──────────────────────────────────────────────────────
  const vol      = volumen(datos, volumenCalculado);
  const flujoVol = flujoVolumen(datos, volumenCalculado);
  const flujoInf = flujoInfinity(datos);
  const flujoMax = flujoMaximo(flujoVol, flujoInf);

  const { velocidadFlujo } = velocidadCargaFlujo(flujoMax);
  const tubSuccion  = tuberiaSeleccionada(velocidadFlujo, "succion");
  const tubDescarga = tuberiaSeleccionada(velocidadFlujo, "descarga");

  // ── Retornos ──────────────────────────────────────────────────────────────
  const tipoRetorno = datos.retorno || "1.5";
  const retornoDatos = retorno(flujoMax, tipoRetorno, datos);
  const { resultadoR, resumenTramosR, resumenDisparosR, tablaDistanciaCM } = retornoDatos;
  const disparoR = resultadoR[0];
  const sumaCargaTotalR = resultadoR.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  const cargaDisparoTotalR = disparoR.cargaDisparoTotal;
  const cargaDinamicaTotalR =
    sumaCargaTotalR + cargaDisparoTotalR + parseFloat(tablaDistanciaCM.cargaTotalCM) + 1.5;

  // ── Desnatadores ──────────────────────────────────────────────────────────
  const tipoDesnatador = datos.desnatador || "1.5";
  const desnatadorDatos = desnatador(flujoMax, tipoDesnatador, datos);
  const { resultadoD, resumenTramosD, resumenDisparosD, tablaDistanciaCMD } = desnatadorDatos;
  const disparoD = resultadoD[0];
  const sumaCargaTotalD = resultadoD.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  const cargaDisparoTotalD = disparoD.cargaDisparoTotal;
  const cargaDinamicaTotalD =
    sumaCargaTotalD + cargaDisparoTotalD + parseFloat(tablaDistanciaCMD.cargaTotalCMD) + 1.5;

  // ── Drenes de fondo ───────────────────────────────────────────────────────
  const tipoDrenFondo = datos.drenFondo || "1.5";
  const drenFondoDatos = drenFondo(flujoMax, tipoDrenFondo, datos);
  const { resultadoDF, resumenTramosDF, tablaDistanciaCMDF } = drenFondoDatos;
  const sumaCargaTotalDF = resultadoDF.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  const cargaDinamicaTotalDF =
    sumaCargaTotalDF + parseFloat(tablaDistanciaCMDF.cargaTotalCMDF) + 1.5;

  // ── Drenes de canal ───────────────────────────────────────────────────────
  const tipoDrenCanal = datos.drenCanal || "1.5";
  const drenCanalDatos = drenCanal(flujoMax, tipoDrenCanal, datos);
  const { resultadoDC, resumenTramosDC, tablaDistanciaCMDC } = drenCanalDatos;
  const sumaCargaTotalDC = resultadoDC.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  const cargaDinamicaTotalDC =
    sumaCargaTotalDC + parseFloat(tablaDistanciaCMDC.cargaTotalCMDC) + 1.5;

  // ── Barredoras ────────────────────────────────────────────────────────────
  const tipoBarredora = datos.barredora || "1.5";
  const barredoraDatos = barredora(flujoMax, tipoBarredora, datos);
  const { resultadoB, resumenTramosB, resumenDisparosB, tablaDistanciaCMB } = barredoraDatos;
  const disparoB = resultadoB[0];
  const sumaCargaTotalB = resultadoB.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  const cargaDisparoTotalB = disparoB.cargaDisparoTotal;
  const cargaDinamicaTotalB =
    sumaCargaTotalB + cargaDisparoTotalB + parseFloat(tablaDistanciaCMB.cargaTotalCMB) + 1.5;

  // ── Helper: ordenar resumen por diámetro desc ─────────────────────────────
  const ordenarResumen = (resumen) =>
    Object.fromEntries(
      Object.entries(resumen).sort((a, b) => {
        const dA = parseFloat(a[0].replace("tuberia ", ""));
        const dB = parseFloat(b[0].replace("tuberia ", ""));
        return dB - dA;
      })
    );

  // ── Retorno del objeto estructurado ───────────────────────────────────────
  return {
    // Resumen general
    resumen: {
      vol,
      flujoVol,
      flujoInf,
      flujoMax,
      tubSuccion,
      tubDescarga,
    },

    // Retornos
    retornos: {
      resultado:        resultadoR,
      sumaTramos:       sumaCargaTotalR,
      disparo:          disparoR,
      cargaDisparoTotal: cargaDisparoTotalR,
      tablaDistanciaCM,
      cargaDinamicaTotal: cargaDinamicaTotalR,
      resumenTramos:    ordenarResumen(resumenTramosR),
      resumenDisparos:  ordenarResumen(resumenDisparosR),
    },

    // Desnatadores
    desnatadores: {
      resultado:        resultadoD,
      sumaTramos:       sumaCargaTotalD,
      disparo:          disparoD,
      cargaDisparoTotal: cargaDisparoTotalD,
      tablaDistanciaCM: tablaDistanciaCMD,
      cargaDinamicaTotal: cargaDinamicaTotalD,
      resumenTramos:    ordenarResumen(resumenTramosD),
      resumenDisparos:  ordenarResumen(resumenDisparosD),
    },

    // Drenes de fondo
    drenFondo: {
      resultado:        resultadoDF,
      sumaTramos:       sumaCargaTotalDF,
      tablaDistanciaCM: tablaDistanciaCMDF,
      cargaDinamicaTotal: cargaDinamicaTotalDF,
      resumenTramos:    ordenarResumen(resumenTramosDF),
    },

    // Drenes de canal
    drenCanal: {
      resultado:        resultadoDC,
      sumaTramos:       sumaCargaTotalDC,
      tablaDistanciaCM: tablaDistanciaCMDC,
      cargaDinamicaTotal: cargaDinamicaTotalDC,
      resumenTramos:    ordenarResumen(resumenTramosDC),
    },

    // Barredoras
    barredoras: {
      resultado:        resultadoB,
      sumaTramos:       sumaCargaTotalB,
      disparo:          disparoB,
      cargaDisparoTotal: cargaDisparoTotalB,
      tablaDistanciaCM: tablaDistanciaCMB,
      cargaDinamicaTotal: cargaDinamicaTotalB,
      resumenTramos:    ordenarResumen(resumenTramosB),
      resumenDisparos:  ordenarResumen(resumenDisparosB),
    },
  };
}