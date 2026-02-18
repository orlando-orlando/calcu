import "./estilos.css";
import { useState, useRef, useMemo } from "react";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";

import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

// 🔹 IMPORT DEL VOLUMEN
import { volumen } from "./utils/volumen";

/* =====================================================
   FUNCIÓN UNIFICADA: ÁREA TOTAL (SUMA DE CUERPOS)
===================================================== */
function areaTotal(datosSistema) {
  if (!datosSistema || !Array.isArray(datosSistema.cuerpos)) return 0;

  const total = datosSistema.cuerpos.reduce((acc, cuerpo) => {
    const area = parseFloat(cuerpo.area);
    return acc + (isNaN(area) ? 0 : area);
  }, 0);

  return parseFloat(total.toFixed(1));
}

export default function App() {
  const [seccion, setSeccion] = useState("dimensiones");
  const [panelColapsado, setPanelColapsado] = useState(false);

  // 🔹 Datos globales por sistema
  const [datosPorSistema, setDatosPorSistema] = useState({});

  // 🔹 Sistema activo
  const [sistemaActivo, setSistemaActivo] = useState(null);

  // 🔹 Referencia a dimensiones
  const dimensionesRef = useRef(null);

  const handleHome = () => {
    setSeccion("dimensiones");
    setSistemaActivo(null);
    dimensionesRef.current?.resetDimensiones();
  };

  // 🔹 Datos del sistema activo
  const datosDim = datosPorSistema?.[sistemaActivo];

  // 🔹 Área total
  const areaCalculada = areaTotal(datosDim);

  // =====================================================
  // 🔹 VOLUMEN TOTAL DEL SISTEMA (INTEGRADO CORRECTAMENTE)
  // =====================================================
  const volumenTotal = useMemo(() => {
    if (!datosDim || !Array.isArray(datosDim.cuerpos)) return 0;

    const total = datosDim.cuerpos.reduce((acc, cuerpo) => {
      return acc + volumen(cuerpo, cuerpo.volumenCalculado ?? null);
    }, 0);

    return parseFloat(total.toFixed(1));
  }, [datosDim]);

  // 🔹 Configuración final de motobombas (SIN CAMBIOS)
  const configBombas = {
    filtrado: true,

    calentamiento:
      datosPorSistema?.calentamiento?.usarBombaCalentamiento === "si",

    infinity:
      datosDim?.usarBombaInfinity === "si" &&
      (datosDim?.desborde === "infinity" || datosDim?.desborde === "ambos")
  };

  return (
    <div className="app-contenedor">

      {/* =========================
          PANEL IZQUIERDO
      ========================== */}
      <div className={`panel-izquierdo ${panelColapsado ? "colapsado" : ""}`}>

        {/* HEADER */}
        <div className={`panel-header ${panelColapsado ? "solo-colapsar" : ""}`}>
          {!panelColapsado && (
            <button className="icon-btn" title="Inicio" onClick={handleHome}>
              <Home size={20} />
            </button>
          )}

          <button
            className="icon-btn"
            title={panelColapsado ? "Expandir panel" : "Contraer panel"}
            onClick={() => setPanelColapsado(!panelColapsado)}
          >
            {panelColapsado ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <div className="nav-vertical">
          <button
            className={`nav-item ${seccion === "dimensiones" ? "activo" : ""}`}
            onClick={handleHome}
          >
            <span className="nav-icon">📐</span>
            {!panelColapsado && <span className="nav-text">Dimensiones</span>}
          </button>

          <button
            className={`nav-item ${seccion === "calentamiento" ? "activo" : ""}`}
            onClick={() => setSeccion("calentamiento")}
          >
            <span className="nav-icon">🔥</span>
            {!panelColapsado && <span className="nav-text">Calentamiento</span>}
          </button>

          <button
            className={`nav-item ${seccion === "equipamiento" ? "activo" : ""}`}
            onClick={() => setSeccion("equipamiento")}
          >
            <span className="nav-icon">⚙️</span>
            {!panelColapsado && <span className="nav-text">Equipamiento</span>}
          </button>
        </div>

        {/* RESULTADOS */}
        <div className="toggle-seccion unida">
          <div className="toggle-boton activo">
            <h3>📊 Resultados generales</h3>
          </div>

          <div className="seccion-resultados">
            <table className="tabla-resultados">
              <tbody>
                <tr>
                  <th>Área total:</th>
                  <td>{areaCalculada > 0 ? `${areaCalculada} m²` : "—"}</td>
                </tr>

                <tr>
                  <th>Volumen total:</th>
                  <td>{volumenTotal > 0 ? `${volumenTotal} m³` : "—"}</td>
                </tr>

                {/* 🔹 TODO LO DEMÁS SIGUE IGUAL */}
                <tr><th>Profundidad promedio:</th><td>—</td></tr>
                <tr><th>Flujo filtrado:</th><td>—</td></tr>
                <tr><th>Flujo panel solar:</th><td>—</td></tr>
                <tr><th>Flujo bomba de calor:</th><td>—</td></tr>
                <tr><th>Flujo caldera de gas:</th><td>—</td></tr>
                <tr><th>Flujo infinity:</th><td>—</td></tr>
                <tr><th>Flujo sanitizador:</th><td>—</td></tr>
                <tr><th>Flujo máximo:</th><td>—</td></tr>
                <tr><th>Pérdida calor:</th><td>—</td></tr>
                <tr><th>Energía necesaria 1°C:</th><td>—</td></tr>
                <tr><th>Temp. deseada:</th><td>—</td></tr>
                <tr><th>Tubería succión:</th><td>—</td></tr>
                <tr><th>Tubería descarga:</th><td>—</td></tr>
                <tr><th>Cloro necesario:</th><td>—</td></tr>
                <tr><th>Ozono necesario:</th><td>—</td></tr>
                <tr><th>Carga total (ftHd):</th><td>—</td></tr>
                <tr><th>Carga total (psi):</th><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================
          PANEL DERECHO
      ========================== */}
      <div className="panel-derecho">
        <div className="panel-derecho-contenido">

          {seccion === "dimensiones" && (
            <Dimensiones
              ref={dimensionesRef}
              setSeccion={setSeccion}
              sistemaActivo={sistemaActivo}
              setSistemaActivo={setSistemaActivo}
              datosPorSistema={datosPorSistema}
              setDatosPorSistema={setDatosPorSistema}
            />
          )}

          {seccion === "calentamiento" && (
            <Calentamiento
              setSeccion={setSeccion}
              tipoSistema={sistemaActivo}
              datosPorSistema={datosPorSistema}
              setDatosPorSistema={setDatosPorSistema}
            />
          )}

          {seccion === "equipamiento" && (
            <Equipamiento
              setSeccion={setSeccion}
              sistemaActivo={sistemaActivo}
              datosPorSistema={datosPorSistema}
              configBombas={configBombas}
            />
          )}

        </div>
      </div>
    </div>
  );
}

