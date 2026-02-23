import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "../estilos.css";
import CalculadorAreaModal from "../components/CalculadorAreaModal";

  const Dimensiones = forwardRef(({setSeccion, sistemaActivo, setSistemaActivo, datosPorSistema, setDatosPorSistema},ref) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [hoveredTipo, setHoveredTipo] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);
  const [animandoSalida, setAnimandoSalida] = useState(false);
  const [datos, setDatos] = useState(null);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarErrores, setMostrarErrores] = useState(false);
  const [calculadorArea, setCalculadorArea] = useState(null);
  
  const [imagenZoom, setImagenZoom] = useState(null);
    /* 🔹 Cerrar visor con ESC */
  useEffect(() => {
    const cerrarConEsc = (e) => {
      if (e.key === "Escape") {
        setImagenZoom(null);
      }
    };
    window.addEventListener("keydown", cerrarConEsc);
    return () => window.removeEventListener("keydown", cerrarConEsc);
  }, []);

  const cambiarSeccionConAnimacion = (nuevaSeccion) => {setAnimandoSalida(true);
    setTimeout(() => {
      setAnimandoSalida(false);
      setSeccion(nuevaSeccion);
    }, 220); // MISMO tiempo que tu CSS
  };

  const crearDatosSistema = (cuerpos) => ({
    cuerpos: Array.from({ length: cuerpos }, () => ({
      area: "",
      profMin: "",
      profMax: "",
      uso: ""
    })),
    distCuarto: "",
    desborde: "",
    largoInfinity: "",
    profCortina: "",
    largoCanal: "",
    tasaRotacion: "",
    uso: "",
    usarBombaInfinity: null
  });

  const actualizarDatos = (patch) => {
    const nuevos = { ...datos, ...patch };

    setDatos(nuevos);

    setDatosPorSistema((mapa) => ({
      ...mapa,
      [tipoSeleccionado]: nuevos
    }));
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
    profCortina: "Altura de la cortina hidráulica, recomendado 5mm",
    largoCanal: "Longitud del canal de desborde",
    usarBombaInfinity: "Define si el borde infinity contará con una motobomba dedicada"
  };

  const descripcionesDesborde = {
  "desborde-infinity":
    "Sistema de rebose continuo por borde infinito, requiere control preciso de nivel y retorno dedicado",
  "desborde-canal":
    "Sistema de desborde perimetral mediante canal recolector con retorno balanceado",
  "desborde-ambos":
    "Combinación de borde infinity y canal de desborde en un mismo sistema hidráulico",
  "desborde-ninguno":
    "Sistema sin desborde, el nivel se controla únicamente por skimmers o tomas directas"
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
  // 🔹 Sistemas simples
  alberca: {
    img: "./img/alberca.jpg",
    cuerpos: 1,
    desborde: true,
    nombre: "Alberca"
  },
  jacuzzi: {
    img: "./img/jacuzzi.jpg",
    cuerpos: 1,
    desborde: true,
    nombre: "Jacuzzi"
  },
  chapoteadero: {
    img: "./img/chapoteadero.jpg",
    cuerpos: 1,
    desborde: true,
    nombre: "Chapoteadero"
  },
  espejoAgua: {
    img: "./img/espejo.jpg",
    cuerpos: 1,
    desborde: true,
    nombre: "Espejo de agua"
  },

  // 🔹 Combinados (1 cuerpo hidráulico)
  albercaJacuzzi1: {
    img: "./img/alberca+jacuzzi1C.jpg",
    cuerpos: 2,
    desborde: true,
    nombre: "Alberca + Jacuzzi (cuerpos de agua combinados)"
  },
  albercaChapo1: {
    img: "./img/alberca+chapoteadero1C.jpg",
    cuerpos: 2,
    desborde: true,
    nombre: "Alberca + Chapoteadero (cuerpos de agua combinados)"
  },

  // 🔹 NUEVOS – 3 cuerpos combinados
  albercaJacuzziJacuzzi: {
    img: "./img/alberca+2jacuzzis.jpg",
    cuerpos: 3,
    desborde: true,
    nombre: "Alberca + Jacuzzi + Jacuzzi (cuerpos de agua combinados)"
  },
  albercaChapoAsoleadero: {
    img: "./img/alberca+chapoteadero+asoleadero.jpg",
    cuerpos: 3,
    desborde: true,
    nombre: "Alberca + Chapoteadero + Asoleadero (cuerpos de agua combinados)"
  },
  albercaJacuzziChapo: {
    img: "./img/alberca+jacuzzi+chapoteadero.jpg",
    cuerpos: 3,
    desborde: true,
    nombre: "Alberca + Jacuzzi + Chapoteadero (cuerpos de agua combinados)"
  },
  albercaAsoleaderoAsoleadero: {
    img: "./img/alberca+2asoleaderos.jpg",
    cuerpos: 3,
    desborde: true,
    nombre: "Alberca + Asoleadero + Asoleadero (cuerpos de agua combinados)"
  }
};

  const descripcionesSistemas = {
    alberca:
      "Sistema hidráulico principal para nado y recreación, diseñado para operación continua y filtración estándar",
    jacuzzi:
      "Sistema de hidromasaje con alta recirculación, mayor temperatura y requerimientos específicos de bombeo",
    chapoteadero:
      "Sistema de baja profundidad destinado a usuarios infantiles, con tasas de rotación más estrictas",
    espejoAgua:
      "Sistema ornamental de baja turbulencia enfocado en efecto visual y control de nivel",
    albercaJacuzzi1:
      "Sistema combinado de alberca y jacuzzi en un solo cuerpo hidráulico con control compartido",
    albercaChapo1:
      "Sistema combinado de alberca y chapoteadero en un solo cuerpo hidráulico",
    jacuzziChapo1:
      "Sistema combinado de jacuzzi y chapoteadero en un solo cuerpo hidráulico",
    albercaJacuzzi2:
      "Sistema combinado de alberca y jacuzzi en un solo cuerpo hidráulico",
    albercaChapo2:
      "Sistema combinado de alberca y chapoteadero en un solo cuerpo hidráulico",
    jacuzziChapo2:
      "Sistema combinado de jacuzzi y chapoteadero en un solo cuerpo hidráulico",
    albercaJacuzziJacuzzi:
      "Sistema combinado con alberca principal y dos zonas de hidromasaje un solo cuerpo hidráulico",
    albercaChapoAsoleadero:
      "Sistema combinado para recreación familiar con área infantil y zona de descanso un solo cuerpo hidráulico",
    albercaJacuzziChapo:
      "Sistema mixto con alberca, hidromasaje y área infantil integrada un solo cuerpo hidráulico",
    albercaAsoleaderoAsoleadero:
      "Sistema con alberca principal y dos zonas someras tipo asoleadero un solo cuerpo hidráulico"
  };

  const config = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;

          useEffect(() => {
            if (!sistemaActivo || !sistemas[sistemaActivo]) return;

            setTipoSeleccionado(sistemaActivo);

            const existente = datosPorSistema[sistemaActivo];

            if (existente) {
              setDatos(existente);
            } else {
              const nuevo = crearDatosSistema(sistemas[sistemaActivo].cuerpos);
              setDatos(nuevo);

              setDatosPorSistema((prev) => ({
                ...prev,
                [sistemaActivo]: nuevo
              }));
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
                  className={
                    mostrarErrores && errores[`area-${i}`] ? "input-error" : ""
                  }
                  onMouseEnter={() => setHoveredField(`area-${i}`)}
                  onMouseLeave={() => setHoveredField(null)}
                />
                  <button
                  type="button"
                  className="btn-calculador-area"
                  onClick={() => setCalculadorArea({ cuerpoIndex: i })}
                >
                  Presiona aquí si necesitas ayuda para calcular el área
                </button>

                {cuerpo.areaCalculada && (
                  <span className="badge-ok">
                    ✔ Área calculada a través de la plataforma
                  </span>
                )}
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
                    className={
                      mostrarErrores && errores[`profMin-${i}`] ? "input-error" : ""
                    }
                  onMouseEnter={() => setHoveredField(`profMin-${i}`)}
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
                    className={
                    mostrarErrores && errores[`profMax-${i}`] ? "input-error" : ""
                  }
                  onMouseEnter={() => setHoveredField(`profMax-${i}`)}
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
                  className={
                    mostrarErrores && errores.uso ? "input-error" : ""
                  }
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
                  className={
                    mostrarErrores && errores.distCuarto ? "input-error" : ""
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

          <div
            className={
              `selector-radios ${
                mostrarErrores && errores.desborde ? "input-error" : ""
              }`
            }
          >              
          {["infinity", "canal", "ambos", "ninguno"].map((v) => (
                <label
                  key={v}
                  onMouseEnter={() => setHoveredField(`desborde-${v}`)}
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
                <>
                  <div className="selector-grid">
                    <div className="campo">
                      <label>Largo infinity (m)</label>
                      <input
                        type="number"
                        value={datos.largoInfinity}
                        onChange={(e) =>
                          actualizarDatos({ largoInfinity: e.target.value })
                        }
                        className={
                          mostrarErrores && errores.largoInfinity ? "input-error" : ""
                        }
                        onMouseEnter={() => setHoveredField("largoInfinity")}
                        onMouseLeave={() => setHoveredField(null)}
                      />
                    </div>

                    <div className="campo">
                      <label>Prof. cortina (mm)</label>
                      <input
                        type="number"
                        value={datos.profCortina}
                        onChange={(e) =>
                          actualizarDatos({ profCortina: e.target.value })
                        }
                        className={
                          mostrarErrores && errores.profCortina ? "input-error" : ""
                        }
                        onMouseEnter={() => setHoveredField("profCortina")}
                        onMouseLeave={() => setHoveredField(null)}
                      />
                    </div>
                  </div>

                  {/* 🔹 PREGUNTA DE BOMBA INDEPENDIENTE */}
                  <div className="selector-grupo">
                    <div className="selector-subtitulo">
                      Motobomba para sistema infinity
                    </div>

                    <div
                      className={`selector-radios ${
                        mostrarErrores && errores.usarBombaInfinity ? "input-error" : ""
                      }`}
                      onMouseEnter={() => setHoveredField("usarBombaInfinity")}
                      onMouseLeave={() => setHoveredField(null)}
                    >
                      <label>
                        <input
                          type="radio"
                          checked={datos.usarBombaInfinity === "si"}
                          onChange={() =>
                            actualizarDatos({ usarBombaInfinity: "si" })
                          }
                        />
                        Sí, bomba independiente
                      </label>

                      <label>
                        <input
                          type="radio"
                          checked={datos.usarBombaInfinity === "no"}
                          onChange={() =>
                            actualizarDatos({ usarBombaInfinity: "no" })
                          }
                        />
                        No, comparte bomba
                      </label>
                    </div>
                  </div>
                </>
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
                    className={
                      mostrarErrores && errores.largoCanal ? "input-error" : ""
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
      
  
   const sistemaCompleto = () => {
      if (!datos) return false;

      // 1️⃣ validar cuerpos
      const cuerposOk = datos.cuerpos.every(
        (c) =>
          c.area !== "" &&
          c.profMin !== "" &&
          c.profMax !== ""
      );

      if (!cuerposOk) return false;

      // 2️⃣ datos generales
      if (
        !datos.uso ||
        !datos.tasaRotacion ||
        datos.distCuarto === ""
      ) {
        return false;
      }

      // 3️⃣ desborde
      if (!datos.desborde) return false;

      if (datos.desborde === "infinity" || datos.desborde === "ambos") {
        if (
          datos.largoInfinity === "" ||
          datos.profCortina === "" ||
          !datos.usarBombaInfinity
        ) {
          return false;
        }
      }

      if (datos.desborde === "canal" || datos.desborde === "ambos") {
        if (datos.largoCanal === "") {
          return false;
        }
      }

      return true;
    };

      const obtenerErrores = () => {
        if (!datos) return {};

        const errores = {};

        // 🔹 Cuerpos
        datos.cuerpos.forEach((c, i) => {
          if (!c.area) errores[`area-${i}`] = "Área requerida";
          if (!c.profMin) errores[`profMin-${i}`] = "Profundidad mínima requerida";
          if (!c.profMax) errores[`profMax-${i}`] = "Profundidad máxima requerida";
        });

        // 🔹 Generales
        if (!datos.uso) errores.uso = "Selecciona el uso";
        if (!datos.tasaRotacion) errores.tasaRotacion = "Selecciona tasa de rotación";
        if (datos.distCuarto === "") errores.distCuarto = "Ingresa la distancia";

        // 🔹 Desborde (NO seleccionado)
        if (!datos.desborde) {
          errores.desborde = "Selecciona un tipo de desborde";
        }

        // 🔹 Desborde
        if (datos.desborde === "infinity" || datos.desborde === "ambos") {

          if (!datos.largoInfinity) {
            errores.largoInfinity = "Largo infinity requerido";
          }

          if (!datos.profCortina) {
            errores.profCortina = "Profundidad de cortina requerida";
          }

          if (!datos.usarBombaInfinity) {
            errores.usarBombaInfinity =
              "Selecciona si el infinity usa bomba independiente";
          }
        }

        if (datos.desborde === "canal" || datos.desborde === "ambos") {
          if (!datos.largoCanal) errores.largoCanal = "Largo de canal requerido";
        }

        return errores;
      };

const errores = obtenerErrores();

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
                  setSistemaActivo(null); // 🔑 CLAVE
                  setDatos(null);
                  setAnimandoSalida(false);
                }, 220);
              }}
            >
              ← Volver a Dimensiones
            </button>

            <div className="aviso-wrapper">
              <button
                className={`btn-primario ${mostrarAviso ? "error" : ""}`}
                onClick={() => {
                  if (Object.keys(errores).length > 0) {
                    setMostrarErrores(true);
                    setMostrarAviso(true);

                    setTimeout(() => setMostrarAviso(false), 2500);
                    return;
                  }
                  cambiarSeccionConAnimacion("calentamiento");
                }}
              >
                Ir a Calentamiento →
              </button>

              {mostrarAviso && (
                <div className="aviso-validacion">
                  Llena toda la información solicitada
                </div>
              )}
            </div>
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
                setSistemaActivo(key);
                  setDatosPorSistema((prev) => {

                  if (prev[key]) return prev;

                  return {
                    ...prev,
                    [key]: crearDatosSistema(s.cuerpos)
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
                <img
                  src={s.img}
                  alt={s.nombre}
                  className="img-zoomable"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔑 evita seleccionar sistema
                    setImagenZoom({
                      src: s.img,
                      titulo: s.nombre
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="selector-footer fijo">
          <span>
            {hoveredTipo
            ? `Configuración seleccionable`
            : `${Object.keys(sistemas).length} configuraciones disponibles`}
          </span>

            <span className="footer-highlight">
              {hoveredField ? (() => {

                // detectar campos de cuerpos: area-0, profMin-1, etc
                const match = hoveredField.match(/(area|profMin|profMax)-(\d+)/);

                if (match) {
                  const campo = match[1];
                  const cuerpo = Number(match[2]) + 1;

                  return `${descripcionesCampos[campo]} (Cuerpo ${cuerpo})`;
                }

                // descripciones específicas de desborde
                if (descripcionesDesborde[hoveredField]) {
                  return descripcionesDesborde[hoveredField];
                }

                // campos normales
                return descripcionesCampos[hoveredField];

              })()
              : hoveredTipo
                ? descripcionesSistemas[hoveredTipo] ?? sistemas[hoveredTipo].nombre
                : "Modo ingeniería"}
            </span>
        </div>
      </div>

      {calculadorArea && (
        <CalculadorAreaModal
          open={true}
          onClose={() => setCalculadorArea(null)}
          onConfirm={(area) => {
            const cuerpos = [...datos.cuerpos];
            cuerpos[calculadorArea.cuerpoIndex] = {
              ...cuerpos[calculadorArea.cuerpoIndex],
              area,
              areaCalculada: true
            };
            actualizarDatos({ cuerpos });
          }}
        />
      )}

        {imagenZoom && (
          <div
            className="visor-imagen"
            onClick={() => setImagenZoom(null)}
          >
            <div
              className="visor-contenido"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={imagenZoom.src} alt={imagenZoom.titulo} />
              <div className="visor-titulo">{imagenZoom.titulo}</div>

              <button
                className="visor-cerrar"
                onClick={() => setImagenZoom(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
    </div>
  );
});

export default Dimensiones;
