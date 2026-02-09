import { useRef, useState, useEffect } from "react";
import "../estilos.css";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const CalculadorAreaModal = ({ open, onClose, onConfirm }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [visible, setVisible] = useState(open);
  const [imagen, setImagen] = useState(null);

  const [cerrando, setCerrando] = useState(false);

  const [puntos, setPuntos] = useState([]);
  const [poligonoCerrado, setPoligonoCerrado] = useState(false);

  const [modoEscala, setModoEscala] = useState(false);
  const [puntosEscala, setPuntosEscala] = useState([]);
  const [distanciaReal, setDistanciaReal] = useState("");
  const [escala, setEscala] = useState(null);

  const [areaPreview, setAreaPreview] = useState(null);

  const [dragIndex, setDragIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  const SNAP_DISTANCE = 12;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

  const [modoZoom, setModoZoom] = useState(false);
  const [zoomInicio, setZoomInicio] = useState(null);
  const [zoomRect, setZoomRect] = useState(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const mouseDownRef = useRef(false);
  const spaceDownRef = useRef(false);
  
  const justZoomedRef = useRef(false);

  const [dragActivo, setDragActivo] = useState(false);

  const [cargando, setCargando] = useState(false);

  /* =====================
     Animación entrada/salida
     ===================== */
  useEffect(() => {
    if (open) {
      setVisible(true);
      setCerrando(false);
    }
  }, [open]);

  /* =====================
     ESC para cerrar
     ===================== */
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
    if (e.key === "Escape") cerrarModal();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const resetVista = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setModoZoom(false);
    setZoomInicio(null);
    setZoomRect(null);
  };

  if (!visible) return null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
    };

    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeys = (e) => {
      if (e.key.toLowerCase() === "z" && !modoZoom) {
        setModoZoom(true);
        setZoomInicio(null);
        setZoomRect(null);
      }

      if (e.key.toLowerCase() === "a" && modoZoom) {
        resetVista();
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [open, modoZoom]);

  useEffect(() => {
    const down = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        spaceDownRef.current = true;
        canvasRef.current.style.cursor = "grab";
      }
    };

    const up = (e) => {
      if (e.code === "Space") {
        spaceDownRef.current = false;
        canvasRef.current.style.cursor = "crosshair";
      }
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  /* =====================
     Cargar imagen / PDF
     ===================== */
  useEffect(() => {
    if (!imagen) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imagen;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      imgRef.current = img;
      dibujar();
    };
  }, [imagen]);

  /* =====================
     Redibujar
     ===================== */
  useEffect(() => {
    if (!imgRef.current) return;
    dibujar();
  }, [puntos, puntosEscala, zoom, pan, modoZoom, zoomRect]);

  /* =====================
     Área en tiempo real
     ===================== */
  useEffect(() => {
    if (!escala || puntos.length < 3) {
      setAreaPreview(null);
      return;
    }

    const areaPix = areaPoligono(puntos);
    const areaReal = areaPix * escala * escala;
    setAreaPreview(areaReal.toFixed(2));
  }, [puntos, escala]);

  /* =====================
     Zoom
     ===================== */
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;

    setZoom((z) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta))
    );
  };

  /* =====================
     🔥 NUEVA FUNCIÓN: Convertir punto mundo a pantalla
     ===================== */
  const worldToScreen = (worldX, worldY) => {
    return {
      x: worldX * zoom + pan.x,
      y: worldY * zoom + pan.y
    };
  };

  /* =====================
     🔥 DIBUJO MEJORADO
     ===================== */
  const dibujar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // RESET TOTAL
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // APLICAR TRANSFORM para la imagen
    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);
    ctx.drawImage(imgRef.current, 0, 0);

    // 🔥 RESETEAR TRANSFORM para dibujar en coordenadas de pantalla
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    /* ===== POLÍGONO ===== */
    if (puntos.length > 0) {
      ctx.beginPath();
      puntos.forEach((p, i) => {
        const screen = worldToScreen(p.x, p.y);
        if (i === 0) ctx.moveTo(screen.x, screen.y);
        else ctx.lineTo(screen.x, screen.y);
      });
      if (puntos.length > 2) ctx.closePath();

      ctx.strokeStyle = "#00bcd4";
      ctx.lineWidth = 2; // 🔥 CONSTANTE en píxeles de pantalla
      ctx.stroke();

      // Puntos del polígono
      puntos.forEach((p) => {
        const screen = worldToScreen(p.x, p.y);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 5, 0, Math.PI * 2); // 🔥 CONSTANTE
        ctx.fillStyle = "#00bcd4";
        ctx.fill();
      });
    }

    /* ===== ESCALA ===== */
    if (puntosEscala.length > 0) {
      ctx.save();

      ctx.strokeStyle = "#ff9800";
      ctx.fillStyle = "#ff9800";
      ctx.lineWidth = 2; // 🔥 CONSTANTE

      // Línea si hay 2 puntos
      if (puntosEscala.length === 2) {
        const s0 = worldToScreen(puntosEscala[0].x, puntosEscala[0].y);
        const s1 = worldToScreen(puntosEscala[1].x, puntosEscala[1].y);
        
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }

      // Puntos de escala
      puntosEscala.forEach((p) => {
        const screen = worldToScreen(p.x, p.y);
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 6, 0, Math.PI * 2); // 🔥 CONSTANTE
        ctx.fill();
      });

      ctx.restore();
    }

    /* ===== RECTÁNGULO ZOOM ===== */
    if (modoZoom && zoomInicio && zoomRect) {
      const s0 = worldToScreen(zoomInicio.x, zoomInicio.y);
      const s1 = worldToScreen(zoomRect.x, zoomRect.y);

      ctx.save();
      ctx.strokeStyle = "rgba(0,188,212,.9)";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1; // 🔥 CONSTANTE

      ctx.strokeRect(
        s0.x,
        s0.y,
        s1.x - s0.x,
        s1.y - s0.y
      );
      ctx.restore();
    }
  };

  /* =====================
     Mouse helpers
     ===================== */

  const getWorldPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const sx = (e.clientX - rect.left) * scaleX;
    const sy = (e.clientY - rect.top) * scaleY;

    return {
      x: (sx - pan.x) / zoom,
      y: (sy - pan.y) / zoom,
    };
  };

  const handleMouseDown = (e) => {
    if (spaceDownRef.current) {
      mouseDownRef.current = true;
      panStart.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
      return;
    }

    mouseDownRef.current = true;

    if (modoZoom) {
      const p = getWorldPos(e);
      setZoomInicio(p);
      setZoomRect(p);
      return;
    }

    const { x, y } = getWorldPos(e);
    
    // 🔥 DETECCIÓN DE PUNTOS mejorada - usa distancia en pantalla
    for (let i = 0; i < puntos.length; i++) {
      const screen = worldToScreen(puntos[i].x, puntos[i].y);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      
      if (Math.hypot(sx - screen.x, sy - screen.y) < 10) { // 🔥 10px en pantalla
        setDragIndex(i);
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!mouseDownRef.current) return;

    if (spaceDownRef.current) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
      return;
    }

    if (modoZoom && zoomInicio) {
      setZoomRect(getWorldPos(e));
      return;
    }

    if (dragIndex === null) return;

    const { x, y } = getWorldPos(e);
    const nuevos = [...puntos];
    nuevos[dragIndex] = { x, y };
    setPuntos(nuevos);
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
    setDragIndex(null);

    if (modoZoom && zoomInicio && zoomRect) {
      const w = Math.abs(zoomRect.x - zoomInicio.x);
      const h = Math.abs(zoomRect.y - zoomInicio.y);

      if (w > 20 && h > 20) {
        const scaleX = canvasRef.current.width / w;
        const scaleY = canvasRef.current.height / h;
        const nuevoZoom = Math.min(scaleX, scaleY, MAX_ZOOM);

        const cx = Math.min(zoomInicio.x, zoomRect.x);
        const cy = Math.min(zoomInicio.y, zoomRect.y);

        setPan({
          x: -cx * nuevoZoom,
          y: -cy * nuevoZoom,
        });
        setZoom(nuevoZoom);
      }

      justZoomedRef.current = true;
      
      setTimeout(() => {
        justZoomedRef.current = false;
      }, 50);
    }

    setModoZoom(false);
    setZoomInicio(null);
    setZoomRect(null);
  };

  const handleClick = (e) => {
    if (justZoomedRef.current) {
      return;
    }
    
    if (spaceDownRef.current || modoZoom) return;
    const { x, y } = getWorldPos(e);

    if (modoEscala) {
      if (puntosEscala.length < 2) {
        setPuntosEscala([...puntosEscala, { x, y }]);
      }
      return;
    }

    if (poligonoCerrado) return;

    if (puntos.length > 2) {
      const p0 = puntos[0];
      // 🔥 SNAP mejorado - usa distancia en pantalla
      const screen0 = worldToScreen(p0.x, p0.y);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      
      if (Math.hypot(sx - screen0.x, sy - screen0.y) < SNAP_DISTANCE) {
        setPoligonoCerrado(true);
        return;
      }
    }

    setPuntos([...puntos, { x, y }]);
  };

  /* =====================
     Cálculos
     ===================== */
  const areaPoligono = (pts) => {
    if (pts.length < 3) return 0;
    
    let area = 0;
    const n = pts.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    
    return Math.abs(area) / 2;
  };

  const calcularEscala = () => {
    if (puntosEscala.length !== 2 || !distanciaReal) return;

    const dx = puntosEscala[1].x - puntosEscala[0].x;
    const dy = puntosEscala[1].y - puntosEscala[0].y;
    const pix = Math.sqrt(dx * dx + dy * dy);

    const escalaCalculada = parseFloat(distanciaReal) / pix;
    
    setEscala(escalaCalculada);
    setModoEscala(false);
  };

  const confirmarArea = () => {
    if (!escala || puntos.length < 3) return;
    
    const areaPix = areaPoligono(puntos);
    const areaReal = areaPix * escala * escala;
    
    const areaRedondeada = Math.round(areaReal * 100) / 100;
    
    onConfirm(areaRedondeada);
    onClose();
  };

