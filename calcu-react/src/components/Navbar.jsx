export default function Navbar({ onChangeSeccion }) {
  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold tracking-wide">BlueDesign Calculator</h1>
      <div className="flex gap-4">
        <button onClick={() => onChangeSeccion("dimensiones")} className="hover:text-blue-200 transition">
          Dimensiones
        </button>
        <button onClick={() => onChangeSeccion("calentamiento")} className="hover:text-blue-200 transition">
          Calentamiento
        </button>
        <button onClick={() => onChangeSeccion("equipamiento")} className="hover:text-blue-200 transition">
          Equipamiento
        </button>
        <button onClick={() => onChangeSeccion("resultado")} className="hover:text-blue-200 transition">
          Resultado
        </button>
      </div>
    </nav>
  );
}
