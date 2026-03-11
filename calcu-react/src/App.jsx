import "./estilos.css";
import { useState, useRef, useMemo, useEffect } from "react";
import { Home, ChevronLeft, ChevronRight, Settings, CreditCard, Palette, HelpCircle, LogOut, Plus, Sun, Moon } from "lucide-react";

import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";

import { volumen } from "./utils/volumen";
import { flujoFinal } from "./utils/flujoFinal";
import { flujoInfinity } from "./utils/flujoInfinity";

import { formatBTU, formatM2, formatM3, formatMetro, formatGPM } from "./utils/format";

/* =====================================================
   ÁREA TOTAL
===================================================== */
function areaTotal(datosSistema) {
  if (!datosSistema || !Array.isArray(datosSistema.cuerpos)) return 0;
  const total = datosSistema.cuerpos.reduce((acc, cuerpo) => {
    const area = parseFloat(cuerpo.area);
    return acc + (isNaN(area) ? 0 : area);
  }, 0);
  return parseFloat(total.toFixed(1));
}

/* =====================================================
   MENÚ USUARIO
===================================================== */
function MenuUsuario({ abierto, onCerrar, panelColapsado, temaOscuro, setTemaOscuro }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onCerrar();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      ref={menuRef}
      className={`menu-usuario-popup ${panelColapsado ? "menu-usuario-colapsado" : ""}`}
    >
      {/* Cuenta */}
      <div className="menu-usuario-cuenta">
        <div className="menu-usuario-avatar">OS</div>
        <div className="menu-usuario-info">
          <span className="menu-usuario-nombre">Orlando Salcedo</span>
          <span className="menu-usuario-plan">Gratis</span>
        </div>
      </div>

      <div className="menu-usuario-divider" />

      <button className="menu-usuario-item">
        <Plus size={15} /><span>Añadir una cuenta</span>
      </button>

      <div className="menu-usuario-divider" />

      <button className="menu-usuario-item">
        <CreditCard size={15} /><span>Cambiar plan</span>
      </button>
      <button className="menu-usuario-item">
        <Palette size={15} /><span>Personalización</span>
      </button>
      <button className="menu-usuario-item">
        <Settings size={15} /><span>Configuración</span>
      </button>

      {/* Tema dentro del menú */}
      <button
        className="menu-usuario-item menu-usuario-item-tema"
        onClick={() => { setTemaOscuro(!temaOscuro); onCerrar(); }}
      >
        {temaOscuro ? <Sun size={15} /> : <Moon size={15} />}
        <span>{temaOscuro ? "Modo claro" : "Modo oscuro"}</span>
        <span className="menu-usuario-tema-badge">{temaOscuro ? "☀️" : "🌙"}</span>
      </button>

      <div className="menu-usuario-divider" />

      <button className="menu-usuario-item menu-usuario-item-arrow">
        <HelpCircle size={15} /><span>Ayuda</span>
        <ChevronRight size={13} className="menu-usuario-arrow" />
      </button>
      <button className="menu-usuario-item menu-usuario-item-danger">
        <LogOut size={15} /><span>Cerrar sesión</span>
      </button>

      <div className="menu-usuario-divider" />

      <div className="menu-usuario-footer">
        <span>Política de privacidad</span><span>·</span><span>Condiciones del servicio</span>
      </div>

      <div className="menu-usuario-upgrade">
        <div className="menu-usuario-avatar menu-usuario-avatar-sm">OS</div>
        <div className="menu-usuario-upgrade-info">
          <span>Orlando Salc...</span>
          <span className="menu-usuario-plan">Gratis</span>
        </div>
        <button className="menu-usuario-btn-upgrade">Mejorar plan</button>
      </div>
    </div>
  );
}

