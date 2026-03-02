import { useState, useMemo, useEffect } from "react";
import "../estilos.css";
import { getClimaMensual } from "../data/clima";
import { Pie } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { qEvaporacion } from "../utils/qEvaporacion";
import { qConveccion } from "../utils/qConveccion";
import { qRadiacion } from "../utils/qRadiacion";
import { qTransmision } from "../utils/qTransmision";
import { qInfinity } from "../utils/qInfinity";
import { qCanal } from "../utils/qCanal";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calentamiento({
  setSeccion,
  tipoSistema,
  datosPorSistema,
  setDatosPorSistema,

  areaTotal,
  volumenTotal,
  profundidadPromedio
}) {

const sistemaActivo = datosPorSistema?.[tipoSistema];

  const SISTEMAS_LABELS = {
    alberca: "Alberca",
    jacuzzi: "Jacuzzi",
    chapoteadero: "Chapoteadero",
    espejoAgua: "Espejo de agua",

    albercaJacuzzi1: "Alberca + Jacuzzi (2 cuerpos)",
    albercaChapo1: "Alberca + Chapoteadero (2 cuerpos)",
    albercaJacuzziJacuzzi: "Alberca + Jacuzzi + Jacuzzi (3 cuerpos)",

    albercaChapoAsoleadero: "Alberca + Chapoteadero + Asoleadero (3 cuerpos)",
    albercaJacuzziChapo: "Alberca + Jacuzzi + Chapoteadero (3 cuerpos)",
    albercaAsoleaderoAsoleadero: "Alberca + Asoleadero + Asoleadero (3 cuerpos)"
  };

  const nombreSistema = SISTEMAS_LABELS[tipoSistema] || "Dimensiones";

  /* =========================
     ESTADOS (con persistencia)
  ========================== */
  const datosPrevios = datosPorSistema?.calentamiento || {};
  const [usarBombaCalentamiento, setUsarBombaCalentamiento] = useState(datosPrevios.usarBombaCalentamiento ?? null);
  const [ciudad, setCiudad] = useState(datosPrevios.ciudad || "");
  const [tempDeseada, setTempDeseada] = useState(datosPrevios.tempDeseada ?? null);
  const [tempDeseadaInput, setTempDeseadaInput] = useState(datosPrevios.tempDeseada != null ? String(datosPrevios.tempDeseada): "");
  const [cubierta, setCubierta] = useState(datosPrevios.cubierta ?? null);
  const [techada, setTechada] = useState(datosPrevios.techada ?? null);
  const [mesesCalentar, setMesesCalentar] = useState(datosPrevios.mesesCalentar || {});
  const [hoveredField, setHoveredField] = useState(null);
  const [animandoSalida, setAnimandoSalida] = useState(false);
  const [mostrarOmitirHint, setMostrarOmitirHint] = useState(true);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);

  const calentamientoCompleto = () => {
    // Ciudad obligatoria
    if (!ciudad) return false;

    // Temperatura válida
    if (tempDeseada === null || tempDeseada <= 0) return false;

    // Meses seleccionados
    const mesesSeleccionados = Object.values(mesesCalentar).some(v => v);
    if (!mesesSeleccionados) return false;

    // Radios obligatorios
    if (cubierta === null) return false;
    if (techada === null) return false;
    if (!usarBombaCalentamiento) return false;

    return true;
  };

    const obtenerErroresCalentamiento = () => {
      const errores = {};

      if (!ciudad) errores.ciudad = true;
      if (tempDeseada === null || tempDeseada <= 0) errores.tempDeseada = true;

      const mesesSeleccionados = Object.values(mesesCalentar).some(v => v);
      if (!mesesSeleccionados) errores.meses = true;

      if (cubierta === null) errores.cubierta = true;
      if (techada === null) errores.techada = true;
      if (!usarBombaCalentamiento) errores.usarBombaCalentamiento = true;

      return errores;
    };

  const errores = obtenerErroresCalentamiento();

  const yaConfiguroCalentamiento = useMemo(() => {
    return (
      ciudad ||
      tempDeseada !== null ||
      Object.keys(mesesCalentar).length > 0 ||
      cubierta !== null ||
      techada !== null
    );
  }, [ciudad, tempDeseada, mesesCalentar, cubierta, techada]);

  /* =========================
     GUARDAR EN APP
  ========================== */
  useEffect(() => {
    setDatosPorSistema(prev => ({
      ...prev,
      calentamiento: {
        usarBombaCalentamiento,
        ciudad,
        tempDeseada,
        cubierta,
        techada,
        mesesCalentar
      }
    }));
  }, [
    usarBombaCalentamiento,
    ciudad,
    tempDeseada,
    cubierta,
    techada,
    mesesCalentar,
    setDatosPorSistema
  ]);

