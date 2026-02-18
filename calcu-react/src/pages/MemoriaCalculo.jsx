import { useState, useEffect } from "react";
import { memoriaCalculo } from "../utils/memoriaCalculo";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt2(v) {
  const n = parseFloat(v);
  return isNaN(n) ? "—" : n.toFixed(2);
}

// ─── Sub-componentes de tabla ─────────────────────────────────────────────────

function TablaTramos({ resultado, titulo }) {
  const suma = resultado.reduce((acc, d) => acc + parseFloat(d.cargaTotal), 0);
  return (
    <div className="mc-tabla-wrap">
      <p className="mc-tabla-titulo">{titulo}</p>
      <table className="mc-tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Flujo (gpm)</th>
            <th>Tubería (in)</th>
            <th>Velocidad (ft/s)</th>
            <th>Carga base (ft/100ft)</th>
            <th>Longitud (m)</th>
            <th>Carga tramo (ft)</th>
            <th>Tees</th>
            <th>L.Eq. Tee (ft)</th>
            <th>Carga tee (ft)</th>
            <th>Codos</th>
            <th>L.Eq. Codo (ft)</th>
            <th>Carga codo (ft)</th>
            <th>Reducciones</th>
            <th>L.Eq. Red. (ft)</th>
            <th>Carga red. (ft)</th>
            <th className="mc-th-total">Carga total (ft)</th>
          </tr>
        </thead>
        <tbody>
          {resultado.map((d) => (
            <tr key={d.tramo}>
              <td>{d.tramo}</td>
              <td>{d.flujo}</td>
              <td>{d.tuberia}</td>
              <td>{d.velocidad}</td>
              <td>{d.cargaBase}</td>
              <td>{d.longitud}</td>
              <td>{d.cargaTramo}</td>
              <td>{d.cantidadTees}</td>
              <td>{d.longEqTee}</td>
              <td>{d.cargaTee}</td>
              <td>{d.cantidadCodos}</td>
              <td>{d.longEqCodo}</td>
              <td>{d.cargaCodo}</td>
              <td>{d.cantidadReducciones}</td>
              <td>{d.longEqReduccion}</td>
              <td>{d.cargaReduccion}</td>
              <td className="mc-td-total">{d.cargaTotal}</td>
            </tr>
          ))}
          <tr className="mc-tr-suma">
            <td colSpan={16} style={{ textAlign: "right" }}>
              Sumatoria carga tramos (ft):
            </td>
            <td>{fmt2(suma)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TablaCuarto({ tablaDistanciaCM, sufijo = "CM" }) {
  const d = tablaDistanciaCM;
  const k = (campo) => d[campo + sufijo] ?? d[campo] ?? "—";
  return (
    <div className="mc-tabla-wrap">
      <p className="mc-tabla-titulo">Tramo cuarto de máquinas</p>
      <table className="mc-tabla">
        <thead>
          <tr>
            <th>Flujo (gpm)</th>
            <th>Tubería (in)</th>
            <th>Velocidad (ft/s)</th>
            <th>Carga base (ft/100ft)</th>
            <th>Longitud (m)</th>
            <th>Carga tramo (ft)</th>
            <th>Codos</th>
            <th>L.Eq. Codo (ft)</th>
            <th>Carga codo (ft)</th>
            <th className="mc-th-total">Carga total (ft)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{k("flujo")}</td>
            <td>{k("tuberia")}</td>
            <td>{k("velocidad")}</td>
            <td>{k("cargaBase")}</td>
            <td>{k("distancia")}</td>
            <td>{k("cargaTramo")}</td>
            <td>1</td>
            <td>{k("longEqCodo")}</td>
            <td>{k("cargaCodo")}</td>
            <td className="mc-td-total">{k("cargaTotal")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TablaDisparo({ disparo, titulo }) {
  const d = disparo;
  return (
    <div className="mc-tabla-wrap">
      <p className="mc-tabla-titulo">{titulo}</p>
      <table className="mc-tabla">
        <thead>
          <tr>
            <th>Flujo (gpm)</th>
            <th>Tubería (in)</th>
            <th>Velocidad (ft/s)</th>
            <th>Carga base (ft/100ft)</th>
            <th>Longitud (m)</th>
            <th>Carga tramo (ft)</th>
            <th>Codos</th>
            <th>L.Eq. Codo (ft)</th>
            <th>Carga codo (ft)</th>
            <th>Reducciones</th>
            <th>L.Eq. Red. (ft)</th>
            <th>Carga red. (ft)</th>
            <th className="mc-th-total">Carga disparo total (ft)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{fmt2(d.flujoDisparo)}</td>
            <td>{d.diametroDisparo}</td>
            <td>{fmt2(d.velocidadDisparo)}</td>
            <td>{fmt2(d.cargaBaseDisparo)}</td>
            <td>{fmt2(d.longitudDisparo)}</td>
            <td>{fmt2(d.cargaDisparo)}</td>
            <td>1</td>
            <td>{fmt2(d.longEqCodoDisparo)}</td>
            <td>{fmt2(d.cargaCodoDisparo)}</td>
            <td>{d.longEqReduccionDisparo !== 0 ? 1 : 0}</td>
            <td>{fmt2(d.longEqReduccionDisparo)}</td>
            <td>{fmt2(d.cargaReduccionDisparo)}</td>
            <td className="mc-td-total">{fmt2(d.cargaDisparoTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TablaResumenMateriales({ resumenTramos, resumenDisparos = null, tituloTramos, tituloDisparos }) {
  const renderResumen = (resumen, titulo) => (
    <div>
      <p className="mc-tabla-titulo">{titulo}</p>
      <table className="mc-tabla mc-tabla-resumen">
        <thead>
          <tr>
            <th>Diámetro (in)</th>
            <th>Tubería (m)</th>
            <th>Tees</th>
            <th>Codos</th>
            <th>Reducciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(resumen).map(([diam, r]) => (
            <tr key={diam}>
              <td>{diam.replace("tuberia ", "")}</td>
              <td>{fmt2(r.tuberia_m)}</td>
              <td>{r.tees}</td>
              <td>{r.codos}</td>
              <td>{r.reducciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="mc-resumen-row">
      {renderResumen(resumenTramos, tituloTramos)}
      {resumenDisparos && renderResumen(resumenDisparos, tituloDisparos)}
    </div>
  );
}

function TablaSumatoria({ items, total }) {
  return (
    <div className="mc-sumatoria">
      <p className="mc-tabla-titulo">Sumatoria de cargas</p>
      <table className="mc-tabla mc-tabla-sumatoria">
        <tbody>
          {items.map(({ label, valor }) => (
            <tr key={label}>
              <td className="mc-sum-label">{label}</td>
              <td>{fmt2(valor)} ft</td>
            </tr>
          ))}
          <tr className="mc-tr-total">
            <td className="mc-sum-label">Carga dinámica total (ft):</td>
            <td>{fmt2(total)} ft</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Secciones por sistema ────────────────────────────────────────────────────

function SeccionRetornos({ data }) {
  const { resultado, sumaTramos, disparo, cargaDisparoTotal, tablaDistanciaCM, cargaDinamicaTotal, resumenTramos, resumenDisparos } = data;
  return (
    <div className="mc-seccion">
      <TablaTramos resultado={resultado} titulo="Tramos retornos" />
      <TablaCuarto tablaDistanciaCM={tablaDistanciaCM} sufijo="CM" />
      <TablaDisparo disparo={disparo} titulo="Disparo — tubería principal a retorno" />
      <div className="mc-bottom-row">
        <TablaResumenMateriales
          resumenTramos={resumenTramos}
          resumenDisparos={resumenDisparos}
          tituloTramos="Tramos"
          tituloDisparos="Disparos al retorno"
        />
        <TablaSumatoria
          items={[
            { label: "Carga tramo retornos (ft):", valor: sumaTramos },
            { label: "Carga a cuarto de máquinas (ft):", valor: parseFloat(tablaDistanciaCM.cargaTotalCM) },
            { label: "Carga disparos (ft):", valor: cargaDisparoTotal },
            { label: "Carga accesorio retornos (ft):", valor: 1.5 },
          ]}
          total={cargaDinamicaTotal}
        />
      </div>
    </div>
  );
}

function SeccionDesnatadores({ data }) {
  const { resultado, sumaTramos, disparo, cargaDisparoTotal, tablaDistanciaCM, cargaDinamicaTotal, resumenTramos, resumenDisparos } = data;
  return (
    <div className="mc-seccion">
      <TablaTramos resultado={resultado} titulo="Tramos desnatadores" />
      <TablaCuarto tablaDistanciaCM={tablaDistanciaCM} sufijo="CMD" />
      <TablaDisparo disparo={disparo} titulo="Disparo — tubería principal a desnatador" />
      <div className="mc-bottom-row">
        <TablaResumenMateriales
          resumenTramos={resumenTramos}
          resumenDisparos={resumenDisparos}
          tituloTramos="Tramos"
          tituloDisparos="Disparos al desnatador"
        />
        <TablaSumatoria
          items={[
            { label: "Carga tramo desnatadores (ft):", valor: sumaTramos },
            { label: "Carga a cuarto de máquinas (ft):", valor: parseFloat(tablaDistanciaCM.cargaTotalCMD) },
            { label: "Carga disparos (ft):", valor: cargaDisparoTotal },
            { label: "Carga accesorio desnatadores (ft):", valor: 1.5 },
          ]}
          total={cargaDinamicaTotal}
        />
      </div>
    </div>
  );
}

function SeccionDrenFondo({ data }) {
  const { resultado, sumaTramos, tablaDistanciaCM, cargaDinamicaTotal, resumenTramos } = data;
  return (
    <div className="mc-seccion">
      <TablaTramos resultado={resultado} titulo="Tramos drenes fondo" />
      <TablaCuarto tablaDistanciaCM={tablaDistanciaCM} sufijo="CMDF" />
      <div className="mc-bottom-row">
        <TablaResumenMateriales
          resumenTramos={resumenTramos}
          tituloTramos="Tramos"
        />
        <TablaSumatoria
          items={[
            { label: "Carga tramo drenes fondo (ft):", valor: sumaTramos },
            { label: "Carga a cuarto de máquinas (ft):", valor: parseFloat(tablaDistanciaCM.cargaTotalCMDF) },
            { label: "Carga accesorio drenes fondo (ft):", valor: 1.5 },
          ]}
          total={cargaDinamicaTotal}
        />
      </div>
    </div>
  );
}

function SeccionDrenCanal({ data }) {
  const { resultado, sumaTramos, tablaDistanciaCM, cargaDinamicaTotal, resumenTramos } = data;
  return (
    <div className="mc-seccion">
      <TablaTramos resultado={resultado} titulo="Tramos drenes canal" />
      <TablaCuarto tablaDistanciaCM={tablaDistanciaCM} sufijo="CMDC" />
      <div className="mc-bottom-row">
        <TablaResumenMateriales
          resumenTramos={resumenTramos}
          tituloTramos="Tramos"
        />
        <TablaSumatoria
          items={[
            { label: "Carga tramo drenes canal (ft):", valor: sumaTramos },
            { label: "Carga a cuarto de máquinas (ft):", valor: parseFloat(tablaDistanciaCM.cargaTotalCMDC) },
            { label: "Carga accesorio drenes canal (ft):", valor: 1.5 },
          ]}
          total={cargaDinamicaTotal}
        />
      </div>
    </div>
  );
}

function SeccionBarredoras({ data }) {
  const { resultado, sumaTramos, disparo, cargaDisparoTotal, tablaDistanciaCM, cargaDinamicaTotal, resumenTramos, resumenDisparos } = data;
  return (
    <div className="mc-seccion">
      <TablaTramos resultado={resultado} titulo="Tramos barredoras" />
      <TablaCuarto tablaDistanciaCM={tablaDistanciaCM} sufijo="CMB" />
      <TablaDisparo disparo={disparo} titulo="Disparo — tubería principal a barredora" />
      <div className="mc-bottom-row">
        <TablaResumenMateriales
          resumenTramos={resumenTramos}
          resumenDisparos={resumenDisparos}
          tituloTramos="Tramos"
          tituloDisparos="Disparos a barredora"
        />
        <TablaSumatoria
          items={[
            { label: "Carga tramo barredoras (ft):", valor: sumaTramos },
            { label: "Carga a cuarto de máquinas (ft):", valor: parseFloat(tablaDistanciaCM.cargaTotalCMB) },
            { label: "Carga disparos (ft):", valor: cargaDisparoTotal },
            { label: "Carga accesorio barredoras (ft):", valor: 1.5 },
          ]}
          total={cargaDinamicaTotal}
        />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function MemoriaCalculo() {
  const [memoria, setMemoria] = useState(null);
  const [tabActiva, setTabActiva] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("memoriaCalculo");
      if (!raw) throw new Error("No se encontraron datos de cálculo.");
      setMemoria(JSON.parse(raw));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  if (error) {
    return (
      <div className="mc-error">
        <p>⚠️ {error}</p>
        <p>Cierra esta ventana y vuelve a generar la memoria de cálculo.</p>
      </div>
    );
  }

  if (!memoria) {
    return <div className="mc-loading">Cargando memoria de cálculo…</div>;
  }

  const { resumen, retornos, desnatadores, drenFondo, drenCanal, barredoras } = memoria;

  // Tabs siempre visibles: Retornos, Desnatadores, Drenes Fondo, Barredoras
  // Condicionales: Drenes Canal (solo si hay datos)
  const tabs = [
    { label: "Retornos",      comp: <SeccionRetornos    data={retornos}    /> },
    { label: "Desnatadores",  comp: <SeccionDesnatadores data={desnatadores} /> },
    { label: "Drenes Fondo",  comp: <SeccionDrenFondo   data={drenFondo}   /> },
    ...(drenCanal?.resultado?.length > 0
      ? [{ label: "Drenes Canal", comp: <SeccionDrenCanal data={drenCanal} /> }]
      : []),
    { label: "Barredoras",    comp: <SeccionBarredoras  data={barredoras}  /> },
  ];

  return (
    <div className="mc-root">
      {/* Header */}
      <header className="mc-header">
        <h1 className="mc-titulo">Memoria de cálculo hidráulico</h1>
        <div className="mc-resumen-general">
          <span><strong>Volumen:</strong> {resumen.vol} m³</span>
          <span><strong>Flujo vol.:</strong> {resumen.flujoVol} gpm</span>
          <span><strong>Flujo infinity:</strong> {resumen.flujoInf} gpm</span>
          <span><strong>Flujo máximo:</strong> {resumen.flujoMax} gpm</span>
          <span><strong>Tubería succión:</strong> {resumen.tubSuccion}</span>
          <span><strong>Tubería descarga:</strong> {resumen.tubDescarga}</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="mc-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`mc-tab ${tabActiva === i ? "mc-tab-activa" : ""}`}
            onClick={() => setTabActiva(i)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenido del tab activo */}
      <main className="mc-contenido">
        {tabs[tabActiva]?.comp}
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          min-height: 100vh;
        }

        .mc-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .mc-header {
          background: #1e293b;
          border-bottom: 1px solid #334155;
          padding: 16px 24px;
        }
        .mc-titulo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #60a5fa;
          letter-spacing: 0.02em;
          margin-bottom: 10px;
        }
        .mc-resumen-general {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .mc-resumen-general strong { color: #e2e8f0; }

        /* Tabs */
        .mc-tabs {
          display: flex;
          gap: 2px;
          background: #1e293b;
          border-bottom: 2px solid #334155;
          padding: 0 16px;
        }
        .mc-tab {
          padding: 10px 20px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: color 0.15s, border-color 0.15s;
        }
        .mc-tab:hover { color: #e2e8f0; }
        .mc-tab-activa {
          color: #60a5fa;
          border-bottom-color: #60a5fa;
        }

        /* Contenido */
        .mc-contenido {
          flex: 1;
          padding: 20px 16px;
          overflow-x: auto;
        }
        .mc-seccion {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Tablas */
        .mc-tabla-wrap {
          overflow-x: auto;
        }
        .mc-tabla-titulo {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #60a5fa;
          background: #1e293b;
          border: 1px solid #334155;
          border-bottom: none;
          padding: 6px 12px;
          border-radius: 6px 6px 0 0;
          display: inline-block;
        }
        .mc-tabla {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 0 6px 6px 6px;
        }
        .mc-tabla th {
          background: #0f172a;
          color: #94a3b8;
          font-weight: 600;
          padding: 7px 10px;
          text-align: center;
          border: 1px solid #334155;
          white-space: nowrap;
        }
        .mc-tabla td {
          padding: 5px 10px;
          text-align: center;
          border: 1px solid #1e3a5f;
          color: #cbd5e1;
        }
        .mc-tabla tbody tr:hover { background: #0f2d4a; }
        .mc-th-total, .mc-td-total {
          background: #0c2340 !important;
          color: #60a5fa !important;
          font-weight: 700 !important;
        }
        .mc-tr-suma td {
          background: #1a3a5c;
          font-weight: 700;
          color: #93c5fd;
        }
        .mc-tabla-resumen { width: auto; min-width: 280px; }

        /* Fila inferior: materiales + sumatoria */
        .mc-bottom-row {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .mc-resumen-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        /* Sumatoria */
        .mc-sumatoria { min-width: 320px; }
        .mc-tabla-sumatoria { width: 100%; }
        .mc-sum-label {
          text-align: left !important;
          font-weight: 600;
          color: #94a3b8 !important;
        }
        .mc-tr-total td {
          background: #0c2340;
          color: #60a5fa !important;
          font-weight: 700;
        }

        /* Estados */
        .mc-error, .mc-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 12px;
          color: #94a3b8;
          font-size: 0.9rem;
        }
        .mc-error { color: #f87171; }
      `}</style>
    </div>
  );
}