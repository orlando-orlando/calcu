// src/components/Navbar.jsx
export default function Navbar({ onChangeSeccion, seccionActiva }) {
  const secciones = [
    { id: "dimensiones", nombre: "Dimensiones del cuerpo de agua" },
    { id: "calentamiento", nombre: "Perfil de calentamiento" },
    { id: "equipamiento", nombre: "Selecciona tus equipos" },
    { id: "resultado", nombre: "Resumen de resultados" },
  ];

  return (
    <aside className="w-full md:w-72 bg-white shadow-md md:h-screen border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-semibold text-[#004b8d]">Calcula tu sistema</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {secciones.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onChangeSeccion(sec.id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              seccionActiva === sec.id
                ? "bg-[#004b8d] text-white font-medium"
                : "hover:bg-[#e8f0fb] text-gray-700"
            }`}
          >
            {sec.nombre}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => alert("Cálculo ejecutado")}
          className="w-full bg-[#004b8d] text-white py-2 rounded-lg hover:shadow-lg transition-all"
        >
          Calcular
        </button>
      </div>
    </aside>
  );
}
