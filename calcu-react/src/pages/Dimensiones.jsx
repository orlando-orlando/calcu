import { useState, useEffect } from "react";
import "../estilos.css";

export default function Dimensiones() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);

  // Configuración base de sistemas
  const sistemas = {
    alberca: { img: "./img/alberca.jpg", cuerpos: 1, desborde: true, nombre: "Alberca" },
    jacuzzi: { img: "./img/jacuzzi.jpg", cuerpos: 1, desborde: true, nombre: "Jacuzzi" },
    chapoteadero: {
      img: "https://cdn.pixabay.com/photo/2017/08/06/22/01/kids-2594035_1280.jpg",
      cuerpos: 1,
      desborde: true,
      nombre: "Chapoteadero",
    },
    espejoAgua: {
      img: "https://cdn.pixabay.com/photo/2017/08/06/22/01/kids-2594035_1280.jpg",
      cuerpos: 1,
      desborde: true,
      nombre: "Espejo de agua",
    },
    albercaJacuzzi1: {
      img: "./img/alberca+jacuzzi1C.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Alberca + Jacuzzi (1 cuerpo)",
    },
    albercaChapo1: {
      img: "./img/alberca+chapoteadero1C.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Alberca + Chapoteadero (1 cuerpo)",
    },
    jacuzziChapo1: {
      img: "https://cdn.pixabay.com/photo/2017/03/09/21/15/jacuzzi-2138446_1280.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Jacuzzi + Chapoteadero (1 cuerpo)",
    },
    albercaJacuzzi2: {
      img: "https://cdn.pixabay.com/photo/2017/01/20/00/30/pool-1996826_1280.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Alberca + Jacuzzi (2 cuerpos)",
    },
    albercaChapo2: {
      img: "https://cdn.pixabay.com/photo/2017/08/30/06/08/pool-2691424_1280.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Alberca + Chapoteadero (2 cuerpos)",
    },
    jacuzziChapo2: {
      img: "https://cdn.pixabay.com/photo/2016/06/06/16/40/hot-tub-1436680_1280.jpg",
      cuerpos: 2,
      desborde: true,
      nombre: "Jacuzzi + Chapoteadero (2 cuerpos)",
    },
  };

  const handleSeleccion = (tipo) => {
    setTipoSeleccionado(tipo);
    setMostrarPanel(true);
  };

  const config = tipoSeleccionado ? sistemas[tipoSeleccionado] : null;

  return (
    <div className="form-section" style={{ fontFamily: "inherit" }}>
      {!mostrarPanel ? (
        <>
          <div className="tipo-sistema-container full-width">
            <div className="titulo-seccion">Selecciona el tipo de sistema</div>

            <div className="opciones-sistema">
              {Object.entries(sistemas).map(([key, s]) => (
                <label className="opcion-sistema" key={key}>
                  <input
                    type="radio"
                    name="tipoSistema"
                    value={key}
                    onChange={() => handleSeleccion(key)}
                  />
                  <img src={s.img} alt={s.nombre} />
                  <span>{s.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div id="opcionesFooter" className="opciones-footer">
            <div className="opciones-preview">
              <img className="opciones-preview-img" src="" alt="Preview sistema" />
              <div className="opciones-meta">
                <div className="titulo">Selecciona un tipo</div>
                <div className="desc">
                  Pasa el cursor o haz clic en una opción para ver más.
                </div>
                <div className="stats"></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        config && (
          <div className="form-section animacion-aparecer">
            <button
              className="btn-volver"
              onClick={() => {
                setMostrarPanel(false);
                setTipoSeleccionado(null);
              }}
            >
              ← Volver a tipos de sistema
            </button>

            <h2 className="titulo-sistema-activo">{config.nombre}</h2>

            <div className="sistema-contenido">
              {/* Columna izquierda */}
              <div className="columna-izquierda">
                {/* Bloques de dimensiones */}
                {[...Array(config.cuerpos)].map((_, i) => (
                  <div className="tarjeta-bdc tarjeta-calentamiento" key={i}>
                    <label className="label-calentamiento">
                      Dimensiones físicas {config.cuerpos > 1 ? `(Cuerpo ${i + 1})` : ""}
                    </label>
                    <div className="form-group">
                      <label>Área (m²):</label>
                      <input type="number" step="0.01" className="input-azul" />
                    </div>
                    <div className="form-group inline fila-bdc">
                      <div className="campo-bdc">
                        <label>Profundidad mínima (m):</label>
                        <input type="number" step="0.01" className="input-azul" />
                      </div>
                      <div className="campo-bdc">
                        <label>Profundidad máxima (m):</label>
                        <input type="number" step="0.01" className="input-azul" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Uso y rotación */}
                <div className="tarjeta-bdc tarjeta-calentamiento">
                  <div className="form-group inline fila-bdc">
                    <div className="campo-bdc">
                      <label>Uso del cuerpo de agua:</label>
                      <select className="input-azul">
                        <option value="">-- Selecciona uso --</option>
                        <option value="residencial">Residencial</option>
                        <option value="publica">Pública</option>
                        <option value="competencia">Competencia</option>
                        <option value="parque">Parque acuático</option>
                      </select>
                    </div>
                    <div className="campo-bdc" style={{ marginLeft: "16px" }}>
                      <label>Tasa de rotación (h):</label>
                      <select className="input-azul">
                        <option value="">-- Selecciona --</option>
                        {[0.5, 1, 4, 6, 8, 12, 18, 24].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
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
                      />
                    </div>
                  </div>
                </div>

                {/* Tipo de desborde */}
                {config.desborde && (
                  <div className="tarjeta-bdc tarjeta-calentamiento">
                    <label className="label-calentamiento">Tipo de desborde:</label>
                    <div className="checkbox-row">
                      <label>
                        <input type="radio" name="desborde" value="infinity" /> Infinity
                      </label>
                      <label>
                        <input type="radio" name="desborde" value="canal" /> Canal perimetral
                      </label>
                      <label>
                        <input type="radio" name="desborde" value="ambos" /> Ambos
                      </label>
                      <label>
                        <input type="radio" name="desborde" value="ninguno" /> Ninguno
                      </label>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 20 }}>
                  <button className="btn-principal">Ir a calentamiento →</button>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="columna-derecha">
                <div className="tarjeta-bdc tarjeta-imagen">
                  <img
                    src={config.img}
                    alt={config.nombre}
                    className="imagen-sistema-activo"
                  />
                  <p className="texto-imagen">Vista del sistema seleccionado</p>
                </div>

                <div id="ayudaContextual" className="ayuda-contextual">
                  <div className="ayuda-titulo">Descripción del campo</div>
                  <div className="ayuda-texto">
                    Pasa el cursor sobre un campo para ver su descripción.
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
