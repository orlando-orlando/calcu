import { useState } from "react";
import "../estilos.css";
import EquipoSelect from "../components/EquipoSelect";

export default function Equipamiento({ setSeccion, sistemaActivo }) {

  const [hoveredField, setHoveredField] = useState(null);
  const [sistemaAbierto, setSistemaAbierto] = useState(null);

  const hayDosCuerpos = sistemaActivo === "dos-cuerpos" || sistemaActivo === "jacuzzi";
  const segundoCuerpoEsJacuzzi = sistemaActivo === "jacuzzi";

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
    setSistemaAbierto(sistemaAbierto === id ? null : id);
  };

  return (
    <div className="form-section hero-wrapper equipamiento">
      <div className="selector-tecnico modo-experto">

        {/* ================= HEADER ================= */}
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

          {/* =====================================================
              SISTEMAS GENERALES
          ====================================================== */}
          <div
            className="selector-grupo"
            onMouseEnter={() => setHoveredField("filtrado")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="selector-subtitulo">Sistemas del proyecto</div>

            <div className="tarjetas-grid">

              {renderSistemaCard({
                id: "filtrado",
                titulo: "💧 Filtrado",
                abierto: sistemaAbierto === "filtrado",
                toggleSistema,
                contenido: (
                  <>
                    <EquipoSelect titulo="Prefiltro" />
                    <EquipoSelect titulo="Filtro de arena" />
                    <EquipoSelect titulo="Filtro de cartucho" />
                  </>
                )
              })}

              {renderSistemaCard({
                id: "calentamiento",
                titulo: "🔥 Calentamiento",
                abierto: sistemaAbierto === "calentamiento",
                toggleSistema,
                contenido: (
                  <>
                    <EquipoSelect titulo="Panel solar" />
                    <EquipoSelect titulo="Bomba de calor" />
                    <EquipoSelect titulo="Caldera" />
                  </>
                )
              })}

              {renderSistemaCard({
                id: "sanitizacion",
                titulo: "🧪 Sanitización",
                abierto: sistemaAbierto === "sanitizacion",
                toggleSistema,
                contenido: (
                  <>
                    <EquipoSelect titulo="Generador de cloro" />
                    <EquipoSelect titulo="Clorador automático fuera de línea" />
                    <EquipoSelect titulo="Clorador automático en línea" />
                    <EquipoSelect titulo="Generador UV" />
                    <EquipoSelect titulo="Generador de ozono" />
                  </>
                )
              })}

              {renderSistemaCard({
                id: "iluminacion",
                titulo: "💡 Iluminación",
                abierto: sistemaAbierto === "iluminacion",
                toggleSistema,
                contenido: (
                  <>
                    <EquipoSelect titulo="Reflectores" />
                    <EquipoSelect titulo="Transformador" />
                  </>
                )
              })}

              {renderSistemaCard({
                id: "empotrables",
                titulo: "🔹 Empotrables",
                abierto: sistemaAbierto === "empotrables",
                toggleSistema,
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

              {segundoCuerpoEsJacuzzi &&
                renderSistemaCard({
                  id: "jacuzzi",
                  titulo: "💨 Jacuzzi",
                  abierto: sistemaAbierto === "jacuzzi",
                  toggleSistema,
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

              {renderSistemaCard({
                id: "recubrimiento",
                titulo: "🎨 Recubrimiento",
                abierto: sistemaAbierto === "recubrimiento",
                toggleSistema,
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

        {/* ================= FOOTER ================= */}
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

/* =========================
   TARJETA SISTEMA (MISMO CSS)
========================= */
function renderSistemaCard({ id, titulo, abierto, toggleSistema, contenido }) {
  return (
    <div className="tarjeta-tecnica sistema-card">

        <div
          className={`sistema-header-interno ${abierto ? "abierto" : ""}`}
          onClick={() => toggleSistema(id)}
        >
          <div className="sistema-titulo">
            {titulo}
          </div>

          <div className="sistema-boton">
            {abierto ? "Cerrar" : "Configurar"}
          </div>
        </div>


      {abierto && (
        <div className="sistema-contenido-interno">
          {contenido}
        </div>
      )}

    </div>
  );
}


