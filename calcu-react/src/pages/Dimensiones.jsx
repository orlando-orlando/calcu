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

      const renderCamposSistema = () => {
        if (!config) return null;

        return (
      <div className="bloques-tecnicos">
            {/* ================= DIMENSIONES ================= */}
            {[...Array(config.cuerpos)].map((_, i) => (
              <div className="tarjeta-bdc tarjeta-calentamiento" key={i}>
                <label className="label-calentamiento">
                  Dimensiones físicas{" "}
                  {config.cuerpos > 1 ? `(Cuerpo ${i + 1})` : ""}
                </label>

                <div className="form-group">
                  <label>Área (m²):</label>
                  <input
                    type="number"
                    className="input-azul"
                    value={datos.area}
                    onChange={(e) =>
                      setDatos({ ...datos, area: e.target.value })
                    }
                  />
                </div>

                <div className="form-group inline fila-bdc">
                  <div className="campo-bdc">
                    <label>Profundidad mínima (m):</label>
                    <input
                      type="number"
                      className="input-azul"
                      value={datos.profMin}
                      onChange={(e) =>
                        setDatos({ ...datos, profMin: e.target.value })
                      }
                    />
                  </div>

                  <div className="campo-bdc">
                    <label>Profundidad máxima (m):</label>
                    <input
                      type="number"
                      className="input-azul"
                      value={datos.profMax}
                      onChange={(e) =>
                        setDatos({ ...datos, profMax: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* ================= USO / ROTACIÓN ================= */}
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

                <div className="campo-bdc">
                  <label>Rotación (h):</label>
                  <select className="input-azul">
                    {[0.5, 1, 4, 6, 8, 12, 18, 24].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="campo-bdc">
                  <label>Distancia a cuarto (m):</label>
                  <input
                    type="number"
                    className="input-azul"
                    value={datos.distCuarto}
                    onChange={(e) =>
                      setDatos({ ...datos, distCuarto: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ================= DESBORDE ================= */}
            {config.desborde && (
              <div className="tarjeta-bdc tarjeta-calentamiento">
                <label className="label-calentamiento">
                  Tipo de desborde:
                </label>

                <div className="checkbox-row">
                  {["infinity", "canal", "ambos", "ninguno"].map((v) => (
                    <label key={v}>
                      <input
                        type="radio"
                        name="desborde"
                        value={v}
                        checked={datos.desborde === v}
                        onChange={(e) =>
                          setDatos({ ...datos, desborde: e.target.value })
                        }
                      />
                      {v}
                    </label>
                  ))}
                </div>

                {(datos.desborde === "infinity" ||
                  datos.desborde === "ambos") && (
                  <>
                    <div className="form-group">
                      <label>Largo muro infinity (m):</label>
                      <input
                        type="number"
                        className="input-azul"
                        value={datos.largoInfinity}
                        onChange={(e) =>
                          setDatos({
                            ...datos,
                            largoInfinity: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Profundidad cortina (m):</label>
                      <input
                        type="number"
                        className="input-azul"
                        value={datos.profCortina}
                        onChange={(e) =>
                          setDatos({
                            ...datos,
                            profCortina: e.target.value
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {(datos.desborde === "canal" ||
                  datos.desborde === "ambos") && (
                  <div className="form-group">
                    <label>Largo canal perimetral (m):</label>
                    <input
                      type="number"
                      className="input-azul"
                      value={datos.largoCanal}
                      onChange={(e) =>
                        setDatos({
                          ...datos,
                          largoCanal: e.target.value
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      };

  return (
    <div className="form-section hero-wrapper" style={{ fontFamily: "inherit" }}>
      <div className="selector-tecnico modo-experto">

        {/* HEADER */}
        <div className="selector-header">
          {!tipoSeleccionado ? (
            <>
              <div className="selector-titulo">Configuración del sistema</div>
              <div className="selector-subtitulo">
                Selecciona el tipo de cuerpo hidráulico a calcular
              </div>
            </>
          ) : (
            <>
              <div className="selector-titulo-sistema">
                {sistemas[tipoSeleccionado].nombre}
              </div>
              <div className="selector-subtitulo-tecnico">
                Sistema seleccionado
              </div>
            </>
          )}
        </div>

        {/* INPUTS INLINE (LOS BUENOS) */}
        {tipoSeleccionado && (
          <div className="tarjeta-tipo-sistema">
            {renderCamposSistema()}
          </div>
        )}

        {/* LISTA DE SISTEMAS */}
        <div className="lista-sistemas">
          {Object.entries(sistemas).map(([key, s]) => {
            const activo = tipoSeleccionado === key;

            return (
              <div
                key={key}
                className={`fila-sistema ${activo ? "activo" : ""}`}
                onClick={() => handleSeleccion(key)}
                onMouseEnter={() => setHoveredTipo(key)}
                onMouseLeave={() => setHoveredTipo(null)}
              >
                <div className="sistema-info">
                  <div className="sistema-nombre">
                    {s.nombre}
                    <span className={`badge-cuerpo ${s.cuerpos > 1 ? "doble" : "simple"}`}>
                      {s.cuerpos}C
                    </span>
                  </div>
                  <div className="sistema-meta">
                    {s.desborde ? "Desborde activo" : "Sin desborde"}
                  </div>
                </div>

                <div className="sistema-imagen">
                  <img src={s.img} alt={s.nombre} />
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="selector-footer fijo">
          <span>
            {hoveredTipo
              ? `Sistema ${Object.keys(sistemas).indexOf(hoveredTipo) + 1} / ${Object.keys(sistemas).length}`
              : `${Object.keys(sistemas).length} sistemas`}
          </span>

          <span className="footer-highlight">
            {hoveredTipo
              ? sistemas[hoveredTipo].nombre
              : "Modo ingeniería"}
          </span>
        </div>
      </div>
    </div>
  );

}