const procesarArchivo = async (file) => {
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert("El archivo supera el tamaño máximo de 10MB");
    return;
  }

  setCargando(true); // 🔥 INICIO CARGA

  try {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagen(reader.result);
        setCargando(false);
      };
      reader.readAsDataURL(file);
    }

    if (file.type === "application/pdf") {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);

      const containerWidth = 1400;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");

      c.width = viewport.width;
      c.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      setImagen(c.toDataURL());
      setCargando(false); // 🔥 FIN CARGA
    }
  } catch (err) {
    console.error(err);
    alert("Error al procesar el archivo");
    setCargando(false);
  }
};

    const cerrarModal = () => {
      setCerrando(true);

      setTimeout(() => {
        setVisible(false);
        onClose();
      }, 300); // debe coincidir con CSS
    };

  /* =====================
     JSX
     ===================== */
  return (
    <div
    className={`modal-overlay-area ${open && !cerrando ? "show" : "hide"}`}
    onClick={cerrarModal}
    >
      <div
        className={`modal-area-calc ${open && !cerrando ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-area">
          <div className="modal-titulo-grupo">
            <h3>📐 Calculador de área</h3>
            <p className="modal-subtitulo">Sube tu plano en PDF o imagen</p>
          </div>
          <button className="btn-close-area" onClick={cerrarModal}>✕</button>
        </div>

        <div className="modal-content-area">
          {!imagen && (
                <div
                  className={`upload-zone ${dragActivo ? "drag-activo" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActivo(true);
                  }}
                  onDragLeave={() => setDragActivo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActivo(false);
                    procesarArchivo(e.dataTransfer.files[0]);
                  }}
                >
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => procesarArchivo(e.target.files[0])}
              />
              <label htmlFor="file-upload" className="upload-label">
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  <span className="upload-titulo">Arrastra tu archivo aquí </span>
                  <span className="upload-desc">o haz clic para seleccionar</span>
                </div>
                <div className="upload-formatos">PDF, PNG, JPG (máx. 10MB)</div>
              </label>
            </div>
          )}

          {cargando && (
            <div className="loader-overlay">
              <div className="spinner"></div>
              <p>Procesando plano…</p>
            </div>
          )}
          {imagen && (
            <>
              <div className="canvas-container-area">
                <canvas
                  ref={canvasRef}
                  className={`canvas-area-dark ${modoZoom ? "zoom-mode" : ""}`}
                  onClick={handleClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onWheel={handleWheel}
                  style={{ cursor: spaceDownRef.current ? "grab" : "crosshair" }}
                />
              </div>

              {areaPreview && (
                <div className="area-preview-dark">
                  <span className="preview-label">Área calculada:</span>
                  <strong className="preview-valor">{areaPreview} m²</strong>
                </div>
              )}

              <div className="instrucciones-area">
                <h4>Instrucciones de uso</h4>

                <ol>

                  {/* ===== PASO ESCALA ===== */}
                  <li>
                    Define la <strong>escala real</strong> marcando dos puntos sobre una distancia conocida
                    e ingresando el valor correspondiente en metros.

                    <div className="acciones-instruccion">

                      <button
                        className="btn-tool-primary"
                        onClick={() => {
                          setModoEscala(true);
                          setPuntosEscala([]);
                          resetVista();
                        }}
                      >
                        📏 Definir escala
                      </button>

                      {modoEscala && (
                        <div className="escala-inline">
                          <input
                            type="number"
                            placeholder="Distancia (m)"
                            value={distanciaReal}
                            onChange={(e) => setDistanciaReal(e.target.value)}
                            className="input-escala"
                          />

                          <button
                            className="btn-confirmar-escala"
                            onClick={calcularEscala}
                          >
                            ✓ Confirmar
                          </button>
                        </div>
                      )}

                    </div>
                  </li>

                  {/* ===== PASO TRAZADO ===== */}
                  <li>
                    Una vez definida la escala, comienza a trazar el contorno de la superficie
                    dando clic sobre cada vértice del polígono.
                    El <strong>área se calculará automáticamente</strong>.

                    <div className="acciones-instruccion">
                      <button
                        className="btn-tool-secondary"
                        onClick={() => setPuntos([])}
                      >
                        🗑️ Limpiar contorno
                      </button>

                      <button
                        className="btn-tool-secondary"
                        onClick={() => {
                          if (puntos.length > 0) {
                            setPuntos(puntos.slice(0, -1));
                            setPoligonoCerrado(false);
                          }
                        }}
                        disabled={puntos.length === 0}
                      >
                        ↶ Deshacer punto
                      </button>
                    </div>
                  </li>

                  {/* ===== PASO CONFIRMAR ===== */}
                  <li>
                    Al finalizar el trazado, presiona el botón <strong>Usar área</strong> para confirmar.

                    {escala && (
                      <div className="acciones-instruccion">
                        <button
                          className="btn-confirmar-area-dark"
                          onClick={confirmarArea}
                        >
                          ✓ Usar esta área
                        </button>
                      </div>
                    )}
                  </li>

                </ol>

                {/* Navegación */}
                <div className="instrucciones-navegacion">
                  <strong>Navegación del plano</strong>
                  <ul>
                    <li>Scroll del mouse: zoom</li>
                    <li>Tecla Z: zoom por selección</li>
                    <li>Teclas Z + A: vista original</li>
                    <li>Space + clic: pan</li>
                  </ul>
                </div>
              </div> 
            </>
          )}
        </div> 
      </div> 
    </div> 
  );
};

export default CalculadorAreaModal;