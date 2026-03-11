// src/components/MenuUsuario.jsx
import { useEffect, useRef } from "react";
import { Settings, CreditCard, Palette, HelpCircle, LogOut, Plus, ChevronRight } from "lucide-react";

export default function MenuUsuario({ abierto, onCerrar, panelColapsado }) {
  const menuRef = useRef(null);

  // Cierra al hacer click fuera
  useEffect(() => {
    if (!abierto) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onCerrar();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      ref={menuRef}
      className={`menu-usuario-popup ${panelColapsado ? "menu-usuario-colapsado" : ""}`}
    >
      {/* Cuenta activa */}
      <div className="menu-usuario-cuenta">
        <div className="menu-usuario-avatar">OS</div>
        <div className="menu-usuario-info">
          <span className="menu-usuario-nombre">Orlando Salcedo</span>
          <span className="menu-usuario-plan">Gratis</span>
        </div>
      </div>

      <div className="menu-usuario-divider" />

      {/* Añadir cuenta */}
      <button className="menu-usuario-item">
        <Plus size={15} />
        <span>Añadir una cuenta</span>
      </button>

      <div className="menu-usuario-divider" />

      {/* Opciones */}
      <button className="menu-usuario-item">
        <CreditCard size={15} />
        <span>Cambiar plan</span>
      </button>
      <button className="menu-usuario-item">
        <Palette size={15} />
        <span>Personalización</span>
      </button>
      <button className="menu-usuario-item">
        <Settings size={15} />
        <span>Configuración</span>
      </button>

      <div className="menu-usuario-divider" />

      <button className="menu-usuario-item menu-usuario-item-arrow">
        <HelpCircle size={15} />
        <span>Ayuda</span>
        <ChevronRight size={13} className="menu-usuario-arrow" />
      </button>
      <button className="menu-usuario-item menu-usuario-item-danger">
        <LogOut size={15} />
        <span>Cerrar sesión</span>
      </button>

      <div className="menu-usuario-divider" />

      {/* Footer */}
      <div className="menu-usuario-footer">
        <span>Política de privacidad</span>
        <span>·</span>
        <span>Condiciones del servicio</span>
      </div>

      {/* Barra inferior con plan */}
      <div className="menu-usuario-upgrade">
        <div className="menu-usuario-avatar menu-usuario-avatar-sm">OS</div>
        <div className="menu-usuario-upgrade-info">
          <span>Orlando Salc...</span>
          <span className="menu-usuario-plan">Gratis</span>
        </div>
        <button className="menu-usuario-btn-upgrade">Mejorar plan</button>
      </div>
    </div>
  );
}