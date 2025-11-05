export default function ToggleSeccion({ opciones, seleccion, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {opciones.map((opcion) => (
        <button
          key={opcion}
          onClick={() => onChange(opcion)}
          className={`px-4 py-2 rounded-lg border transition ${
            seleccion === opcion
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-blue-800 border-blue-300 hover:bg-blue-50"
          }`}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
}
