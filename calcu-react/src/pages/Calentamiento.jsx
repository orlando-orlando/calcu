import { useState, useMemo, useEffect } from "react";
import "../estilos.css";
import { getClimaMensual } from "../data/clima";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calentamiento({
  setSeccion,
  tipoSistema,
  datosPorSistema,
  setDatosPorSistema
}) {

  const SISTEMAS_LABELS = {
    alberca: "Alberca",
    jacuzzi: "Jacuzzi",
    chapoteadero: "Chapoteadero",
    espejoAgua: "Espejo de agua",

    albercaJacuzzi1: "Alberca + Jacuzzi (1 cuerpo)",
    albercaChapo1: "Alberca + Chapoteadero (1 cuerpo)",
    jacuzziChapo1: "Jacuzzi + Chapoteadero (1 cuerpo)",

    albercaJacuzzi2: "Alberca + Jacuzzi (2 cuerpos)",
    albercaChapo2: "Alberca + Chapoteadero (2 cuerpos)",
    jacuzziChapo2: "Jacuzzi + Chapoteadero (2 cuerpos)"
  };

  const nombreSistema =
  SISTEMAS_LABELS[tipoSistema] || "Dimensiones";


  /* =========================
     ESTADOS (con persistencia)
  ========================== */
  const datosPrevios = datosPorSistema?.calentamiento || {};

  const [usarBombaCalentamiento, setUsarBombaCalentamiento] = useState(
    datosPrevios.usarBombaCalentamiento || "no"
  );
  const [ciudad, setCiudad] = useState(datosPrevios.ciudad || "");
  const [tempDeseada, setTempDeseada] = useState(datosPrevios.tempDeseada ?? 30);
  const [cubierta, setCubierta] = useState(datosPrevios.cubierta ?? false);
  const [techada, setTechada] = useState(datosPrevios.techada ?? false);
  const [mesesCalentar, setMesesCalentar] = useState(
    datosPrevios.mesesCalentar || {}
  );

  const [hoveredField, setHoveredField] = useState(null);
  const [animandoSalida, setAnimandoSalida] = useState(false);

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
    usarBombaCalentamiento:
      "Define si el sistema de calentamiento contará con una motobomba independiente",
    default: "Configuración térmica del sistema"
  };

  /* =========================
     DATA GRÁFICA
  ========================== */
  const pieData = useMemo(() => ({
    labels: [
      "Evaporación",
      "Convección",
      "Radiación",
      "Transmisión",
      "Infinity",
      "Canal",
      "Tuberías"
    ],
    datasets: [
      {
        data: [30, 20, 15, 10, 10, 8, 7],
        backgroundColor: [
          "rgba(96,165,250,0.85)",
          "rgba(56,189,248,0.85)",
          "rgba(167,139,250,0.85)",
          "rgba(251,191,36,0.85)",
          "rgba(34,197,94,0.85)",
          "rgba(244,114,182,0.85)",
          "rgba(148,163,184,0.85)"
        ],
        borderColor: "rgba(15,23,42,0.8)",
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  }), []);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
            return `${context.label}: ${context.parsed}%`;
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
          <div className="selector-titulo">Calentamiento del sistema</div>
          <div className="selector-subtitulo-tecnico">
            Análisis térmico y condiciones climáticas
          </div>
        </div>

        <div className="selector-acciones">
          <button className="btn-secundario" onClick={volverConAnimacion}>
            ← Volver a {nombreSistema}
          </button>
          <button
            className="btn-primario"
            onClick={() => setSeccion("equipamiento")}
          >
            Ir a Equipamiento →
          </button>
        </div>

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
                  className="input-azul"
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
                  className="input-azul"
                  value={tempDeseada}
                  onChange={e => setTempDeseada(+e.target.value)}
                />
              </div>
            </div>

            <div className="selector-radios">
              <div
                className="grupo-radio"
                onMouseEnter={() => setHoveredField("cubierta")}
                onMouseLeave={() => setHoveredField(null)}
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
                className="grupo-radio"
                onMouseEnter={() => setHoveredField("techada")}
                onMouseLeave={() => setHoveredField(null)}
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
            <div className="selector-subtitulo">
              Análisis climático y pérdidas energéticas
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
                className="tabla-clima-wrapper"
                onMouseEnter={() => setHoveredField("meses")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <table className="tabla-resultados">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Temp Min</th>
                      <th>Temp Prom</th>
                      <th>Temp Max</th>
                      <th>Humedad</th>
                      <th>Viento</th>
                      <th>Calentar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clima.map(m => (
                      <tr key={m.mes}>
                        <td>{m.mes}</td>
                        <td>{m.tMin}°C</td>
                        <td>{m.tProm}°C</td>
                        <td>{m.tMax}°C</td>
                        <td>{m.humedad}%</td>
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
              </div>
            </div>
          </div>

          {/* MOTOBOMBA */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">
              Motobomba para sistema de calentamiento
            </div>

            <div
              className="selector-radios"
              onMouseEnter={() => setHoveredField("usarBombaCalentamiento")}
              onMouseLeave={() => setHoveredField(null)}
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

          <div className="acciones-calentamiento">
            <button
              className="btn-secundario"
              onClick={() => setSeccion("equipamiento")}
            >
              Omitir calentamiento y continuar →
            </button>
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
