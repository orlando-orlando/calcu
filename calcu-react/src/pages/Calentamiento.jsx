import { useState, useMemo } from "react";
import "../estilos.css";

import { climaPorCiudad } from "../data/clima";
import { calcularPerdidas } from "../utils/perdidasTermicas";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Calentamiento({ setSeccion, tipoSistema }) {
  const [ciudad, setCiudad] = useState("");
  const [tempDeseada, setTempDeseada] = useState(30);
  const [cubierta, setCubierta] = useState(false);
  const [techada, setTechada] = useState(false);

  /* =========================
     DATOS CLIMÁTICOS
  ========================== */
  const clima = ciudad ? climaPorCiudad[ciudad] : [];

  /* =========================
     CÁLCULO DE PÉRDIDAS
     (valores ejemplo: los tuyos entran aquí)
  ========================== */
  const perdidas = useMemo(() => {
    if (!ciudad) return null;

    return calcularPerdidas({
      evaporacion: 42000,
      conveccion: 18000,
      radiacion: 12000,
      transmision: 9000,
      infinity: 15000,
      canal: 8000,
      tuberia: 5000
    });
  }, [ciudad, tempDeseada, cubierta, techada]);

  /* =========================
     DATA PARA PIE CHART
  ========================== */
  const pieData = perdidas && {
    labels: perdidas.desglose.map(p => p.label),
    datasets: [
      {
        data: perdidas.desglose.map(p => p.valor),
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="calentamiento-wrapper">

      {/* =========================
          HEADER / NAVEGACIÓN
      ========================== */}
      <div className="header-navegacion">
        <button
          className="btn-volver minimal"
          onClick={() => setSeccion("dimensiones")}
        >
          ← Volver a {tipoSistema || "dimensiones"}
        </button>

        <button
          className="btn-volver minimal"
          onClick={() => setSeccion("equipamiento")}
        >
          Ir a equipamiento →
        </button>
      </div>

      {/* =========================
          GRÁFICA DE PÉRDIDAS
      ========================== */}
      <div className="tarjeta-bdc">
        <h3>Pérdidas térmicas del sistema</h3>

        {perdidas ? (
          <div className="grafica-container">
            <Pie data={pieData} />
          </div>
        ) : (
          <div className="placeholder">
            Selecciona una ciudad para ver las pérdidas térmicas.
          </div>
        )}
      </div>

      {/* =========================
          CONTROLES
      ========================== */}
      <div className="tarjeta-bdc fila-controles">
        <select
          className="input-azul"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        >
          <option value="">Selecciona ciudad</option>
          {Object.keys(climaPorCiudad).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          className="input-azul"
          value={tempDeseada}
          onChange={(e) => setTempDeseada(e.target.value)}
          placeholder="Temperatura deseada °C"
        />

        <select
          className="input-azul"
          value={cubierta ? "si" : "no"}
          onChange={(e) => setCubierta(e.target.value === "si")}
        >
          <option value="no">Sin cubierta térmica</option>
          <option value="si">Con cubierta térmica</option>
        </select>

        <select
          className="input-azul"
          value={techada ? "si" : "no"}
          onChange={(e) => setTechada(e.target.value === "si")}
        >
          <option value="no">No techada</option>
          <option value="si">Techada</option>
        </select>
      </div>

      {/* =========================
          TABLA CLIMÁTICA
      ========================== */}
      {clima.length > 0 && (
        <div className="tarjeta-bdc">
          <h3>Condiciones climáticas mensuales</h3>

          <table className="tabla-resultados">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Temp Min</th>
                <th>Temp Prom</th>
                <th>Temp Max</th>
                <th>Viento Max</th>
                <th>Humedad %</th>
              </tr>
            </thead>
            <tbody>
              {clima.map((m) => (
                <tr key={m.mes}>
                  <td>{m.mes}</td>
                  <td>{m.tMin} °C</td>
                  <td>{m.tProm} °C</td>
                  <td>{m.tMax} °C</td>
                  <td>{m.viento} km/h</td>
                  <td>{m.humedad} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
