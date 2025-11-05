export default function TarjetaSistema({ titulo, descripcion, imagen }) {
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden max-w-xs">
      <img src={imagen} alt={titulo} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-blue-800 text-lg mb-1">{titulo}</h3>
        <p className="text-sm text-gray-600">{descripcion}</p>
      </div>
    </div>
  );
}