/* =====================================================
   LOGO — expandido
===================================================== */
function LogoCompleto() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg width="28" height="32" viewBox="0 0 90 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg-s" x1="0" y1="0" x2="90" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2d88e0" /><stop offset="100%" stopColor="#00ccff" />
          </linearGradient>
          <linearGradient id="lg-f" x1="10" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0" />
            <stop offset="25%" stopColor="#00ccff" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#2d88e0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2d88e0" stopOpacity="0" />
          </linearGradient>
          <clipPath id="lg-clip"><path d="M45 4C45 4 9 46 9 68A36 36 0 0 0 81 68C81 46 45 4 45 4Z" /></clipPath>
          <filter id="lg-glow"><feGaussianBlur stdDeviation="1.8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M45 4C45 4 9 46 9 68A36 36 0 0 0 81 68C81 46 45 4 45 4Z" fill="none" stroke="url(#lg-s)" strokeWidth="2.4" />
        <g clipPath="url(#lg-clip)">
          <line x1="9" y1="68" x2="81" y2="68" stroke="#2d88e0" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.35" />
          <line x1="45" y1="8" x2="45" y2="102" stroke="#2d88e0" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.25" />
          <line x1="25" y1="65" x2="25" y2="71" stroke="#2d88e0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="35" y1="65" x2="35" y2="71" stroke="#2d88e0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="55" y1="65" x2="55" y2="71" stroke="#2d88e0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <line x1="65" y1="65" x2="65" y2="71" stroke="#2d88e0" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M13 80 Q27 61 45 72 Q63 83 77 63" stroke="url(#lg-f)" strokeWidth="2.4" strokeLinecap="round" fill="none" filter="url(#lg-glow)" />
          <polygon points="77,63 71,61 73,68" fill="#00ccff" opacity="0.9" />
          <circle cx="45" cy="72" r="3.4" fill="#00ccff" filter="url(#lg-glow)" />
          <circle cx="45" cy="72" r="7" fill="#00ccff" fillOpacity="0.2" />
          <line x1="41.5" y1="68" x2="48.5" y2="68" stroke="#00aaff" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
          <line x1="45" y1="64.5" x2="45" y2="71.5" stroke="#00aaff" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
      <div style={{ lineHeight: 1 }}>
        <span style={{ fontFamily: "'Rajdhani','Barlow',sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: ".02em", color: "#c8e0f8" }}>
          Pool<span style={{ color: "#29aaef" }}>Metric</span>
        </span>
        <span style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: ".48rem", letterSpacing: ".18em", color: "#7fb9e8", marginTop: "1px" }}>
          HYDRAULIC DESIGN
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   LOGO — colapsado
===================================================== */
function LogoIcono() {
  return (
    <svg width="26" height="30" viewBox="0 0 90 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pl-s" x1="0" y1="0" x2="90" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2d88e0" /><stop offset="100%" stopColor="#00ccff" />
        </linearGradient>
        <clipPath id="pl-clip"><path d="M45 4C45 4 9 46 9 68A36 36 0 0 0 81 68C81 46 45 4 45 4Z" /></clipPath>
        <filter id="pl-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M45 4C45 4 9 46 9 68A36 36 0 0 0 81 68C81 46 45 4 45 4Z" fill="none" stroke="url(#pl-s)" strokeWidth="5" />
      <g clipPath="url(#pl-clip)">
        <line x1="14" y1="64" x2="76" y2="64" stroke="#2d88e0" strokeWidth="7" strokeLinecap="round" />
        <polygon points="36,64 28,57 28,71" fill="#00ccff" />
        <polygon points="60,64 52,57 52,71" fill="#00ccff" />
        <line x1="45" y1="64" x2="45" y2="46" stroke="#00aaff" strokeWidth="2.5" strokeDasharray="3 2.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="45" cy="40" r="8" fill="#0a1628" stroke="#2d88e0" strokeWidth="2.5" />
        <line x1="40" y1="37.5" x2="50" y2="37.5" stroke="#00ccff" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="37.5" x2="45" y2="44" stroke="#00ccff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="45" cy="64" r="6" fill="#00ccff" filter="url(#pl-glow)" />
        <circle cx="45" cy="64" r="10" fill="#00ccff" fillOpacity="0.18" />
      </g>
    </svg>
  );
}

