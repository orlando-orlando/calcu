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

/* ─── Catálogo de sistemas de calentamiento ─── */
const SISTEMAS_CALENTAMIENTO = [
  { key: "bombaCalor",          label: "Bomba de calor",        icon: "🔥" },
  { key: "caldera",             label: "Caldera",               icon: "🌡️" },
  { key: "panelSolar",          label: "Panel solar",           icon: "☀️" },
  { key: "calentadorElectrico", label: "Calentador eléctrico",  icon: "⚡" },
];

const TASAS_ELEVACION = [0.25, 0.50, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0];

const SISTEMA_DEFAULTS = () => ({
  distancia: "",
  alturaVertical: "",
  tasaElevacion: null, // solo caldera
});

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

  /* ── Estados con persistencia ── */
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

  /* ── NUEVO: sistemas de calentamiento seleccionados ── */
  const [sistemasSeleccionados, setSistemasSeleccionados] = useState(
    datosPrevios.sistemasSeleccionados || {}
    // e.g. { bombaCalor: { distancia: "5", alturaVertical: "2" }, caldera: { distancia: "3", alturaVertical: "1", tasaElevacion: 1.0 } }
  );

  /* ─── helpers para sistemas ─── */
  const toggleSistema = (key) => {
    setSistemasSeleccionados(prev => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: SISTEMA_DEFAULTS() };
    });
  };

  const updateSistemaField = (key, field, value) => {
    setSistemasSeleccionados(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  /* ── Validaciones ── */
  const sistemaCalentamientoCompleto = useMemo(() => {
    const keys = Object.keys(sistemasSeleccionados);
    if (keys.length === 0) return false;
    return keys.every(k => {
      const s = sistemasSeleccionados[k];
      const base = s.distancia !== "" && s.alturaVertical !== "";
      if (k === "caldera") return base && s.tasaElevacion !== null;
      return base;
    });
  }, [sistemasSeleccionados]);

  const calentamientoCompleto = () => {
    if (!ciudad) return false;
    if (tempDeseada === null || tempDeseada <= 0) return false;
    const mesesSeleccionados = Object.values(mesesCalentar).some(v => v);
    if (!mesesSeleccionados) return false;
    if (cubierta === null) return false;
    if (techada === null) return false;
    if (!usarBombaCalentamiento) return false;
    if (!sistemaCalentamientoCompleto) return false;
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
    if (!sistemaCalentamientoCompleto) errores.sistemasCalentamiento = true;
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

  /* ── Clima ── */
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
  }), [areaTotal, volumenTotal, profundidadPromedio, tempDeseada, techada, cubierta]);

  const profMaxSistema = useMemo(() => {
    if (!sistemaActivo?.cuerpos?.length) return 0;
    return Math.max(
      ...sistemaActivo.cuerpos.map(c =>
        Math.max(parseFloat(c.profMin) || 0, parseFloat(c.profMax) || 0)
      )
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
    return qTransmision({ area: areaTotal, profMax: profMaxSistema, tempDeseada }, mesMasFrio);
  }, [mesMasFrio, tempDeseada, areaTotal, profMaxSistema]);

  const perdidaInfinity = useMemo(() => {
    if (!mesMasFrio || !tempDeseada) return 0;
    if (!sistemaActivo) return 0;
    if (sistemaActivo.desborde !== "infinity" && sistemaActivo.desborde !== "ambos") return 0;
    const largoInfinity = parseFloat(sistemaActivo.largoInfinity) || 0;
    if (largoInfinity <= 0 || profMaxSistema <= 0) return 0;
    return qInfinity({ profMin: 0, profMax: profMaxSistema, largoInfinity, tempDeseada }, mesMasFrio);
  }, [mesMasFrio, tempDeseada, sistemaActivo, profMaxSistema]);

  const perdidaCanal = useMemo(() => {
    if (!mesMasFrio || !tempDeseada) return 0;
    if (!sistemaActivo) return 0;
    if (sistemaActivo.desborde !== "canal" && sistemaActivo.desborde !== "ambos") return 0;
    const largoCanal = parseFloat(sistemaActivo.largoCanal) || 0;
    if (largoCanal <= 0) return 0;
    return qCanal({ largoCanal, tempDeseada }, mesMasFrio);
  }, [mesMasFrio, tempDeseada, sistemaActivo]);

  const perdidasBTU = useMemo(() => ({
    evaporacion: perdidaEvaporacion,
    conveccion: perdidaConveccion,
    radiacion: perdidaRadiacion,
    transmision: perdidaTransmision,
    infinity: perdidaInfinity,
    canal: perdidaCanal
  }), [perdidaEvaporacion, perdidaConveccion, perdidaRadiacion, perdidaTransmision, perdidaInfinity, perdidaCanal]);

  const perdidaTotalBTU = useMemo(() => Object.values(perdidasBTU).reduce((a, b) => a + b, 0), [perdidasBTU]);

  useEffect(() => {
    setDatosPorSistema(prev => ({
      ...prev,
      calentamiento: {
        usarBombaCalentamiento,
        ciudad,
        tempDeseada,
        cubierta,
        techada,
        mesesCalentar,
        perdidasBTU,
        perdidaTotalBTU,
        sistemasSeleccionados
      }
    }));
  }, [usarBombaCalentamiento, ciudad, tempDeseada, cubierta, techada, mesesCalentar, perdidasBTU, perdidaTotalBTU, sistemasSeleccionados, setDatosPorSistema]);

  useEffect(() => {
    if (clima.length && Object.keys(mesesCalentar).length === 0) {
      const todos = {};
      clima.forEach(m => { todos[m.mes] = true; });
      setMesesCalentar(todos);
    }
  }, [clima]);

  /* ── Descripciones footer ── */
  const descripcionesCampos = {
    ciudad: "Ubicación geográfica del proyecto para obtener datos climáticos",
    tempDeseada: "Temperatura objetivo del agua durante la operación",
    cubierta: "La cubierta térmica reduce significativamente pérdidas por evaporación",
    techada: "Un cuerpo de agua techado reduce convección y radiación",
    meses: "Meses del año en los que el sistema deberá aportar energía térmica",
    grafica: "Distribución porcentual de las pérdidas energéticas del sistema",
    usarBombaCalentamiento: "Define si el sistema de calentamiento contará con una motobomba independiente",
    sistemasCalentamiento: "Tipo(s) de fuente de calor. Selecciona uno o varios; cada uno requiere distancia y altura respecto al espejo de agua",
    default: "Configuración térmica del sistema"
  };

  /* ── Pie chart ── */
  const pieData = useMemo(() => ({
    labels: ["Evaporación", "Convección", "Radiación", "Transmisión", "Infinity", "Canal Perimetral"],
    datasets: [{
      data: [perdidasBTU.evaporacion, perdidasBTU.conveccion, perdidasBTU.radiacion, perdidasBTU.transmision, perdidasBTU.infinity, perdidasBTU.canal],
      backgroundColor: [
        "rgba(30,64,175,0.85)",
        "rgba(56,189,248,0.85)",
        "rgba(251,113,133,0.85)",
        "rgba(163,163,163,0.85)",
        "rgba(34,197,94,0.85)",
        "rgba(96,165,250,0.85)"
      ],
      borderColor: "rgba(15,23,42,0.8)",
      borderWidth: 2
    }]
  }), [perdidasBTU]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 18, bottom: 18, left: 18, right: 18 } },
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#e5e7eb", font: { size: 13, weight: "500" }, padding: 14, boxWidth: 14 }
      },
      tooltip: {
        callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed} BTU/h` }
      }
    }
  };

  const volverConAnimacion = () => {
    setAnimandoSalida(true);
    setTimeout(() => setSeccion("dimensiones"), 220);
  };

  /* ─────────────────────────────────────────
     JSX
  ───────────────────────────────────────── */
  return (
    <div className="form-section hero-wrapper calentamiento">
      <div className="selector-tecnico modo-experto">

        {/* HEADER */}
        <div className="selector-header">
          <div className="selector-titulo">Calentamiento del sistema</div>
          <div className="selector-subtitulo-tecnico">Análisis térmico y condiciones climáticas</div>
        </div>

        <div className="selector-acciones">
          <button className="btn-secundario" onClick={volverConAnimacion}>
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
              <div className="aviso-validacion">Llena toda la información solicitada</div>
            )}
          </div>
        </div>

        {mostrarOmitirHint && !yaConfiguroCalentamiento && (
          <div className="callout-omitir-calentamiento">
            <div className="callout-texto">
              <strong>¿No deseas calentamiento?</strong>
              <span>Puedes omitir esta sección y continuar directamente a equipamiento.</span>
            </div>
            <div className="callout-acciones">
              <button className="btn-secundario" onClick={() => setSeccion("equipamiento")}>
                Omitir calentamiento →
              </button>
              <button className="btn-link" onClick={() => setMostrarOmitirHint(false)}>
                Configurar calentamiento
              </button>
            </div>
          </div>
        )}

        <div className={`selector-contenido ${animandoSalida ? "salida" : "entrada"}`}>

          {/* ── DATOS GENERALES ── */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">Datos generales del proyecto</div>

            <div className="selector-grid">
              <div className="campo" onMouseEnter={() => setHoveredField("ciudad")} onMouseLeave={() => setHoveredField(null)}>
                <label>Ubicación del proyecto</label>
                <select
                  className={`input-azul ${mostrarErrores && errores.ciudad ? "input-error" : ""}`}
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                >
                  <option value="">Selecciona ciudad</option>
                  {ciudadesMexico.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>

              <div className="campo" onMouseEnter={() => setHoveredField("tempDeseada")} onMouseLeave={() => setHoveredField(null)}>
                <label>Temperatura deseada (°C)</label>
                <input
                  type="number"
                  className={`input-azul ${mostrarErrores && errores.tempDeseada ? "input-error" : ""}`}
                  value={tempDeseadaInput}
                  onChange={e => {
                    const val = e.target.value;
                    setTempDeseadaInput(val);
                    setTempDeseada(val === "" ? null : Number(val));
                  }}
                />
              </div>
            </div>

            <div className="selector-radios">
              <div className={`grupo-radio ${mostrarErrores && errores.cubierta ? "grupo-radio-error" : ""}`}>
                <span>¿Cuenta con cubierta térmica?</span>
                <label><input type="radio" checked={cubierta === true} onChange={() => setCubierta(true)} /> Sí</label>
                <label><input type="radio" checked={cubierta === false} onChange={() => setCubierta(false)} /> No</label>
              </div>

              <div className={`grupo-radio ${mostrarErrores && errores.techada ? "grupo-radio-error" : ""}`}>
                <span>¿El cuerpo de agua está techado?</span>
                <label><input type="radio" checked={techada === true} onChange={() => setTechada(true)} /> Sí</label>
                <label><input type="radio" checked={techada === false} onChange={() => setTechada(false)} /> No</label>
              </div>
            </div>
          </div>

          {/* ── CLIMA + GRÁFICA ── */}
          <div className="selector-grupo">
            <div className="selector-subtitulo fila-header-clima">
              <span>Análisis climático y pérdidas energéticas</span>
            </div>

            <div className="layout-clima-grafica">
              <div className="grafica-mini" onMouseEnter={() => setHoveredField("grafica")} onMouseLeave={() => setHoveredField(null)}>
                <Pie data={pieData} options={pieOptions} />
              </div>

              <div className="tabla-clima-card" onMouseEnter={() => setHoveredField("meses")} onMouseLeave={() => setHoveredField(null)}>
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
                            checked={clima.length && clima.every(m => mesesCalentar[m.mes])}
                            onChange={e => {
                              const nuevo = {};
                              clima.forEach(m => { nuevo[m.mes] = e.target.checked; });
                              setMesesCalentar(nuevo);
                            }}
                          />
                          <span>Seleccionar todo</span>
                        </label>
                        <div className="titulo-columna">Calentar</div>
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
                            onChange={() => setMesesCalentar(prev => ({ ...prev, [m.mes]: !prev[m.mes] }))}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={`tabla-resumen-frio ${mesMasFrio ? "visible" : "oculto"}`}>
                  <div className="resumen-titulo">Mes más frío seleccionado</div>
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
                        <tr><td colSpan={5} className="resumen-placeholder">Selecciona meses para ver el resumen</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── SISTEMAS DE CALENTAMIENTO ── (NUEVO) */}
          <div
            className={`selector-grupo ${mostrarErrores && errores.sistemasCalentamiento ? "grupo-error" : ""}`}
            onMouseEnter={() => setHoveredField("sistemasCalentamiento")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="selector-subtitulo">
              Sistema(s) de calentamiento
              <span className="selector-subtitulo-hint">Selecciona uno o más</span>
            </div>

            {/* Tarjetas de selección */}
            <div className="sistemas-calentamiento-grid">
              {SISTEMAS_CALENTAMIENTO.map(({ key, label, icon }) => {
                const activo = !!sistemasSeleccionados[key];
                return (
                  <div
                    key={key}
                    className={`sistema-cal-card ${activo ? "activo" : ""} ${mostrarErrores && errores.sistemasCalentamiento && !activo && Object.keys(sistemasSeleccionados).length === 0 ? "card-error" : ""}`}
                    onClick={() => toggleSistema(key)}
                  >
                    <div className="sistema-cal-icon">{icon}</div>
                    <div className="sistema-cal-label">{label}</div>
                    <div className={`sistema-cal-check ${activo ? "checked" : ""}`}>
                      {activo ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campos de detalle por sistema seleccionado */}
            {Object.keys(sistemasSeleccionados).length > 0 && (
              <div className="sistemas-detalle-wrapper">
                {SISTEMAS_CALENTAMIENTO.filter(s => sistemasSeleccionados[s.key]).map(({ key, label, icon }) => {
                  const datos = sistemasSeleccionados[key];
                  const camposIncompletos = mostrarErrores && (
                    datos.distancia === "" ||
                    datos.alturaVertical === "" ||
                    (key === "caldera" && datos.tasaElevacion === null)
                  );

                  return (
                    <div key={key} className={`sistema-detalle-card ${camposIncompletos ? "detalle-error" : ""}`}>
                      <div className="sistema-detalle-header">
                        <span className="sistema-detalle-icon">{icon}</span>
                        <span className="sistema-detalle-titulo">{label}</span>
                      </div>

                      <div className="sistema-detalle-campos">
                        <div className="campo">
                          <label>Distancia al cuerpo de agua (m)</label>
                          <input
                            type="number"
                            min="0"
                            className={`input-azul ${camposIncompletos && datos.distancia === "" ? "input-error" : ""}`}
                            value={datos.distancia}
                            onChange={e => updateSistemaField(key, "distancia", e.target.value)}
                            placeholder="ej. 5"
                          />
                        </div>

                        <div className="campo">
                          <label>Altura vertical sobre espejo de agua (m)</label>
                          <input
                            type="number"
                            min="0"
                            className={`input-azul ${camposIncompletos && datos.alturaVertical === "" ? "input-error" : ""}`}
                            value={datos.alturaVertical}
                            onChange={e => updateSistemaField(key, "alturaVertical", e.target.value)}
                            placeholder="ej. 2"
                          />
                        </div>

                        {/* Campo exclusivo de caldera */}
                        {key === "caldera" && (
                          <div className="campo campo-tasa-elevacion">
                            <label>Tasa de elevación (°C/h)</label>
                            <div className={`tasa-elevacion-grid ${camposIncompletos && datos.tasaElevacion === null ? "tasa-error" : ""}`}>
                              {TASAS_ELEVACION.map(tasa => (
                                <button
                                  key={tasa}
                                  type="button"
                                  className={`tasa-btn ${datos.tasaElevacion === tasa ? "tasa-activa" : ""}`}
                                  onClick={() => updateSistemaField(key, "tasaElevacion", tasa)}
                                >
                                  {tasa}°C/h
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── MOTOBOMBA ── */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">Motobomba para sistema de calentamiento</div>
            <div
              className={`selector-radios ${mostrarErrores && errores.usarBombaCalentamiento ? "grupo-radio-error" : ""}`}
              onMouseEnter={() => setHoveredField("usarBombaCalentamiento")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <label>
                <input type="radio" checked={usarBombaCalentamiento === "si"} onChange={() => setUsarBombaCalentamiento("si")} />
                Sí, motobomba independiente
              </label>
              <label>
                <input type="radio" checked={usarBombaCalentamiento === "no"} onChange={() => setUsarBombaCalentamiento("no")} />
                No, comparte motobomba de filtrado
              </label>
            </div>
          </div>

        </div>{/* /selector-contenido */}

        {/* FOOTER */}
        <div className="selector-footer fijo calentamiento">
          <span>Modo ingeniería · Calentamiento</span>
          <span className="footer-highlight">
            {hoveredField ? descripcionesCampos[hoveredField] : descripcionesCampos.default}
          </span>
        </div>
      </div>
    </div>
  );
}