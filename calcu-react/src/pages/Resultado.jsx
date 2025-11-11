import "../estilos.css";
import { useState } from "react";

export default function Resultado() {
  // Estado inicial simulado — luego aquí llegarán los datos calculados
  const [resultados, setResultados] = useState({
    areaTotal: 0,
    profundidadPromedio: 0,
    volumenTotal: 0,
    flujoFiltrado: 0,
    flujoCalentamientoPanel: 0,
    flujoCalentamientoBomba: 0,
    flujoCalentamientoCaldera: 0,
    flujoInfinity: 0,
    flujoSanitizador: 0,
    flujoMaximo: 0,
    btuPerdida: 0,
    tempPromedioAmbiente: 0,
    tempDeseada: 0,
    tuberiaSuccion: "",
    tuberiaDescarga: "",
    cloroDia: 0,
  });

  return (
    <div className="form-section animacion-aparecer" style={{ fontFamily: "inherit" }}>
      <h2 className="titulo-seccion">Resumen de resultados</h2>

      {/* === BLOQUE GENERAL === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Datos generales</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>Área total (m²):</label>
            <input type="number" className="input-azul" value={resultados.areaTotal} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Profundidad promedio (m):</label>
            <input type="number" className="input-azul" value={resultados.profundidadPromedio} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Volumen total (m³):</label>
            <input type="number" className="input-azul" value={resultados.volumenTotal} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Flujo filtrado (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoFiltrado} readOnly />
          </div>
        </div>
      </div>

      {/* === BLOQUE DE CALENTAMIENTO === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Flujos de calentamiento</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>Panel solar (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoCalentamientoPanel} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Bomba de calor (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoCalentamientoBomba} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Caldera (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoCalentamientoCaldera} readOnly />
          </div>
        </div>
      </div>

      {/* === BLOQUE DE FLUJOS ADICIONALES === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Otros flujos</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>Infinity (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoInfinity} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Sanitizador (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoSanitizador} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Flujo máximo (lpm):</label>
            <input type="number" className="input-azul" value={resultados.flujoMaximo} readOnly />
          </div>
        </div>
      </div>

      {/* === BLOQUE DE CONDICIONES TÉRMICAS === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Condiciones térmicas</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>BTU's de pérdida:</label>
            <input type="number" className="input-azul" value={resultados.btuPerdida} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Temp. ambiente (°C):</label>
            <input type="number" className="input-azul" value={resultados.tempPromedioAmbiente} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Temp. deseada (°C):</label>
            <input type="number" className="input-azul" value={resultados.tempDeseada} readOnly />
          </div>
        </div>
      </div>

      {/* === BLOQUE DE TUBERÍA === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Selección de tubería</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>Tubería succión:</label>
            <input type="text" className="input-azul" value={resultados.tuberiaSuccion} readOnly />
          </div>

          <div className="campo-resultado">
            <label>Tubería descarga:</label>
            <input type="text" className="input-azul" value={resultados.tuberiaDescarga} readOnly />
          </div>
        </div>
      </div>

      {/* === BLOQUE DE CLORO === */}
      <div className="tarjeta-tipo-sistema">
        <div className="titulo-subseccion">Cloración</div>

        <div className="grid-resultados">
          <div className="campo-resultado">
            <label>Kg de cloro/día necesarios:</label>
            <input type="number" className="input-azul" value={resultados.cloroDia} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
