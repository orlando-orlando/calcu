import { useState } from "react";
import "../estilos.css";
import EquipoSelect from "../components/EquipoSelect";

export default function Equipamiento({ setSeccion, sistemaActivo }) {

  /* ================= ESTADOS ================= */
  const [hoveredField, setHoveredField] = useState(null);
  const [sistemaAbierto, setSistemaAbierto] = useState(null);

  // Filtrado
  const [usaPrefiltro, setUsaPrefiltro] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState(""); // arena | cartucho

  // Calentamiento
  const [usaPanelSolar, setUsaPanelSolar] = useState(false);
  const [usaBombaCalor, setUsaBombaCalor] = useState(false);
  const [usaCaldera, setUsaCaldera] = useState(false);

    // Sanitización
  const [tipoCloro, setTipoCloro] = useState(""); 
  // "cloro" | "fuera-linea" | "en-linea"

  const [usaUV, setUsaUV] = useState(false);
  const [usaOzono, setUsaOzono] = useState(false);

  const segundoCuerpoEsJacuzzi = sistemaActivo === "jacuzzi";

  /* ================= DESCRIPCIONES ================= */
  const descripcionesCampos = {
    filtrado: "Sistema de protección, recirculación y limpieza hidráulica",
    calentamiento: "Sistema encargado del aporte energético térmico",
    sanitizacion: "Sistema de desinfección y control microbiológico",
    iluminacion: "Sistema de iluminación subacuática",
    empotrables: "Elementos hidráulicos integrados al vaso",
    jacuzzi: "Sistema especializado de hidromasaje",
    recubrimiento: "Acabados interiores del cuerpo de agua",
    default: "Configuración integral del equipamiento del sistema"
  };

  const toggleSistema = (id) => {
    setSistemaAbierto(prev => (prev === id ? null : id));
  };

  /* ================= TARJETA SISTEMA ================= */
  function renderSistemaCard({ id, titulo, abierto, contenido }) {
    return (
      <div className="tarjeta-tecnica sistema-card">
        <div
          className={`sistema-header-interno ${abierto ? "abierto" : ""}`}
          onClick={() => toggleSistema(id)}
        >
          <div className="sistema-titulo">{titulo}</div>
          <div className="sistema-boton">
            {abierto ? "Cerrar" : "Configurar"}
          </div>
        </div>

        <div className={`sistema-contenido-interno ${abierto ? "expandido" : ""}`}>
          {contenido}
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="form-section hero-wrapper equipamiento">
      <div className="selector-tecnico modo-experto">

        {/* HEADER */}
        <div className="selector-header">
          <div className="selector-titulo">Equipamiento del sistema</div>
          <div className="selector-subtitulo-tecnico">
            Selección técnica de equipos y empotrables
          </div>
        </div>

        <div className="selector-acciones">
          <button
            className="btn-secundario"
            onClick={() => setSeccion("calentamiento")}
          >
            ← Volver a Calentamiento
          </button>
        </div>

        <div className="selector-contenido entrada">
          <div className="selector-grupo">
            <div className="selector-subtitulo">Sistemas del proyecto</div>

            <div className="tarjetas-grid">

              {/* ================= FILTRADO ================= */}
              {renderSistemaCard({
                id: "filtrado",
                titulo: "💧 Filtrado",
                abierto: sistemaAbierto === "filtrado",
                contenido: (
                  <>
                    <div className="decision-card">
                      <div className="decision-grupo">
                        <label className="decision-label">¿Incluir prefiltro?</label>
                        <select
                          className="input-azul"
                          value={usaPrefiltro ? "si" : "no"}
                          onChange={(e) =>
                            setUsaPrefiltro(e.target.value === "si")
                          }
                        >
                          <option value="no">No</option>
                          <option value="si">Sí</option>
                        </select>
                      </div>

                      <div className="decision-grupo">
                        <label className="decision-label">Tipo de filtro</label>
                        <select
                          className="input-azul"
                          value={tipoFiltro}
                          onChange={(e) => setTipoFiltro(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="arena">Filtro de arena</option>
                          <option value="cartucho">Filtro de cartucho</option>
                        </select>
                      </div>
                    </div>

                    {usaPrefiltro && <EquipoSelect titulo="Prefiltro" />}
                    {tipoFiltro === "arena" && <EquipoSelect titulo="Filtro de arena" />}
                    {tipoFiltro === "cartucho" && <EquipoSelect titulo="Filtro de cartucho" />}
                  </>
                )
              })}

              {/* ================= CALENTAMIENTO ================= */}
              {renderSistemaCard({
                id: "calentamiento",
                titulo: "🔥 Calentamiento",
                abierto: sistemaAbierto === "calentamiento",
                contenido: (
                  <>
                    <div className="decision-card">

                      <div
                        className={`decision-toggle ${usaPanelSolar ? "activo" : ""}`}
                        onClick={() => setUsaPanelSolar(!usaPanelSolar)}
                      >
                        <span>Panel solar</span>
                        <span className="decision-estado">
                          {usaPanelSolar ? "Incluido" : "No incluido"}
                        </span>
                      </div>

                      <div
                        className={`decision-toggle ${usaBombaCalor ? "activo" : ""}`}
                        onClick={() => setUsaBombaCalor(!usaBombaCalor)}
                      >
                        <span>Bomba de calor</span>
                        <span className="decision-estado">
                          {usaBombaCalor ? "Incluida" : "No incluida"}
                        </span>
                      </div>

                      <div
                        className={`decision-toggle ${usaCaldera ? "activo" : ""}`}
                        onClick={() => setUsaCaldera(!usaCaldera)}
                      >
                        <span>Caldera</span>
                        <span className="decision-estado">
                          {usaCaldera ? "Incluida" : "No incluida"}
                        </span>
                      </div>
                    </div>

                    {usaPanelSolar && <EquipoSelect titulo="Panel solar" />}
                    {usaBombaCalor && <EquipoSelect titulo="Bomba de calor" />}
                    {usaCaldera && <EquipoSelect titulo="Caldera" />}
                  </>
                )
              })}


              {/* ================= SANITIZACIÓN ================= */}
              {renderSistemaCard({
                id: "sanitizacion",
                titulo: "🧪 Sanitización",
                abierto: sistemaAbierto === "sanitizacion",
                contenido: (
                  <>
                    {/* ====== DECISIÓN CLORO ====== */}
                    <div className="decision-card">

                      <div className="decision-grupo">
                        <label className="decision-label">
                          Sistema principal de cloro
                        </label>
                        <select
                          className="input-azul"
                          value={tipoCloro}
                          onChange={(e) => setTipoCloro(e.target.value)}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="cloro">Generador de cloro</option>
                          <option value="fuera-linea">
                            Clorador automático fuera de línea
                          </option>
                          <option value="en-linea">
                            Clorador automático en línea
                          </option>
                        </select>
                      </div>

                    </div>

                    {/* ====== COMPLEMENTARIOS ====== */}
                    <div className="decision-card">

                      <div
                        className={`decision-toggle ${usaUV ? "activo" : ""}`}
                        onClick={() => setUsaUV(!usaUV)}
                      >
                        <span>Generador UV</span>
                        <span className="decision-estado">
                          {usaUV ? "Incluido" : "No incluido"}
                        </span>
                      </div>

                      <div
                        className={`decision-toggle ${usaOzono ? "activo" : ""}`}
                        onClick={() => setUsaOzono(!usaOzono)}
                      >
                        <span>Generador de ozono</span>
                        <span className="decision-estado">
                          {usaOzono ? "Incluido" : "No incluido"}
                        </span>
                      </div>

                    </div>

                    {/* ====== EQUIPOS ====== */}
                    {tipoCloro === "cloro" && (
                      <EquipoSelect titulo="Generador de cloro" />
                    )}

                    {tipoCloro === "fuera-linea" && (
                      <EquipoSelect titulo="Clorador automático fuera de línea" />
                    )}

                    {tipoCloro === "en-linea" && (
                      <EquipoSelect titulo="Clorador automático en línea" />
                    )}

                    {usaUV && <EquipoSelect titulo="Generador UV" />}
                    {usaOzono && <EquipoSelect titulo="Generador de ozono" />}
                  </>
                )
              })}

              {/* ================= ILUMINACIÓN ================= */}
              {renderSistemaCard({
                id: "iluminacion",
                titulo: "💡 Iluminación",
                abierto: sistemaAbierto === "iluminacion",
                contenido: (
                  <>
                    <EquipoSelect titulo="Reflectores" />
                    <EquipoSelect titulo="Transformador" />
                  </>
                )
              })}

              {/* ================= EMPOTRABLES ================= */}
              {renderSistemaCard({
                id: "empotrables",
                titulo: "🔹 Empotrables",
                abierto: sistemaAbierto === "empotrables",
                contenido: (
                  <>
                    <EquipoSelect titulo="Boquilla de retorno" />
                    <EquipoSelect titulo="Desnatador" />
                    <EquipoSelect titulo="Dren de fondo" />
                    <EquipoSelect titulo="Dren de canal" />
                    <EquipoSelect titulo="Boquilla de barredora" />
                    <EquipoSelect titulo="Rejilla perimetral" />
                  </>
                )
              })}

              {/* ================= JACUZZI ================= */}
              {segundoCuerpoEsJacuzzi &&
                renderSistemaCard({
                  id: "jacuzzi",
                  titulo: "💨 Jacuzzi",
                  abierto: sistemaAbierto === "jacuzzi",
                  contenido: (
                    <>
                      <EquipoSelect titulo="Motobomba hidrojets" />
                      <EquipoSelect titulo="Empotrables hidrojets" />
                      <EquipoSelect titulo="Empotrables salero" />
                      <EquipoSelect titulo="Soplador" />
                      <EquipoSelect titulo="Dren de fondo jacuzzi" />
                      <EquipoSelect titulo="Retorno jacuzzi" />
                      <EquipoSelect titulo="Desnatador jacuzzi" />
                      <EquipoSelect titulo="Barredora jacuzzi" />
                      <EquipoSelect titulo="Reflector jacuzzi" />
                    </>
                  )
                })}

              {/* ================= RECUBRIMIENTO ================= */}
              {renderSistemaCard({
                id: "recubrimiento",
                titulo: "🎨 Recubrimiento",
                abierto: sistemaAbierto === "recubrimiento",
                contenido: (
                  <>
                    <EquipoSelect titulo="Recubrimiento m²" />
                    <EquipoSelect titulo="Adhesivo" />
                  </>
                )
              })}

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="selector-footer fijo equipamiento">
          <span>Modo ingeniería · Equipamiento</span>
          <span className="footer-highlight">
            {hoveredField
              ? descripcionesCampos[hoveredField]
              : descripcionesCampos.default}
          </span>
        </div>

      </div>
    </div>
  );
}