const ciudadesMexico = [
  { key: "guadalajara", label: "Guadalajara" },
  { key: "mexicali", label: "Mexicali" },
  { key: "losCabos", label: "Los Cabos" },
  { key: "hermosillo", label: "Hermosillo" },
  { key: "chihuahua", label: "Chihuahua" },
  { key: "torreon", label: "Torreón" },
  { key: "monterrey", label: "Monterrey" },
  { key: "tampico", label: "Tampico" },
  { key: "veracruz", label: "Veracruz" },
  { key: "sanLuisPotosi", label: "San Luis Potosí" },
  { key: "durango", label: "Durango" },
  { key: "culiacan", label: "Culiacán" },
  { key: "tepic", label: "Tepic" },
  { key: "colima", label: "Colima" },
  { key: "aguascalientes", label: "Aguascalientes" },
  { key: "zacatecas", label: "Zacatecas" },
  { key: "morelia", label: "Morelia" },
  { key: "leon", label: "León" },
  { key: "queretaro", label: "Querétaro" },
  { key: "pachuca", label: "Pachuca" },
  { key: "ciudadDeMexico", label: "Ciudad de México" },
  { key: "acapulco", label: "Acapulco" },
  { key: "cuernavaca", label: "Cuernavaca" },
  { key: "puebla", label: "Puebla" },
  { key: "tlaxcala", label: "Tlaxcala" },
  { key: "oaxaca", label: "Oaxaca" },
  { key: "villahermosa", label: "Villahermosa" },
  { key: "tuxtlaGutierrez", label: "Tuxtla Gutierrez" },
  { key: "campeche", label: "Campeche" },
  { key: "merida", label: "Mérida" },
  { key: "cancun", label: "Cancún" },
  { key: "manzanillo", label: "Manzanillo" },
  { key: "puertoVallarta", label: "Puerto Vallarta" },
];

  /* =========================
    CLIMA REAL (desde clima.js)
  ========================== */
  const clima = useMemo(() => {
    if (!ciudad) return [];
    return getClimaMensual(ciudad);
  }, [ciudad]);

  const mesMasFrio = useMemo(() => {
    const seleccionados = clima.filter(m => mesesCalentar[m.mes]);
    if (!seleccionados.length) return null;

    return seleccionados.reduce((frio, actual) =>
      actual.tProm < frio.tProm ? actual : frio
    );
  }, [clima, mesesCalentar]);

  const datosTermicos = useMemo(() => ({
    area: areaTotal,
    volumen: volumenTotal,
    profundidad: profundidadPromedio,

    tempDeseada,
    techada,
    cubierta
  }), [
    areaTotal,
    volumenTotal,
    profundidadPromedio,
    tempDeseada,
    techada,
    cubierta
  ]);

const profMaxSistema = useMemo(() => {
  if (!sistemaActivo?.cuerpos?.length) return 0;
  return Math.max(
    ...sistemaActivo.cuerpos.map(c => parseFloat(c.profMax) || 0)
  );
}, [sistemaActivo]);

const perdidaEvaporacion = useMemo(() => {
  if (!mesMasFrio || !tempDeseada || areaTotal <= 0) return 0;
  return qEvaporacion(datosTermicos, mesMasFrio);
}, [datosTermicos, mesMasFrio, tempDeseada, areaTotal]);

const perdidaConveccion = useMemo(() => {
  if (!mesMasFrio || !tempDeseada || areaTotal <= 0) return 0;
  return qConveccion(datosTermicos, mesMasFrio);
}, [datosTermicos, mesMasFrio, tempDeseada, areaTotal]);

const perdidaRadiacion = useMemo(() => {
  if (!mesMasFrio || !tempDeseada || areaTotal <= 0) return 0;
  return qRadiacion(datosTermicos, mesMasFrio);
}, [datosTermicos, mesMasFrio, tempDeseada, areaTotal]);