/* =====================================================
   APP
===================================================== */
export default function App() {
  const [seccion, setSeccion] = useState("dimensiones");
  const [panelColapsado, setPanelColapsado] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [temaOscuro, setTemaOscuro] = useState(true);

  const [datosPorSistema, setDatosPorSistema] = useState({});
  const [sistemaActivo, setSistemaActivo] = useState(null);
  const dimensionesRef = useRef(null);

  const handleHome = () => {
    setSeccion("dimensiones");
    setSistemaActivo(null);
    dimensionesRef.current?.resetDimensiones();
  };

  useEffect(() => {
    document.body.className = temaOscuro ? "tema-oscuro" : "tema-claro";
  }, [temaOscuro]);

  useEffect(() => {
    const titulos = {
      dimensiones: "PoolMetric · Dimensiones",
      calentamiento: "PoolMetric · Calentamiento",
      equipamiento: "PoolMetric · Equipamiento",
    };
    document.title = titulos[seccion] ?? "PoolMetric";
  }, [seccion]);

  const datosDim = datosPorSistema?.[sistemaActivo];
  const areaCalculada = areaTotal(datosDim);

  const volumenTotal = useMemo(() => {
    if (!datosDim || !Array.isArray(datosDim.cuerpos)) return 0;
    return parseFloat(datosDim.cuerpos.reduce((acc, c) => acc + volumen(c, c.volumenCalculado ?? null), 0).toFixed(1));
  }, [datosDim]);

  const datosFlujo = useMemo(() => {
    if (!datosDim?.cuerpos) return null;
    return {
      tasaGeneral: datosDim.tasaGeneral,
      tasaJacuzzi: datosDim.tasaJacuzzi,
      cuerpos: datosDim.cuerpos.map(c => ({ tipo: c.tipoCuerpo, volumen: volumen(c) }))
    };
  }, [datosDim]);

  const flujoFiltrado = useMemo(() => datosFlujo ? flujoFinal(datosFlujo) : 0, [datosFlujo]);

  const flujoInfinitySistema = useMemo(() => {
    if (!datosDim || !(datosDim.desborde === "infinity" || datosDim.desborde === "ambos")) return 0;
    return flujoInfinity(datosDim);
  }, [datosDim]);

  const profundidadPromedio = useMemo(() => {
    if (areaCalculada > 0 && volumenTotal > 0) return parseFloat((volumenTotal / areaCalculada).toFixed(2));
    return 0;
  }, [areaCalculada, volumenTotal]);

  const sistemaListoCalor = areaCalculada > 0 && volumenTotal > 0 && profundidadPromedio > 0;

  const configBombas = {
    filtrado: true,
    calentamiento: datosPorSistema?.calentamiento?.usarBombaCalentamiento === "si",
    infinity: datosDim?.usarBombaInfinity === "si" && (datosDim?.desborde === "infinity" || datosDim?.desborde === "ambos")
  };

  const textoBombaInfinity = useMemo(() => {
    if (!datosDim || !(datosDim.desborde === "infinity" || datosDim.desborde === "ambos")) return "—";
    if (datosDim.usarBombaInfinity === "si") return "Sí";
    if (datosDim.usarBombaInfinity === "no") return "No";
    return "—";
  }, [datosDim]);

  const perdidaTotalBTU    = datosPorSistema?.calentamiento?.perdidaTotalBTU          ?? 0;
  const perdidaEvaporacion = datosPorSistema?.calentamiento?.perdidasBTU?.evaporacion ?? 0;
  const perdidaConveccion  = datosPorSistema?.calentamiento?.perdidasBTU?.conveccion  ?? 0;
  const perdidaRadiacion   = datosPorSistema?.calentamiento?.perdidasBTU?.radiacion   ?? 0;
  const perdidaTransmision = datosPorSistema?.calentamiento?.perdidasBTU?.transmision ?? 0;
  const perdidaInfinity    = datosPorSistema?.calentamiento?.perdidasBTU?.infinity    ?? 0;
  const perdidaCanal       = datosPorSistema?.calentamiento?.perdidasBTU?.canal       ?? 0;
  const perdidaTuberia     = datosPorSistema?.calentamiento?.perdidasBTU?.tuberia     ?? 0;

  return (
    <div className={`app-contenedor ${temaOscuro ? "tema-oscuro" : "tema-claro"}`}>

      {/* PANEL IZQUIERDO */}
      <div className={`panel-izquierdo ${panelColapsado ? "colapsado" : ""}`}>

        {/* HEADER */}
        <div className={`panel-header ${panelColapsado ? "solo-colapsar" : ""}`}>
          {!panelColapsado && (
            <button className="icon-btn" title="Inicio" onClick={handleHome}>
              <Home size={18} />
            </button>
          )}
          <button
            className="icon-btn"
            title={panelColapsado ? "Expandir panel" : "Contraer panel"}
            onClick={() => setPanelColapsado(!panelColapsado)}
          >
            {panelColapsado ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* NAV */}
        <div className="nav-vertical">
          <button className={`nav-item ${seccion === "dimensiones" ? "activo" : ""}`} onClick={handleHome}>
            <span className="nav-icon">📐</span>
            {!panelColapsado && <span className="nav-text">Dimensiones</span>}
          </button>
          <button className={`nav-item ${seccion === "calentamiento" ? "activo" : ""}`} onClick={() => setSeccion("calentamiento")}>
            <span className="nav-icon">🔥</span>
            {!panelColapsado && <span className="nav-text">Calentamiento</span>}
          </button>
          <button className={`nav-item ${seccion === "equipamiento" ? "activo" : ""}`} onClick={() => setSeccion("equipamiento")}>
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
                <tr><th>Área total:</th><td>{formatM2(areaCalculada)}</td></tr>
                <tr><th>Volumen total:</th><td>{formatM3(volumenTotal)}</td></tr>
                <tr><th>Profundidad promedio:</th><td>{formatMetro(profundidadPromedio)}</td></tr>
                <tr><th>Flujo filtrado:</th><td>{formatGPM(flujoFiltrado)}</td></tr>
                <tr><th>Flujo infinity:</th><td>{formatGPM(flujoInfinitySistema)}</td></tr>
                <tr><th>Motobomba para infinity:</th><td>{textoBombaInfinity}</td></tr>
                <tr><th>Pérdida por evaporación:</th><td>{sistemaListoCalor ? formatBTU(perdidaEvaporacion) : "—"}</td></tr>
                <tr><th>Pérdida por convección:</th><td>{sistemaListoCalor ? formatBTU(perdidaConveccion) : "—"}</td></tr>
                <tr><th>Pérdida por radiación:</th><td>{sistemaListoCalor ? formatBTU(perdidaRadiacion) : "—"}</td></tr>
                <tr><th>Pérdida por transmisión:</th><td>{sistemaListoCalor ? formatBTU(perdidaTransmision) : "—"}</td></tr>
                <tr><th>Pérdida por tubería:</th><td>{sistemaListoCalor ? formatBTU(perdidaTuberia) : "—"}</td></tr>
                <tr><th>Pérdida por infinity:</th><td>{sistemaListoCalor ? formatBTU(perdidaInfinity) : "—"}</td></tr>
                <tr><th>Pérdida por canal perimetral:</th><td>{sistemaListoCalor ? formatBTU(perdidaCanal) : "—"}</td></tr>
                <tr><th>Pérdida total de calor:</th><td>{sistemaListoCalor ? formatBTU(perdidaTotalBTU) : "—"}</td></tr>
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

        {/* PANEL BOTTOM — Logo + engrane */}
        <div className="panel-bottom">
          <div className="panel-bottom-logo-row">
            {panelColapsado ? <LogoIcono /> : <LogoCompleto />}

            <div className="panel-bottom-sep" />

            {/* Botón engrane con menú */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                className={`panel-bottom-icon-btn ${menuUsuarioAbierto ? "panel-bottom-icon-btn-activo" : ""}`}
                title="Configuración"
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
              >
                <Settings size={15} />
              </button>
              <MenuUsuario
                abierto={menuUsuarioAbierto}
                onCerrar={() => setMenuUsuarioAbierto(false)}
                panelColapsado={panelColapsado}
                temaOscuro={temaOscuro}
                setTemaOscuro={setTemaOscuro}
              />
            </div>
          </div>
        </div>

      </div>

      {/* PANEL DERECHO */}
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