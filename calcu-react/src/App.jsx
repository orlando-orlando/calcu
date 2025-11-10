import "./estilos.css";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";
import Resultado from "./pages/Resultado.jsx";

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
      case "resultado":
        return <Resultado />;
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

        <div
          className={`tab ${seccion === "resultado" ? "active" : ""}`}
          onClick={() => setSeccion("resultado")}
        >
          Resultados
        </div>

        <button className="btn-calcular" onClick={() => setSeccion("resultado")}>
          Calcular
        </button>
      </div>

      <div className="panel-derecho">
        <div className="panel-derecho-contenido">{renderSeccion()}</div>
        <Footer />
      </div>
    </div>  
  );
}
