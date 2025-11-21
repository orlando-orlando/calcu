import { useState, useEffect, useCallback, useRef } from "react";

export function useCalculosHidraulicos() {

  // --------------------------------------------
  // Estados principales
  // --------------------------------------------
  const [datos, setDatos] = useState({});
  const [ciudad, setCiudad] = useState("");
  const [seccionActual, setSeccionActual] = useState("dimensiones");
  const [tipoSistemaActual, setTipoSistemaActual] = useState(null);

  // Mantiene datos organizados por tipo de sistema
  const datosPorSistema = useRef({});

  // --------------------------------------------
  // toggleInputs → versión React
  // --------------------------------------------
  const toggleInputs = useCallback((isChecked, setEstado) => {
    // Aquí solo guardamos el estado general del checkbox
    // La UI decide que inputs habilitar
    setEstado(isChecked);
  }, []);

  // --------------------------------------------
  // guardarCambio (React)
  // --------------------------------------------
  const guardarCambio = useCallback((id, value) => {
    setDatos(prev => ({
      ...prev,
      [id]: value
    }));
  }, []);

  // --------------------------------------------
  // Manejo de desborde (convertido)
  // --------------------------------------------
  const handleDesborde = useCallback((tipo, setShowInfinity, setShowCanal, setShowCampos) => {
    setShowCampos(tipo !== "ninguno");
    setShowInfinity(tipo === "infinity" || tipo === "ambos");
    setShowCanal(tipo === "canal" || tipo === "ambos");
  }, []);

  // --------------------------------------------
  // actualizarTablasClima → convertido a React
  // --------------------------------------------
  const actualizarTablasClima = useCallback(() => {
    if (!ciudad) {
      return {
        disabled: true,
        tabla: Array(12).fill(null).map((_, i) => ({
          mes: i,
          tempMin: "-",
          tempMax: "-",
          vientoMax: "-",
          humedad: "-"
        })),
        resumen: null
      };
    }

    // Aquí NO renderizamos DOM.
    // El componente que consume este hook debe generar la tabla.
    return {
      disabled: false,
      tabla: null, // el render real se hará fuera
      resumen: null
    };

  }, [ciudad]);


  // --------------------------------------------
  // Secciones (se usará desde el render principal)
  // --------------------------------------------
  const secciones = {
    dimensiones: "...AQUÍ VA EL HTML QUE TRAES (NO JSX)...",
    calentamiento: "...AQUÍ VA EL HTML ORIGINAL...",
    equipamiento: "...AQUÍ VA EL HTML ORIGINAL..."
  };


  // --------------------------------------------
  // Navegación entre secciones
  // --------------------------------------------
  const irASeccion = useCallback((sec) => {
    setSeccionActual(sec);
  }, []);

  const irAEquipamiento = useCallback(() => {
    irASeccion("equipamiento");

    if (!tipoSistemaActual) return;

    // Guardar radios leídos
    const motobombaInfinity = datosPorSistema.current[tipoSistemaActual]?.motobombaInfinity || "no";
    const motobombaCalentamiento = datosPorSistema.current[tipoSistemaActual]?.motobombaCalentamiento || "no";

    datosPorSistema.current[tipoSistemaActual] = {
      ...datosPorSistema.current[tipoSistemaActual],
      motobombaInfinity,
      motobombaCalentamiento
    };
  }, [tipoSistemaActual, irASeccion]);

  const volverACalentamiento = useCallback(() => {
    irASeccion("calentamiento");
  }, [irASeccion]);


  // --------------------------------------------
  // mostrarFormularioSistema → convertido a lógica React
  // --------------------------------------------
  const mostrarFormularioSistema = useCallback(
    (tipo) => {
      // Guardar el tipo anterior antes de cambiar
      if (tipoSistemaActual && tipoSistemaActual !== tipo) {
        datosPorSistema.current[tipoSistemaActual] = {
          ...datosPorSistema.current[tipoSistemaActual],
          ...datos
        };
      }

      setTipoSistemaActual(tipo);
      irASeccion("dimensiones");

    },
    [datos, tipoSistemaActual, irASeccion]
  );

  // --------------------------------------------
  // API pública del hook
  // --------------------------------------------
  return {
    datos,
    ciudad,
    setCiudad,
    
    seccionActual,
    irASeccion,
    irAEquipamiento,
    volverACalentamiento,

    toggleInputs,
    guardarCambio,
    handleDesborde,
    actualizarTablasClima,
    mostrarFormularioSistema,

    tipoSistemaActual,
    datosPorSistema,
    secciones
  };
}

// calcu/calcu-react/src/hooks/useCalculosHidraulicos.js
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useCalculosHidraulicos
 * Opción A: envolver la lógica original casi idéntica dentro de un hook React.
 * Mantiene interacciones DOM (document.getElementById, querySelector, etc.)
 * y sincroniza estados a window.* para compatibilidad con código existente.
 */
