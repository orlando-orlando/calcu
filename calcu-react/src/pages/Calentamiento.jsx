import { useState, useMemo } from "react";
import "../estilos.css";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calentamiento({ setSeccion, tipoSistema }) {

  /* =========================
     ESTADOS BASE
  ========================== */
  const [ciudad, setCiudad] = useState("");
  const [tempDeseada, setTempDeseada] = useState(30);
  const [cubierta, setCubierta] = useState(false);
  const [techada, setTechada] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [mesesCalentar, setMesesCalentar] = useState({});

  /* =========================
     DATA MOCK (CASCARÓN)
     luego conectas funciones reales
  ========================== */
  const ciudadesMexico = [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Querétaro",
    "Cancún",
    "Tijuana"
  ];

const descripcionesCampos = {
  ciudad: "Ubicación geográfica del proyecto para obtener datos climáticos",
  tempDeseada: "Temperatura objetivo del agua en operación",
  cubierta: "Indica si el cuerpo cuenta con cubierta térmica para reducir pérdidas",
  techada: "Indica si el cuerpo de agua se encuentra bajo techo",
  meses: "Meses del año en los que se requiere calentamiento",
  grafica: "Distribución porcentual de pérdidas energéticas del sistema"
};


  const clima = [
    { mes: "Enero", tMin: 10, tProm: 16, tMax: 22, humedad: 55, viento: 18 },
    { mes: "Febrero", tMin: 11, tProm: 17, tMax: 23, humedad: 52, viento: 20 },
    { mes: "Marzo", tMin: 13, tProm: 19, tMax: 26, humedad: 48, viento: 22 },
    { mes: "Abril", tMin: 15, tProm: 21, tMax: 29, humedad: 45, viento: 24 },
    { mes: "Mayo", tMin: 17, tProm: 24, tMax: 32, humedad: 50, viento: 22 }
  ];

  /* =========================
     DATA GRÁFICA (PLACEHOLDER)
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
        borderWidth: 1
      }
    ]
  }), []);

  /* =========================
     JSX
  ========================== */
  return (
    <div className="form-section hero-wrapper calentamiento">

      <div className="selector-tecnico modo-experto">

        {/* ================= HEADER ================= */}
        <div className="selector-header">
          <div className="selector-titulo">Calentamiento del sistema</div>
          <div className="selector-subtitulo-tecnico">
            Análisis térmico y condiciones climáticas
          </div>
        </div>

        <div className="selector-acciones">
          <button
            className="btn-secundario"
            onClick={() => setSeccion("dimensiones")}
          >
            ← Volver a {tipoSistema || "Dimensiones"}
          </button>

          <button
            className="btn-primario"
            onClick={() => setSeccion("equipamiento")}
          >
            Ir a Equipamiento →
          </button>
        </div>

        <div className="selector-contenido entrada">

          {/* ================= DATOS GENERALES ================= */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">Datos generales del proyecto</div>

            <div className="selector-grid">
              <div className="campo">
                <label>Ubicación del proyecto</label>
                <select
                  className="input-azul"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                >
                  <option value="">Selecciona ciudad</option>
                  {ciudadesMexico.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Temperatura deseada (°C)</label>
                <input
                  type="number"
                  className="input-azul"
                  value={tempDeseada}
                  onChange={e => setTempDeseada(e.target.value)}
                />
              </div>
            </div>

            <div className="selector-radios">
              <div className="grupo-radio">
                <span>¿Cuenta con cubierta térmica?</span>
                <label>
                  <input
                    type="radio"
                    checked={cubierta === true}
                    onChange={() => setCubierta(true)}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={cubierta === false}
                    onChange={() => setCubierta(false)}
                  />
                  No
                </label>
              </div>

              <div className="grupo-radio">
                <span>¿El cuerpo de agua está techado?</span>
                <label>
                  <input
                    type="radio"
                    checked={techada === true}
                    onChange={() => setTechada(true)}
                  />
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    checked={techada === false}
                    onChange={() => setTechada(false)}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          {/* ================= TABLA CLIMÁTICA ================= */}
          <div className="selector-grupo">
            <div className="selector-subtitulo">
              Análisis climático y pérdidas energéticas
            </div>

            <div className="layout-clima-grafica">

              {/* GRÁFICA */}
              <div className="grafica-mini">
                <Pie data={pieData} />
              </div>

              {/* TABLA */}
              <div className="tabla-clima-wrapper">
                <table className="tabla-resultados">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Temp Min</th>
                      <th>Temp Prom</th>
                      <th>Temp Max</th>
                      <th>Humedad %</th>
                      <th>Viento máx</th>
                      <th>Calentar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clima.map(m => (
                      <tr key={m.mes}>
                        <td>{m.mes}</td>
                        <td>{m.tMin} °C</td>
                        <td>{m.tProm} °C</td>
                        <td>{m.tMax} °C</td>
                        <td>{m.humedad} %</td>
                        <td>{m.viento} km/h</td>
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

            <div className="acciones-calentamiento">
              <button
                className="btn-secundario"
                onClick={() => setSeccion("equipamiento")}
              >
                Omitir en caso de no requerir calentamiento →
              </button>
            </div>

        </div>
      </div>
    </div>
  );
}
