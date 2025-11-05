import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Dimensiones from "./pages/Dimensiones.jsx";
import Calentamiento from "./pages/Calentamiento.jsx";
import Equipamiento from "./pages/Equipamiento.jsx";
import Resultado from "./pages/Resultado.jsx";

export default function App() {
  const [seccion, setSeccion] = useState("dimensiones");

  const renderSeccion = () => {
    switch (seccion) {
      case "calentamiento":
        return <Calentamiento />;
      case "equipamiento":
        return <Equipamiento />;
      case "resultado":
        return <Resultado />;
      default:
        return <Dimensiones />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <Navbar onChangeSeccion={setSeccion} />
      <main className="flex-1 p-6">{renderSeccion()}</main>
      <Footer />
    </div>
  );
}