export default function useCalculosHidraulicos() {

  // -------------------------
  // Estados React (replican variables globales del código original)
  // -------------------------
  const [datos, setDatos] = useState({}); // objeto principal con inputs
  const [datosPorSistema, setDatosPorSistema] = useState({}); // por tipo de sistema
  const [tipoSistemaActual, setTipoSistemaActual] = useState(null);
  const [ultimoTipoSistema, setUltimoTipoSistema] = useState(null);

  // refs para evitar stale closures en listeners
  const datosRef = useRef(datos);
  const datosPorSistemaRef = useRef(datosPorSistema);
  const tipoSistemaActualRef = useRef(tipoSistemaActual);
  const ultimoTipoSistemaRef = useRef(ultimoTipoSistema);

  useEffect(() => { datosRef.current = datos; window.datos = datos; }, [datos]);
  useEffect(() => { datosPorSistemaRef.current = datosPorSistema; window.datosPorSistema = datosPorSistema; }, [datosPorSistema]);
  useEffect(() => { tipoSistemaActualRef.current = tipoSistemaActual; window.tipoSistemaActual = tipoSistemaActual; }, [tipoSistemaActual]);
  useEffect(() => { ultimoTipoSistemaRef.current = ultimoTipoSistema; window.ultimoTipoSistema = ultimoTipoSistema; }, [ultimoTipoSistema]);

  // -------------------------
  // HELPERS: utilidades mínimas para respetar la lógica original
  // -------------------------
  const safeParseFloat = v => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
  };

  // -------------------------
  // toggleInputs (se quedó en versión DOM - mantenemos el comportamiento original)
  // -------------------------
  const toggleInputs = useCallback((checkboxId, contenedorId) => {
    try {
      const chk = document.getElementById(checkboxId);
      const contenedor = document.getElementById(contenedorId);
      if (!chk || !contenedor) return;
      const inputs = contenedor.querySelectorAll("input, select, textarea");
      inputs.forEach(el => {
        el.disabled = !chk.checked;
      });
    } catch (err) {
      console.warn("toggleInputs error:", err);
    }
  }, []);

  // -------------------------
  // guardarCambio (mantener listener original)
  // -------------------------
  const guardarCambio = useCallback((e) => {
    try {
      const el = e.target;
      // Actualiza el objeto datos (mantener igual comportamiento)
      setDatos(prev => {
        const nuevo = { ...prev };
        if (el.type === "checkbox") {
          if (el.id) nuevo[el.id] = el.checked;
        } else if (el.type === "radio") {
          if (el.checked && el.name) nuevo[el.name] = el.value;
        } else if (el.id) {
          nuevo[el.id] = el.value;
        }
        return nuevo;
      });
    } catch (err) {
      console.error("guardarCambio error:", err);
    }
  }, []);

  // -------------------------
  // actualizarTablasClima (mantener)
  // -------------------------
  const renderTabla = useCallback((ciudad) => {
    // Placeholder: la función renderTabla se esperaba por el bloque anterior
    // En esta integración A la dejamos como placeholder si no existe
    try {
      if (typeof window.renderTabla === "function") {
        window.renderTabla(ciudad);
      } else {
        // No hacemos nada si no existe (preservar comportamiento)
      }
    } catch (err) {
      console.warn("renderTabla wrapper error:", err);
    }
  }, []);

  const actualizarTablasClima = useCallback(() => {
    try {
      const ciudad = document.getElementById("ciudad")?.value;
      const tablaClima = document.getElementById("tablaClima");
      const resumenClima = document.getElementById("contenedorMesFrio");

      if (!tablaClima || !resumenClima) return;

      if (!ciudad) {
        tablaClima.classList.add("disabled-table");
        resumenClima.classList.add("disabled-table");

        const tablaVacia = `
          <p><strong>Selecciona los meses a calentar:</strong></p>
          <table>
            <thead>
              <tr>
                <th>Calentar</th>
                <th>Mes</th>
                <th>Temperatura Min. (°C)</th>
                <th>Temperatura Max. (°C)</th>
                <th>Velocidad Viento Max. (km/h)</th>
                <th>Humedad Relativa Prom. (%)</th>
              </tr>
            </thead>
            <tbody>
              ${Array(12).fill(0).map((_, i) => `
                <tr data-mes="${i}" class="deshabilitado">
                  <td><input type="checkbox" class="chk-mes" data-mes="${i}" disabled></td>
                  <td>${(window.meses && window.meses[i]) || ("Mes " + (i+1))}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        tablaClima.innerHTML = tablaVacia;
        resumenClima.innerHTML = `<p>Mes más frío seleccionado: -</p>`;
      } else {
        tablaClima.classList.remove("disabled-table");
        resumenClima.classList.remove("disabled-table");
        renderTabla(ciudad);
      }
    } catch (err) {
      console.warn("actualizarTablasClima error:", err);
    }
  }, [renderTabla]);

  // -------------------------
  // handleDesborde (mantener lógica DOM)
  // -------------------------
  const handleDesborde = useCallback((tipo) => {
    try {
      const campos = document.getElementById("camposDesborde");
      const campoInfinity = document.getElementById("campoInfinity");
      const campoCanal = document.getElementById("campoCanal");
      if (!campos) return;
      campos.style.display = tipo === "ninguno" ? "none" : "block";
      if (campoInfinity) campoInfinity.style.display = (tipo === "infinity" || tipo === "ambos") ? "block" : "none";
      if (campoCanal) campoCanal.style.display = (tipo === "canal" || tipo === "ambos") ? "block" : "none";
    } catch (err) {
      console.warn("handleDesborde error:", err);
    }
  }, []);

  // -------------------------
  // buildEquipamientoUI (bloque 2) - se deja prácticamente igual (DOM)
  // -------------------------
  const buildEquipamientoUI = useCallback((tipoActual) => {
    try {
      const columnaIzquierda = document.getElementById("equipamientoIzquierdaContenido");
      const columnaDerecha = document.getElementById("equipamientoDerechaContenido");
      if (!columnaIzquierda || !columnaDerecha) return;

      columnaIzquierda.innerHTML = "";
      columnaDerecha.innerHTML = "";

      const crearBloqueEquipo = (label, opciones = []) => `
        <div class="bloque-equipo">
          <div class="bloque-titulo">${label}</div>
          <div class="bloque-campos">
            <div class="campo">
              <label>Cantidad:</label>
              <input type="number" min="0" class="input-azul cantidad">
            </div>
            <div class="campo">
              <label>Equipo recomendado:</label>
              <select class="input-azul">
                <option value="">-- Selecciona --</option>
                ${opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
              </select>
            </div>
            <div class="campo">
              <label>Capacidad:</label>
              <input type="text" class="input-azul capacidad">
            </div>
          </div>
        </div>
      `;

      const crearBloqueEquipoCalentamiento = (label, opciones = []) => `
        <div class="bloque-equipo">
          <div class="bloque-titulo">${label}</div>
          <div class="bloque-campos">
            <div class="campo">
              <label>Cantidad:</label>
                <input type="number" min="0" max="999" class="input-azul cantidad input-corto" data-eq="${label}Cantidad" style="width:70px; text-align:center;">
              </div>
            <div class="campo">
              <label>Equipo recomendado:</label>
              <select class="input-azul" data-eq="${label}Recomendado">
                <option value="">-- Selecciona --</option>
                ${opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
              </select>
            </div>
            <div class="campo">
              <label>Capacidad:</label>
              <input type="text" class="input-azul capacidad" data-eq="${label}Capacidad">
            </div>
            <div class="campo">
              <label>Altura espejo ↔ equipo (m):</label>
              <input type="number" min="0" class="input-azul altura" data-eq="${label}Altura">
            </div>
            <div class="campo">
              <label>Distancia cuarto ↔ equipo (m):</label>
              <input type="number" min="0" class="input-azul distancia" data-eq="${label}Distancia">
            </div>
          </div>
        </div>
      `;

      const crearToggle = (titulo, contenido) => `
        <details class="tarjeta-equipamiento">
          <summary class="titulo-toggle">${titulo}</summary>
          <div class="contenido-toggle">${contenido}</div>
        </details>
      `;

      // bloques principales (igual que en tu original)
      const bloqueCalentamiento = crearToggle("🔥 Calentamiento", `
        ${crearBloqueEquipoCalentamiento("Caldera", ["Caldera A", "Caldera B", "Caldera C"])}
        ${crearBloqueEquipoCalentamiento("Bomba de calor", ["Bomba 3HP", "Bomba 5HP"])}
        ${crearBloqueEquipoCalentamiento("Panel solar", ["Solar 1", "Solar 2"])}
      `);

      const bloqueFiltrado = crearToggle("💧 Filtrado", `
        ${crearBloqueEquipo("Prefiltro", ["Prefiltro chico", "Prefiltro grande"])}
        ${crearBloqueEquipo("Filtro de arena", ["Arena 24\"", "Arena 30\""]) }
      `);

      const bloqueSanitizacion = crearToggle("🧪 Sanitización", `
        ${crearBloqueEquipo("Generador de cloro", ["Clorador salino", "Dosificador"]) }
        ${crearBloqueEquipo("Ozonificador", ["Ozono 10g", "Ozono 20g"]) }
        ${crearBloqueEquipo("Lámpara UV", ["UV Compacta", "UV Industrial"]) }
      `);

      const bloqueEmpotrables = crearToggle("🧱 Empotrables", `
        ${crearBloqueEquipo("Boquilla de retorno", ["PVC", "Acero inoxidable"]) }
        ${crearBloqueEquipo("Dren de fondo", ["Circular", "Cuadrado"]) }
        ${crearBloqueEquipo("Desnatador", ["Estándar", "Ancho"]) }
        ${crearBloqueEquipo("Barredora", ["Manual", "Automática"]) }
        ${crearBloqueEquipo("Manguera barredora", ["10m", "15m"]) }
      `);

      const bloqueIluminacion = crearToggle("💡 Iluminación", `
        ${crearBloqueEquipo("Foco LED", ["RGB", "Blanco cálido"]) }
        ${crearBloqueEquipo("Controlador", ["Control remoto", "Wi-Fi"]) }
        ${crearBloqueEquipo("Transformador", ["12V", "24V"]) }
      `);

      const bloqueMotobomba = crearToggle("⚙️ Motobomba Filtrado", `
        ${crearBloqueEquipo("Motobomba", ["1HP", "1.5HP", "2HP"]) }
      `);

      // secundarios
      const empotrablesJacuzzi = crearToggle("🌀 Empotrables Jacuzzi", `
        ${crearBloqueEquipo("Jets", ["Jet lateral", "Jet masaje"]) }
        ${crearBloqueEquipo("Dren Jacuzzi", ["Fondo redondo", "Fondo plano"]) }
        ${crearBloqueEquipo("Boquilla aire", ["Aire 1", "Aire 2"]) }
      `);

      const motobombaHidrojets = crearToggle("💨 Motobomba Hidrojets", `
        ${crearBloqueEquipo("Motobomba Hidrojets", ["2HP", "3HP", "4HP"]) }
      `);

      const sopladoresJacuzzi = crearToggle("🌬️ Sopladores Jacuzzi", `
        ${crearBloqueEquipo("Soplador", ["Soplador 1HP", "Soplador 2HP"]) }
      `);

      const empotrablesCuerpo2 = crearToggle("🌊 Empotrables Cuerpo 2", `
        ${crearBloqueEquipo("Boquilla retorno (Cuerpo 2)", ["PVC", "Acero inoxidable"]) }
        ${crearBloqueEquipo("Dren fondo (Cuerpo 2)", ["Circular", "Cuadrado"]) }
        ${crearBloqueEquipo("Desnatador (Cuerpo 2)", ["Estándar", "Ancho"]) }
      `);

      const motobombaInfinity = crearToggle("♾️ Motobomba Infinity", `
        ${crearBloqueEquipo("Motobomba Infinity", ["1HP", "1.5HP", "2HP"]) }
      `);

      const motobombaCalentamiento = crearToggle("🔥 Motobomba Calentamiento", `
        ${crearBloqueEquipo("Motobomba Calentamiento", ["1HP", "1.5HP", "2HP"]) }
      `);

      const placeholder = crearToggle("⚠️ Sin segundo cuerpo", `<p>No hay equipos adicionales.</p>`);

      // datosDim se lee desde window (compatibilidad)
      const datosDim = (window.datosPorSistema && window.datosPorSistema[tipoActual]) || {};
      const llevaInfinity = datosDim.motobombaInfinity === "si";
      const llevaCalentamiento = datosDim.motobombaCalentamiento === "si";

      let motobombasIndependientes = "";
      if (llevaInfinity) motobombasIndependientes += motobombaInfinity;
      if (llevaCalentamiento) motobombasIndependientes += motobombaCalentamiento;

      columnaIzquierda.innerHTML = `
        ${bloqueCalentamiento}
        ${bloqueFiltrado}
        ${bloqueSanitizacion}
        ${bloqueEmpotrables}
        ${bloqueIluminacion}
        ${bloqueMotobomba}
      `;

      let derechaHTML = "";
      switch (tipoActual) {
        case "alberca":
        case "chapoteadero":
        case "espejoAgua":
        case "albercaChapo1":
          derechaHTML = motobombasIndependientes || placeholder;
          break;

        case "jacuzzi":
        case "albercaJacuzzi1":
        case "jacuzziChapo1":
          derechaHTML =
            empotrablesJacuzzi +
            motobombaHidrojets +
            sopladoresJacuzzi +
            motobombasIndependientes;
          break;

        case "albercaChapo2":
          derechaHTML = empotrablesCuerpo2 + motobombasIndependientes;
          break;

        case "albercaJacuzzi2":
        case "jacuzziChapo2":
          derechaHTML =
            empotrablesJacuzzi +
            motobombaHidrojets +
            sopladoresJacuzzi +
            empotrablesCuerpo2 +
            motobombasIndependientes;
          break;

        default:
          derechaHTML = placeholder;
      }

      columnaDerecha.innerHTML = derechaHTML;
    } catch (err) {
      console.error("buildEquipamientoUI error:", err);
    }
  }, []);

  // -------------------------
  // restaurarInputsSistema (bloque 2) - DOM logic preserved
  // -------------------------
  const restaurarInputsSistema = useCallback((tipo) => {
    try {
      const datosPrevios = (window.datosPorSistema && window.datosPorSistema[tipo]) || null;
      if (!datosPrevios) return;

      setTimeout(() => {
        Object.entries(datosPrevios).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          const el = document.getElementById(key);
          const radios = document.querySelectorAll(`input[name='${key}']`);
          if (el) {
            if (el.type === "checkbox") el.checked = !!value;
            else if (el.tagName === "SELECT") el.value = value;
            else if (el.type === "number" || el.type === "text") el.value = value;
          } else if (radios.length > 0) {
            radios.forEach(r => (r.checked = r.value === String(value)));
          }
        });

        // reactivar vista desborde
        if (datosPrevios.desborde) {
          const radio = document.querySelector(`input[name='desborde'][value='${datosPrevios.desborde}']`);
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event("change"));

            const campos = document.getElementById("camposDesborde");
            const campoInfinity = document.getElementById("campoInfinity");
            const campoCanal = document.getElementById("campoCanal");

            if (campos) campos.style.display = "block";

            switch (datosPrevios.desborde) {
              case "infinity":
                if (campoInfinity) campoInfinity.style.display = "block";
                break;
              case "canal":
                if (campoCanal) campoCanal.style.display = "block";
                break;
              case "ambos":
                if (campoInfinity) campoInfinity.style.display = "block";
                if (campoCanal) campoCanal.style.display = "block";
                break;
              case "ninguno":
                if (campos) campos.style.display = "none";
                break;
            }
          }
        }

        // restaurar motobombaInfinity radios
        if (datosPrevios.motobombaInfinity) {
          const radiosMoto = document.querySelectorAll("input[name='motobombaInfinity']");
          radiosMoto.forEach(r => {
            r.checked = r.value === String(datosPrevios.motobombaInfinity);
          });
        }

        console.log(`✅ Inputs restaurados para ${tipo}`, datosPrevios);
      }, 50);
    } catch (err) {
      console.warn("restaurarInputsSistema error:", err);
    }
  }, []);

  // -------------------------
  // inicializarEventosTipoSistema
  // -------------------------
  const inicializarEventosTipoSistema = useCallback(() => {
    try {
      const opciones = document.querySelectorAll("input[name='tipoSistema']");
      const panelDatos = document.getElementById("panelDatosSistema");
      if (!panelDatos || opciones.length === 0) return;
      opciones.forEach(opcion => {
        opcion.addEventListener("change", () => {
          const tipo = opcion.value;
          mostrarFormularioSistema(tipo);
        });
      });
    } catch (err) {
      console.warn("inicializarEventosTipoSistema error:", err);
    }
  }, []);

  // -------------------------
  // actualizarValoresGlobales - replica la lógica original
  // -------------------------
  const sincronizarDatosGlobales = useCallback(() => {
    try {
      const vg = window.valoresGlobales;
      if (!vg) return;
      // Actualizar `datos` (mantener compatibilidad)
      setDatos(prev => {
        const nuevo = { ...prev };
        nuevo.area = vg.area;
        nuevo.profMin = vg.profMin;
        nuevo.profMax = vg.profMax;
        nuevo.volumen = vg.volumen;
        nuevo.tasaRotacion = vg.tasaRotacion ?? vg.tasaRot ?? vg.tasaRotacion;
        nuevo.distancia = vg.distancia;
        nuevo.largoInfinity = vg.largoInfinity;
        nuevo.alturaDesborde = vg.alturaDesborde;
        nuevo.largoCanal = vg.largoCanal;
        return nuevo;
      });

      // actualizar inputs si existen (mantener comportamiento original)
      if (document.getElementById("area")) document.getElementById("area").value = (vg.area ?? 0).toFixed ? (vg.area).toFixed(2) : vg.area;
      if (document.getElementById("profMin")) document.getElementById("profMin").value = (vg.profMin ?? 0).toFixed ? (vg.profMin).toFixed(2) : vg.profMin;
      if (document.getElementById("profMax")) document.getElementById("profMax").value = (vg.profMax ?? 0).toFixed ? (vg.profMax).toFixed(2) : vg.profMax;
      if (document.getElementById("volumen")) document.getElementById("volumen").value = (vg.volumen ?? 0).toFixed ? (vg.volumen).toFixed(2) : vg.volumen;
      if (document.getElementById("tasaRotacion")) document.getElementById("tasaRotacion").value = vg.tasaRotacion ?? vg.tasaRot ?? "";
      if (document.getElementById("distancia")) document.getElementById("distancia").value = vg.distancia ?? "";

      console.log("💾 Sincronizado con datos globales:", vg);
    } catch (err) {
      console.warn("sincronizarDatosGlobales error:", err);
    }
  }, []);

  const actualizarValoresGlobales = useCallback(() => {
    try {
      const tieneInputsSistema = document.getElementById("area1") || document.getElementById("area2");
      if (!tieneInputsSistema) {
        console.log("⚠️ No hay inputs de sistema visibles → se conserva window.valoresGlobales sin cambios.");
        return;
      }

      const area1 = safeParseFloat(document.getElementById("area1")?.value);
      const area2 = safeParseFloat(document.getElementById("area2")?.value);
      let profMin1 = safeParseFloat(document.getElementById("profMin1")?.value);
      let profMax1 = safeParseFloat(document.getElementById("profMax1")?.value);
      let profMin2 = safeParseFloat(document.getElementById("profMin2")?.value);
      let profMax2 = safeParseFloat(document.getElementById("profMax2")?.value);

      const tasaRot = safeParseFloat(document.getElementById("rotacion")?.value) || 0;
      const distancia = safeParseFloat(document.getElementById("distCuarto")?.value) || 0;
      const largoInfinity = safeParseFloat(document.getElementById("largoInfinity")?.value) || 0;
      const alturaDesborde = safeParseFloat(document.getElementById("alturaDesborde")?.value) || 0;
      const largoCanal = safeParseFloat(document.getElementById("largoCanal")?.value) || 0;

      const limpiar = v => (isNaN(v) ? null : v);

      profMin1 = limpiar(profMin1);
      profMax1 = limpiar(profMax1);
      profMin2 = limpiar(profMin2);
      profMax2 = limpiar(profMax2);

      const normalizar = (min, max) => {
        if (min != null && max != null) {
          return [Math.min(min, max), Math.max(min, max)];
        }
        return [min ?? max ?? 0, max ?? min ?? 0];
      };

      [profMin1, profMax1] = normalizar(profMin1, profMax1);
      [profMin2, profMax2] = normalizar(profMin2, profMax2);

      function calcularProfundidadMedia(min, max) {
        const tieneMin = min != null && !isNaN(min);
        const tieneMax = max != null && !isNaN(max);
        if (tieneMin && tieneMax) return (min + max) / 2;
        if (tieneMin) return min;
        if (tieneMax) return max;
        return 0;
      }

      const meanDepth1 = calcularProfundidadMedia(profMin1, profMax1);
      const meanDepth2 = calcularProfundidadMedia(profMin2, profMax2);

      const a1 = isNaN(area1) ? 0 : area1;
      const a2 = isNaN(area2) ? 0 : area2;
      const areaTotal = a1 + a2;

      let volumenTotal = 0;
      let profMinProm = 0, profMaxProm = 0;

      if (a2 > 0) {
        const vol1 = a1 * meanDepth1;
        const vol2 = a2 * meanDepth2;
        volumenTotal = vol1 + vol2;
        const profPromedio = areaTotal > 0 ? volumenTotal / areaTotal : meanDepth1;
        profMinProm = Math.min(profMin1 || profMin2 || 0, profMin2 || profMin1 || 0);
        profMaxProm = Math.max(profMax1 || profMax2 || 0, profMax2 || profMax1 || 0);
      } else {
        volumenTotal = a1 * meanDepth1;
        profMinProm = profMin1 || 0;
        profMaxProm = profMax1 || 0;
      }

      window.valoresGlobales = {
        area: areaTotal,
        profMin: profMinProm,
        profMax: profMaxProm,
        volumen: volumenTotal,
        tasaRot,
        distancia,
        largoInfinity,
        alturaDesborde,
        largoCanal
      };

      console.log("📊 Actualizando valores globales:", window.valoresGlobales);
      sincronizarDatosGlobales();
    } catch (err) {
      console.warn("actualizarValoresGlobales error:", err);
    }
  }, [sincronizarDatosGlobales]);

  // -------------------------
  // guardarDatos (mantener lógica, pero escribe en estado React y window)
  // -------------------------
  const guardarDatos = useCallback((tipoForzado) => {
    try {
      if (typeof window.normalizeAllDepths === "function") {
        const allDepthInputs = Array.from(document.querySelectorAll('[id^="profMin"], [id^="profMax"]'));
        const hasZero = allDepthInputs.some(el => parseFloat(el.value) === 0);
        if (!hasZero) window.normalizeAllDepths();
      }

      const tipoActualLocal = tipoForzado
        || window.ultimoTipoSistema
        || document.querySelector("input[name='tipoSistema']:checked")?.value;

      if (!tipoActualLocal) return;

      // Asegurar estructura
      const globalDatosPorSistema = window.datosPorSistema || {};
      globalDatosPorSistema[tipoActualLocal] = globalDatosPorSistema[tipoActualLocal] || {};
      const datosSistema = globalDatosPorSistema[tipoActualLocal];

      // tipoConfig
      const tipoConfig = {
        alberca: 1, jacuzzi: 1, chapoteadero: 1, espejoAgua: 1,
        albercaJacuzzi1: 2, albercaChapo1: 2, jacuzziChapo1: 2,
        albercaJacuzzi2: 2, albercaChapo2: 2, jacuzziChapo2: 2
      };
      const numCuerpos = tipoConfig[tipoActualLocal] || 1;

      function computeMeanDepth(pmin, pmax) {
        const minVal = Number.isFinite(pmin) && pmin > 0 ? pmin : null;
        const maxVal = Number.isFinite(pmax) && pmax > 0 ? pmax : null;
        if (minVal !== null && maxVal !== null) {
          return (minVal + maxVal) / 2;
        }
        if (minVal !== null) return minVal;
        if (maxVal !== null) return maxVal;
        return 0;
      }

      for (let i = 1; i <= numCuerpos; i++) {
        const areaEl = document.getElementById(`area${i}`);
        const minEl = document.getElementById(`profMin${i}`);
        const maxEl = document.getElementById(`profMax${i}`);
        if (areaEl) {
          const areaRaw = (areaEl.value ?? "").toString().trim();
          datosSistema[`area${i}`] = areaRaw === "" ? null : parseFloat(areaRaw);
        }
        if (minEl) {
          const minRaw = (minEl.value ?? "").toString().trim();
          datosSistema[`profMin${i}`] = minRaw === "" ? null : parseFloat(minRaw);
        }
        if (maxEl) {
          const maxRaw = (maxEl.value ?? "").toString().trim();
          datosSistema[`profMax${i}`] = maxRaw === "" ? null : parseFloat(maxRaw);
        }
        const a = datosSistema[`area${i}`];
        const pmin = datosSistema[`profMin${i}`];
        const pmax = datosSistema[`profMax${i}`];
        const meanDepth = computeMeanDepth(pmin, pmax);
        datosSistema[`volumen${i}`] =
          (Number.isFinite(a) && Number.isFinite(meanDepth) && meanDepth > 0)
            ? (a * meanDepth)
            : (datosSistema[`volumen${i}`] ?? 0);
      }

      // agregados
      let sumArea = 0;
      let volumenTotal = 0;
      const profMinList = [];
      const profMaxList = [];
      const meanDepths = [];

      for (let i = 1; i <= numCuerpos; i++) {
        const a = datosSistema[`area${i}`];
        const pmin = datosSistema[`profMin${i}`];
        const pmax = datosSistema[`profMax${i}`];
        const meanDepth = computeMeanDepth(pmin, pmax);

        if (Number.isFinite(a)) sumArea += a;
        if (Number.isFinite(pmin) && pmin > 0) profMinList.push(pmin);
        if (Number.isFinite(pmax) && pmax > 0) profMaxList.push(pmax);
        if (Number.isFinite(a) && Number.isFinite(meanDepth) && meanDepth > 0) {
          volumenTotal += a * meanDepth;
          meanDepths.push(meanDepth);
        }
      }

      const validMeanDepths = meanDepths.filter(d => d > 0);
      const allZeros = validMeanDepths.length === 0 && volumenTotal === 0;

      const areaTotal = sumArea || 0;
      const profundidadPromedio = allZeros
        ? 0
        : areaTotal > 0
          ? (volumenTotal / areaTotal)
          : (validMeanDepths.length ? (validMeanDepths.reduce((a,b)=>a+b,0)/validMeanDepths.length) : 0);

      const profMinAgg = profMinList.length ? Math.min(...profMinList) : (allZeros ? 0 : null);
      const profMaxAgg = profMaxList.length ? Math.max(...profMaxList) : (allZeros ? 0 : null);

      datosSistema.area = areaTotal || 0;
      datosSistema.volumen = volumenTotal || 0;
      datosSistema.profMin = profMinAgg;
      datosSistema.profMax = profMaxAgg;
      datosSistema.profMedio = Number.isFinite(profundidadPromedio) ? profundidadPromedio : null;

      // campos adicionales
      const usoEl = document.getElementById("usoCuerpo");
      if (usoEl) datosSistema.usoCuerpo = usoEl.value || null;
      const rotEl = document.getElementById("rotacion");
      if (rotEl) datosSistema.rotacion = rotEl.value || null;
      const distEl = document.getElementById("distCuarto");
      if (distEl) {
        const v = (distEl.value ?? "").toString().trim();
        datosSistema.distCuarto = v === "" ? null : parseFloat(v);
      }

      // desborde
      const desbEl = document.querySelector("input[name='desborde']:checked");
      if (desbEl) {
        datosSistema.desborde = desbEl.value;
        if (desbEl.value === "infinity" || desbEl.value === "ambos") {
          const motInf = document.querySelector("input[name='motobombaInfinity']:checked");
          if (motInf) datosSistema.motobombaInfinity = motInf.value;
          const lI = document.getElementById("largoInfinity");
          if (lI) datosSistema.largoInfinity = lI.value === "" ? null : parseFloat(lI.value);
          const aD = document.getElementById("alturaDesborde");
          if (aD) datosSistema.alturaDesborde = aD.value === "" ? null : parseFloat(aD.value);
        } else {
          if (document.querySelector("input[name='motobombaInfinity']")) datosSistema.motobombaInfinity = datosSistema.motobombaInfinity ?? null;
          if (document.getElementById("largoInfinity")) datosSistema.largoInfinity = null;
          if (document.getElementById("alturaDesborde")) datosSistema.alturaDesborde = null;
        }

        if (desbEl.value === "canal" || desbEl.value === "ambos") {
          const lC = document.getElementById("largoCanal");
          if (lC) datosSistema.largoCanal = lC.value === "" ? null : parseFloat(lC.value);
        } else {
          if (document.getElementById("largoCanal")) datosSistema.largoCanal = null;
        }
      }

      // checkboxes / radios globales
      ["chkBombaCalor", "chkPanel", "chkCaldera"].forEach(id => {
        const el = document.getElementById(id);
        if (el) datosSistema[id] = el.type === "checkbox" ? !!el.checked : (el.value || null);
      });

      // inputs dinámicos data-eq
      try {
        const equipElems = document.querySelectorAll('#contenidoDerecho [data-eq]');
        equipElems.forEach(el => {
          const key = el.dataset.eq;
          if (!key) return;
          if (el.type === "checkbox") datosSistema[key] = !!el.checked;
          else if (el.type === "number") datosSistema[key] = el.value === "" ? null : parseFloat(el.value);
          else datosSistema[key] = el.value === "" ? null : el.value;
        });
      } catch (err) {
        console.warn("Error guardando inputs equipamiento:", err);
      }

      // Guardado final en window y en estado React (para compatibilidad)
      globalDatosPorSistema[tipoActualLocal] = datosSistema;
      window.datosPorSistema = globalDatosPorSistema;
      setDatosPorSistema({ ...globalDatosPorSistema });

      console.log(`💾 guardarDatos(): guardado para [${tipoActualLocal}]`, datosSistema);
    } catch (err) {
      console.warn("guardarDatos error:", err);
    }
  }, []);

  // -------------------------
  // mostrarFormularioSistema & renderSeccion (mantener lógica original)
  // -------------------------
  const mostrarFormularioSistema = useCallback((tipo) => {
    try {
      const contenedorPrincipal = document.getElementById("contenidoDerecho");
      if (!contenedorPrincipal) return;

      if (window.ultimoTipoSistema && window.ultimoTipoSistema !== tipo) {
        guardarDatos(window.ultimoTipoSistema);
        console.log("💾 Datos guardados de:", window.ultimoTipoSistema);
      }

      // evitar recrear si mismo
      const tituloActual = contenedorPrincipal.querySelector(".titulo-sistema-activo");
      if (tituloActual && tituloActual.textContent.trim().toLowerCase() === tipo.replace(/([A-Z])/g, " $1").trim().toLowerCase()) {
        console.log("🔁 Mismo tipo de sistema, se mantiene visible.");
        return;
      }

      const sistemas = {
        alberca: { img: "alberca.jpg", cuerpos: 1, desborde: true },
        jacuzzi: { img: "jacuzzi.jpg", cuerpos: 1, desborde: true },
        chapoteadero: { img: "chapoteadero.jpg", cuerpos: 1, desborde: true },
        espejoAgua: { img: "espejo.jpg", cuerpos: 1, desborde: true },
        albercaJacuzzi1: { img: "alberca+jacuzzi1C.jpg", cuerpos: 2, desborde: true },
        albercaChapo1: { img: "alberca+chapoteadero1C.jpg", cuerpos: 2, desborde: true },
        jacuzziChapo1: { img: "jacuzziChapo1.jpg", cuerpos: 2, desborde: true },
        albercaJacuzzi2: { img: "albercaJacuzzi2.jpg", cuerpos: 2, desborde: true },
        albercaChapo2: { img: "albercaChapo2.jpg", cuerpos: 2, desborde: true },
        jacuzziChapo2: { img: "jacuzziChapo2.jpg", cuerpos: 2, desborde: true }
      };

      const config = sistemas[tipo];
      if (!config) return;

      const bloqueDimensiones = (num) => `
        <div class="tarjeta-bdc tarjeta-calentamiento">
          <label class="label-calentamiento">
            Dimensiones físicas${config.cuerpos > 1 ? ` (Cuerpo ${num})` : ""}:
          </label>
          <div class="form-group">
            <label>Área (m²):</label>
            <input type="number" id="area${num}" step="0.01" class="input-azul">
          </div>
          <div class="form-group inline fila-bdc">
            <div class="campo-bdc">
              <label>Profundidad mínima (m):</label>
              <input type="number" id="profMin${num}" step="0.01" class="input-azul">
            </div>
            <div class="campo-bdc">
              <label>Profundidad máxima (m):</label>
              <input type="number" id="profMax${num}" step="0.01" class="input-azul">
            </div>
          </div>
        </div>
      `;

      let bloquesDimensiones = "";
      for (let i = 1; i <= config.cuerpos; i++) bloquesDimensiones += bloqueDimensiones(i);

      const bloqueUsoRotacion = `
        <div class="tarjeta-bdc tarjeta-calentamiento">
          <div class="form-group inline fila-bdc">
            <div class="campo-bdc">
              <label>Uso del cuerpo de agua:</label>
              <select id="usoCuerpo" class="input-azul">
                <option value="">-- Selecciona uso --</option>
                <option value="residencial">Residencial</option>
                <option value="publica">Pública</option>
                <option value="competencia">Competencia</option>
                <option value="parque">Parque acuático</option>
              </select>
            </div>
            <div class="campo-bdc" style="margin-left: 16px;">
              <label>Tasa de rotación (h):</label>
              <select id="rotacion" class="input-azul">
                <option value="">-- Selecciona --</option>
                <option value="0.5">0.5</option>
                <option value="1">1</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
              </select>
            </div>
            <div class="campo-bdc" style="margin-left: 16px;">
              <label>Distancia a cuarto de máquinas (m):</label>
              <input type="number" id="distCuarto" step="0.1" placeholder="Ej. 15" class="input-azul">
            </div>
          </div>
        </div>
      `;

      const bloqueDesborde = config.desborde ? `
        <div class="tarjeta-bdc tarjeta-calentamiento">
          <label class="label-calentamiento">Tipo de desborde:</label>
          <div id="toggleDesborde" class="checkbox-row">
            <label><input type="radio" name="desborde" value="infinity"> Infinity</label>
            <label><input type="radio" name="desborde" value="canal"> Canal perimetral</label>
            <label><input type="radio" name="desborde" value="ambos"> Ambos</label>
            <label><input type="radio" name="desborde" value="ninguno"> Ninguno</label>
          </div>
        </div>

        <div id="camposDesborde" style="display:none;">
          <div id="campoInfinity" class="tarjeta-bdc tarjeta-calentamiento" style="display:none;">
            <label class="label-calentamiento">Desborde Infinity:</label>
            <div class="form-group inline">
              <span>¿Deseas trabajar el infinity con motobomba independiente al filtrado?</span>
              <label><input type="radio" name="motobombaInfinity" value="si"> Sí</label>
              <label><input type="radio" name="motobombaInfinity" value="no"> No</label>
            </div>
            <div class="form-group inline fila-bdc">
              <div class="campo-bdc">
                <label for="largoInfinity">Largo del muro (m):</label>
                <input type="number" id="largoInfinity" step="0.01" class="input-azul">
              </div>
              <div class="campo-bdc">
                <label for="alturaDesborde">Altura desborde (mm):</label>
                <input type="number" id="alturaDesborde" step="0.01" class="input-azul">
              </div>
            </div>
          </div>

          <div id="campoCanal" class="tarjeta-bdc tarjeta-calentamiento" style="display:none;">
            <label class="label-calentamiento">Canal perimetral:</label>
            <div class="form-group inline fila-bdc">
              <div class="campo-bdc">
                <label for="largoCanal">Largo total del canal (m):</label>
                <input type="number" id="largoCanal" step="0.01" class="input-azul">
              </div>
            </div>
          </div>
        </div>
      ` : "";

      contenedorPrincipal.innerHTML = `
        <div class="form-section animacion-aparecer" style="font-family: inherit;">
          <button id="btnVolverTipos" class="btn-volver">← Volver a tipos de sistema</button>
          <h2 class="titulo-sistema-activo">${tipo.replace(/([A-Z])/g, " $1")}</h2>
          <div class="sistema-contenido">
            <div class="columna-izquierda">
              ${bloquesDimensiones}
              ${bloqueUsoRotacion}
              ${bloqueDesborde}
              <div style="margin-top:20px;">
                <button id="btnIrCalentamiento" class="btn-principal">Ir a calentamiento →</button>
              </div>
            </div>
            <div class="columna-derecha">
              <div class="tarjeta-bdc tarjeta-imagen">
                <img src="./img/${config.img}" alt="${tipo}" class="imagen-sistema-activo">
                <p class="texto-imagen">Vista del sistema seleccionado</p>
              </div>
              <div id="ayudaContextual" class="ayuda-contextual" style="display:none;">
                <div class="ayuda-titulo">Descripción del campo</div>
                <div class="ayuda-texto">Pasa el cursor sobre un campo para ver su descripción.</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // llamar helpers que el proyecto original usa (si existen)
      try { if (typeof window.attachDepthNormalizationListeners === "function") window.attachDepthNormalizationListeners(true); } catch(e){}
      try { if (typeof window.inicializarEventosDesborde === "function") window.inicializarEventosDesborde(); } catch(e){}
      try { if (typeof window.inicializarAyudaContextual === "function") window.inicializarAyudaContextual(); } catch(e){}

      // los botones vuelven a la UI anterior
      const btnVolver = document.getElementById("btnVolverTipos");
      if (btnVolver) {
        btnVolver.addEventListener("click", () => {
          guardarDatos(tipo);
          window.tipoSistemaActual = null;
          setTipoSistemaActual(null);
          renderSeccion("dimensiones");
        });
      }

      const btnIrCal = document.getElementById("btnIrCalentamiento");
      if (btnIrCal) {
        btnIrCal.addEventListener("click", () => {
          guardarDatos(tipo);
          window.tipoSistemaActual = tipo;
          setTipoSistemaActual(tipo);
          renderSeccion("calentamiento");
        });
      }

      if (window.datosPorSistema?.[tipo] && typeof restaurarInputsSistema === "function") {
        setTimeout(() => restaurarInputsSistema(tipo), 100);
      }

      window.ultimoTipoSistema = tipo;
      setUltimoTipoSistema(tipo);

      // inicializar eventos desborde local (igual lógica que el original)
      (function inicializarEventosDesborde() {
        const radiosDesborde = document.querySelectorAll("input[name='desborde']");
        const campos = document.getElementById("camposDesborde");
        const campoInfinity = document.getElementById("campoInfinity");
        const campoCanal = document.getElementById("campoCanal");
        radiosDesborde.forEach(radio => {
          radio.addEventListener("change", () => {
            if (!campos) return;
            campos.style.display = "block";
            if (campoInfinity) campoInfinity.style.display = "none";
            if (campoCanal) campoCanal.style.display = "none";
            switch (radio.value) {
              case "infinity":
                if (campoInfinity) campoInfinity.style.display = "block";
                break;
              case "canal":
                if (campoCanal) campoCanal.style.display = "block";
                break;
              case "ambos":
                if (campoInfinity) campoInfinity.style.display = "block";
                if (campoCanal) campoCanal.style.display = "block";
                break;
              case "ninguno":
                if (campos) campos.style.display = "none";
                break;
            }
          });
        });
      })();

      // ayuda contextual
      (function inicializarAyudaContextual() {
        const ayuda = document.getElementById("ayudaContextual");
        if (!ayuda) return;
        const titulo = ayuda.querySelector(".ayuda-titulo");
        const texto = ayuda.querySelector(".ayuda-texto");
        const descripciones = {
          area1: "Superficie del cuerpo de agua en metros cuadrados.",
          profMin1: "Profundidad mínima del cuerpo de agua.",
          profMax1: "Profundidad máxima del cuerpo de agua.",
          usoCuerpo: "Define el uso del sistema: residencial, público o de competencia.",
          rotacion: "Tiempo que tarda en filtrarse completamente el volumen total de agua.",
          distCuarto: "Distancia entre la alberca y el cuarto de máquinas.",
          largoInfinity: "Longitud total del muro tipo infinity.",
          alturaDesborde: "Altura de caída del agua en el muro Infinity.",
          largoCanal: "Longitud total del canal perimetral."
        };
        document.querySelectorAll(".columna-izquierda input, .columna-izquierda select").forEach(el => {
          el.addEventListener("mouseenter", () => {
            const id = el.id;
            if (descripciones[id]) {
              titulo.textContent = el.labels?.[0]?.innerText || "Campo";
              texto.textContent = descripciones[id];
              ayuda.style.display = "flex";
              ayuda.style.opacity = "1";
            }
          });
          el.addEventListener("mouseleave", () => {
            ayuda.style.opacity = "0";
            setTimeout(() => (ayuda.style.display = "none"), 250);
          });
        });
      })();

    } catch (err) {
      console.error("mostrarFormularioSistema error:", err);
    }
  }, [guardarDatos, restaurarInputsSistema, renderSeccion]);

  // -------------------------
  // renderSeccion (mantener lógica tal cual)
  // -------------------------
  const renderSeccion = useCallback((seccion) => {
    try {
      const contenedor = document.getElementById("contenidoDerecho");
      if (!contenedor) return;
      contenedor.innerHTML = (window.secciones && window.secciones[seccion]) || "Sin contenido";

      // Restaurar listeners comunes (si existe la función global)
      try { if (typeof window.attachDepthNormalizationListeners === "function") window.attachDepthNormalizationListeners(); } catch(e){}

      // Sección "dimensiones"
      if (seccion === "dimensiones") {
        if (window._preventAutoOpenTipo) {
          window._preventAutoOpenTipo = false;
          inicializarEventosTipoSistema();
        } else if (window.tipoSistemaActual) {
          mostrarFormularioSistema(window.tipoSistemaActual);
          return;
        } else {
          inicializarEventosTipoSistema();
        }
        setTimeout(() => {
          try {
            if (typeof window.enhanceDimensionesUI === "function") window.enhanceDimensionesUI();
          } catch (err) {
            console.warn("Error al mejorar UI de dimensiones:", err);
          }
        }, 60);
      }

      // Restaurar valores globales (checkboxes, radios, etc.)
      if (typeof window.datos === "object") {
        for (let key in window.datos) {
          const el = document.getElementById(key);
          const radios = document.querySelectorAll(`input[name="${key}"]`);
          if (el) {
            if (el.type === "checkbox") el.checked = !!window.datos[key];
            else el.value = window.datos[key];
          } else if (radios.length > 0) {
            radios.forEach(r => (r.checked = r.value === window.datos[key]));
          }
        }
      }

      // Restaurar checkboxes de calentamiento si aplica
      ["chkBombaCalor", "chkPanel", "chkCaldera"].forEach(id => {
        if (document.getElementById(id)) {
          toggleInputs(id, "campo" + id.replace("chk", ""));
        }
      });

      // Listeners de ciudad (calentamiento)
      const ciudadSelect = document.getElementById("ciudad");
      if (ciudadSelect) {
        if (!ciudadSelect.dataset.listener) {
          ciudadSelect.addEventListener("change", () => {
            actualizarTablasClima();
            renderTabla(ciudadSelect.value);
          });
          ciudadSelect.dataset.listener = true;
        }
        actualizarTablasClima();
        if (ciudadSelect.value) renderTabla(ciudadSelect.value);
      }

      // Listeners calentamiento (checkboxes)
      ["chkBombaCalor", "chkPanel", "chkCaldera"].forEach(id => {
        const chk = document.getElementById(id);
        if (chk && !chk.dataset.listener) {
          chk.addEventListener("change", () =>
            toggleInputs(id, "campo" + id.replace("chk", ""))
          );
          chk.dataset.listener = true;
        }
      });

      if (seccion === "calentamiento") {
        const volverBtn = document.createElement("button");
        volverBtn.textContent = "← Volver a dimensiones";
        volverBtn.className = "btn-volver";
        volverBtn.style.marginBottom = "15px";
        const form = contenedor.querySelector(".clima-form");
        if (form) form.prepend(volverBtn);
        volverBtn.addEventListener("click", () => {
          guardarDatos(window.tipoSistemaActual);
          if (window.tipoSistemaActual) {
            mostrarFormularioSistema(window.tipoSistemaActual);
          } else {
            window._preventAutoOpenTipo = true;
            renderSeccion("dimensiones");
          }
        });

        setTimeout(() => {
          try { if (typeof window.engancharListenersCalentamiento === "function") window.engancharListenersCalentamiento(); } catch(e){}
          try { if (typeof window.qEvaporacion === "function") window.qEvaporacion(); } catch(e){}
          try { if (typeof window.qTuberia === "function") window.qTuberia(); } catch(e){}
        }, 50);

        if (window.datosPorSistema?.[window.tipoSistemaActual]) {
          setTimeout(() => restaurarInputsSistema(window.tipoSistemaActual), 80);
        }
      }

      if (seccion === "equipamiento") {
        console.log("⚙️ Sección 'Equipamiento' cargada correctamente ✅");
        setTimeout(() => {
          if (typeof buildEquipamientoUI === "function") {
            const tipo = window.tipoSistemaActual || window.ultimoTipoSistema || null;
            buildEquipamientoUI(tipo);
          } else {
            console.warn("⚠️ buildEquipamientoUI() no está definida todavía");
          }
        }, 50);
      }

      if (seccion === "dimensiones" && window.tipoSistemaActual && typeof restaurarInputsSistema === "function") {
        setTimeout(() => restaurarInputsSistema(window.tipoSistemaActual), 120);
      }

    } catch (err) {
      console.error("renderSeccion error:", err);
    }
  }, [buildEquipamientoUI, inicializarEventosTipoSistema, mostrarFormularioSistema, restaurarInputsSistema, actualizarTablasClima, renderTabla, toggleInputs, guardarDatos]);

  // -------------------------
  // Listeners globales: replicate original wiring (input/change/click)
  // -------------------------
  useEffect(() => {
    // conectar guardarCambio a input + change
    document.addEventListener("input", guardarCambio);
    document.addEventListener("change", guardarCambio);

    // listener para toggles en cambios generales (original)
    const onChangeGlobal = () => {
      try {
        toggleInputs("chkInfinity", "campoInfinity");
        toggleInputs("chkCanal", "campoCanal");
        toggleInputs("chkBombaCalor", "campoBombaCalor");
        toggleInputs("chkPanel", "campoPanel");
        toggleInputs("chkCaldera", "campoCaldera");
      } catch (err) {
        console.warn("global onChange error:", err);
      }
    };
    document.addEventListener("change", onChangeGlobal);

    // listener click para btnIrEquipamiento y btnVolverCalentamiento (delegado)
    const onClick = (e) => {
      try {
        const target = e.target;
        if (target && target.id === "btnIrEquipamiento") {
          e.preventDefault();
          const detailsEquip = document.querySelector('details[data-section="equipamiento"]');
          const panelDerecho = document.getElementById("contenidoDerecho");
          if (!detailsEquip || !panelDerecho) return;
          document.querySelectorAll("details").forEach(d => d.open = false);
          detailsEquip.open = true;

          const tipoActualDom = window.tipoSistemaActual || document.querySelector("input[name='tipoSistema']:checked")?.value;
          if (!tipoActualDom) {
            panelDerecho.innerHTML = (window.secciones && window.secciones.equipamiento) || "";
            return;
          }

          const readRadio = name => document.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
          const motobombaInfinity_dom = readRadio("motobombaInfinity");
          const motobombaCalentamiento_dom = readRadio("motobombaCalentamiento");

          window.datosPorSistema = window.datosPorSistema || {};
          window.datosPorSistema[tipoActualDom] = window.datosPorSistema[tipoActualDom] || {};

          const motobombaInfinity = motobombaInfinity_dom ?? window.datosPorSistema[tipoActualDom].motobombaInfinity ?? "no";
          const motobombaCalentamiento = motobombaCalentamiento_dom ?? window.datosPorSistema[tipoActualDom].motobombaCalentamiento ?? "no";

          window.datosPorSistema[tipoActualDom].motobombaInfinity = motobombaInfinity;
          window.datosPorSistema[tipoActualDom].motobombaCalentamiento = motobombaCalentamiento;

          panelDerecho.innerHTML = (window.secciones && window.secciones.equipamiento) || "";
          setTimeout(() => buildEquipamientoUI(tipoActualDom), 40);
          return;
        }

        if (target && target.id === "btnVolverCalentamiento") {
          e.preventDefault();
          const detailsCal = document.querySelector('details[data-section="calentamiento"]');
          const panelDerecho = document.getElementById("contenidoDerecho");
          if (detailsCal && panelDerecho && window.secciones?.calentamiento) {
            document.querySelectorAll("details").forEach(d => d.open = false);
            detailsCal.open = true;
            panelDerecho.innerHTML = window.secciones.calentamiento;
          }
          return;
        }
      } catch (err) {
        console.warn("global click handler error:", err);
      }
    };
    document.addEventListener("click", onClick);

    // permitir abrir el mismo tipo (original had a click listener)
    const onClickTipoSistema = (e) => {
      if (e.target && e.target.name === "tipoSistema") {
        const tipo = e.target.value;
        mostrarFormularioSistema(tipo);
      }
    };
    document.addEventListener("click", onClickTipoSistema);

    // listeners dentro de #contenidoDerecho para inputs que actualizan valores globales
    const onInputContenido = (e) => {
      if (e.target && e.target.closest && e.target.closest("#contenidoDerecho")) {
        actualizarValoresGlobales();
      }
    };
    document.addEventListener("input", onInputContenido);
    document.addEventListener("change", onInputContenido);

    // cleanup
    return () => {
      document.removeEventListener("input", guardarCambio);
      document.removeEventListener("change", guardarCambio);
      document.removeEventListener("change", onChangeGlobal);
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", onClickTipoSistema);
      document.removeEventListener("input", onInputContenido);
      document.removeEventListener("change", onInputContenido);
    };
  }, [guardarCambio, toggleInputs, buildEquipamientoUI, mostrarFormularioSistema, actualizarValoresGlobales]);

  // -------------------------
  // Exportar desde el hook (mantener nombres y permitir uso desde componentes)
  // -------------------------
  return {
    // estados
    datos,
    setDatos,
    datosPorSistema,
    setDatosPorSistema,
    tipoSistemaActual,
    setTipoSistemaActual,
    ultimoTipoSistema,
    setUltimoTipoSistema,

    // refs (exponer si quieres)
    datosRef,
    datosPorSistemaRef,
    tipoSistemaActualRef,
    ultimoTipoSistemaRef,

    // funciones (las mismas que venías usando)
    toggleInputs,
    guardarCambio,
    actualizarTablasClima,
    handleDesborde,
    buildEquipamientoUI,
    restaurarInputsSistema,
    inicializarEventosTipoSistema,
    actualizarValoresGlobales,
    sincronizarDatosGlobales,
    guardarDatos,
    mostrarFormularioSistema,
    renderSeccion
  };
}
