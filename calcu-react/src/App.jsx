import "./estilos.css";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

export default function App() {
  const [seccion, setSeccion] = useState("inicio");

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
      <div className="panel-izquierdo">
        <h2 className="titulo-panel">Simulador</h2>

        {/* === TABS PRINCIPALES === */}
        <div
          className={`tab ${seccion === "dimensiones" ? "active" : ""}`}
          onClick={() => setSeccion("dimensiones")}
        >
          Dimensiones
        </div>

        <div
          className={`tab ${seccion === "calentamiento" ? "active" : ""}`}
          onClick={() => setSeccion("calentamiento")}
        >
          Calentamiento
        </div>

        <div
          className={`tab ${seccion === "equipamiento" ? "active" : ""}`}
          onClick={() => setSeccion("equipamiento")}
        >
          Equipamiento
        </div>

        <button className="btn-calcular">Calcular</button>

        {/* === TABLA DE RESULTADOS === */}
        <div className="seccion-resultados">
          <h3>Resultados</h3>
          <table className="tabla-resultados">
            <tbody>
              <tr><td>Área total</td><td>128.5 m²</td></tr>
              <tr><td>Profundidad promedio</td><td>1.35 m</td></tr>
              <tr><td>Volumen total</td><td>173 m³</td></tr>
              <tr><td>Flujo filtrado</td><td>45 m³/h</td></tr>
              <tr><td>Flujo calentamiento (panel)</td><td>32 m³/h</td></tr>
              <tr><td>Flujo calentamiento (bomba de calor)</td><td>28 m³/h</td></tr>
              <tr><td>Flujo calentamiento (caldera)</td><td>24 m³/h</td></tr>
              <tr><td>Flujo infinity</td><td>12 m³/h</td></tr>
              <tr><td>Flujo sanitizador</td><td>8 m³/h</td></tr>
              <tr><td>Flujo máximo</td><td>65 m³/h</td></tr>
              <tr><td>BTU’s pérdida</td><td>89,000</td></tr>
              <tr><td>Temp. promedio ambiente</td><td>26 °C</td></tr>
              <tr><td>Temp. deseada</td><td>30 °C</td></tr>
              <tr><td>Tubería succión</td><td>3”</td></tr>
              <tr><td>Tubería descarga</td><td>2.5”</td></tr>
              <tr><td>Cloro necesario</td><td>2.1 kg/día</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel-derecho">
        <div className="panel-derecho-contenido">{renderSeccion()}</div>
        <Footer />
      </div>
    </div>
  );
}
