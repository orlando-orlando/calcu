import "../estilos.css";

export default function EquipoSelect({ titulo, onHover }) {
  return (
    <div
      className="equipo-card"
      onMouseEnter={onHover}
      onMouseLeave={() => onHover(null)}
    >
      <div className="equipo-header">
        <span className="equipo-dot" />
        <h5 className="equipo-titulo">{titulo}</h5>
      </div>

      <div className="equipo-grid">

        <div className="campo">
          <label>N° equipos</label>
          <select className="input-azul">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="campo">
          <label>Modo selección</label>
          <select className="input-azul">
            <option value="auto">Automático (sistema)</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div className="campo">
          <label>Capacidad</label>
          <select className="input-azul">
            <option value="auto">Calculada automáticamente</option>
          </select>
        </div>

        <div className="campo">
          <label>Marca / Modelo</label>
          <select className="input-azul">
            <option value="">Seleccionar...</option>
          </select>
        </div>

      </div>
    </div>
  );
}