const perdidaTransmision = useMemo(() => {
  if (!mesMasFrio || !tempDeseada || areaTotal <= 0) return 0;
  return qTransmision(
    {
      area: areaTotal,
      profMax: profMaxSistema,
      tempDeseada
    },
    mesMasFrio
  );
}, [mesMasFrio, tempDeseada, areaTotal, profMaxSistema]);

const perdidaInfinity = useMemo(() => {
  if (!mesMasFrio || !tempDeseada) return 0;
  if (!sistemaActivo) return 0;
  if (
    sistemaActivo.desborde !== "infinity" &&
    sistemaActivo.desborde !== "ambos"
  ) {
    return 0;
  }
  const largoInfinity = parseFloat(sistemaActivo.largoInfinity) || 0;
  if (largoInfinity <= 0) return 0;
  if (profMaxSistema <= 0) return 0;
  return qInfinity(
    {
      profMin: 0,
      profMax: profMaxSistema, // ✅ MISMA PROFUNDIDAD
      largoInfinity,
      tempDeseada
    },
    mesMasFrio
  );
}, [
  mesMasFrio,
  tempDeseada,
  sistemaActivo,
  profMaxSistema
]);

const perdidaCanal = useMemo(() => {
  if (!mesMasFrio || !tempDeseada) return 0;
  // 👉 aquí decides la condición lógica
  // ajusta según tu modelo de datos real
  const largoCanal =
    datosPorSistema?.dimensiones?.largoCanal ||
    sistemaActivo?.largoCanal ||
    0;
  if (largoCanal <= 0) return 0;
  return qCanal(
    {
      largoCanal,
      tempDeseada
    },
    mesMasFrio
  );
}, [
  mesMasFrio,
  tempDeseada,
  datosPorSistema,
  sistemaActivo
]);

const perdidasBTU = useMemo(() => ({
  evaporacion: perdidaEvaporacion,
  conveccion: perdidaConveccion,
  radiacion: perdidaRadiacion,
  transmision: perdidaTransmision,
  infinity: perdidaInfinity,
  canal: perdidaCanal
}), [
  perdidaEvaporacion,
  perdidaConveccion,
  perdidaRadiacion,
  perdidaTransmision,
  perdidaInfinity,
  perdidaCanal
]);

const perdidaTotalBTU = useMemo(() => {
  return Object.values(perdidasBTU).reduce((a, b) => a + b, 0);
}, [perdidasBTU]);

useEffect(() => {
  setDatosPorSistema(prev => ({
    ...prev,
    calentamiento: {
      ...prev.calentamiento,
      perdidasBTU,
      perdidaTotalBTU
    }
  }));
}, [perdidasBTU, perdidaTotalBTU, setDatosPorSistema]);

  useEffect(() => {
    if (clima.length && Object.keys(mesesCalentar).length === 0) {
      const todos = {};
      clima.forEach(m => {
        todos[m.mes] = true;
      });
      setMesesCalentar(todos);
    }
  }, [clima]);

  /* =========================
     DESCRIPCIONES FOOTER
  ========================== */
  const descripcionesCampos = {
    ciudad: "Ubicación geográfica del proyecto para obtener datos climáticos",
    tempDeseada: "Temperatura objetivo del agua durante la operación",
    cubierta: "La cubierta térmica reduce significativamente pérdidas por evaporación",
    techada: "Un cuerpo de agua techado reduce convección y radiación",
    meses: "Meses del año en los que el sistema deberá aportar energía térmica",
    grafica: "Distribución porcentual de las pérdidas energéticas del sistema",
    usarBombaCalentamiento: "Define si el sistema de calentamiento contará con una motobomba independiente",
    default: "Configuración térmica del sistema"
  };

  /* =========================
     DATA GRÁFICA
  ========================== */
