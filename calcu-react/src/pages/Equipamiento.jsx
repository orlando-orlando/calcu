import { useState } from "react";
import "../estilos.css";

export default function Equipamiento({ setSeccion }) {

  /* =========================
     ESTADO UI
  ========================== */
  const [hoveredField, setHoveredField] = useState(null);

  /* =========================
     MOCK CONFIG (luego vendrá del sistema)
  ========================== */
  const hayDosCuerpos = true;
  const segundoCuerpoEsJacuzzi = true;

  /* =========================
     FOOTER DESCRIPTIVO
  ========================== */
  const descripcionesCampos = {
    generales: "Equipos principales que conforman el sistema hidráulico y térmico",
    filtracion: "Sistema encargado de la limpieza y circulación del agua",
    calentamiento: "Equipos destinados al aporte de energía térmica",
    sanitizacion: "Sistemas de desinfección y control microbiológico",
    cuerpo1: "Empotrables y equipos específicos del cuerpo de agua principal",
    cuerpo2: "Equipos exclusivos del segundo cuerpo de agua",
    jacuzzi: "Equipos especiales para hidromasaje y aireación",
    default: "Configuración técnica del equipamiento del sistema"
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
              EQUIPOS GENERALES
          ====================================================== */}
          <div
            className="selector-grupo"
            onMouseEnter={() => setHoveredField("generales")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="selector-subtitulo">Equipos principales</div>

            <div className="tarjetas-grid">

              {/* FILTRACIÓN */}
              <div
                className="tarjeta-tecnica"
                onMouseEnter={() => setHoveredField("filtracion")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <h4>💧 Filtración & Bombeo</h4>
                <ul>
                  <li>Prefiltración</li>
                  <li>Filtro</li>
                  <li>Motobomba principal</li>
                  <li>Motobomba hidrojets</li>
                </ul>
              </div>

              {/* CALENTAMIENTO */}
              <div
                className="tarjeta-tecnica"
                onMouseEnter={() => setHoveredField("calentamiento")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <h4>🔥 Calentamiento</h4>
                <ul>
                  <li>Panel solar</li>
                  <li>Bomba de calor</li>
                  <li>Caldera</li>
                </ul>
              </div>

              {/* SANITIZACIÓN */}
              <div
                className="tarjeta-tecnica"
                onMouseEnter={() => setHoveredField("sanitizacion")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <h4>🧪 Sanitización</h4>
                <ul>
                  <li>Generador de cloro</li>
                  <li>Clorador automático fuera de línea</li>
                  <li>Clorador automático en línea</li>
                  <li>Sanitizador UV</li>
                  <li>Sanitizador ozono</li>
                </ul>
              </div>

            </div>
          </div>

          {/* =====================================================
              CUERPO DE AGUA 1
          ====================================================== */}
          <div
            className="selector-grupo"
            onMouseEnter={() => setHoveredField("cuerpo1")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="selector-subtitulo">
              Cuerpo de agua 1 · Alberca principal
            </div>

            <div className="tarjetas-grid">

              <div className="tarjeta-tecnica">
                <h4>🔹 Empotrables hidráulicos</h4>
                <ul>
                  <li>Retorno</li>
                  <li>Desnatador</li>
                  <li>Dren de fondo</li>
                  <li>Dren canal</li>
                  <li>Barredora</li>
                  <li>Rejilla perimetral</li>
                  <li>Hidrojet</li>
                  <li>Salero</li>
                </ul>
              </div>

              <div className="tarjeta-tecnica">
                <h4>💡 Iluminación</h4>
                <ul>
                  <li>Reflectores</li>
                </ul>
              </div>

              <div className="tarjeta-tecnica">
                <h4>🎨 Acabados</h4>
                <ul>
                  <li>Recubrimiento</li>
                </ul>
              </div>

            </div>
          </div>

          {/* =====================================================
              CUERPO DE AGUA 2
          ====================================================== */}
          {hayDosCuerpos && (
            <div
              className="selector-grupo"
              onMouseEnter={() =>
                setHoveredField(segundoCuerpoEsJacuzzi ? "jacuzzi" : "cuerpo2")
              }
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="selector-subtitulo">
                {segundoCuerpoEsJacuzzi
                  ? "Cuerpo de agua 2 · Jacuzzi"
                  : "Cuerpo de agua 2 · Alberca secundaria"}
              </div>

              <div className="tarjetas-grid">

                {segundoCuerpoEsJacuzzi && (
                  <div className="tarjeta-tecnica">
                    <h4>💨 Hidromasaje & Aire</h4>
                    <ul>
                      <li>Soplador</li>
                      <li>Motobomba hidrojets</li>
                      <li>Empotrable hidrojet</li>
                    </ul>
                  </div>
                )}

                <div className="tarjeta-tecnica">
                  <h4>🔹 Empotrables</h4>
                  <ul>
                    <li>Retorno</li>
                    <li>Dren</li>
                    <li>Salero</li>
                    <li>Reflectores</li>
                  </ul>
                </div>

                <div className="tarjeta-tecnica">
                  <h4>🔥 Calentamiento</h4>
                  <ul>
                    <li>Panel solar</li>
                    <li>Bomba de calor</li>
                    <li>Caldera</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ================= FOOTER DINÁMICO ================= */}
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
