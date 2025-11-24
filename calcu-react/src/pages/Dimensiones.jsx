import { useState, useMemo } from "react";
import "../estilos.css";
import useCalculosHidraulicos from "../hooks/useCalculosHidraulicos";

export default function Dimensiones({ setSeccion }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [hoveredTipo, setHoveredTipo] = useState(null);

  // Estado para inputs de cálculo
  const [datos, setDatos] = useState({
    area: "",
    profMin: "",
    profMax: "",
    distCuarto: ""
  });

  const { retorno } = useCalculosHidraulicos(datos, (num) => num.toFixed(2));
  const [resultadosRetorno, setResultadosRetorno] = useState(null);

  // Hover por campo para ayuda contextual
  const [hoveredField, setHoveredField] = useState(null);

  // Configuración base de sistemas
  const sistemas = {
    alberca: { img: "./img/alberca.jpg", cuerpos: 1, desborde: true, nombre: "Alberca" },
    jacuzzi: { img: "./img/jacuzzi.jpg", cuerpos: 1, desborde: true, nombre: "Jacuzzi" },
    chapoteadero: { img: "./img/chapoteadero.jpg", cuerpos: 1, desborde: true, nombre: "Chapoteadero" },
    espejoAgua: { img: "./img/espejo.jpg", cuerpos: 1, desborde: true, nombre: "Espejo de agua" },
    albercaJacuzzi1: { img: "./img/alberca+jacuzzi1C.jpg", cuerpos: 2, desborde: true, nombre: "Alberca + Jacuzzi (1 cuerpo)" },
    albercaChapo1: { img: "./img/alberca+chapoteadero1C.jpg", cuerpos: 2, desborde: true, nombre: "Alberca + Chapoteadero (1 cuerpo)" },
    jacuzziChapo1: { img: "./img/jacuzzi+chapoteadero1C.jpg", cuerpos: 2, desborde: true, nombre: "Jacuzzi + Chapoteadero (1 cuerpo)" },
    albercaJacuzzi2: { img: "./img/alberca+jacuzzi2C.jpg", cuerpos: 2, desborde: true, nombre: "Alberca + Jacuzzi (2 cuerpos)" },
    albercaChapo2: { img: "./img/alberca+chapoteadero2C.jpg", cuerpos: 2, desborde: true, nombre: "Alberca + Chapoteadero (2 cuerpos)" },
    jacuzziChapo2: { img: "./img/jacuzzi+chapoteadero2C.jpg", cuerpos: 2, desborde: true, nombre: "Jacuzzi + Chapoteadero (2 cuerpos)" }
  };

  const handleSeleccion = (tipo) => {
    setTipoSeleccionado(tipo);
    // pequeño delay para animación (no necesario pero mejora sensación)
    setTimeout(() => setMostrarPanel(true), 60);
  };

  const config = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;
  const tipoHover = hoveredTipo || tipoSeleccionado;

  // Mensajes de ayuda por campo (puedes editarlos)
  const ayudaMap = useMemo(() => ({
    area: "Área del cuerpo de agua en metros cuadrados. Se usa para calcular longitudes y distribución de retornos.",
    profMin: "Profundidad mínima del cuerpo (m). Influye en longitud de tiro y cálculos de volumen.",
    profMax: "Profundidad máxima del cuerpo (m). Se toma el mayor entre profMin y profMax para cálculos críticos.",
    distCuarto: "Distancia desde el cuerpo de agua hasta el cuarto de máquinas (m). Se usa para dimensionar el tramo especial.",
    uso: "Tipo de uso (residencial, pública, competencia...) afecta tasas de recirculación recomendadas.",
    rotacion: "Tasa de rotación deseada en horas. Controla caudal necesario para recircular el volumen.",
    desborde: "Tipo de desborde (Infinity / Canal / Ambos) — afecta diseño del rebosadero y retornos."
  }), []);

  // Texto de ayuda a mostrar: hover de campo > hover general > instrucciones por defecto
  const ayudaTexto = hoveredField
    ? ayudaMap[hoveredField] || "Información del campo"
    : tipoHover
      ? `${sistemas[tipoHover].nombre} — selecciona un campo para ver ayuda contextual.`
      : "Selecciona un tipo de sistema para ver detalles y ayuda contextual.";

  return (
    <div className={`form-section hero-wrapper ${mostrarPanel ? "expanded" : ""}`} style={{ fontFamily: "inherit" }}>
      {!mostrarPanel ? (
        <>
          {/* === SELECCIÓN DE TIPO DE SISTEMA === */}
          <div className="tipo-sistema-container">
            <div className="tarjeta-tipo-sistema tarjeta-entrada">
              <div className="titulo-seccion">Selecciona el tipo de sistema</div>
              <div className="opciones-sistema">
                {Object.entries(sistemas).map(([key, s]) => (
                  <label
                    className={`opcion-sistema ${tipoSeleccionado === key ? "seleccionada" : ""}`}
                    key={key}
                    onMouseEnter={() => setHoveredTipo(key)}
                    onMouseLeave={() => setHoveredTipo(null)}
                    onClick={() => handleSeleccion(key)}
                  >
                    <input type="radio" name="tipoSistema" value={key} style={{ display: "none" }} />
                    <img src={s.img} alt={s.nombre} />
                    <span>{s.nombre}</span>
                  </label>
                ))}
              </div>

              {/* === FRANJA DE PREVIEW === */}
              <div id="opcionesFooter" className="opciones-footer">
                <div className="opciones-preview">
                  {tipoHover ? (
                    <>
                      <img className="opciones-preview-img" src={sistemas[tipoHover].img} alt="Preview sistema" />
                      <div className="opciones-meta">
                        <div className="titulo">{sistemas[tipoHover].nombre}</div>
                        <div className="desc">
                          Sistema de {sistemas[tipoHover].cuerpos} cuerpo(s) con {sistemas[tipoHover].desborde ? "desborde activo" : "sin desborde"}.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="opciones-placeholder">
                      Pasa el cursor sobre un tipo para ver su vista previa.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        config && (
          <div className="tarjeta-expandida">
            {/* HERO BACKGROUND: cubre el área derecha (fondo blur) */}
            <div
              className="hero-background"
              style={{
                backgroundImage: `url(${config.img})`
              }}
            />

            {/* contenido en primer plano (paneles semitransparentes) */}
            <div className="tarjeta-contenido">
              <button
                className="btn-volver minimal"
                onClick={() => {
                  setMostrarPanel(false);
                  // hacemos small delay para que cierre animación
                  setTimeout(() => setTipoSeleccionado(null), 300);
                }}
              >
                ← Volver
              </button>

              <h2 className="titulo-sistema-activo">{config.nombre}</h2>

              <div className="sistema-contenido overlay">
                <div className="columna-izquierda overlay-card">
                  {/* Dimensiones físicas */}
                  {[...Array(config.cuerpos)].map((_, i) => (
                    <div className="tarjeta-bdc tarjeta-calentamiento" key={i}>
                      <label className="label-calentamiento">
                        Dimensiones físicas {config.cuerpos > 1 ? `(Cuerpo ${i + 1})` : ""}
                      </label>
                      <div className="form-group">
                        <label>Área (m²):</label>
                        <input
                          type="number"
                          step="0.01"
                          className="input-azul"
                          value={datos.area}
                          onChange={(e) => setDatos({ ...datos, area: e.target.value })}
                          onMouseEnter={() => setHoveredField("area")}
                          onMouseLeave={() => setHoveredField(null)}
                        />
                      </div>
                      <div className="form-group inline fila-bdc">
                        <div className="campo-bdc">
                          <label>Profundidad mínima (m):</label>
                          <input
                            type="number"
                            step="0.01"
                            className="input-azul"
                            value={datos.profMin}
                            onChange={(e) => setDatos({ ...datos, profMin: e.target.value })}
                            onMouseEnter={() => setHoveredField("profMin")}
                            onMouseLeave={() => setHoveredField(null)}
                          />
                        </div>
                        <div className="campo-bdc">
                          <label>Profundidad máxima (m):</label>
                          <input
                            type="number"
                            step="0.01"
                            className="input-azul"
                            value={datos.profMax}
                            onChange={(e) => setDatos({ ...datos, profMax: e.target.value })}
                            onMouseEnter={() => setHoveredField("profMax")}
                            onMouseLeave={() => setHoveredField(null)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Uso y rotación */}
                  <div className="tarjeta-bdc tarjeta-calentamiento">
                    <div className="form-group inline fila-bdc">
                      <div className="campo-bdc" onMouseEnter={() => setHoveredField("uso")} onMouseLeave={() => setHoveredField(null)}>
                        <label>Uso del cuerpo de agua:</label>
                        <select className="input-azul">
                          <option value="">-- Selecciona uso --</option>
                          <option value="residencial">Residencial</option>
                          <option value="publica">Pública</option>
                          <option value="competencia">Competencia</option>
                          <option value="parque">Parque acuático</option>
                        </select>
                      </div>
                      <div className="campo-bdc" style={{ marginLeft: "16px" }} onMouseEnter={() => setHoveredField("rotacion")} onMouseLeave={() => setHoveredField(null)}>
                        <label>Tasa de rotación (h):</label>
                        <select className="input-azul">
                          <option value="">-- Selecciona --</option>
                          {[0.5, 1, 4, 6, 8, 12, 18, 24].map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <div className="campo-bdc" style={{ marginLeft: "16px" }}>
                        <label>Distancia a cuarto de máquinas (m):</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Ej. 15"
                          className="input-azul"
                          value={datos.distCuarto}
                          onChange={(e) => setDatos({ ...datos, distCuarto: e.target.value })}
                          onMouseEnter={() => setHoveredField("distCuarto")}
                          onMouseLeave={() => setHoveredField(null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipo de desborde */}
                  {config.desborde && (
                    <div className="tarjeta-bdc tarjeta-calentamiento">
                      <label className="label-calentamiento">Tipo de desborde:</label>
                      <div className="checkbox-row">
                        <label><input type="radio" name="desborde" value="infinity" /> Infinity</label>
                        <label><input type="radio" name="desborde" value="canal" /> Canal perimetral</label>
                        <label><input type="radio" name="desborde" value="ambos" /> Ambos</label>
                        <label><input type="radio" name="desborde" value="ninguno" /> Ninguno</label>
                      </div>
                    </div>
                  )}

                  {/* Mostrar resultados */}
                  {resultadosRetorno && (
                    <div style={{ marginTop: 14 }}>
                      <h3>Resultados del cálculo de retornos:</h3>
                      <pre style={{ fontSize: 12, maxHeight: 260, overflow: "auto" }}>
                        {JSON.stringify(resultadosRetorno, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Columna derecha convertida en overlay de ayuda (sin bordes) */}
                <div className="columna-derecha overlay-card ayuda-area">
                  <div className="tarjeta-imagen overlay-image" aria-hidden>
                    {/* la imagen real ya está en hero-background, aquí podemos mostrar una mini o ícono */}
                    <div className="imagen-placeholder">
                      {/* opcional: small preview */}
                      <img src={config.img} alt={config.nombre} className="imagen-mini" />
                    </div>
                  </div>

                  <div id="ayudaContextual" className="ayuda-contextual overlay-help">
                    <div className="ayuda-titulo">Ayuda contextual</div>
                    <div className="ayuda-texto">
                      {ayudaTexto}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
