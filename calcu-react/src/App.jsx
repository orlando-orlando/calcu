import "./estilos.css";
import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

export default function App() {
  const [seccion, setSeccion] = useState("inicio");
  const [mostrarResultados, setMostrarResultados] = useState(true);

  const renderSeccion = () => {
    switch (seccion) {
      case "dimensiones":
        return <Dimensiones />;
      case "calentamiento":
        return <Calentamiento />;
      case "equipamiento":
        return <Equipamiento />;
      default:
        return (
          <div className="panel-derecho mensaje-inicial">
            <p>Selecciona una pestaña de la izquierda para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-contenedor">
      {/* PANEL IZQUIERDO */}
      <div className="panel-izquierdo">
        <h2 className="titulo-panel">Simulador</h2>

        {/* === TOGGLES FIJOS ARRIBA === */}
        <div className="toggle-navegacion-fija">
          <button
            className={`toggle-boton-principal ${
              seccion === "dimensiones" ? "activo" : ""
            }`}
            onClick={() => setSeccion("dimensiones")}
          >
            📏 Dimensiones
          </button>

          <button
            className={`toggle-boton-principal ${
              seccion === "calentamiento" ? "activo" : ""
            }`}
            onClick={() => setSeccion("calentamiento")}
          >
            🔥 Calentamiento
          </button>

          <button
            className={`toggle-boton-principal ${
              seccion === "equipamiento" ? "activo" : ""
            }`}
            onClick={() => setSeccion("equipamiento")}
          >
            ⚙️ Equipamiento
          </button>
        </div>

        {/* BOTÓN PRINCIPAL */}
        <button
          className="btn-calcular"
          onClick={() => setMostrarResultados(!mostrarResultados)}
        >
          {mostrarResultados ? "Ocultar resultados" : "Mostrar resultados"}
        </button>

        {/* === SECCIÓN RESULTADOS === */}
        {mostrarResultados && (
          <div className="toggle-seccion unida">
            <button className="toggle-boton activo">
              <span>📊 Resultados generales</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="seccion-resultados">
              <table className="tabla-resultados">
                <tbody>
                  <tr><th>Área total</th><td>128.5 m²</td></tr>
                  <tr><th>Profundidad promedio</th><td>1.35 m</td></tr>
                  <tr><th>Volumen total</th><td>173 m³</td></tr>
                  <tr><th>Flujo filtrado</th><td>45 m³/h</td></tr>
                  <tr><th>Flujo calentamiento (panel)</th><td>32 m³/h</td></tr>
                  <tr><th>Flujo calentamiento (bomba de calor)</th><td>28 m³/h</td></tr>
                  <tr><th>Flujo calentamiento (caldera)</th><td>24 m³/h</td></tr>
                  <tr><th>Flujo infinity</th><td>12 m³/h</td></tr>
                  <tr><th>Flujo sanitizador</th><td>8 m³/h</td></tr>
                  <tr><th>Flujo máximo</th><td>65 m³/h</td></tr>
                  <tr><th>BTU’s pérdida</th><td>89,000</td></tr>
                  <tr><th>Temp. ambiente</th><td>26 °C</td></tr>
                  <tr><th>Temp. deseada</th><td>30 °C</td></tr>
                  <tr><th>Tubería succión</th><td>3”</td></tr>
                  <tr><th>Tubería descarga</th><td>2.5”</td></tr>
                  <tr><th>Cloro necesario</th><td>2.1 kg/día</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PANEL DERECHO */}
      <div className="panel-derecho">
        <div className="panel-derecho-contenido">{renderSeccion()}</div>
        <Footer />
      </div>
    </div>
  );
}
