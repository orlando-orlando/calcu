import { useState, useMemo } from "react";
import "../estilos.css";
import useCalculosHidraulicos from "../hooks/useCalculosHidraulicos";

export default function Dimensiones({ setSeccion }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [hoveredTipo, setHoveredTipo] = useState(null);

  // Estado para inputs
  const [datos, setDatos] = useState({
    area: "",
    profMin: "",
    profMax: "",
    distCuarto: "",
    desborde: "",
    largoInfinity: "",
    profCortina: "",
    motobombaInfinity: "",
    largoCanal: ""
  });

  const { retorno } = useCalculosHidraulicos(datos, (num) => num.toFixed(2));
  const [resultadosRetorno, setResultadosRetorno] = useState(null);

  // Hover por campo
  const [hoveredField, setHoveredField] = useState(null);

  // Catálogo de sistemas
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
    setTimeout(() => setMostrarPanel(true), 60);
  };

  const config = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;
  const tipoHover = hoveredTipo || tipoSeleccionado;

  const ayudaMap = useMemo(
    () => ({
      area: "Área del cuerpo de agua en m².",
      profMin: "Profundidad mínima.",
      profMax: "Profundidad máxima.",
      distCuarto: "Distancia a cuarto de máquinas.",
      desborde: "Selecciona tipo de desborde.",
      largoInfinity: "Longitud de muro tipo infinity (m).",
      profCortina: "Profundidad de cortina de agua (m).",
      motobombaInfinity: "Motobomba independiente para infinity.",
      largoCanal: "Longitud del canal perimetral (m)."
    }),
    []
  );

  const ayudaTexto = hoveredField
    ? ayudaMap[hoveredField] || "Información del campo"
    : tipoHover
    ? `${sistemas[tipoHover].nombre} — selecciona un campo para ver ayuda contextual.`
    : "Selecciona un tipo de sistema para ver detalles y ayuda contextual.";

  return (
    <div className={`form-section hero-wrapper ${mostrarPanel ? "expanded" : ""}`} style={{ fontFamily: "inherit" }}>
      {!mostrarPanel ? (
        <>
          {/* SELECCIÓN DE SISTEMA */}
          <div className="tipo-sistema-container">
            <div className="tarjeta-tipo-sistema tarjeta-entrada">
              <div className="toggle-boton activo">Selecciona el tipo de sistema</div>
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

              <div id="opcionesFooter" className="opciones-footer">
                <div className="opciones-preview">
                  {tipoHover ? (
                    <>
                      <img className="opciones-preview-img" src={sistemas[tipoHover].img} alt="" />
                      <div className="opciones-meta">
                        <div className="titulo">{sistemas[tipoHover].nombre}</div>
                        <div className="desc">
                          Sistema de {sistemas[tipoHover].cuerpos} cuerpo(s) con{" "}
                          {sistemas[tipoHover].desborde ? "desborde activo" : "sin desborde"}.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="opciones-placeholder">Pasa el cursor para ver vista previa.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        config && (
          <div className="tarjeta-expandida">
            <div className="hero-background" style={{ backgroundImage: `url(${config.img})` }} />

            <div className="tarjeta-contenido">
              <button
                className="btn-volver minimal"
                onClick={() => {
                  setMostrarPanel(false);
                  setTimeout(() => setTipoSeleccionado(null), 300);
                }}
              >
                ← Volver
              </button>

              <button
                className="btn-volver minimal"
                style={{ alignSelf: "flex-end" }}
                onClick={() => setSeccion("calentamiento")}
              >
                Ir a calentamiento →
              </button>

                <h2 className="titulo-sistema-activo">{config.nombre}</h2>

              <div className="sistema-contenido overlay">
                <div className="columna-izquierda overlay-card">
                  {/* Dimensiones */}
                  {[...Array(config.cuerpos)].map((_, i) => (
                    <div className="tarjeta-bdc tarjeta-calentamiento" key={i}>
                      <label className="label-calentamiento">
                        Dimensiones físicas {config.cuerpos > 1 ? `(Cuerpo ${i + 1})` : ""}
                      </label>

                      <div className="form-group">
                        <label>Área (m²):</label>
                        <input
                          type="number"
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

                  {/* Uso / Rotación */}
                  <div className="tarjeta-bdc tarjeta-calentamiento">
                    <div className="form-group inline fila-bdc">
                      <div className="campo-bdc">
                        <label>Uso:</label>
                        <select className="input-azul">
                          <option value="">-- Selecciona --</option>
                          <option value="residencial">Residencial</option>
                          <option value="publica">Pública</option>
                          <option value="competencia">Competencia</option>
                          <option value="parque">Parque acuático</option>
                        </select>
                      </div>

                      <div className="campo-bdc" style={{ marginLeft: "16px" }}>
                        <label>Rotación (h):</label>
                        <select className="input-azul">
                          <option value="">-- Selecciona --</option>
                          {[0.5, 1, 4, 6, 8, 12, 18, 24].map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </div>

                      <div className="campo-bdc" style={{ marginLeft: "16px" }}>
                        <label>Distancia a cuarto (m):</label>
                        <input
                          type="number"
                          className="input-azul"
                          value={datos.distCuarto}
                          onChange={(e) => setDatos({ ...datos, distCuarto: e.target.value })}
                          onMouseEnter={() => setHoveredField("distCuarto")}
                          onMouseLeave={() => setHoveredField(null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* === TIPO DE DESBORDE === */}
                  {config.desborde && (
                    <div className="tarjeta-bdc tarjeta-calentamiento">
                      <label className="label-calentamiento">Tipo de desborde:</label>

                      <div className="checkbox-row">
                        {["infinity", "canal", "ambos", "ninguno"].map((v) => (
                          <label key={v}>
                            <input
                              type="radio"
                              name="desborde"
                              value={v}
                              checked={datos.desborde === v}
                              onChange={(e) => setDatos({ ...datos, desborde: e.target.value })}
                              onMouseEnter={() => setHoveredField("desborde")}
                              onMouseLeave={() => setHoveredField(null)}
                            />
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </label>
                        ))}
                      </div>

                      {/* === Campos dinámicos === */}

                      {(datos.desborde === "infinity" || datos.desborde === "ambos") && (
                        <>
                          <div className="form-group" style={{ marginTop: 10 }}>
                            <label>Largo del muro infinity (m):</label>
                            <input
                              type="number"
                              className="input-azul"
                              value={datos.largoInfinity}
                              onChange={(e) => setDatos({ ...datos, largoInfinity: e.target.value })}
                              onMouseEnter={() => setHoveredField("largoInfinity")}
                              onMouseLeave={() => setHoveredField(null)}
                            />
                          </div>

                          <div className="form-group">
                            <label>Profundidad de cortina (m):</label>
                            <input
                              type="number"
                              className="input-azul"
                              value={datos.profCortina}
                              onChange={(e) => setDatos({ ...datos, profCortina: e.target.value })}
                              onMouseEnter={() => setHoveredField("profCortina")}
                              onMouseLeave={() => setHoveredField(null)}
                            />
                          </div>

                          <div className="checkbox-row" style={{ marginTop: 10 }}>
                            <label>
                              <input
                                type="radio"
                                name="motobombaInfinity"
                                value="si"
                                checked={datos.motobombaInfinity === "si"}
                                onChange={(e) => setDatos({ ...datos, motobombaInfinity: e.target.value })}
                                onMouseEnter={() => setHoveredField("motobombaInfinity")}
                                onMouseLeave={() => setHoveredField(null)}
                              />
                              Motobomba independiente
                            </label>

                            <label>
                              <input
                                type="radio"
                                name="motobombaInfinity"
                                value="no"
                                checked={datos.motobombaInfinity === "no"}
                                onChange={(e) => setDatos({ ...datos, motobombaInfinity: e.target.value })}
                              />
                              No independiente
                            </label>
                          </div>
                        </>
                      )}

                      {(datos.desborde === "canal" || datos.desborde === "ambos") && (
                        <div className="form-group" style={{ marginTop: 10 }}>
                          <label>Largo canal perimetral (m):</label>
                          <input
                            type="number"
                            className="input-azul"
                            value={datos.largoCanal}
                            onChange={(e) => setDatos({ ...datos, largoCanal: e.target.value })}
                            onMouseEnter={() => setHoveredField("largoCanal")}
                            onMouseLeave={() => setHoveredField(null)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {resultadosRetorno && (
                    <div style={{ marginTop: 14 }}>
                      <h3>Resultados del cálculo de retornos:</h3>
                      <pre style={{ maxHeight: 260, overflow: "auto" }}>{JSON.stringify(resultadosRetorno, null, 2)}</pre>
                    </div>
                  )}
                </div>

                <div className="columna-derecha overlay-card ayuda-area">
                  <div className="tarjeta-imagen overlay-image">
                    <img src={config.img} alt="" className="imagen-mini" />
                  </div>

                  <div id="ayudaContextual" className="ayuda-contextual overlay-help">
                    <div className="ayuda-titulo">Ayuda contextual</div>
                    <div className="ayuda-texto">{ayudaTexto}</div>
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
