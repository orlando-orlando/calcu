import "./estilos.css";
import { useState } from "react";
import Footer from "./components/Footer.jsx";
import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

export default function App() {
  const [seccion, setSeccion] = useState("dimensiones");
  const [mostrarResultados, setMostrarResultados] = useState(true);

  return (
    <div className="app-contenedor">

      {/* PANEL IZQUIERDO */}
      <div className="panel-izquierdo">

        {/* ❌ Título del menú (no es resultados generales) */}
        {/*
        <h2 className="titulo-panel">Menú de selección</h2>
        */}

        {/* ❌ NAVEGACIÓN PRINCIPAL (no es resultados generales) */}
        {/*
        <div className="toggle-navegacion-fija">
          {["dimensiones", "calentamiento", "equipamiento"].map((s) => (
            <button
              key={s}
              className={seccion === s ? "activo" : ""}
              onClick={() => setSeccion(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        */}

        {/* ✅ RESULTADOS GENERALES (ÚNICO CONTENIDO ACTIVO) */}
        <div className="toggle-seccion unida">
          <div className="toggle-boton activo">
            <h3>📊 Resultados generales</h3>
          </div>

          <div className="seccion-resultados">
            <table className="tabla-resultados">
              <tbody>
                <tr><th>Área total:</th><td>128.5 m²</td></tr>
                <tr><th>Profundidad promedio:</th><td>1.35 m</td></tr>
                <tr><th>Volumen total:</th><td>173 m³</td></tr>
                <tr><th>Flujo filtrado:</th><td>45 m³/h</td></tr>
                <tr><th>Flujo panel solar:</th><td>32 m³/h</td></tr>
                <tr><th>Flujo bomba de calor:</th><td>28 m³/h</td></tr>
                <tr><th>Flujo caldera de gas:</th><td>24 m³/h</td></tr>
                <tr><th>Flujo infinity:</th><td>12 m³/h</td></tr>
                <tr><th>Flujo sanitizador:</th><td>8 m³/h</td></tr>
                <tr><th>Flujo máximo:</th><td>65 m³/h</td></tr>
                <tr><th>Pérdida calor:</th><td>89,000</td></tr>
                <tr><th>Energía necesaria 1°C:</th><td>89,000</td></tr>
                <tr><th>Temp. deseada:</th><td>30 °C</td></tr>
                <tr><th>Tubería succión:</th><td>3”</td></tr>
                <tr><th>Tubería descarga:</th><td>2.5”</td></tr>
                <tr><th>Cloro necesario:</th><td>2.1 kg/día</td></tr>
                <tr><th>Ozono necesario:</th><td>2.1 kg/día</td></tr>
                <tr><th>Carga retorno:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga dren de fondo:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga dren canal:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga desnatador:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga barredora:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga filtro:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga prefiltro:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga panel solar:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga bomba de calor:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga caldera:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga ozonificador:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga clorador:</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga total (ftHd):</th><td>0.0 ftHd</td></tr>
                <tr><th>Carga total (psi)):</th><td>0.0 psi</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* PANEL DERECHO (NO TOCADO) */}
      <div className="panel-derecho">
        <div className="panel-derecha-contenido">
          {seccion === "dimensiones" && <Dimensiones setSeccion={setSeccion} />}
          {seccion === "calentamiento" && <Calentamiento setSeccion={setSeccion} />}
          {seccion === "equipamiento" && <Equipamiento setSeccion={setSeccion} />}
        </div>
      </div>

    </div>
  );
}
