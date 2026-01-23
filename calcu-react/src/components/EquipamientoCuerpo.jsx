export default function EquipamientoCuerpo({ titulo, children }) {
  return (
    <div className="tarjeta-tecnica cuerpo-card">
      <div className="cuerpo-header">
        <h3>{titulo}</h3>
      </div>

      <div className="cuerpo-contenido">
        {children}
      </div>
    </div>
  );
}
