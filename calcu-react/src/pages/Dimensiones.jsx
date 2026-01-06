import { useState, useImperativeHandle, forwardRef } from "react";
import "../estilos.css";

const Dimensiones = forwardRef(({ setSeccion }, ref) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [hoveredTipo, setHoveredTipo] = useState(null);
  const [hoveredField, setHoveredField] = useState(null);

  const [datos, setDatos] = useState({
    area: "",
    profMin: "",
    profMax: "",
    distCuarto: "",
    desborde: "",
    largoInfinity: "",
    profCortina: "",
    largoCanal: "",
    tasaRotacion: "",
    uso: ""
  });

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

  const renderCamposSistema = () => {
    if (!config) return null;

    return (
      <div className="selector-bloque-inputs">
        {[...Array(config.cuerpos)].map((_, i) => (
          <div key={i} className="selector-grupo">
            <div className="selector-subtitulo">
              Dimensiones físicas {config.cuerpos > 1 && `(Cuerpo ${i + 1})`}
            </div>

            <div className="selector-grid">
              <div className="campo">
                <label>Área (m²)</label>
                <input
                  type="number"
                  value={datos.area}
                  onChange={(e) => setDatos({ ...datos, area: e.target.value })}
                  onMouseEnter={() => setHoveredField("area")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>

              <div className="campo">
                <label>Prof. mínima (m)</label>
                <input
                  type="number"
                  value={datos.profMin}
                  onChange={(e) => setDatos({ ...datos, profMin: e.target.value })}
                  onMouseEnter={() => setHoveredField("profMin")}
                  onMouseLeave={() => setHoveredField(null)}
                />
              </div>

              <div className="campo">
                <label>Prof. máxima (m)</label>
                <input
                  type="number"
                  value={datos.profMax}
                  onChange={(e) => setDatos({ ...datos, profMax: e.target.value })}
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
                  setDatos((prev) => ({
                    ...prev,
                    uso,
                    tasaRotacion: tasasPorUso[uso] ?? prev.tasaRotacion
                  }));
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
                onChange={(e) => setDatos({ ...datos, tasaRotacion: e.target.value })}
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
                onChange={(e) => setDatos({ ...datos, distCuarto: e.target.value })}
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
                    onChange={() => setDatos({ ...datos, desborde: v })}
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
                    onChange={(e) => setDatos({ ...datos, largoInfinity: e.target.value })}
                    onMouseEnter={() => setHoveredField("largoInfinity")}
                    onMouseLeave={() => setHoveredField(null)}
                  />
                </div>

                <div className="campo">
                  <label>Prof. cortina (m)</label>
                  <input
                    type="number"
                    value={datos.profCortina}
                    onChange={(e) => setDatos({ ...datos, profCortina: e.target.value })}
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
                  onChange={(e) => setDatos({ ...datos, largoCanal: e.target.value })}
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

        {tipoSeleccionado && renderCamposSistema()}

        <div className="lista-sistemas">
          {(tipoSeleccionado
            ? [[tipoSeleccionado, sistemas[tipoSeleccionado]]]
            : Object.entries(sistemas)
          ).map(([key, s]) => (
            <div
              key={key}
              className={`fila-sistema ${tipoSeleccionado === key ? "activo" : ""}`}
              onClick={() => setTipoSeleccionado(key)}
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
