// src/pages/Dimensiones.jsx
export default function Dimensiones() {
  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold text-[#004b8d] mb-4">
        Dimensiones del cuerpo de agua
      </h2>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <label className="block font-medium mb-2 text-gray-700">
          Área (m²):
        </label>
        <input
          type="number"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004b8d]"
        />

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Profundidad mínima (m):
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004b8d]"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">
              Profundidad máxima (m):
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004b8d]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