const pieData = useMemo(() => {
  const total = perdidaTotalBTU || 1;

  return {
    labels: ["Evaporación", "Convección", "Radiación", "Transmisión", "Infinity", "Canal Perimetral"],
    datasets: [{
      data: [
        perdidasBTU.evaporacion,
        perdidasBTU.conveccion,
        perdidasBTU.radiacion,
        perdidasBTU.transmision,
        perdidasBTU.infinity,
        perdidasBTU.canal
      ],
      backgroundColor: [
          "rgba(30,64,175,0.85)", // evaporacion
          "rgba(56,189,248,0.85)",   // cian → convección
          "rgba(251,113,133,0.85)",   // rojo/rosa → radiación)"
          "rgba(163,163,163,0.85)",  // transmisión (gris técnico)
          "rgba(34,197,94,0.85)",     // infinity (verde energético)
          "rgba(96,165,250,0.85)"   // canal

      ],
      borderColor: "rgba(15,23,42,0.8)",
      borderWidth: 2
    }]
  };
}, [perdidasBTU, perdidaTotalBTU]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
      layout: {
        padding: {
          top: 18,
          bottom: 18,
          left: 18,
          right: 18
        }
      },
      plugins: {
        legend: {
          position: "right", // 👈 mover a la derecha
          labels: {
            color: "#e5e7eb", // gris claro (Tailwind gray-200)
            font: {
              size: 13,
              weight: "500"
            },
            padding: 14,
            boxWidth: 14
          }
        },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed} BTU/h`;
          }
        }
      }
    }
  };

  const volverConAnimacion = () => {
    setAnimandoSalida(true);
    setTimeout(() => setSeccion("dimensiones"), 220);
  };

  /* =========================
     JSX
  ========================== */
  return (
    <div className="form-section hero-wrapper calentamiento">
      <div className="selector-tecnico modo-experto">

        {/* HEADER */}
        <div className="selector-header">
          <div className="selector-titulo">
            Calentamiento del sistema
          </div>

          <div className="selector-subtitulo-tecnico">
            Análisis térmico y condiciones climáticas
          </div>
        </div>
          <div className="selector-acciones">
            <button
              className="btn-secundario"
              onClick={volverConAnimacion}
            >
              ← Volver a {nombreSistema}
            </button>

            <div className="aviso-wrapper">
              <button
                className={`btn-primario ${mostrarAviso ? "error" : ""}`}
                onClick={() => {
                  if (!calentamientoCompleto()) {
                    setMostrarErrores(true);
                    setMostrarAviso(true);
                    setTimeout(() => setMostrarAviso(false), 2500);
                    return;
                  }
                  setSeccion("equipamiento");
                }}
              >
                Ir a Equipamiento →
              </button>

              {mostrarAviso && (
                <div className="aviso-validacion">
                  Llena toda la información solicitada
                </div>
              )}
            </div>
          </div>

        {mostrarOmitirHint && !yaConfiguroCalentamiento && (
          <div className="callout-omitir-calentamiento">
            <div className="callout-texto">
              <strong>¿No deseas calentamiento?</strong>
              <span>
                Puedes omitir esta sección y continuar directamente a equipamiento.
              </span>
            </div>

            <div className="callout-acciones">
              <button
                className="btn-secundario"
                onClick={() => setSeccion("equipamiento")}
              >
                Omitir calentamiento →
              </button>

              <button
                className="btn-link"
                onClick={() => setMostrarOmitirHint(false)}
              >
                Configurar calentamiento
              </button>
            </div>
          </div>
        )}

        <div className={`selector-contenido ${animandoSalida ? "salida" : "entrada"}`}>

          {/* DATOS GENERALES */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">Datos generales del proyecto</div>

            <div className="selector-grid">
              <div
                className="campo"
                onMouseEnter={() => setHoveredField("ciudad")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <label>Ubicación del proyecto</label>
                  <select
                    className={`input-azul ${
                      mostrarErrores && errores.ciudad ? "input-error" : ""
                    }`}
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                  >
                  <option value="">Selecciona ciudad</option>
                    {ciudadesMexico.map(c => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>

              <div
                className="campo"
                onMouseEnter={() => setHoveredField("tempDeseada")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <label>Temperatura deseada (°C)</label>
                  <input
                    type="number"
                    className={`input-azul ${
                      mostrarErrores && errores.tempDeseada ? "input-error" : ""
                    }`}
                    value={tempDeseadaInput}
                    onChange={e => {
                      const val = e.target.value;

                      setTempDeseadaInput(val);

                      if (val === "") {
                        setTempDeseada(null);
                      } else {
                        setTempDeseada(Number(val));
                      }
                    }}
                  />
              </div>
            </div>

            <div className="selector-radios">
              <div
                className={`grupo-radio ${
                  mostrarErrores && errores.cubierta ? "grupo-radio-error" : ""
                }`}
              >
                <span>¿Cuenta con cubierta térmica?</span>
                <label>
                  <input
                    type="radio"
                    checked={cubierta === true}
                    onChange={() => setCubierta(true)}
                  /> Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={cubierta === false}
                    onChange={() => setCubierta(false)}
                  /> No
                </label>
              </div>

              <div
                className={`grupo-radio ${
                  mostrarErrores && errores.techada ? "grupo-radio-error" : ""
                }`}
              >
                <span>¿El cuerpo de agua está techado?</span>
                <label>
                  <input
                    type="radio"
                    checked={techada === true}
                    onChange={() => setTechada(true)}
                  /> Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={techada === false}
                    onChange={() => setTechada(false)}
                  /> No
                </label>
              </div>
            </div>
          </div>

          {/* CLIMA + GRÁFICA */}
          <div className="selector-grupo">
            <div className="selector-subtitulo fila-header-clima">
              <span>Análisis climático y pérdidas energéticas</span>
            </div>

            <div className="layout-clima-grafica">
              <div
                className="grafica-mini"
                onMouseEnter={() => setHoveredField("grafica")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <Pie data={pieData} options={pieOptions} />
              </div>

                <div
                  className="tabla-clima-card"
                  onMouseEnter={() => setHoveredField("meses")}
                  onMouseLeave={() => setHoveredField(null)}
                >

                <table className="tabla-clima-pro">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Temp Min (°C)</th>
                      <th>Temp Prom (°C)</th>
                      <th>Temp Max (°C)</th>
                      <th>Humedad (%)</th>
                      <th>Viento</th>
                      <th className="th-calentar">
                        <label className="checkbox-columna">
                          <input
                            type="checkbox"
                            checked={
                              clima.length &&
                              clima.every(m => mesesCalentar[m.mes])
                            }
                            onChange={e => {
                              const nuevo = {};
                              clima.forEach(m => {
                                nuevo[m.mes] = e.target.checked;
                              });
                              setMesesCalentar(nuevo);
                            }}
                          />
                          <span>Seleccionar todo</span>
                        </label>

                        <div className="titulo-columna">
                          Calentar
                        </div>
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {clima.map(m => (
                      <tr key={m.mes}>
                        <td>{m.mes}</td>
                        <td>{m.tMin}</td>
                        <td>{m.tProm}</td>
                        <td>{m.tMax}</td>
                        <td>{m.humedad}</td>
                        <td>{m.viento}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={mesesCalentar[m.mes] || false}
                            onChange={() =>
                              setMesesCalentar(prev => ({
                                ...prev,
                                [m.mes]: !prev[m.mes]
                              }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                  <div
                    className={`tabla-resumen-frio ${
                      mesMasFrio ? "visible" : "oculto"
                    }`}
                  >
                    <div className="resumen-titulo">
                      Mes más frío seleccionado
                    </div>

                    <table className="tabla-clima-pro resumen">
                      <thead>
                        <tr>
                          <th>Mes</th>
                          <th>Temp Min (°C)</th>
                          <th>Temp Prom (°C)</th>
                          <th>Viento Máx</th>
                          <th>Humedad (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                      {mesMasFrio ? (
                        <tr>
                          <td>{mesMasFrio.mes}</td>
                          <td>{mesMasFrio.tMin}</td>
                          <td>{mesMasFrio.tProm}</td>
                          <td>{mesMasFrio.viento}</td>
                          <td>{mesMasFrio.humedad}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5} className="resumen-placeholder">
                            Selecciona meses para ver el resumen
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* MOTOBOMBA */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">
              Motobomba para sistema de calentamiento
            </div>
                <div
                  className={`selector-radios ${
                    mostrarErrores && errores.usarBombaCalentamiento ? "grupo-radio-error" : ""
                  }`}
                >
              <label>
                <input
                  type="radio"
                  checked={usarBombaCalentamiento === "si"}
                  onChange={() => setUsarBombaCalentamiento("si")}
                />
                Sí, motobomba independiente
              </label>

              <label>
                <input
                  type="radio"
                  checked={usarBombaCalentamiento === "no"}
                  onChange={() => setUsarBombaCalentamiento("no")}
                />
                No, comparte motobomba de filtrado
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="selector-footer fijo calentamiento">
          <span>Modo ingeniería · Calentamiento</span>
          <span className="footer-highlight">
            {hoveredField
              ? descripcionesCampos[hoveredField]
              : descripcionesCampos.default}
          </span>
        </div>
      </div>

      </div>

  );
}
