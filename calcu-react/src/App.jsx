import "./estilos.css";
import { useState, useRef, useMemo, useEffect } from "react";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";

import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

// 🔹 IMPORT DEL VOLUMEN
import { volumen } from "./utils/volumen";
import { flujoFinal } from "./utils/flujoFinal";
import { flujoInfinity } from "./utils/flujoInfinity";

import {
  formatBTU,
  formatM2,
  formatM3,
  formatMetro,
  formatGPM
} from "./utils/format";

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

  const [temaOscuro, setTemaOscuro] = useState(true);

  useEffect(() => {
    document.body.className = temaOscuro ? "tema-oscuro" : "tema-claro";
  }, [temaOscuro]);

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

// =====================================================
// 🔹 OBJETO VIRTUAL DEL SISTEMA (para flujoVolumen)
// =====================================================
const datosSistemaFlujo = useMemo(() => ({
  tasaRotacion:
    parseFloat(datosDim?.tasaRotacion) ||
    parseFloat(datosPorSistema?.tasaRotacion) ||
    6
}), [datosDim, datosPorSistema]);

// =====================================================
// 🔹 FLUJO DE FILTRACIÓN (DESDE VOLUMEN TOTAL)
// =====================================================
const datosFlujo = useMemo(() => {
  if (!datosDim?.cuerpos) return null;

  return {
    tasaGeneral: datosDim.tasaGeneral,
    tasaJacuzzi: datosDim.tasaJacuzzi,
    cuerpos: datosDim.cuerpos.map(c => ({
      tipo: c.tipoCuerpo,
      volumen: volumen(c)
    }))
  };
}, [datosDim]);

const flujoFiltrado = useMemo(() => {
  if (!datosFlujo) return 0;
  return flujoFinal(datosFlujo);
}, [datosFlujo]);

// =====================================================
// 🔹 FLUJO INFINITY (SI EXISTE BORDE INFINITO)
// =====================================================
const flujoInfinitySistema = useMemo(() => {
  if (
    !datosDim ||
    !(datosDim.desborde === "infinity" || datosDim.desborde === "ambos")
  ) {
    return 0;
  }

  return flujoInfinity(datosDim);
}, [datosDim]);

// =====================================================
// 🔹 PROFUNDIDAD PROMEDIO GLOBAL DEL SISTEMA
//     (volumen total / área total)
// =====================================================
const profundidadPromedio = useMemo(() => {
  if (areaCalculada > 0 && volumenTotal > 0) {
    return parseFloat((volumenTotal / areaCalculada).toFixed(2));
  }
  return 0;
}, [areaCalculada, volumenTotal]);

// =====================================================
// 🔹 SISTEMA LISTO PARA CÁLCULOS TÉRMICOS
// =====================================================
const sistemaListoCalor =
  areaCalculada > 0 &&
  volumenTotal > 0 &&
  profundidadPromedio > 0;

  // 🔹 Configuración final de motobombas (SIN CAMBIOS)
  const configBombas = {
    filtrado: true,

    calentamiento:
      datosPorSistema?.calentamiento?.usarBombaCalentamiento === "si",

    infinity:
      datosDim?.usarBombaInfinity === "si" &&
      (datosDim?.desborde === "infinity" || datosDim?.desborde === "ambos")
  };

  // =====================================================
  // 🔹 MOTOBOMBA INFINITY INDEPENDIENTE (SI / NO)
  // =====================================================
  const textoBombaInfinity = useMemo(() => {
    if (
      !datosDim ||
      !(datosDim.desborde === "infinity" || datosDim.desborde === "ambos")
    ) {
      return "—";
    }

    if (datosDim.usarBombaInfinity === "si") return "Sí";
    if (datosDim.usarBombaInfinity === "no") return "No";

    return "—";
  }, [datosDim]);

  // =====================================================
  // 🔹 FLUJO INFINITY EFECTIVO (SEGÚN BOMBA)
  // =====================================================
  const flujoInfinityEfectivo = useMemo(() => {
    if (datosDim?.usarBombaInfinity !== "si") return 0;
    return flujoInfinitySistema;
  }, [datosDim, flujoInfinitySistema]);

  const perdidaTotalBTU =
    datosPorSistema?.calentamiento?.perdidaTotalBTU ?? 0;

  const perdidaEvaporacion =
    datosPorSistema?.calentamiento?.perdidasBTU?.evaporacion ?? 0;

  const perdidaConveccion =
    datosPorSistema?.calentamiento?.perdidasBTU?.conveccion ?? 0;

  const perdidaRadiacion =
    datosPorSistema?.calentamiento?.perdidasBTU?.radiacion ?? 0;

  const perdidaTransmision =
    datosPorSistema?.calentamiento?.perdidasBTU?.transmision ?? 0;

  const perdidaInfinity =
    datosPorSistema?.calentamiento?.perdidasBTU?.infinity ?? 0;

  const perdidaCanal =
    datosPorSistema?.calentamiento?.perdidasBTU?.canal ?? 0;

  return (
      <div className={`app-contenedor ${temaOscuro ? "tema-oscuro" : "tema-claro"}`}>

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

          {!panelColapsado && (
            <button
              className={`boton-tema ${temaOscuro ? "tema-claro-btn" : "tema-oscuro-btn"}`}
              onClick={() => setTemaOscuro(!temaOscuro)}
            >
              {temaOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro"}
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
                  <td>{formatM2(areaCalculada)}</td>
                </tr>

                <tr>
                  <th>Volumen total:</th>
                  <td>{formatM3(volumenTotal)}</td>
                </tr>

                <tr>
                  <th>Profundidad promedio:</th>
                  <td>{formatMetro(profundidadPromedio)}</td>
                </tr>

                <tr>
                  <th>Flujo filtrado:</th>
                  <td>{formatGPM(flujoFiltrado)}</td>
                </tr>
                
                <tr>
                  <th>Flujo infinity:</th>
                  <td>{formatGPM(flujoInfinitySistema)}</td>
                </tr>

                <tr>
                  <th>Motobomba para infinity:</th>
                  <td>{textoBombaInfinity}</td>
                </tr>

                <tr>
                  <th>Pérdida por evaporación:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaEvaporacion)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida por convección:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaConveccion)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida por radiación:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaRadiacion)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida por transmisión:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaTransmision)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida por infinity:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaInfinity)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida por canal perimetral:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaCanal)
                      : "—"}
                  </td>
                </tr>

                <tr>
                  <th>Pérdida total de calor:</th>
                  <td>
                    {sistemaListoCalor
                      ? formatBTU(perdidaTotalBTU)
                      : "—"}
                  </td>
                </tr>


                <tr><th>Flujo panel solar:</th><td>—</td></tr>
                <tr><th>Flujo bomba de calor:</th><td>—</td></tr>
                <tr><th>Flujo caldera de gas:</th><td>—</td></tr>
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

              areaTotal={areaCalculada}
              volumenTotal={volumenTotal}
              profundidadPromedio={profundidadPromedio}
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

