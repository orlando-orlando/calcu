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
  
  // 🔥 NUEVO: Flag para prevenir click después de zoom
  const justZoomedRef = useRef(false);

  /* =====================
     Animación entrada/salida
     ===================== */
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  /* =====================
     ESC para cerrar
     ===================== */
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
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
     DIBUJO
     ===================== */
  const dibujar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 🔥 RESET TOTAL
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🔥 APLICAR TRANSFORM UNICO
    ctx.setTransform(
      zoom,
      0,
      0,
      zoom,
      pan.x,
      pan.y
    );

    ctx.drawImage(imgRef.current, 0, 0);

    /* ===== POLÍGONO ===== */
    if (puntos.length > 0) {
      ctx.beginPath();
      puntos.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      if (puntos.length > 2) ctx.closePath();

      ctx.strokeStyle = "#00bcd4";
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();

      puntos.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 / zoom, 0, Math.PI * 2);
        ctx.fillStyle = "#00bcd4";
        ctx.fill();
      });
    }

    /* ===== ESCALA ===== */
    if (puntosEscala.length > 0) {
      ctx.save();

      ctx.strokeStyle = "#ff9800";
      ctx.fillStyle = "#ff9800";
      ctx.lineWidth = 2 / zoom;

      // Línea si hay 2 puntos
      if (puntosEscala.length === 2) {
        ctx.beginPath();
        ctx.moveTo(puntosEscala[0].x, puntosEscala[0].y);
        ctx.lineTo(puntosEscala[1].x, puntosEscala[1].y);
        ctx.stroke();
      }

      // Puntos
      puntosEscala.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 / zoom, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }

    /* ===== RECTÁNGULO ZOOM ===== */
    if (modoZoom && zoomInicio && zoomRect) {
      ctx.save();
      ctx.strokeStyle = "rgba(0,188,212,.9)";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1 / zoom;

      ctx.strokeRect(
        zoomInicio.x,
        zoomInicio.y,
        zoomRect.x - zoomInicio.x,
        zoomRect.y - zoomInicio.y
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
    for (let i = 0; i < puntos.length; i++) {
      if (Math.hypot(x - puntos[i].x, y - puntos[i].y) < 8 / zoom) {
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

    // 🔥 NUEVO: Si estamos en modo zoom y completamos el rectángulo
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

      // 🔥 CLAVE: Marcar que acabamos de hacer zoom para prevenir el click
      justZoomedRef.current = true;
      
      // Resetear el flag después de un pequeño delay
      setTimeout(() => {
        justZoomedRef.current = false;
      }, 50);
    }

    setModoZoom(false);
    setZoomInicio(null);
    setZoomRect(null);
  };

  const handleClick = (e) => {
    // 🔥 NUEVO: Prevenir click si acabamos de hacer zoom
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
      if (Math.hypot(x - p0.x, y - p0.y) < SNAP_DISTANCE / zoom) {
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
    
    // Fórmula de Shoelace (más precisa)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    
    // Valor absoluto y dividir entre 2
    return Math.abs(area) / 2;
  };

  const calcularEscala = () => {
    if (puntosEscala.length !== 2 || !distanciaReal) return;

    const dx = puntosEscala[1].x - puntosEscala[0].x;
    const dy = puntosEscala[1].y - puntosEscala[0].y;
    const pix = Math.sqrt(dx * dx + dy * dy);

    // Escala: metros por píxel
    const escalaCalculada = parseFloat(distanciaReal) / pix;
    
    setEscala(escalaCalculada);
    setModoEscala(false);
  };

  const confirmarArea = () => {
    if (!escala || puntos.length < 3) return;
    
    const areaPix = areaPoligono(puntos);
    const areaReal = areaPix * escala * escala;
    
    // Redondear a 2 decimales de forma más precisa
    const areaRedondeada = Math.round(areaReal * 100) / 100;
    
    onConfirm(areaRedondeada);
    onClose();
  };

  /* =====================
     JSX
     ===================== */
  return (
    <div
      className={`modal-overlay-area ${open ? "show" : "hide"}`}
      onClick={onClose}
    >
      <div
        className={`modal-area-calc ${open ? "show" : "hide"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-area">
          <div className="modal-titulo-grupo">
            <h3>📐 Calculador de área</h3>
            <p className="modal-subtitulo">Sube tu plano en PDF o imagen</p>
          </div>
          <button className="btn-close-area" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content-area">
          {!imagen && (
            <div className="upload-zone">
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = () => setImagen(reader.result);
                    reader.readAsDataURL(file);
                  }

                  if (file.type === "application/pdf") {
                    const buffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
                    const page = await pdf.getPage(1);

                    const containerWidth = 1400; // o el ancho real de tu modal
                    const unscaledViewport = page.getViewport({ scale: 1 });

                    const scale = containerWidth / unscaledViewport.width;

                    const viewport = page.getViewport({ scale });
                    const c = document.createElement("canvas");
                    const ctx = c.getContext("2d");

                    c.width = viewport.width;
                    c.height = viewport.height;

                    await page.render({ canvasContext: ctx, viewport }).promise;
                    setImagen(c.toDataURL());
                  }
                }}
              />
              <label htmlFor="file-upload" className="upload-label">
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  <span className="upload-titulo">Arrastra tu archivo aquí</span>
                  <span className="upload-desc">o haz clic para seleccionar</span>
                </div>
                <div className="upload-formatos">PDF, PNG, JPG (máx. 10MB)</div>
              </label>
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

              {/* Instrucciones */}
              <div className="instrucciones-area">
                <h4>📋 Cómo usar:</h4>
                <ul>
                  <li><strong>Definir escala:</strong> Marca 2 puntos sobre una distancia conocida e ingresa la medida real</li>
                  <li><strong>Dibujar contorno:</strong> Haz clic en cada vértice. Cierra en el primer punto</li>
                  <li><strong>Zoom (Z):</strong> Presiona Z y arrastra un rectángulo</li>
                  <li><strong>Resetear vista (Z+A):</strong> Vuelve a la vista original</li>
                  <li><strong>Mover plano:</strong> Mantén Espacio + arrastra</li>
                </ul>
              </div>

              <div className="tools-area">
                <button className="btn-tool-secondary" onClick={() => setPuntos([])}>
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
              </div>

              {modoEscala && (
                <div className="escala-box-dark">
                  <span className="escala-label">Distancia real en metros:</span>
                  <input
                    type="number"
                    placeholder="Ej: 10"
                    value={distanciaReal}
                    onChange={(e) => setDistanciaReal(e.target.value)}
                    className="input-escala"
                  />
                  <button className="btn-confirmar-escala" onClick={calcularEscala}>
                    ✓ Confirmar
                  </button>
                </div>
              )}

              {escala && (
                <button className="btn-confirmar-area-dark" onClick={confirmarArea}>
                  ✓ Usar esta área
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculadorAreaModal;