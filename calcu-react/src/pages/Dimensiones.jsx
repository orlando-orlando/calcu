export default function Dimensiones() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Dimensiones</h2>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label className="block font-semibold mb-1">Área (m²):</label>
          <input type="number" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Profundidad máxima (m):</label>
          <input type="number" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300" />
        </div>
      </div>
    </section>
  );
}
