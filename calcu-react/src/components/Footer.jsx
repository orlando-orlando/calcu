export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-4 text-center mt-10">
      <p className="text-sm">
        © {new Date().getFullYear()} BlueDesign. Todos los derechos reservados. | Versión 1.0.0
      </p>
    </footer>
  );
}
