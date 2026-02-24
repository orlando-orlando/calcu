import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import "../estilos.css";
import CalculadorAreaModal from "../components/CalculadorAreaModal";

const Dimensiones = forwardRef(({ setSeccion, sistemaActivo, setSistemaActivo, datosPorSistema, setDatosPorSistema }, ref) => {
  const [tipoSeleccionado, setTipoSeleccionado]   = useState(null);
  const [hoveredTipo, setHoveredTipo]             = useState(null);
  const [hoveredField, setHoveredField]           = useState(null);
  const [animandoSalida, setAnimandoSalida]       = useState(false);
  const [datos, setDatos]                         = useState(null);
  const [mostrarAviso, setMostrarAviso]           = useState(false);
  const [mostrarErrores, setMostrarErrores]       = useState(false);
  const [calculadorArea, setCalculadorArea]       = useState(null);
  const [imagenZoom, setImagenZoom]               = useState(null);

  /* ── Cerrar visor con ESC ─────────────────────────────────────── */
  useEffect(() => {
    const cerrarConEsc = (e) => { if (e.key === "Escape") setImagenZoom(null); };
    window.addEventListener("keydown", cerrarConEsc);
    return () => window.removeEventListener("keydown", cerrarConEsc);
  }, []);

  /* ── Catálogo de sistemas ─────────────────────────────────────── */
  const sistemas = {
    alberca:                     { img: "./img/alberca.jpg",                         cuerpos: 1, desborde: true, nombre: "Alberca" },
    jacuzzi:                     { img: "./img/jacuzzi.jpg",                         cuerpos: 1, desborde: true, nombre: "Jacuzzi" },
    chapoteadero:                { img: "./img/chapoteadero.jpg",                    cuerpos: 1, desborde: true, nombre: "Chapoteadero" },
    espejoAgua:                  { img: "./img/espejo.jpg",                          cuerpos: 1, desborde: true, nombre: "Espejo de agua" },
    albercaJacuzzi1:             { img: "./img/alberca+jacuzzi1C.jpg",               cuerpos: 2, desborde: true, nombre: "Alberca + Jacuzzi (cuerpos de agua combinados)" },
    albercaChapo1:               { img: "./img/alberca+chapoteadero1C.jpg",          cuerpos: 2, desborde: true, nombre: "Alberca + Chapoteadero (cuerpos de agua combinados)" },
    albercaJacuzziJacuzzi:       { img: "./img/alberca+2jacuzzis.jpg",               cuerpos: 3, desborde: true, nombre: "Alberca + Jacuzzi + Jacuzzi (cuerpos de agua combinados)" },
    albercaChapoAsoleadero:      { img: "./img/alberca+chapoteadero+asoleadero.jpg", cuerpos: 3, desborde: true, nombre: "Alberca + Chapoteadero + Asoleadero (cuerpos de agua combinados)" },
    albercaJacuzziChapo:         { img: "./img/alberca+jacuzzi+chapoteadero.jpg",    cuerpos: 3, desborde: true, nombre: "Alberca + Jacuzzi + Chapoteadero (cuerpos de agua combinados)" },
    albercaAsoleaderoAsoleadero: { img: "./img/alberca+2asoleaderos.jpg",            cuerpos: 3, desborde: true, nombre: "Alberca + Asoleadero + Asoleadero (cuerpos de agua combinados)" },
  };

  const tipoCuerposPorSistema = {
    alberca:                     ["alberca"],
    jacuzzi:                     ["jacuzzi"],
    chapoteadero:                ["chapoteadero"],
    espejoAgua:                  ["espejoAgua"],
    albercaJacuzzi1:             ["alberca", "jacuzzi"],
    albercaChapo1:               ["alberca", "chapoteadero"],
    albercaJacuzziJacuzzi:       ["alberca", "jacuzzi", "jacuzzi"],
    albercaChapoAsoleadero:      ["alberca", "chapoteadero", "asoleadero"],
    albercaJacuzziChapo:         ["alberca", "jacuzzi", "chapoteadero"],
    albercaAsoleaderoAsoleadero: ["alberca", "asoleadero", "asoleadero"],
  };

  const nombreTipoCuerpo = {
    alberca: "Alberca", jacuzzi: "Jacuzzi",
    chapoteadero: "Chapoteadero", asoleadero: "Asoleadero", espejoAgua: "Espejo de agua",
  };

  // Tasas como STRING — el <select> compara por igualdad de string
  const TASAS_GENERAL = ["4", "6", "8"];
  const TASAS_JACUZZI = ["0.5", "1"];

  // Tasa sugerida por uso — también STRING
  const tasaSugeridaPorUso = {
    residencial: "8",
    publica:     "6",
    competencia: "6",
    parque:      "4",
  };

  /* ── Estructura de datos ──────────────────────────────────────── */
  const crearDatosSistema = (numCuerpos, tipoCuerpos = []) => {
    const tieneJacuzzi = tipoCuerpos.includes("jacuzzi");
    const tieneGeneral = tipoCuerpos.some((t) => t !== "jacuzzi");
    return {
      cuerpos: Array.from({ length: numCuerpos }, (_, i) => ({
        area: "", profMin: "", profMax: "",
        tipoCuerpo: tipoCuerpos[i] ?? "alberca",
      })),
      usoGeneral:        tieneGeneral ? ""     : null,
      tasaGeneral:       tieneGeneral ? ""     : null,
      tasaJacuzzi:       tieneJacuzzi ? "0.5" : null,
      distCuarto: "", desborde: "",
      largoInfinity: "", profCortina: "", largoCanal: "",
      usarBombaInfinity: null,
    };
  };

  /* ── Helpers ──────────────────────────────────────────────────── */
  const hayJacuzzi = (d) => d?.tasaJacuzzi !== null && d?.tasaJacuzzi !== undefined;
  const hayGeneral = (d) => d?.usoGeneral  !== null && d?.usoGeneral  !== undefined;

  /*
   * actualizarDatos usa setState funcional para evitar closures stale.
   * Recibe el key del sistema activo como parámetro para que no dependa
   * de tipoSeleccionado del closure.
   */
  const actualizarDatos = useCallback((patch) => {
    setDatos((prev) => {
      const nuevos = { ...prev, ...patch };
      // Sincronizar con el mapa global usando el estado previo del mapa
      setDatosPorSistema((mapa) => ({
        ...mapa,
        [sistemaActivo]: nuevos,
      }));
      return nuevos;
    });
  }, [sistemaActivo, setDatosPorSistema]);

  /* ── Reacción automática: cuando cambia usoGeneral → actualizar tasaGeneral ── */
  useEffect(() => {
    if (!datos || !hayGeneral(datos)) return;
    // Solo pre-llenar si el uso tiene sugerencia definida
    const sugerida = tasaSugeridaPorUso[datos.usoGeneral];
    if (sugerida !== undefined) {
      // Solo actualizar si la tasa actual NO es una de las válidas ya elegidas
      // (para no pisar si el usuario la cambió manualmente después)
      setDatos((prev) => {
        if (!prev) return prev;
        // Si ya tiene una tasa válida manual, no sobreescribir
        if (prev.tasaGeneral !== "" && prev.tasaGeneral !== sugerida) return prev;
        const nuevos = { ...prev, tasaGeneral: sugerida };
        setDatosPorSistema((mapa) => ({ ...mapa, [sistemaActivo]: nuevos }));
        return nuevos;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos?.usoGeneral]);

  /* ── Textos tooltip ───────────────────────────────────────────── */
  const descripcionesCampos = {
    area:              "Área superficial del cuerpo de agua",
    profMin:           "Profundidad mínima operativa",
    profMax:           "Profundidad máxima operativa",
    usoGeneral:        "Tipo de uso hidráulico para los cuerpos no-jacuzzi del sistema",
    tasaGeneral:       "Tiempo (h) para renovar el volumen total de los cuerpos no-jacuzzi — 4, 6 u 8 h",
    tasaJacuzzi:       "Tiempo (h) para renovar el volumen del jacuzzi — 0.5 h o 1 h",
    distCuarto:        "Distancia entre el cuerpo de agua y el cuarto de máquinas",
    largoInfinity:     "Longitud total del borde infinity",
    profCortina:       "Altura de la cortina hidráulica, recomendado 5 mm",
    largoCanal:        "Longitud del canal de desborde",
    usarBombaInfinity: "Define si el borde infinity contará con una motobomba dedicada",
  };

  const descripcionesDesborde = {
    "desborde-infinity": "Sistema de rebose continuo por borde infinito, requiere control preciso de nivel y retorno dedicado",
    "desborde-canal":    "Sistema de desborde perimetral mediante canal recolector con retorno balanceado",
    "desborde-ambos":    "Combinación de borde infinity y canal de desborde en un mismo sistema hidráulico",
    "desborde-ninguno":  "Sistema sin desborde, el nivel se controla únicamente por skimmers o tomas directas",
  };

  const descripcionesSistemas = {
    alberca:                     "Sistema hidráulico principal para nado y recreación, diseñado para operación continua y filtración estándar",
    jacuzzi:                     "Sistema de hidromasaje con alta recirculación, mayor temperatura y requerimientos específicos de bombeo",
    chapoteadero:                "Sistema de baja profundidad destinado a usuarios infantiles, con tasas de rotación más estrictas",
    espejoAgua:                  "Sistema ornamental de baja turbulencia enfocado en efecto visual y control de nivel",
    albercaJacuzzi1:             "Sistema combinado de alberca y jacuzzi en un solo cuerpo hidráulico con control compartido",
    albercaChapo1:               "Sistema combinado de alberca y chapoteadero en un solo cuerpo hidráulico",
    albercaJacuzziJacuzzi:       "Sistema combinado con alberca principal y dos zonas de hidromasaje en un solo cuerpo hidráulico",
    albercaChapoAsoleadero:      "Sistema combinado para recreación familiar con área infantil y zona de descanso en un solo cuerpo hidráulico",
    albercaJacuzziChapo:         "Sistema mixto con alberca, hidromasaje y área infantil integrada en un solo cuerpo hidráulico",
    albercaAsoleaderoAsoleadero: "Sistema con alberca principal y dos zonas someras tipo asoleadero en un solo cuerpo hidráulico",
  };

  /* ── Efectos ──────────────────────────────────────────────────── */
  useImperativeHandle(ref, () => ({
    resetDimensiones() {
      setTipoSeleccionado(null); setSistemaActivo(null); setDatos(null);
    }
  }));

  useEffect(() => {
    if (!sistemaActivo || !sistemas[sistemaActivo]) return;
    setTipoSeleccionado(sistemaActivo);
    const existente = datosPorSistema[sistemaActivo];
    if (existente) {
      setDatos(existente);
    } else {
      const tipoCuerpos = tipoCuerposPorSistema[sistemaActivo] ?? [];
      const nuevo = crearDatosSistema(sistemas[sistemaActivo].cuerpos, tipoCuerpos);
      setDatos(nuevo);
      setDatosPorSistema((prev) => ({ ...prev, [sistemaActivo]: nuevo }));
    }
  }, [sistemaActivo]);

  const cambiarSeccionConAnimacion = (nuevaSeccion) => {
    setAnimandoSalida(true);
    setTimeout(() => { setAnimandoSalida(false); setSeccion(nuevaSeccion); }, 220);
  };

  /* ── Validación ───────────────────────────────────────────────── */
  const obtenerErrores = () => {
    if (!datos) return {};
    const err = {};

    datos.cuerpos.forEach((c, i) => {
      if (!c.area)    err[`area-${i}`]    = "Área requerida";
      if (!c.profMin) err[`profMin-${i}`] = "Profundidad mínima requerida";
      if (!c.profMax) err[`profMax-${i}`] = "Profundidad máxima requerida";
    });

    if (hayGeneral(datos)) {
      if (!datos.usoGeneral)  err.usoGeneral  = "Selecciona el uso hidráulico";
      if (!datos.tasaGeneral) err.tasaGeneral = "Selecciona la tasa de rotación";
    }

    if (hayJacuzzi(datos) && !datos.tasaJacuzzi) {
      err.tasaJacuzzi = "Selecciona la tasa de rotación del jacuzzi";
    }

    if (datos.distCuarto === "") err.distCuarto = "Ingresa la distancia";

    if (!datos.desborde) err.desborde = "Selecciona un tipo de desborde";
    if (datos.desborde === "infinity" || datos.desborde === "ambos") {
      if (!datos.largoInfinity)     err.largoInfinity     = "Largo infinity requerido";
      if (!datos.profCortina)       err.profCortina       = "Profundidad de cortina requerida";
      if (!datos.usarBombaInfinity) err.usarBombaInfinity = "Selecciona si el infinity usa bomba independiente";
    }
    if (datos.desborde === "canal" || datos.desborde === "ambos") {
      if (!datos.largoCanal) err.largoCanal = "Largo de canal requerido";
    }
    return err;
  };

  const config  = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;
  const errores = obtenerErrores();

  /* ── Render campos ────────────────────────────────────────────── */
  const renderCamposSistema = () => {
    if (!config || !datos) return null;

    const etiquetaGrupoGeneral = () => {
      const tipos = datos.cuerpos
        .filter((c) => c.tipoCuerpo !== "jacuzzi")
        .map((c) => nombreTipoCuerpo[c.tipoCuerpo] ?? c.tipoCuerpo);
      return [...new Set(tipos)].join(" + ");
    };

    return (
      <div className="selector-bloque-inputs">

        {/* ── Dimensiones por cuerpo ─────────────────────────── */}
        {datos.cuerpos.map((cuerpo, i) => {
          const etiquetaCuerpo = config.cuerpos > 1
            ? nombreTipoCuerpo[cuerpo.tipoCuerpo] ?? `Cuerpo ${i + 1}`
            : "Dimensiones físicas";

          return (
            <div key={i} className="selector-grupo">
              <div className="selector-subtitulo">{etiquetaCuerpo}</div>
              <div className="selector-grid">

                <div className="campo">
                  <label>Área (m²)</label>
                  <input
                    type="number"
                    value={cuerpo.area}
                    onChange={(e) => {
                      const cuerpos = [...datos.cuerpos];
                      cuerpos[i] = { ...cuerpos[i], area: e.target.value };
                      actualizarDatos({ cuerpos });
                    }}
                    className={mostrarErrores && errores[`area-${i}`] ? "input-error" : ""}
                    onMouseEnter={() => setHoveredField(`area-${i}`)}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                  <button type="button" className="btn-calculador-area"
                    onClick={() => setCalculadorArea({ cuerpoIndex: i })}>
                    Presiona aquí si necesitas ayuda para calcular el área
                  </button>
                  {cuerpo.areaCalculada && (
                    <span className="badge-ok">✔ Área calculada a través de la plataforma</span>
                  )}
                </div>

                <div className="campo">
                  <label>Prof. mínima (m)</label>
                  <input
                    type="number"
                    value={cuerpo.profMin}
                    onChange={(e) => {
                      const cuerpos = [...datos.cuerpos];
                      cuerpos[i] = { ...cuerpos[i], profMin: e.target.value };
                      actualizarDatos({ cuerpos });
                    }}
                    className={mostrarErrores && errores[`profMin-${i}`] ? "input-error" : ""}
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
                      cuerpos[i] = { ...cuerpos[i], profMax: e.target.value };
                      actualizarDatos({ cuerpos });
                    }}
                    className={mostrarErrores && errores[`profMax-${i}`] ? "input-error" : ""}
                    onMouseEnter={() => setHoveredField(`profMax-${i}`)}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                </div>

              </div>
            </div>
          );
        })}

        {/* ── Bloque uso GENERAL (no-jacuzzi) ────────────────── */}
        {hayGeneral(datos) && (
          <div className="selector-grupo">
            <div className="selector-subtitulo">
              Uso hidráulico
              {hayJacuzzi(datos) && (
                <span className="subtitulo-detalle"> — {etiquetaGrupoGeneral()}</span>
              )}
            </div>

            <div className="selector-grid">

              <div className="campo">
                <label>Uso</label>
                <select
                  value={datos.usoGeneral}
                  onChange={(e) => {
                    // Solo actualizar usoGeneral — el useEffect se encarga de tasaGeneral
                    actualizarDatos({ usoGeneral: e.target.value, tasaGeneral: tasaSugeridaPorUso[e.target.value] ?? "" });
                  }}
                  className={mostrarErrores && errores.usoGeneral ? "input-error" : ""}
                  onMouseEnter={() => setHoveredField("usoGeneral")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <option value="">Selecciona</option>
                  <option value="residencial">Residencial</option>
                  <option value="publica">Pública</option>
                  <option value="competencia">Competencia</option>
                  <option value="parque">Parque acuático</option>
                </select>
              </div>

              <div className="campo">
                <label>Tasa de rotación (h)</label>
                <select
                  value={datos.tasaGeneral ?? ""}
                  onChange={(e) => actualizarDatos({ tasaGeneral: e.target.value })}
                  className={mostrarErrores && errores.tasaGeneral ? "input-error" : ""}
                  onMouseEnter={() => setHoveredField("tasaGeneral")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <option value="">Selecciona</option>
                  {TASAS_GENERAL.map((v) => (
                    <option key={v} value={v}>{v} h</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        )}

        {/* ── Bloque uso JACUZZI ─────────────────────────────── */}
        {hayJacuzzi(datos) && (
          <div className="selector-grupo">
            <div className="selector-subtitulo">
              Uso hidráulico <span className="subtitulo-detalle">— Jacuzzi</span>
            </div>

            <div className="selector-grid">

              <div className="campo">
                <label>Uso</label>
                <select value="hidromasaje" disabled>
                  <option value="hidromasaje">Hidromasaje</option>
                </select>
                <span className="badge-ok">✔ Uso fijado como hidromasaje</span>
              </div>

              <div className="campo">
                <label>Tasa de rotación (h)</label>
                <select
                  value={datos.tasaJacuzzi ?? "0.5"}
                  onChange={(e) => actualizarDatos({ tasaJacuzzi: e.target.value })}
                  className={mostrarErrores && errores.tasaJacuzzi ? "input-error" : ""}
                  onMouseEnter={() => setHoveredField("tasaJacuzzi")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  {TASAS_JACUZZI.map((v) => (
                    <option key={v} value={v}>{v} h</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        )}

        {/* ── Instalación ────────────────────────────────────── */}
        <div className="selector-grupo">
          <div className="selector-subtitulo">Instalación</div>
          <div className="selector-grid">
            <div className="campo">
              <label>Distancia a cuarto (m)</label>
              <input
                type="number"
                value={datos.distCuarto}
                onChange={(e) => actualizarDatos({ distCuarto: e.target.value })}
                className={mostrarErrores && errores.distCuarto ? "input-error" : ""}
                onMouseEnter={() => setHoveredField("distCuarto")}
                onMouseLeave={() => setHoveredField(null)}
              />
            </div>
          </div>
        </div>

        {/* ── Desborde ───────────────────────────────────────── */}
        {config.desborde && (
          <div className="selector-grupo">
            <div className="selector-subtitulo">Tipo de desborde</div>

            <div className={`selector-radios ${mostrarErrores && errores.desborde ? "input-error" : ""}`}>
              {["infinity", "canal", "ambos", "ninguno"].map((v) => (
                <label key={v}
                  onMouseEnter={() => setHoveredField(`desborde-${v}`)}
                  onMouseLeave={() => setHoveredField(null)}>
                  <input type="radio" checked={datos.desborde === v}
                    onChange={() => actualizarDatos({ desborde: v })} />
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
                      onChange={(e) => actualizarDatos({ largoInfinity: e.target.value })}
                      className={mostrarErrores && errores.largoInfinity ? "input-error" : ""}
                      onMouseEnter={() => setHoveredField("largoInfinity")}
                      onMouseLeave={() => setHoveredField(null)}
                    />
                  </div>
                  <div className="campo">
                    <label>Prof. cortina (mm)</label>
                    <input
                      type="number"
                      value={datos.profCortina}
                      onChange={(e) => actualizarDatos({ profCortina: e.target.value })}
                      className={mostrarErrores && errores.profCortina ? "input-error" : ""}
                      onMouseEnter={() => setHoveredField("profCortina")}
                      onMouseLeave={() => setHoveredField(null)}
                    />
                  </div>
                </div>

                <div className="selector-grupo">
                  <div className="selector-subtitulo">Motobomba para sistema infinity</div>
                  <div
                    className={`selector-radios ${mostrarErrores && errores.usarBombaInfinity ? "input-error" : ""}`}
                    onMouseEnter={() => setHoveredField("usarBombaInfinity")}
                    onMouseLeave={() => setHoveredField(null)}
                  >
                    <label>
                      <input type="radio" checked={datos.usarBombaInfinity === "si"}
                        onChange={() => actualizarDatos({ usarBombaInfinity: "si" })} />
                      Sí, bomba independiente
                    </label>
                    <label>
                      <input type="radio" checked={datos.usarBombaInfinity === "no"}
                        onChange={() => actualizarDatos({ usarBombaInfinity: "no" })} />
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
                  onChange={(e) => actualizarDatos({ largoCanal: e.target.value })}
                  className={mostrarErrores && errores.largoCanal ? "input-error" : ""}
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

  /* ── Render principal ─────────────────────────────────────────── */
  return (
    <div className="form-section hero-wrapper">
      <div className="selector-tecnico modo-experto">

        <div className="selector-header">
          {!tipoSeleccionado ? (
            <>
              <div className="selector-titulo">Configuración del sistema</div>
              <div className="selector-subtitulo">Selecciona el tipo de cuerpo hidráulico</div>
            </>
          ) : (
            <>
              <div className="selector-titulo-sistema">{sistemas[tipoSeleccionado].nombre}</div>
              <div className="selector-subtitulo-tecnico">Parámetros técnicos del sistema</div>
            </>
          )}
        </div>

        {tipoSeleccionado && (
          <div className="selector-acciones">
            <button className="btn-secundario" onClick={() => {
              setAnimandoSalida(true);
              setTimeout(() => {
                setTipoSeleccionado(null); setSistemaActivo(null);
                setDatos(null); setAnimandoSalida(false);
              }, 220);
            }}>
              ← Volver a Dimensiones
            </button>

            <div className="aviso-wrapper">
              <button
                className={`btn-primario ${mostrarAviso ? "error" : ""}`}
                onClick={() => {
                  if (Object.keys(errores).length > 0) {
                    setMostrarErrores(true); setMostrarAviso(true);
                    setTimeout(() => setMostrarAviso(false), 2500);
                    return;
                  }
                  cambiarSeccionConAnimacion("calentamiento");
                }}
              >
                Ir a Calentamiento →
              </button>
              {mostrarAviso && (
                <div className="aviso-validacion">Llena toda la información solicitada</div>
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
            <div key={key}
              className={`fila-sistema ${tipoSeleccionado === key ? "activo" : ""}`}
              onClick={() => {
                setSistemaActivo(key);
                setDatosPorSistema((prev) => {
                  if (prev[key]) return prev;
                  const tipoCuerpos = tipoCuerposPorSistema[key] ?? [];
                  return { ...prev, [key]: crearDatosSistema(s.cuerpos, tipoCuerpos) };
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
                <img src={s.img} alt={s.nombre} className="img-zoomable"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagenZoom({ src: s.img, titulo: s.nombre });
                  }} />
              </div>
            </div>
          ))}
        </div>

        <div className="selector-footer fijo">
          <span>
            {hoveredTipo
              ? "Configuración seleccionable"
              : `${Object.keys(sistemas).length} configuraciones disponibles`}
          </span>
          <span className="footer-highlight">
            {hoveredField ? (() => {
              const matchCuerpo = hoveredField.match(/^(area|profMin|profMax)-(\d+)$/);
              if (matchCuerpo) {
                const campo = matchCuerpo[1];
                const idx   = Number(matchCuerpo[2]) + 1;
                return `${descripcionesCampos[campo]} (Cuerpo ${idx})`;
              }
              if (descripcionesDesborde[hoveredField]) return descripcionesDesborde[hoveredField];
              return descripcionesCampos[hoveredField] ?? hoveredField;
            })()
              : hoveredTipo
                ? descripcionesSistemas[hoveredTipo] ?? sistemas[hoveredTipo].nombre
                : "Modo ingeniería"}
          </span>
        </div>
      </div>

      {calculadorArea && (
        <CalculadorAreaModal open onClose={() => setCalculadorArea(null)}
          onConfirm={(area) => {
            const cuerpos = [...datos.cuerpos];
            cuerpos[calculadorArea.cuerpoIndex] = {
              ...cuerpos[calculadorArea.cuerpoIndex], area, areaCalculada: true,
            };
            actualizarDatos({ cuerpos });
          }} />
      )}

      {imagenZoom && (
        <div className="visor-imagen" onClick={() => setImagenZoom(null)}>
          <div className="visor-contenido" onClick={(e) => e.stopPropagation()}>
            <img src={imagenZoom.src} alt={imagenZoom.titulo} />
            <div className="visor-titulo">{imagenZoom.titulo}</div>
            <button className="visor-cerrar" onClick={() => setImagenZoom(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Dimensiones;