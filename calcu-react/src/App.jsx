import React, { useState } from "react";
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
          <p>Selecciona un apartado en el menú de la izquierda para empezar.</p>
        );
    }
  };

  return (
    <div className="contenedor">
      {/* Panel izquierdo */}
      <div className="panel-izquierdo">
        <h1>Calcula tu sistema</h1>
        <br /><br />

        <details open>
          <summary onClick={() => setSeccion("dimensiones")}>
            Dimensiones del cuerpo de agua
          </summary>
        </details>

        <details>
          <summary onClick={() => setSeccion("calentamiento")}>
            Perfil de calentamiento
          </summary>
        </details>

        <details>
          <summary onClick={() => setSeccion("equipamiento")}>
            Selecciona tus equipos
          </summary>
        </details>

        <button onClick={() => setSeccion("resultado")}>Calcular</button>
        <br /><br /><br />

        <details>
          <summary onClick={() => setSeccion("resultado")}>
            Resumen de resultados
          </summary>
        </details>
      </div>

      {/* Panel derecho */}
      <div className="panel-derecho" id="contenidoDerecho">
        {renderSeccion()}
      </div>
    </div>
  );
}
