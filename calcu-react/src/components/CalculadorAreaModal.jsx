import { useRef, useState, useEffect } from "react";
import "../estilos.css";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const CalculadorAreaModal = ({ open, onClose, onConfirm }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [areaPreview, setAreaPreview] = useState(null);
  const [poligonoCerrado, setPoligonoCerrado] = useState(false);
  const SNAP_DISTANCE = 12; // píxeles
  const [imagen, setImagen] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [escala, setEscala] = useState(null);
  const [distanciaReal, setDistanciaReal] = useState("");
  const [modoEscala, setModoEscala] = useState(false);
  const [puntosEscala, setPuntosEscala] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

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

    useEffect(() => {
    if (!imgRef.current) return;
    dibujar();
    }, [puntos, puntosEscala, zoom]);

    useEffect(() => {
    if (!escala || puntos.length < 3) {
        setAreaPreview(null);
        return;
    }

    const areaPixeles = areaPoligono(puntos);
    const areaReal = areaPixeles * escala * escala;

    setAreaPreview(areaReal.toFixed(2));
    }, [puntos, escala]);

    const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;

    setZoom((z) =>
        Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta))
    );
    };

  const dibujar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
    ctx.clearRect(0, 0, canvas.width / zoom, canvas.height / zoom);
    ctx.drawImage(imgRef.current, 0, 0);

    // 🔹 polígono
    if (puntos.length > 0) {
      ctx.beginPath();
      puntos.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.strokeStyle = "#00bcd4";
      ctx.lineWidth = 2;

        if (puntos.length > 2) {
        ctx.lineTo(puntos[0].x, puntos[0].y);
        }

      ctx.stroke();

      puntos.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#00bcd4";
        ctx.fill();
      });
    }

    // 🔸 primer punto de escala (visible desde el primer clic)
    if (puntosEscala.length === 1) {
    const p = puntosEscala[0];

    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5722";
    ctx.fill();

    // pequeño halo para que no se pierda
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,87,34,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    }

    if (puntosEscala.length === 2) {
    const [p1, p2] = puntosEscala;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "#ff5722";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // puntos grandes
    [p1, p2].forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ff5722";
        ctx.fill();
    });

    // texto de metros
    if (escala) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const metros = Math.sqrt(dx * dx + dy * dy) * escala;

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.fillStyle = "#ff5722";
        ctx.font = "14px sans-serif";
        ctx.fillText(`${metros.toFixed(2)} m`, midX + 6, midY - 6);
    }
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
    };

    const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);

    puntos.forEach((p, i) => {
        const dx = x - p.x;
        const dy = y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < 8) {
        setDragIndex(i);
        }
    });
    };

    const handleMouseMove = (e) => {
    if (dragIndex === null) return;

    const { x, y } = getMousePos(e);
    const nuevos = [...puntos];
    nuevos[dragIndex] = { x, y };
    setPuntos(nuevos);
    };

    const handleMouseUp = () => {
    setDragIndex(null);
    };

    const handleClick = (e) => {
    const { x, y } = getMousePos(e);

    if (modoEscala) {
        if (puntosEscala.length < 2) {
        setPuntosEscala([...puntosEscala, { x, y }]);
        }
        return;
    }

    if (poligonoCerrado) return;

    if (puntos.length > 2) {
        const p0 = puntos[0];
        const dx = x - p0.x;
        const dy = y - p0.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < SNAP_DISTANCE) {
        setPoligonoCerrado(true);
        return;
        }
    }

    setPuntos([...puntos, { x, y }]);
    };

  const calcularEscala = () => {
    if (puntosEscala.length !== 2 || !distanciaReal) return;

    const dx = puntosEscala[0].x - puntosEscala[1].x;
    const dy = puntosEscala[0].y - puntosEscala[1].y;
    const distanciaPixeles = Math.sqrt(dx * dx + dy * dy);

    setEscala(distanciaReal / distanciaPixeles);
    setModoEscala(false);
  };

  const areaPoligono = (pts) => {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    return Math.abs(area / 2);
  };

  const confirmarArea = () => {
    if (!escala || puntos.length < 3) return;

    const areaPixeles = areaPoligono(puntos);
    const areaReal = areaPixeles * escala * escala;

    onConfirm(Number(areaReal.toFixed(2)));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-area">

        <div className="modal-header">
                      <button onClick={onClose}>✕</button>
          <h3>Sube tu archivo en formato imagen o pdf</h3>
        </div>

        {!imagen && (
        <input
        type="file"
        accept="image/*,application/pdf"
        onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 🔹 IMAGEN
            if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setImagen(reader.result);
            reader.readAsDataURL(file);
            return;
            }

            // 🔹 PDF
            if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(1);

            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: ctx,
                viewport
            }).promise;

            // 👉 Convertimos el PDF a imagen
            setImagen(canvas.toDataURL());
            }
        }}
        />

        )}

        {imagen && (
          <>
            <canvas
            ref={canvasRef}
            className="canvas-area"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            />

            {areaPreview && (
            <div className="area-preview">
                Área aproximada: <strong>{areaPreview} m²</strong>
            </div>
            )}

            <div className="tools">
              <button onClick={() => setPuntos([])}>Limpiar contorno</button>
              <button onClick={() => {
                setModoEscala(true);
                setPuntosEscala([]);
              }}>
                Definir escala
              </button>
            </div>

            {modoEscala && (
              <div className="escala-box">
                <p>Selecciona dos puntos y define la distancia real</p>
                <input
                  type="number"
                  placeholder="Distancia en metros"
                  value={distanciaReal}
                  onChange={(e) => setDistanciaReal(e.target.value)}
                />
                <button onClick={calcularEscala}>
                  Confirmar escala
                </button>
              </div>
            )}

            {escala && (
              <button
                className="btn-confirmar-area"
                onClick={confirmarArea}
              >
                Usar esta área
              </button>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default CalculadorAreaModal;
