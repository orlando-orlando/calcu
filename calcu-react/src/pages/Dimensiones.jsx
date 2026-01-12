import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "../estilos.css";

  const Dimensiones = forwardRef(({ setSeccion, sistemaActivo, setSistemaActivo }, ref) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [hoveredTipo, setHoveredTipo] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [animandoSalida, setAnimandoSalida] = useState(false);
  const [datosPorSistema, setDatosPorSistema] = useState({});
  const [datos, setDatos] = useState(null);

  const crearDatosSistema = (cuerpos) => ({
    cuerpos: Array.from({ length: cuerpos }, () => ({
      area: "",
      profMin: "",
      profMax: ""
    })),
    distCuarto: "",
    desborde: "",
    largoInfinity: "",
    profCortina: "",
    largoCanal: "",
    tasaRotacion: "",
    uso: ""
  });

const actualizarDatos = (patch) => {
  setDatos((prev) => {
    const nuevos = { ...prev, ...patch };

    setDatosPorSistema((mapa) => ({
      ...mapa,
      [tipoSeleccionado]: nuevos
    }));

    return nuevos;
  });
};

  const descripcionesCampos = {
    area: "Área superficial del cuerpo de agua",
    profMin: "Profundidad mínima operativa",
    profMax: "Profundidad máxima operativa",
    uso: "Tipo de uso hidráulico del sistema",
    tasaRotacion: "Tiempo en horas para renovar el volumen total",
    distCuarto: "Distancia entre el cuerpo de agua y el cuarto de máquinas",
    desborde: "Tipo de sistema de desborde del agua",
    largoInfinity: "Longitud total del borde infinity",
    profCortina: "Altura de la cortina hidráulica",
    largoCanal: "Longitud del canal de desborde"
  };

  useImperativeHandle(ref, () => ({
    resetDimensiones() {
      setTipoSeleccionado(null);
      setSistemaActivo(null);
      setDatos(null);
    }
  }));

  const tasasPorUso = {
    residencial: 8,
    publica: 6,
    competencia: 6,
    hidromasaje: 0.5,
    parque: 4
  };

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

  const config = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;

          useEffect(() => {
          if (sistemaActivo && sistemas[sistemaActivo]) {
            setTipoSeleccionado(sistemaActivo);

            setDatosPorSistema((prev) => {
              if (prev[sistemaActivo]) {
                setDatos(prev[sistemaActivo]);
                return prev;
              }

              const nuevo = crearDatosSistema(sistemas[sistemaActivo].cuerpos);
              setDatos(nuevo);

              return {
                ...prev,
                [sistemaActivo]: nuevo
              };
            });
          }
        }, [sistemaActivo]);

  const renderCamposSistema = () => {
  if (!config || !datos) return null;

    return (
      <div className="selector-bloque-inputs">
          {datos.cuerpos.map((cuerpo, i) => (
          <div key={i} className="selector-grupo">
            <div className="selector-subtitulo">
              Dimensiones físicas {config.cuerpos > 1 && `(Cuerpo ${i + 1})`}
            </div>

            <div className="selector-grid">
              <div className="campo">
                <label>Área (m²)</label>
                <input
                  type="number"
                  value={cuerpo.area}
                  onChange={(e) => {
                    const cuerpos = [...datos.cuerpos];
                    cuerpos[i].area = e.target.value;
                    actualizarDatos({ cuerpos });
                  }}

                  onMouseEnter={() => setHoveredField("area")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>

              <div className="campo">
                <label>Prof. mínima (m)</label>
                <input
                  type="number"
                  value={cuerpo.profMin}
                  onChange={(e) => {
                    const cuerpos = [...datos.cuerpos];
                    cuerpos[i].profMin = e.target.value;
                    actualizarDatos({ cuerpos });
                  }}
                  onMouseEnter={() => setHoveredField("profMin")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>

              <div className="campo">
                <label>Prof. máxima (m)</label>
                <input
                  type="number"
                  value={cuerpo.profMax}
                  onChange={(e) => {
                    const cuerpos = [...datos.cuerpos];
                    cuerpos[i].profMax = e.target.value;
                    actualizarDatos({ cuerpos });
                  }}
                  onMouseEnter={() => setHoveredField("profMax")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="selector-grupo">
          <div className="selector-subtitulo">Uso hidráulico</div>

          <div className="selector-grid">
            <div className="campo">
              <label>Uso</label>
              <select
                value={datos.uso}
                onChange={(e) => {
                  const uso = e.target.value;
                  actualizarDatos({
                    uso,
                    tasaRotacion: tasasPorUso[uso] ?? datos.tasaRotacion
                  });
                }}
                onMouseEnter={() => setHoveredField("uso")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <option value="">Selecciona</option>
                <option value="residencial">Residencial</option>
                <option value="publica">Pública</option>
                <option value="competencia">Competencia</option>
                <option value="hidromasaje">Hidromasaje</option>
                <option value="parque">Parque acuático</option>
              </select>
            </div>

            <div className="campo">
              <label>Tasa de rotación (h)</label>
              <select
                value={datos.tasaRotacion}
                onChange={(e) =>
                  actualizarDatos({ tasaRotacion: e.target.value })
                }
                onMouseEnter={() => setHoveredField("tasaRotacion")}
                onMouseLeave={() => setHoveredField(null)}
              >
                {[0.5, 1, 2, 3, 4, 6, 8, 12, 24].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Distancia a cuarto (m)</label>
              <input
                type="number"
                value={datos.distCuarto}
                onChange={(e) =>
                  actualizarDatos({ distCuarto: e.target.value })
                }
                onMouseEnter={() => setHoveredField("distCuarto")}
                onMouseLeave={() => setHoveredField(null)}
              />
            </div>
          </div>
        </div>

        {config.desborde && (
          <div className="selector-grupo">
            <div className="selector-subtitulo">Tipo de desborde</div>

            <div className="selector-radios">
              {["infinity", "canal", "ambos", "ninguno"].map((v) => (
                <label
                  key={v}
                  onMouseEnter={() => setHoveredField("desborde")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <input
                    type="radio"
                    checked={datos.desborde === v}
                    onChange={() => actualizarDatos({ desborde: v })}
                  />
                  {v}
                </label>
              ))}
            </div>

            {(datos.desborde === "infinity" || datos.desborde === "ambos") && (
              <div className="selector-grid">
                <div className="campo">
                  <label>Largo infinity (m)</label>
                  <input
                    type="number"
                    value={datos.largoInfinity}
                    onChange={(e) =>
                      actualizarDatos({ largoInfinity: e.target.value })
                    }
                    onMouseEnter={() => setHoveredField("largoInfinity")}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                </div>

                <div className="campo">
                  <label>Prof. cortina (m)</label>
                  <input
                    type="number"
                    value={datos.profCortina}
                    onChange={(e) =>
                      actualizarDatos({ profCortina: e.target.value })
                    }
                    onMouseEnter={() => setHoveredField("profCortina")}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                </div>
              </div>
            )}

            {(datos.desborde === "canal" || datos.desborde === "ambos") && (
              <div className="campo">
                <label>Largo canal (m)</label>
                <input
                  type="number"
                  value={datos.largoCanal}
                  onChange={(e) =>
                    actualizarDatos({ largoCanal: e.target.value })
                  }
                  onMouseEnter={() => setHoveredField("largoCanal")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
        
  return (
    <div className="form-section hero-wrapper">
      <div className="selector-tecnico modo-experto">

        <div className="selector-header">
          {!tipoSeleccionado ? (
            <>
              <div className="selector-titulo">Configuración del sistema</div>
              <div className="selector-subtitulo">
                Selecciona el tipo de cuerpo hidráulico
              </div>
            </>
          ) : (
            <>
              <div className="selector-titulo-sistema">
                {sistemas[tipoSeleccionado].nombre}
              </div>
              <div className="selector-subtitulo-tecnico">
                Parámetros técnicos del sistema
              </div>
            </>
          )}
        </div>

        {tipoSeleccionado && (
          <div className="selector-acciones">
            <button
              className="btn-secundario"
              onClick={() => {
                setAnimandoSalida(true);

                setTimeout(() => {
                  setTipoSeleccionado(null);
                  setSistemaActivo(null); 
                  setDatos(null);
                  setAnimandoSalida(false);
                }, 220);
              }}
            >
              ← Volver a Dimensiones
            </button>

            <button
              className="btn-primario"
              disabled={!datos?.uso || !datos?.cuerpos?.[0]?.area}
              onClick={() => setSeccion("calentamiento")}
            >
              Ir a Calentamiento →
            </button>
          </div>
        )}

          {tipoSeleccionado && (
            <div className={`selector-contenido ${animandoSalida ? "salida" : "entrada"}`}>
              {renderCamposSistema()}
            </div>
          )}

        <div className="lista-sistemas">
          {(tipoSeleccionado
            ? [[tipoSeleccionado, sistemas[tipoSeleccionado]]]
            : Object.entries(sistemas)
          ).map(([key, s]) => (
            <div
              key={key}
              className={`fila-sistema ${tipoSeleccionado === key ? "activo" : ""}`}
              onClick={() => {
                setTipoSeleccionado(key);
                setSistemaActivo(key); // 👈 CLAVE

                setDatosPorSistema((prev) => {
                  // si ya existe, lo usamos
                  if (prev[key]) {
                    setDatos(prev[key]);
                    return prev;
                  }

                  // si no existe, lo creamos
                  const nuevo = crearDatosSistema(s.cuerpos);
                  setDatos(nuevo);

                  return {
                    ...prev,
                    [key]: nuevo
                  };
                });
              }}

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
          ))}
        </div>

        <div className="selector-footer fijo">
          <span>
            {hoveredTipo
              ? `Sistema ${Object.keys(sistemas).indexOf(hoveredTipo) + 1} / ${Object.keys(sistemas).length}`
              : `${Object.keys(sistemas).length} sistemas`}
          </span>

          <span className="footer-highlight">
            {hoveredField
              ? descripcionesCampos[hoveredField]
              : hoveredTipo
                ? sistemas[hoveredTipo].nombre
                : "Modo ingeniería"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default Dimensiones;
