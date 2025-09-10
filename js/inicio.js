// Objeto para guardar datos de usuario
const datos = {};

// Contenido de cada sección
const secciones = {
  dimensiones: `
    <label for="area">Área (m²):</label>
    <input type="number" id="area" step="0.01"><br>
    <label for="profMin">Profundidad mínima (m):</label>
    <input type="number" id="profMin" step="0.01"><br>
    <label for="profMax">Profundidad máxima (m):</label>
    <input type="number" id="profMax" step="0.01"><br>
    <label for="distCuarto">Distancia al cuarto de máquinas (m):</label>
    <input type="number" id="distCuarto" step="0.01"><br>
    <label for="rotacion">Tasa de rotación (h):</label>
    <select id="rotacion">
      <option value="0.5">0.5 horas</option>
      <option value="1">1 hora</option>
      <option value="4">4 horas</option>
      <option value="6">6 horas</option>
      <option value="8">8 horas</option>
      <option value="12">12 horas</option>
      <option value="18">18 horas</option>
      <option value="24">24 horas</option>
    </select>
  `,
  desborde: `
    <label><input type="checkbox" id="chkInfinity"> Infinity</label><br>
    <label><input type="checkbox" id="chkCanal"> Canal perimetral</label><br>
    <label><input type="checkbox" id="chkNinguno"> Ninguno</label><br>
    <div id="campoInfinity" class="oculto">
      <label for="largoInfinity">Largo del muro Infinity (m):</label>
      <input type="number" id="largoInfinity" step="0.01"><br>
      <label for="alturaDesborde">Altura desborde infinity (mm):</label>
      <input type="number" id="alturaDesborde" step="0.01"><br>
    </div>
    <div id="campoCanal" class="oculto">
      <label for="largoCanal">Largo del canal perimetral (m):</label>
      <input type="number" id="largoCanal" step="0.01"><br>
    </div>
  `,
  calentamiento: `
    <label><input type="checkbox" id="chkBombaCalor"> Bomba de calor</label><br>
    <label><input type="checkbox" id="chkPanel"> Panel solar</label><br>
    <label><input type="checkbox" id="chkCaldera"> Caldera</label><br>
    <div id="campoBombaCalor" class="oculto">
      <label for="cargaEstaticaBC">Diferencia de altura bomba de calor (m):</label>
      <input type="number" id="cargaEstaticaBC" step="0.01"><br>
    </div>
    <div id="campoPanel" class="oculto">
      <label for="cargaEstaticaPan">Diferencia de altura panel solar (m):</label>
      <input type="number" id="cargaEstaticaPan" step="0.01"><br>
    </div>
    <div id="campoCaldera" class="oculto">
      <label for="cargaEstaticaCal">Diferencia de altura caldera (m):</label>
      <input type="number" id="cargaEstaticaCal" step="0.01"><br>
    </div>
  `,
  ubicacion: `
    <label for="ciudad">Ciudad:</label>
    <select id="ciudad">
      <option value="guadalajara">Guadalajara</option>
      <option value="mexicali">Mexicali</option>
      <option value="losCabos">Los Cabos</option>
      <option value="hermosillo">Hermosillo</option>
      <option value="chihuahua">Chihuahua</option>
      <option value="torreon">Torreón</option>
      <option value="monterrey">Monterrey</option>
      <option value="tampico">Tampico</option>
      <option value="veracruz">Veracruz</option>
      <option value="sanLuisPotosi">San Luis Potosí</option>
      <option value="durango">Durango</option>
      <option value="culiacan">Culiacán</option>
      <option value="tepic">Tepic</option>
      <option value="colima">Colima</option>
      <option value="aguascalientes">Aguascalientes</option>
      <option value="zacatecas">Zacatecas</option>
      <option value="morelia">Morelia</option>
      <option value="leon">León</option>
      <option value="queretaro">Querétaro</option>
      <option value="pachuca">Pachuca</option>
      <option value="ciudadDeMexico">Ciudad de México</option>
      <option value="acapulco">Acapulco</option>
      <option value="cuernavaca">Cuernavaca</option>
      <option value="puebla">Puebla</option>
      <option value="tlaxcala">Tlaxcala</option>
      <option value="oaxaca">Oaxaca</option>
      <option value="villahermosa">Villahermosa</option>
      <option value="tuxtlaGutierrez">Tuxtla Gutiérrez</option>
      <option value="campeche">Campeche</option>
      <option value="merida">Mérida</option>
      <option value="cancun">Cancún</option>
      <option value="manzanillo">Manzanillo</option>
      <option value="puertoVallarta">Puerto Vallarta</option>
      <option value="huatulco">Huatulco</option>
      <option value="mazatlan">Mazatlán</option>
      <option value="puertoPeñasco">Puerto Peñasco</option>
      <option value="ixtapaZihuatanejo">Ixtapa / Zihuatanejo</option>
      <option value="saltillo">Saltillo</option>
    </select>
  `,
  sanitizacion: `
    <label><input type="checkbox" id="chkGenerador"> Generador de cloro</label><br>
    <label><input type="checkbox" id="chkOzonificador"> Ozonificador</label><br>
    <label><input type="checkbox" id="chkLamparaUV"> Lámpara U.V.</label><br>
  `,
  filtracion: `
    <label><input type="checkbox" id="chkPrefiltro"> Prefiltro</label><br>
    <label><input type="checkbox" id="chkFiltro"> Filtro</label><br>
  `,
  motobomba: `
    <label><input type="checkbox" id="chkMotobomba1V"> Motobomba 1 velocidad</label><br>
    <label><input type="checkbox" id="chkMotobombaVV"> Motobomba velocidad variable</label><br>
  `,
  empotrables: `
    <label for="retorno">Tipo boquilla de retorno:</label>
    <select id="retorno">
      <option value="1.5">1.5in</option>
      <option value="2.0">2.0in</option>
    </select><br>
    <label for="desnatador">Tipo desnatador:</label>
    <select id="desnatador">
      <option value="1.5">1.5in</option>
      <option value="2.0">2.0in</option>
    </select><br>
    <label for="drenFondo">Tipo dren de fondo:</label>
    <select id="drenFondo">
      <option value="1.5">1.5in</option>
      <option value="2.0">2.0in</option>
      <option value="7.5">7.5in</option>
      <option value="8.0">8.0in</option>
      <option value="9.0">9.0in</option>
      <option value="12.0">12.0in</option>
      <option value="18.0">18.0in</option>
    </select><br>
    <label for="drenCanal">Tipo dren de canal:</label>
    <select id="drenCanal">
      <option value="1.5">1.5in</option>
      <option value="2.0">2.0in</option>
      <option value="7.5">7.5in</option>
      <option value="8.0">8.0in</option>
      <option value="9.0">9.0in</option>
    </select><br>
    <label for="barredora">Tipo boquilla de barredora:</label>
    <select id="barredora">
      <option value="1.5">1.5in</option>
      <option value="2.0">2.0in</option>
    </select><br>
    <label for="mangueraBarredora">Largo manguera de barredora:</label>
    <select id="mangueraBarredora">
      <option value="7.5">7.5m</option>
      <option value="9.0">9.0m</option>
      <option value="10.5">10.5m</option>
      <option value="12.0">12.0m</option>
      <option value="15.0">15.0m</option>
      <option value="50.0">50.0m</option>
    </select>
  `
};

// Función para renderizar y restaurar valores previos
function renderSeccion(seccion) {
  const contenedor = document.getElementById("contenidoDerecho");
  contenedor.innerHTML = secciones[seccion] || "Sin contenido";

  // Restaurar valores previos guardados
  for (let id in datos) {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === "checkbox") {
        el.checked = datos[id];
      } else {
        el.value = datos[id];
      }
    }
  }
}

// Listener para abrir secciones
document.querySelectorAll(".panel-izquierdo details").forEach(det => {
  det.addEventListener("toggle", function () {
    if (this.open) {
      const seccion = this.dataset.section;
      renderSeccion(seccion);

      // Cerrar los demás
      document.querySelectorAll(".panel-izquierdo details").forEach(d => {
        if (d !== this) d.open = false;
      });
    }
  });
});

// Guardar valores al escribir/cambiar
document.addEventListener("input", (e) => {
  if (e.target.id) {
    datos[e.target.id] = e.target.value;
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id) {
    if (e.target.type === "checkbox") {
      datos[e.target.id] = e.target.checked;
    } else {
      datos[e.target.id] = e.target.value;
    }
  }
});

function calcular() {
    const vol = volumen();
    const flujoVol = flujoVolumen();
    const flujoInf = flujoInfinity();
    const flujoMax = flujoMaximo(flujoVol, flujoInf);
    const resultadoFlujo = velocidadCargaFlujo(flujoMax);
    const velFlujo = resultadoFlujo.velocidadFlujo;
    const tubSuccion = tuberiaSeleccionada(velFlujo, "succion");
    const tubDescarga = tuberiaSeleccionada(velFlujo, "descarga");

    const tipoRetorno = datos["retorno"] || "1.5";  
    const retornoDatos = retorno(flujoMax, tipoRetorno);
    const { resultadoR, resumenTramosR, resumenDisparosR, tablaDistanciaCM } = retornoDatos;
    const disparoR = resultadoR[0];
    const flujoDisparoR = disparoR.flujoDisparo;
    const diametroDisparoR = disparoR.diametroDisparo;
    const velocidadDisparoR = disparoR.velocidadDisparo;
    const cargaBaseDisparoR = disparoR.cargaBaseDisparo;
    const cargaDisparoR = disparoR.cargaDisparo;
    const longitudDisparoR = disparoR.longitudDisparo;
    const longEqCodoDisparoR = disparoR.longEqCodoDisparo;
    const cargaCodoDisparoR = disparoR.cargaCodoDisparo;
    const longEqReduccionDisparoR = disparoR.longEqReduccionDisparo;
    const cargaReduccionDisparoR = disparoR.cargaReduccionDisparo;
    const cargaDisparoTotalR = disparoR.cargaDisparoTotal;

let retornoHTML = `
<table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
  <caption class="subtitulo-retornos">TRAMO RETORNOS</caption>
  <thead>
    <tr>
      <th>Número retorno</th>
      <th>Flujo tramo (gpm)</th>
      <th>Diámetro tubería tramo (in)</th>
      <th>Velocidad tramo (ft/s)</th>
      <th>Carga base tramo (ft/100ft)</th>
      <th>Longitud tramo (m)</th>
      <th>Carga tramo (ft)</th>
      <th>Cantidad Tees</th>
      <th>L. Eq. Tee (ft)</th>
      <th>Carga Tee (ft)</th>
      <th>Cantidad Codos</th>
      <th>L. Eq. Codo (ft)</th>
      <th>Carga Codo (ft)</th>
      <th>Cantidad Reducciones</th>
      <th>L. Eq. Reducción (ft)</th>
      <th>Carga Reducción (ft)</th>
      <th><strong>Carga tramo total (ft)</strong></th>
    </tr>
  </thead>
  <tbody>
`;
let sumaCargaTotalR = 0;
resultadoR.forEach(dato => {
  retornoHTML += `
    <tr>
      <td>${dato.tramo}</td>
      <td>${dato.flujo}</td>
      <td>${dato.tuberia}</td>
      <td>${dato.velocidad}</td>
      <td>${dato.cargaBase}</td>
      <td>${dato.longitud}</td>
      <td>${dato.cargaTramo}</td>
      <td>${dato.cantidadTees}</td>
      <td>${dato.longEqTee}</td>
      <td>${dato.cargaTee}</td>
      <td>${dato.cantidadCodos}</td>
      <td>${dato.longEqCodo}</td>
      <td>${dato.cargaCodo}</td>
      <td>${dato.cantidadReducciones}</td>
      <td>${dato.longEqReduccion}</td>
      <td>${dato.cargaReduccion}</td>
      <td><strong>${dato.cargaTotal}</strong></td>
    </tr>
  `;
  sumaCargaTotalR += parseFloat(dato.cargaTotal);
});
retornoHTML += `
  <tr>
    <td colspan="16" style="text-align: right;"><strong>Sumatoria carga tramo retornos (ft):</strong></td>
    <td><strong>${sumaCargaTotalR.toFixed(2)}</strong></td>
    </tr>`;
    retornoHTML += `</tbody></table>`;

    cuartoHTML = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE TUBERIA DEL CUARTO DE MAQUINAS AL CUERPO DE AGUA</caption>
            <thead>
                <tr>
                    <th>Flujo<br>tramo (gpm)</th>
                    <th>Diámetro<br>tubería tramo (in)</th>
                    <th>Velocidad<br>tramo (ft/s)</th>
                    <th>Carga Base<br>tramo (ft/100ft)</th>
                    <th>Longitud<br>tramo (m)</th>
                    <th>Carga<br>Tramo (ft)</th>
                    <th>Cantidad<br>Codos</th>
                    <th>L. Eq.<br>Codo (ft)</th>
                    <th>Carga<br>Codo (ft)</th>
                    <th>Carga<br>tramo total (ft)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${tablaDistanciaCM.flujoCM}</td>
                    <td>${tablaDistanciaCM.tuberiaCM}</td>
                    <td>${tablaDistanciaCM.velocidadCM}</td>
                    <td>${tablaDistanciaCM.cargaBaseCM}</td>
                    <td>${tablaDistanciaCM.distanciaCM}</td>
                    <td>${tablaDistanciaCM.cargaTramoCM}</td>
                    <td>1</td>
                    <td>${tablaDistanciaCM.longEqCodoCM}</td>
                    <td>${tablaDistanciaCM.cargaCodoCM}</td>
                    <td><strong>${tablaDistanciaCM.cargaTotalCM}</strong></td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: right;"><strong>Carga tramo a cuarto de máquinas (ft):</strong></td>
                    <td><strong>${tablaDistanciaCM.cargaTotalCM}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
let disparoHTMLR = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE DISPARO TUBERIA PRINCIPAL A RETORNO</caption>
  <thead>
    <tr>
      <th>Flujo<br>tramo (gpm)</th>
      <th>Diámetro<br>tubería tramo (in)</th>
      <th>Velocidad<br>tramo (ft/s)</th>
      <th>Carga base<br>tramo (ft/100ft)</th>
      <th>Longitud<br>tramo (m)</th>
      <th>Carga<br>tramo (ft)</th>
      <th>Cantidad<br>Codos</th>
      <th>L. Eq.<br>Codo (ft)</th>
      <th>Carga<br>Codo (ft)</th>
      <th>Cantidad<br>Reducciones</th>
      <th>L. Eq.<br>Reducción (ft)</th>
      <th>Carga<br>Reducción (ft)</th>
      <th>Carga<br>disparo total (ft)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${flujoDisparoR.toFixed(2)}</td>
      <td>${diametroDisparoR}</td>
      <td>${velocidadDisparoR.toFixed(2)}</td>
      <td>${cargaBaseDisparoR.toFixed(2)}</td>
      <td>${longitudDisparoR.toFixed(2)}</td>
      <td>${cargaDisparoR.toFixed(2)}</td>
      <td>1</td>
      <td>${longEqCodoDisparoR.toFixed(2)}</td>
      <td>${cargaCodoDisparoR.toFixed(2)}</td>
      <td>${longEqReduccionDisparoR !== 0 ? 1 : 0}</td>
      <td>${longEqReduccionDisparoR.toFixed(2)}</td>
      <td>${cargaReduccionDisparoR.toFixed(2)}</td>
      <td><strong>${cargaDisparoTotalR.toFixed(2)}</strong></td>
        </tr>
                <tr>
                    <td colspan="12" style="text-align: right;"><strong>Carga tramo disparos (ft):</strong></td>
                    <td><strong>${cargaDisparoTotalR.toFixed(2)}</strong></td>
                </tr>
        </tbody>
</table>
`;

let sumatoriaHTMLR = `
<div style="width: 350px;">
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align:right;">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center; background:#f5f5f5;">Sumatoria de cargas</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga tramo retornos (ft):</td>
            <td>${sumaCargaTotalR.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga a cuarto de máquinas (ft):</td>
            <td>${parseFloat(tablaDistanciaCM.cargaTotalCM).toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga disparos (ft):</td>
            <td>${cargaDisparoTotalR.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga accesorio retornos (ft):</td>
            <td>${(1.5).toFixed(2)} ft</td>
        </tr>
        <tr style="background:#f5f5f5; font-weight:bold;">
            <td style="text-align:left;">Carga dinámica total (ft):</td>
            <td>${(sumaCargaTotalR + cargaDisparoTotalR + parseFloat(tablaDistanciaCM.cargaTotalCM) + 1.5).toFixed(2)} ft</td>
        </tr>
    </tbody>
  </table>
</div>
`;

let resumenHTMLTramosR = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">TRAMOS</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenTramosR)) {
    resumenHTMLTramosR += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLTramosR += `</tbody></table>`;
let resumenHTMLDisparosR = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">DISPAROS AL RETORNO</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenDisparosR)) {
    resumenHTMLDisparosR += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLDisparosR += `</tbody></table>`;
const tablasHTMLR = `
<div class="contenedor-tablas">
  ${resumenHTMLTramosR}
  ${resumenHTMLDisparosR}
</div>`;

    const tipoDesnatador = datos["desnatador"] || "1.5";
    const desnatadorDatos = desnatador(flujoMax, tipoDesnatador);
    const { resultadoD, resumenTramosD, resumenDisparosD, tablaDistanciaCMD } = desnatadorDatos;
    const disparoD = resultadoD[0];
    const flujoDisparoD = disparoD.flujoDisparo;
    const diametroDisparoD = disparoD.diametroDisparo;
    const velocidadDisparoD = disparoD.velocidadDisparo;
    const cargaBaseDisparoD = disparoD.cargaBaseDisparo;
    const cargaDisparoD = disparoD.cargaDisparo;
    const longitudDisparoD = disparoD.longitudDisparo;
    const longEqCodoDisparoD = disparoD.longEqCodoDisparo;
    const cargaCodoDisparoD = disparoD.cargaCodoDisparo;
    const longEqReduccionDisparoD = disparoD.longEqReduccionDisparo;
    const cargaReduccionDisparoD = disparoD.cargaReduccionDisparo;
    const cargaDisparoTotalD = disparoD.cargaDisparoTotal;

let desnatadorHTML = `
<table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
  <caption class="subtitulo-retornos">TRAMO DESNATADORES</caption>
  <thead>
    <tr>
      <th>Número desnatador</th>
      <th>Flujo tramo (gpm)</th>
      <th>Diámetro tubería tramo (in)</th>
      <th>Velocidad tramo (ft/s)</th>
      <th>Carga base tramo (ft/100ft)</th>
      <th>Longitud tramo (m)</th>
      <th>Carga tramo (ft)</th>
      <th>Cantidad Tees</th>
      <th>L. Eq. Tee (ft)</th>
      <th>Carga Tee (ft)</th>
      <th>Cantidad Codos</th>
      <th>L. Eq. Codo (ft)</th>
      <th>Carga Codo (ft)</th>
      <th>Cantidad Reducciones</th>
      <th>L. Eq. Reducción (ft)</th>
      <th>Carga Reducción (ft)</th>
      <th><strong>Carga tramo total (ft)</strong></th>
    </tr>
  </thead>
  <tbody>
`;
let sumaCargaTotalD = 0;
resultadoD.forEach(dato => {
  desnatadorHTML += `
    <tr>
      <td>${dato.tramo}</td>
      <td>${dato.flujo}</td>
      <td>${dato.tuberia}</td>
      <td>${dato.velocidad}</td>
      <td>${dato.cargaBase}</td>
      <td>${dato.longitud}</td>
      <td>${dato.cargaTramo}</td>
      <td>${dato.cantidadTees}</td>
      <td>${dato.longEqTee}</td>
      <td>${dato.cargaTee}</td>
      <td>${dato.cantidadCodos}</td>
      <td>${dato.longEqCodo}</td>
      <td>${dato.cargaCodo}</td>
      <td>${dato.cantidadReducciones}</td>
      <td>${dato.longEqReduccion}</td>
      <td>${dato.cargaReduccion}</td>
      <td><strong>${dato.cargaTotal}</strong></td>
    </tr>
  `;
  sumaCargaTotalD += parseFloat(dato.cargaTotal);
});
desnatadorHTML += `
  <tr>
    <td colspan="16" style="text-align: right;"><strong>Sumatoria total carga tramo (ft):</strong></td>
    <td><strong>${sumaCargaTotalD.toFixed(2)}</strong></td>
    </tr>`;
    desnatadorHTML += `</tbody></table>`;

    cuartoHTMLD = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE TUBERIA DEL CUARTO DE MAQUINAS AL CUERPO DE AGUA</caption>
            <thead>
                <tr>
                    <th>Flujo<br>tramo (gpm)</th>
                    <th>Diámetro<br>tubería tramo (in)</th>
                    <th>Velocidad<br>tramo (ft/s)</th>
                    <th>Carga Base<br>tramo (ft/100ft)</th>
                    <th>Longitud<br>tramo (m)</th>
                    <th>Carga<br>Tramo (ft)</th>
                    <th>Cantidad<br>Codos</th>
                    <th>L. Eq.<br>Codo (ft)</th>
                    <th>Carga<br>Codo (ft)</th>
                    <th>Carga<br>tramo total (ft)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${tablaDistanciaCMD.flujoCMD}</td>
                    <td>${tablaDistanciaCMD.tuberiaCMD}</td>
                    <td>${tablaDistanciaCMD.velocidadCMD}</td>
                    <td>${tablaDistanciaCMD.cargaBaseCMD}</td>
                    <td>${tablaDistanciaCMD.distanciaCMD}</td>
                    <td>${tablaDistanciaCMD.cargaTramoCMD}</td>
                    <td>1</td>
                    <td>${tablaDistanciaCMD.longEqCodoCMD}</td>
                    <td>${tablaDistanciaCMD.cargaCodoCMD}</td>
                    <td><strong>${tablaDistanciaCMD.cargaTotalCMD}</strong></td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: right;"><strong>Carga tramo a cuarto de máquinas (ft):</strong></td>
                    <td><strong>${tablaDistanciaCMD.cargaTotalCMD}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

let disparoHTMLD = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE DISPARO TUBERIA PRINCIPAL A DESNATADOR</caption>  <thead>
    <tr>
      <th>Flujo<br>tramo (gpm)</th>
      <th>Diámetro<br>tubería tramo (in)</th>
      <th>Velocidad<br>tramo (ft/s)</th>
      <th>Carga base<br>tramo (ft/100ft)</th>
      <th>Longitud<br>tramo (m)</th>
      <th>Carga<br>tramo (ft)</th>
      <th>Cantidad<br>Codos</th>
      <th>L. Eq.<br>Codo (ft)</th>
      <th>Carga<br>Codo (ft)</th>
      <th>Cantidad<br>Reducciones</th>
      <th>L. Eq.<br>Reducción (ft)</th>
      <th>Carga<br>Reducción (ft)</th>
      <th>Carga<br>disparo total (ft)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${flujoDisparoD.toFixed(2)}</td>
      <td>${diametroDisparoD}</td>
      <td>${velocidadDisparoD.toFixed(2)}</td>
      <td>${cargaBaseDisparoD.toFixed(2)}</td>
      <td>${longitudDisparoD.toFixed(2)}</td>
      <td>${cargaDisparoD.toFixed(2)}</td>
      <td>1</td>
      <td>${longEqCodoDisparoD.toFixed(2)}</td>
      <td>${cargaCodoDisparoD.toFixed(2)}</td>
      <td>${longEqReduccionDisparoD !== 0 ? 1 : 0}</td>
      <td>${longEqReduccionDisparoD.toFixed(2)}</td>
      <td>${cargaReduccionDisparoD.toFixed(2)}</td>
      <td><strong>${cargaDisparoTotalD.toFixed(2)}</strong></td>
    </tr>
                <tr>
                    <td colspan="12" style="text-align: right;"><strong>Carga tramo disparos (ft):</strong></td>
                    <td><strong>${cargaDisparoTotalD.toFixed(2)}</strong></td>
                </tr>
        </tbody>
</table>
`;

let sumatoriaHTMLD = `
<div style="width: 350px;">
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align:right;">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center; background:#f5f5f5;">Sumatoria de cargas</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga tramo desnatadores (ft):</td>
            <td>${sumaCargaTotalD.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga a cuarto de máquinas (ft):</td>
            <td>${parseFloat(tablaDistanciaCMD.cargaTotalCMD).toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga disparos (ft):</td>
            <td>${cargaDisparoTotalD.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga accesorio desnatadores (ft):</td>
            <td>${(1.5).toFixed(2)} ft</td>
        </tr>
        <tr style="background:#f5f5f5; font-weight:bold;">
            <td style="text-align:left;">Carga dinámica total (ft):</td>
            <td>${(sumaCargaTotalD + cargaDisparoTotalD + parseFloat(tablaDistanciaCMD.cargaTotalCMD) + 1.5).toFixed(2)} ft</td>
        </tr>
    </tbody>
  </table>
</div>
`;

let resumenHTMLTramosD = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">TRAMOS</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenTramosD)) {
    resumenHTMLTramosD += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLTramosD += `</tbody></table>`;
let resumenHTMLDisparosD = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">DISPAROS AL DESNATADOR</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenDisparosD)) {
    resumenHTMLDisparosD += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLDisparosD += `</tbody></table>`;
const tablasHTMLD = `
<div class="contenedor-tablas">
  ${resumenHTMLTramosD}
  ${resumenHTMLDisparosD}
</div>`;

    const tipoDrenFondo = datos["drenFondo"] || "1.5";
    const drenFondoDatos = drenFondo(flujoMax, tipoDrenFondo);
    const { resultadoDF, resumenTramosDF, tablaDistanciaCMDF } = drenFondoDatos;

let drenFondoHTML = `
<table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
  <caption class="subtitulo-retornos">TRAMO DRENES FONDO</caption>
  <thead>
    <tr>
      <th>Número dren fondo</th>
      <th>Flujo tramo (gpm)</th>
      <th>Diámetro tubería tramo (in)</th>
      <th>Velocidad tramo (ft/s)</th>
      <th>Carga base tramo (ft/100ft)</th>
      <th>Longitud tramo (m)</th>
      <th>Carga tramo (ft)</th>
      <th>Cantidad Tees</th>
      <th>L. Eq. Tee (ft)</th>
      <th>Carga Tee (ft)</th>
      <th>Cantidad Codos</th>
      <th>L. Eq. Codo (ft)</th>
      <th>Carga Codo (ft)</th>
      <th>Cantidad Reducciones</th>
      <th>L. Eq. Reducción (ft)</th>
      <th>Carga Reducción (ft)</th>
      <th><strong>Carga tramo total (ft)</strong></th>
    </tr>
  </thead>
  <tbody>
`;
let sumaCargaTotalDF = 0;
resultadoDF.forEach(dato => {
  drenFondoHTML += `
    <tr>
      <td>${dato.tramo}</td>
      <td>${dato.flujo}</td>
      <td>${dato.tuberia}</td>
      <td>${dato.velocidad}</td>
      <td>${dato.cargaBase}</td>
      <td>${dato.longitud}</td>
      <td>${dato.cargaTramo}</td>
      <td>${dato.cantidadTees}</td>
      <td>${dato.longEqTee}</td>
      <td>${dato.cargaTee}</td>
      <td>${dato.cantidadCodos}</td>
      <td>${dato.longEqCodo}</td>
      <td>${dato.cargaCodo}</td>
      <td>${dato.cantidadReducciones}</td>
      <td>${dato.longEqReduccion}</td>
      <td>${dato.cargaReduccion}</td>
      <td><strong>${dato.cargaTotal}</strong></td>
    </tr>
  `;
  sumaCargaTotalDF += parseFloat(dato.cargaTotal);
});
drenFondoHTML += `
  <tr>
    <td colspan="16" style="text-align: right;"><strong>Sumatoria total carga tramo (ft)</strong></td>
    <td><strong>${sumaCargaTotalDF.toFixed(2)}</strong></td>
    </tr>`;
    drenFondoHTML += `</tbody></table>`;

    cuartoHTMLDF = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE TUBERIA DEL CUARTO DE MAQUINAS AL CUERPO DE AGUA</caption>
            <thead>
                <tr>
                    <th>Flujo<br>tramo (gpm)</th>
                    <th>Diámetro<br>tubería tramo (in)</th>
                    <th>Velocidad<br>tramo (ft/s)</th>
                    <th>Carga Base<br>tramo (ft/100ft)</th>
                    <th>Longitud<br>tramo (m)</th>
                    <th>Carga<br>Tramo (ft)</th>
                    <th>Cantidad<br>Codos</th>
                    <th>L. Eq.<br>Codo (ft)</th>
                    <th>Carga<br>Codo (ft)</th>
                    <th>Carga<br>tramo total (ft)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${tablaDistanciaCMDF.flujoCMDF}</td>
                    <td>${tablaDistanciaCMDF.tuberiaCMDF}</td>
                    <td>${tablaDistanciaCMDF.velocidadCMDF}</td>
                    <td>${tablaDistanciaCMDF.cargaBaseCMDF}</td>
                    <td>${tablaDistanciaCMDF.distanciaCMDF}</td>
                    <td>${tablaDistanciaCMDF.cargaTramoCMDF}</td>
                    <td>1</td>
                    <td>${tablaDistanciaCMDF.longEqCodoCMDF}</td>
                    <td>${tablaDistanciaCMDF.cargaCodoCMDF}</td>
                    <td><strong>${tablaDistanciaCMDF.cargaTotalCMDF}</strong></td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: right;"><strong>Carga tramo a cuarto de máquinas (ft):</strong></td>
                    <td><strong>${tablaDistanciaCMDF.cargaTotalCMDF}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

let sumatoriaHTMLDF = `
<div style="width: 350px;">
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align:right;">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center; background:#f5f5f5;">Sumatoria de cargas</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga tramo drenes fondo (ft):</td>
            <td>${sumaCargaTotalDF.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga a cuarto de máquinas (ft):</td>
            <td>${parseFloat(tablaDistanciaCMDF.cargaTotalCMDF).toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga accesorio drenes fondo (ft):</td>
            <td>${(1.5).toFixed(2)} ft</td>
        </tr>
        <tr style="background:#f5f5f5; font-weight:bold;">
            <td style="text-align:left;">Carga dinámica total (ft):</td>
            <td>${(sumaCargaTotalDF + parseFloat(tablaDistanciaCMDF.cargaTotalCMDF) + 1.5).toFixed(2)} ft</td>
        </tr>
    </tbody>
  </table>
</div>
`;

let resumenHTMLTramosDF = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">TRAMOS</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
// Ordenar los diámetros de mayor a menor antes de recorrer
const entradasOrdenadasDF = Object.entries(resumenTramosDF).sort((a, b) => {
  const diamA = parseFloat(a[0].replace("tuberia ", ""));
  const diamB = parseFloat(b[0].replace("tuberia ", ""));
  return diamB - diamA; // mayor a menor
});
for (const [diam, r] of entradasOrdenadasDF) {
    resumenHTMLTramosDF += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLTramosDF += `</tbody></table>`;

const tablasHTMLDF = `
<div class="contenedor-tablas">
  ${resumenHTMLTramosDF}
</div>`;

    const tipoDrenCanal = datos["drenCanal"] || "1.5";  
    const drenCanalDatos = drenCanal(flujoMax, tipoDrenCanal);
    const { resultadoDC, resumenTramosDC, tablaDistanciaCMDC } = drenCanalDatos;

let drenCanalHTML = `
<table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
  <caption class="subtitulo-retornos">TRAMO DRENES CANAL</caption>
  <thead>
    <tr>
      <th>Número dren fondo</th>
      <th>Flujo tramo (gpm)</th>
      <th>Diámetro tubería tramo (in)</th>
      <th>Velocidad tramo (ft/s)</th>
      <th>Carga base tramo (ft/100ft)</th>
      <th>Longitud tramo (m)</th>
      <th>Carga tramo (ft)</th>
      <th>Cantidad Tees</th>
      <th>L. Eq. Tee (ft)</th>
      <th>Carga Tee (ft)</th>
      <th>Cantidad Codos</th>
      <th>L. Eq. Codo (ft)</th>
      <th>Carga Codo (ft)</th>
      <th>Cantidad Reducciones</th>
      <th>L. Eq. Reducción (ft)</th>
      <th>Carga Reducción (ft)</th>
      <th><strong>Carga tramo total (ft)</strong></th>
    </tr>
  </thead>
  <tbody>
`;
let sumaCargaTotalDC = 0;
resultadoDC.forEach(dato => {
  drenCanalHTML += `
    <tr>
      <td>${dato.tramo}</td>
      <td>${dato.flujo}</td>
      <td>${dato.tuberia}</td>
      <td>${dato.velocidad}</td>
      <td>${dato.cargaBase}</td>
      <td>${dato.longitud}</td>
      <td>${dato.cargaTramo}</td>
      <td>${dato.cantidadTees}</td>
      <td>${dato.longEqTee}</td>
      <td>${dato.cargaTee}</td>
      <td>${dato.cantidadCodos}</td>
      <td>${dato.longEqCodo}</td>
      <td>${dato.cargaCodo}</td>
      <td>${dato.cantidadReducciones}</td>
      <td>${dato.longEqReduccion}</td>
      <td>${dato.cargaReduccion}</td>
      <td><strong>${dato.cargaTotal}</strong></td>
    </tr>
  `;
  sumaCargaTotalDC += parseFloat(dato.cargaTotal);
});
drenCanalHTML += `
  <tr>
    <td colspan="16" style="text-align: right;"><strong>Sumatoria total carga tramo (ft)</strong></td>
    <td><strong>${sumaCargaTotalDC.toFixed(2)}</strong></td>
    </tr>`;
    drenCanalHTML += `</tbody></table>`;

    cuartoHTMLDC = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE TUBERIA DEL CUARTO DE MAQUINAS AL CUERPO DE AGUA</caption>
            <thead>
                <tr>
                    <th>Flujo<br>tramo (gpm)</th>
                    <th>Diámetro<br>tubería tramo (in)</th>
                    <th>Velocidad<br>tramo (ft/s)</th>
                    <th>Carga Base<br>tramo (ft/100ft)</th>
                    <th>Longitud<br>tramo (m)</th>
                    <th>Carga<br>Tramo (ft)</th>
                    <th>Cantidad<br>Codos</th>
                    <th>L. Eq.<br>Codo (ft)</th>
                    <th>Carga<br>Codo (ft)</th>
                    <th>Carga<br>tramo total (ft)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${tablaDistanciaCMDC.flujoCMDC}</td>
                    <td>${tablaDistanciaCMDC.tuberiaCMDC}</td>
                    <td>${tablaDistanciaCMDC.velocidadCMDC}</td>
                    <td>${tablaDistanciaCMDC.cargaBaseCMDC}</td>
                    <td>${tablaDistanciaCMDC.distanciaCMDC}</td>
                    <td>${tablaDistanciaCMDC.cargaTramoCMDC}</td>
                    <td>1</td>
                    <td>${tablaDistanciaCMDC.longEqCodoCMDC}</td>
                    <td>${tablaDistanciaCMDC.cargaCodoCMDC}</td>
                    <td><strong>${tablaDistanciaCMDC.cargaTotalCMDC}</strong></td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: right;"><strong>Carga tramo a cuarto de máquinas (ft):</strong></td>
                    <td><strong>${tablaDistanciaCMDC.cargaTotalCMDC}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

let sumatoriaHTMLDC = `
<div style="width: 350px;">
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align:right;">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center; background:#f5f5f5;">Sumatoria de cargas</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga tramo drenes canal (ft):</td>
            <td>${sumaCargaTotalDC.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga a cuarto de máquinas (ft):</td>
            <td>${parseFloat(tablaDistanciaCMDC.cargaTotalCMDC).toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga accesorio drenes canal (ft):</td>
            <td>${(1.5).toFixed(2)} ft</td>
        </tr>
        <tr style="background:#f5f5f5; font-weight:bold;">
            <td style="text-align:left;">Carga dinámica total (ft):</td>
            <td>${(sumaCargaTotalDC + parseFloat(tablaDistanciaCMDC.cargaTotalCMDC) + 1.5).toFixed(2)} ft</td>
        </tr>
    </tbody>
  </table>
</div>
`;

let resumenHTMLTramosDC = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">TRAMOS</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
// Ordenar los diámetros de mayor a menor antes de recorrer
const entradasOrdenadasDC = Object.entries(resumenTramosDC).sort((a, b) => {
  const diamA = parseFloat(a[0].replace("tuberia ", ""));
  const diamB = parseFloat(b[0].replace("tuberia ", ""));
  return diamB - diamA; // mayor a menor
});
for (const [diam, r] of entradasOrdenadasDC) {
    resumenHTMLTramosDC += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLTramosDC += `</tbody></table>`;

const tablasHTMLDC = `
<div class="contenedor-tablas">
  ${resumenHTMLTramosDC}
</div>`;


    const tipoBarredora = datos["barredora"] || "1.5";  
    const barredoraDatos = barredora(flujoMax, tipoBarredora);
    const { resultadoB, resumenTramosB, resumenDisparosB, tablaDistanciaCMB } = barredoraDatos;
    const disparoB = resultadoB[0];
    const flujoDisparoB = disparoB.flujoDisparo;
    const diametroDisparoB = disparoB.diametroDisparo;
    const velocidadDisparoB = disparoB.velocidadDisparo;
    const cargaBaseDisparoB = disparoB.cargaBaseDisparo;
    const cargaDisparoB = disparoB.cargaDisparo;
    const longitudDisparoB = disparoB.longitudDisparo;
    const longEqCodoDisparoB = disparoB.longEqCodoDisparo;
    const cargaCodoDisparoB = disparoB.cargaCodoDisparo;
    const longEqReduccionDisparoB = disparoB.longEqReduccionDisparo;
    const cargaReduccionDisparoB = disparoB.cargaReduccionDisparo;
    const cargaDisparoTotalB = disparoB.cargaDisparoTotal;

let barredoraHTML = `
<table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
  <caption class="subtitulo-retornos">TRAMO BARREDORAS</caption>
  <thead>
    <tr>
      <th>Número barredora</th>
      <th>Flujo tramo (gpm)</th>
      <th>Diámetro tubería tramo (in)</th>
      <th>Velocidad tramo (ft/s)</th>
      <th>Carga base tramo (ft/100ft)</th>
      <th>Longitud tramo (m)</th>
      <th>Carga tramo (ft)</th>
      <th>Cantidad Tees</th>
      <th>L. Eq. Tee (ft)</th>
      <th>Carga Tee (ft)</th>
      <th>Cantidad Codos</th>
      <th>L. Eq. Codo (ft)</th>
      <th>Carga Codo (ft)</th>
      <th>Cantidad Reducciones</th>
      <th>L. Eq. Reducción (ft)</th>
      <th>Carga Reducción (ft)</th>
      <th><strong>Carga tramo total (ft)</strong></th>
    </tr>
  </thead>
  <tbody>
`;
let sumaCargaTotalB = 0;
resultadoB.forEach(dato => {
  barredoraHTML += `
    <tr>
      <td>${dato.tramo}</td>
      <td>${dato.flujo}</td>
      <td>${dato.tuberia}</td>
      <td>${dato.velocidad}</td>
      <td>${dato.cargaBase}</td>
      <td>${dato.longitud}</td>
      <td>${dato.cargaTramo}</td>
      <td>${dato.cantidadTees}</td>
      <td>${dato.longEqTee}</td>
      <td>${dato.cargaTee}</td>
      <td>${dato.cantidadCodos}</td>
      <td>${dato.longEqCodo}</td>
      <td>${dato.cargaCodo}</td>
      <td>${dato.cantidadReducciones}</td>
      <td>${dato.longEqReduccion}</td>
      <td>${dato.cargaReduccion}</td>
      <td><strong>${dato.cargaTotal}</strong></td>
    </tr>
  `;
  sumaCargaTotalB += parseFloat(dato.cargaTotal);
});
barredoraHTML += `
  <tr>
    <td colspan="16" style="text-align: right;"><strong>Sumatoria carga tramo barredoras (ft):</strong></td>
    <td><strong>${sumaCargaTotalB.toFixed(2)}</strong></td>
    </tr>`;
    barredoraHTML += `</tbody></table>`;

    cuartoHTMLB = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE TUBERIA DEL CUARTO DE MAQUINAS AL CUERPO DE AGUA</caption>
            <thead>
                <tr>
                    <th>Flujo<br>tramo (gpm)</th>
                    <th>Diámetro<br>tubería tramo (in)</th>
                    <th>Velocidad<br>tramo (ft/s)</th>
                    <th>Carga Base<br>tramo (ft/100ft)</th>
                    <th>Longitud<br>tramo (m)</th>
                    <th>Carga<br>Tramo (ft)</th>
                    <th>Cantidad<br>Codos</th>
                    <th>L. Eq.<br>Codo (ft)</th>
                    <th>Carga<br>Codo (ft)</th>
                    <th>Carga<br>tramo total (ft)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${tablaDistanciaCMB.flujoCMB}</td>
                    <td>${tablaDistanciaCMB.tuberiaCMB}</td>
                    <td>${tablaDistanciaCMB.velocidadCMB}</td>
                    <td>${tablaDistanciaCMB.cargaBaseCMB}</td>
                    <td>${tablaDistanciaCMB.distanciaCMB}</td>
                    <td>${tablaDistanciaCMB.cargaTramoCMB}</td>
                    <td>1</td>
                    <td>${tablaDistanciaCMB.longEqCodoCMB}</td>
                    <td>${tablaDistanciaCMB.cargaCodoCMB}</td>
                    <td><strong>${tablaDistanciaCMB.cargaTotalCMB}</strong></td>
                </tr>
                <tr>
                    <td colspan="9" style="text-align: right;"><strong>Carga tramo a cuarto de máquinas (ft):</strong></td>
                    <td><strong>${tablaDistanciaCMB.cargaTotalCMB}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
let disparoHTMLB = `
    <table class="tabla-retornos" border="1" cellpadding="4" cellspacing="0">
    <caption class="subtitulo-retornos">TRAMO DE DISPARO TUBERIA PRINCIPAL A BARREDORA</caption>
  <thead>
    <tr>
      <th>Flujo<br>tramo (gpm)</th>
      <th>Diámetro<br>tubería tramo (in)</th>
      <th>Velocidad<br>tramo (ft/s)</th>
      <th>Carga base<br>tramo (ft/100ft)</th>
      <th>Longitud<br>tramo (m)</th>
      <th>Carga<br>tramo (ft)</th>
      <th>Cantidad<br>Codos</th>
      <th>L. Eq.<br>Codo (ft)</th>
      <th>Carga<br>Codo (ft)</th>
      <th>Cantidad<br>Reducciones</th>
      <th>L. Eq.<br>Reducción (ft)</th>
      <th>Carga<br>Reducción (ft)</th>
      <th>Carga<br>disparo total (ft)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${flujoDisparoB.toFixed(2)}</td>
      <td>${diametroDisparoB}</td>
      <td>${velocidadDisparoB.toFixed(2)}</td>
      <td>${cargaBaseDisparoB.toFixed(2)}</td>
      <td>${longitudDisparoB.toFixed(2)}</td>
      <td>${cargaDisparoB.toFixed(2)}</td>
      <td>1</td>
      <td>${longEqCodoDisparoB.toFixed(2)}</td>
      <td>${cargaCodoDisparoB.toFixed(2)}</td>
      <td>${longEqReduccionDisparoB !== 0 ? 1 : 0}</td>
      <td>${longEqReduccionDisparoB.toFixed(2)}</td>
      <td>${cargaReduccionDisparoB.toFixed(2)}</td>
      <td><strong>${cargaDisparoTotalB.toFixed(2)}</strong></td>
        </tr>
                <tr>
                    <td colspan="12" style="text-align: right;"><strong>Carga tramo disparos (ft):</strong></td>
                    <td><strong>${cargaDisparoTotalB.toFixed(2)}</strong></td>
                </tr>
        </tbody>
</table>
`;

let sumatoriaHTMLB = `
<div style="width: 350px;">
  <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; text-align:right;">
    <thead>
      <tr>
        <th colspan="2" style="text-align:center; background:#f5f5f5;">Sumatoria de cargas</th>
      </tr>
    </thead>
    <tbody>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga tramo barredoras (ft):</td>
            <td>${sumaCargaTotalB.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga a cuarto de máquinas (ft):</td>
            <td>${parseFloat(tablaDistanciaCMB.cargaTotalCMB).toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga disparos (ft):</td>
            <td>${cargaDisparoTotalB.toFixed(2)} ft</td>
        </tr>
        <tr>
            <td style="font-weight:bold; text-align:left;">Carga accesorio barredoras (ft):</td>
            <td>${(1.5).toFixed(2)} ft</td>
        </tr>
        <tr style="background:#f5f5f5; font-weight:bold;">
            <td style="text-align:left;">Carga dinámica total (ft):</td>
            <td>${(sumaCargaTotalB + cargaDisparoTotalB + parseFloat(tablaDistanciaCMB.cargaTotalCMB) + 1.5).toFixed(2)} ft</td>
        </tr>
    </tbody>
  </table>
</div>
`;

let resumenHTMLTramosB = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">TRAMOS</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenTramosB)) {
    resumenHTMLTramosB += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLTramosB += `</tbody></table>`;
let resumenHTMLDisparosB = `
<table class="tabla-ajustada redondeada" border="1" cellpadding="4" cellspacing="0">
  <thead>
    <tr>
      <th colspan="5" style="text-align:center; background:#eaeaea;">DISPAROS A BARREDORA</th>
    </tr>
    <tr>
      <th>Diámetro (in)</th>
      <th>Tubería (m)</th>
      <th>Tees</th>
      <th>Codos</th>
      <th>Reducciones</th>
    </tr>
  </thead>
  <tbody>`;
for (const [diam, r] of Object.entries(resumenDisparosB)) {
    resumenHTMLDisparosB += `
    <tr>
      <td>${diam.replace("tuberia ", "")}</td>
      <td>${r.tuberia_m.toFixed(2)}</td>
      <td>${r.tees}</td>
      <td>${r.codos}</td>
      <td>${r.reducciones}</td>
    </tr>`;
}
resumenHTMLDisparosB += `</tbody></table>`;
const tablasHTMLB = `
<div class="contenedor-tablas">
  ${resumenHTMLTramosB}
  ${resumenHTMLDisparosB}
</div>`;

// --- Mostrar en la ventana ---
const nuevaVentana = window.open("", "_blank", `width=${window.screen.width},height=${window.screen.height},left=0,top=0,resizable=yes,scrollbars=yes`);
nuevaVentana.document.write(`
<html>
<head>
  <title>Resultados</title>
        <script>
      document.addEventListener("keydown", function(event) {
          if (event.key === "Escape") {
              window.close();
          }
      });
      </script>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { color: #2c3e50; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 4px; text-align: center; }
    thead { background: #f5f5f5; }

    /* Ajuste al contenido */
    .tabla-ajustada {
    border-collapse: collapse; /* une los bordes */
    width: auto;
    border: 1px solid #ccc; /* borde externo */
    }

    .redondeada {
    border-radius: 10px; /* esquinas redondeadas */
    overflow: hidden; /* evita que sobresalgan las celdas */
    }

    .tabla-ajustada th,
    .tabla-ajustada td {
    border: 1px solid #ccc; /* bordes internos */
    padding: 6px 8px;
    }

    .tabla-ajustada thead th {
    background: #eaeaea;
    }

        /* Tablas de resumen con bordes redondeados */
    .tabla-ajustada.redondeada {
    border-collapse: separate; /* Necesario para border-radius */
    border-spacing: 0;         /* Evita espacios entre celdas */
    border: 1px solid #ccc;    /* Borde externo */
    border-radius: 10px;       /* Esquinas redondeadas */
    overflow: hidden;          /* Evita que las celdas sobresalgan */
    margin-top: 5px;           /* Pegadas al título de explosión de materiales */
    width: max-content;        /* Ajusta al contenido */
    }

    /* Bordes internos de celdas */
    .tabla-ajustada.redondeada th,
    .tabla-ajustada.redondeada td {
    border: 1px solid #ccc;    /* Bordes visibles en todas las celdas */
    padding: 6px 8px;
    text-align: center;
    }

    /* Color de encabezado */
    .tabla-ajustada.redondeada thead th {
    background: #eaeaea;
    font-weight: bold;
    }

    /* Para que el caption no tape celdas (si se usa) */
    .tabla-ajustada.redondeada caption {
    caption-side: top;
    text-align: left;
    font-weight: bold;
    background: #f5f5f5;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    margin-bottom: 0;
    }
    .contenedor-tablas {
    display: flex;
    justify-content: flex-start; /* o center si quieres centrarlas */
    align-items: flex-start;
    gap: 20px;
    margin-top: 5px;
    }

    /* Tabla del cuarto de máquinas */
    .tabla-cuarto {
      table-layout: auto;
      display: table;
      width: 100%; /* Ocupa todo el ancho */
      border-collapse: collapse;
      margin: 10px 0;
    }
    .tabla-cuarto th, .tabla-cuarto td {
      border: 1px solid #ccc;
      padding: 4px;
      text-align: center;
      word-wrap: break-word;
      white-space: normal;
    }

    .tabla-retornos {
    position: relative;        /* Necesario para posicionar el caption */
    width: 100%;
    border-collapse: collapse;
    margin-top: 37px;          /* Espacio para la pestaña */
    }

    caption.subtitulo-retornos {
    position: absolute;        /* Se posiciona respecto a la tabla */
    top: -29px;                /* Ajusta la altura (depende del padding) */
    left: 0.5;
    background: #f5f5f5;
    font-weight: bold;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 6px 6px 0 0; /* Bordes superiores redondeados */
    }

    .sumatoria-container {
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 6px 6px 0 0; /* Bordes superiores redondeados */
    margin-top: 22px;          /* Espacio para la pestaña */
    flex: 0 0 350px; /* Fijo en 350px */
    }
    
    .contenedor-flex {
    display: flex;
    flex-wrap: nowrap; /* NO permite que los elementos bajen */
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    }

        .tabla-ajustada.redondeada tbody tr,
    .tabla-retornos tbody tr,
    .tabla-cuarto tbody tr {
        height: 24px;       /* altura fija para todas las filas de datos */
    }
        
    .explosion-titulo {
    margin-top: 20px;  /* más pegado a la tabla */
    margin-bottom: 0px;
    }

  </style>
</head>
<body>
  <h3>Resumen de resultados:</h3>
  <ul>
    <li><strong>Volumen:</strong> ${vol}</li>
    <li><strong>Flujo volumen:</strong> ${flujoVol}</li>
    <li><strong>Flujo infinity:</strong> ${flujoInf}</li>
    <li><strong>Flujo máximo:</strong> ${flujoMax}</li>
    <li><strong>Tubería seleccionada succión:</strong> ${tubSuccion}</li>
    <li><strong>Tubería seleccionada descarga:</strong> ${tubDescarga}</li>
  </ul>

<h3 class="toggle-header">Retornos</h3>
<div class="toggle-content">
  ${retornoHTML}
  ${cuartoHTML}
  ${disparoHTMLR}
<div class="contenedor-flex">
  <div>
    <h4 class="explosion-titulo">Explosión de materiales:</h4>    ${tablasHTMLR}
  </div>
  <div class="sumatoria-container">
    ${sumatoriaHTMLR}
  </div>
</div>
</div>

<h3 class="toggle-header">Desnatadores</h3>
<div class="toggle-content">
  ${desnatadorHTML}
  ${cuartoHTMLD}
  ${disparoHTMLD}
<div class="contenedor-flex">
  <div>
    <h4 class="explosion-titulo">Explosión de materiales:</h4>    ${tablasHTMLD}
  </div>
  <div class="sumatoria-container">
    ${sumatoriaHTMLD}
  </div>
</div>
</div>

<h3 class="toggle-header">Drenes fondo</h3>
<div class="toggle-content">
  ${drenFondoHTML}
  ${cuartoHTMLDF}
  <div class="contenedor-flex">
  <div>
    <h4 class="explosion-titulo">Explosión de materiales:</h4>  ${tablasHTMLDF}
  </div>
  <div class="sumatoria-container">
    ${sumatoriaHTMLDF}
  </div>
</div>
</div>

<h3 class="toggle-header">Drenes canal</h3>
<div class="toggle-content">
  ${drenCanalHTML}
  ${cuartoHTMLDC}
  <div class="contenedor-flex">
  <div>
    <h4 class="explosion-titulo">Explosión de materiales:</h4>  ${tablasHTMLDC}
  </div>
  <div class="sumatoria-container">
    ${sumatoriaHTMLDC}
  </div>
</div>
</div>

<h3 class="toggle-header">Barredoras</h3>
<div class="toggle-content">
  ${barredoraHTML}
  ${cuartoHTMLB}
  ${disparoHTMLB}
<div class="contenedor-flex">
  <div>
    <h4 class="explosion-titulo">Explosión de materiales:</h4>    ${tablasHTMLB}
  </div>
  <div class="sumatoria-container">
    ${sumatoriaHTMLB}
  </div>
</div>
</div>

<style>
.toggle-content {
  display: none; /* contenido colapsado inicialmente */
  margin-bottom: 20px;
}
.toggle-header {
  cursor: pointer;
  background-color: #094985ff;
  color: white;
  padding: 8px;
  border-radius: 4px;
  margin-top: 10px;
}
.toggle-header:hover {
  background-color: #34495e;
}
</style>

<script>
document.querySelectorAll(".toggle-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });
});
</script>

</body>
</html>
`);
nuevaVentana.document.close();
}

function mostrarCampos() {
    const chkInfinity = document.getElementById('chkInfinity').checked;
    const chkCanal = document.getElementById('chkCanal').checked;
    const chkBombaCalor = document.getElementById('chkBombaCalor').checked;
    const chkPanel = document.getElementById('chkPanel').checked;
    const chkCaldera = document.getElementById('chkCaldera').checked;
    document.getElementById('campoInfinity').classList.toggle('oculto', !chkInfinity);
    document.getElementById('campoCanal').classList.toggle('oculto', !chkCanal);
    document.getElementById('campoBombaCalor').classList.toggle('oculto', !chkBombaCalor);
    document.getElementById('campoPanel').classList.toggle('oculto', !chkPanel);
    document.getElementById('campoCaldera').classList.toggle('oculto', !chkCaldera);
}

function volumen() {
    let area = parseFloat(datos.area) || 0;
    let profMin = parseFloat(datos.profMin) || 0;
    let profMax = parseFloat(datos.profMax) || 0;

    let profProm = 0;

    if (profMin > 0 && profMax > 0) {
        profProm = (profMin + profMax) / 2;
    } else if (profMin > 0) {
        profProm = profMin;
    } else if (profMax > 0) {
        profProm = profMax;
    }

    let vol = parseFloat((area * profProm).toFixed(1));
    return vol;
}

function flujoVolumen() {
    let vol = volumen();
    let rotacion1 = parseFloat(datos.rotacion) || 6; // si no eligió nada, que use 6h por defecto
    let flujoVolumen = parseFloat((vol * 1000 / 60 / rotacion1).toFixed(1));
    let flujoVolumen2 = parseFloat((flujoVolumen / 3.7854).toFixed(1));    
    return flujoVolumen2;
}

function flujoInfinity(){
    let muroInfinity = parseFloat(datos.largoInfinity) || 0;
    let alturaCortina = parseFloat(datos.alturaDesborde) || 0;
    let flujoInfinity = parseFloat((36 * (muroInfinity / 0.3048) * Math.pow((alturaCortina / 25.4), 1.5)).toFixed(1));
    return flujoInfinity;
}

function flujoMaximo(flujoVolumen2, flujoInfinity/*, /*flujoBombaCalor, flujoPanel, flujoCaldera, flujoGenerador*/){
    let flujoMaximo = Math.max(flujoVolumen2, flujoInfinity/*, flujoBombaCalor, flujoPanel, flujoCaldera, flujoGenerador*/);

    return flujoMaximo;
}

function velocidadCargaFlujo(flujoMaximo){
    const diametroTuberia = {
        /*"tuberia 0.75" : 0.81,
        "tuberia 1.00" : 1.03,*/
        "tuberia 1.50" : 1.61,
        "tuberia 2.00" : 2.07,
        "tuberia 2.50" : 2.47,
        "tuberia 3.00" : 3.07,
        "tuberia 4.00" : 4.03,
        "tuberia 6.00" : 6.07,
        "tuberia 8.00" : 7.98,
        "tuberia 10.00" : 9.98,
        "tuberia 12.00" : 11.89,
        "tuberia 14.00" : 13.13,
        "tuberia 16.00" : 14.94,
        "tuberia 18.00" : 16.81
        };
    
    const velocidadFlujo = {};
    const cargaFlujo = {};
    for (let tuberia in diametroTuberia) {
        const diametro = diametroTuberia[tuberia];
        const velocidad = flujoMaximo * 0.408498 / Math.pow((diametro), 2);
        velocidadFlujo[tuberia] = velocidad;
        const carga = 10.536 * 100 * Math.pow(flujoMaximo, 1.852) / (Math.pow(diametro, 4.8655) * Math.pow(150, 1.852));
        cargaFlujo[tuberia] = carga;
    }
    return {velocidadFlujo, cargaFlujo};
}

function tuberiaSeleccionada(velocidades, tipo) {
    const limite = tipo === "succion" ? 4.5 : 6.5;

    let mejorTuberia = null;
    let mejorVelocidad = -Infinity;

    for (let tuberia in velocidades) {
        const velocidad = velocidades[tuberia];
        if (velocidad <= limite && velocidad > mejorVelocidad) {
            mejorVelocidad = velocidad;
            mejorTuberia = tuberia;
        }
    }

    return mejorTuberia
        ? `${mejorTuberia} (${mejorVelocidad.toFixed(2)} ft/s)`
        : "Ninguna cumple";
}

function retorno(flujoMaximo, tipoRetorno) {
    const area = parseFloat(datos.area) || 0;
    const diametros = {
        //"tuberia 0.75": 0.81,
        //"tuberia 1.00": 1.03,
        "tuberia 1.50": 1.61,
        "tuberia 2.00": 2.07,
        "tuberia 2.50": 2.47,
        "tuberia 3.00": 3.07,
        "tuberia 4.00": 4.03,
        "tuberia 6.00": 6.07,
        "tuberia 8.00": 7.98,
        "tuberia 10.00": 9.98,
        "tuberia 12.00": 11.89,
        "tuberia 14.00": 13.13,
        "tuberia 16.00": 14.94,
        "tuberia 18.00": 16.81
    };
        const teeLinea = {
        //"tuberia 0.75": 2.40,
        //"tuberia 1.00": 3.20,
        "tuberia 1.50": 5.60,
        "tuberia 2.00": 7.70,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 12.0,
        "tuberia 4.00": 2.80,
        "tuberia 6.00": 3.80,
        "tuberia 8.00": 4.70,
        "tuberia 10.00": 5.20,
        "tuberia 12.00": 6.00,
        "tuberia 14.00": 6.00,
        "tuberia 16.00": 6.00,
        "tuberia 18.00": 6.00
    };
        const teeBranch = {
        //"tuberia 0.75": 5.30,
        //"tuberia 1.00": 6.60,
        "tuberia 1.50": 9.90,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 13.0,
        "tuberia 3.00": 17.0,
        "tuberia 4.00": 12.0,
        "tuberia 6.00": 18.0,
        "tuberia 8.00": 24.0,
        "tuberia 10.00": 30.0,
        "tuberia 12.00": 34.0,
        "tuberia 14.00": 34.0,
        "tuberia 16.00": 34.0,
        "tuberia 18.00": 34.0
    };

        const codo = {
        //"tuberia 0.75": 4.40,
        //"tuberia 1.00": 5.20,
        "tuberia 1.50": 7.40,
        "tuberia 2.00": 8.50,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 11.0,
        "tuberia 4.00": 5.90,
        "tuberia 6.00": 8.90,
        "tuberia 8.00": 12.0,
        "tuberia 10.00": 14.0,
        "tuberia 12.00": 17.0,
        "tuberia 14.00": 17.0,
        "tuberia 16.00": 17.0,
        "tuberia 18.00": 17.0
    };

        const reduccion = {
        //"tuberia 0.75": 8.0,
        //"tuberia 1.00": 8.0,
        "tuberia 1.50": 10.0,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 12.0,
        "tuberia 3.00": 15.0,
        "tuberia 4.00": 20.0,
        "tuberia 6.00": 25.0,
        "tuberia 8.00": 30.0,
        "tuberia 10.00": 35.0,
        "tuberia 12.00": 40.0,
        "tuberia 14.00": 45.0,
        "tuberia 16.00": 50.0,
        "tuberia 18.00": 55.0
    };

    const numRetornos = Math.ceil(flujoMaximo / (tipoRetorno === "2.0" ? 40 : 26));
    const flujoPorRetorno = flujoMaximo / numRetornos;
    const longitudTotal = Math.sqrt(area) * 3.5;
    const longitudEntreRetornos = longitudTotal / numRetornos;
    const resultadoR = [];
    let sumaCargaTramos = 0;  // Acumulador fuera del ciclo
    let flujoRestante = flujoMaximo;
    let diametroAnterior = null;
    const profMin = parseFloat(datos.profMin) || 0;
    const profMax = parseFloat(datos.profMax) || 0;
    const profundidad = Math.max(profMin, profMax);
    const longitudDisparo = ((profundidad / 2) + 1); 
    const longitudDisparoFt = longitudDisparo / 0.3048;
    const tuberiaDisparo = tipoRetorno === "2.0" ? "tuberia 2.00" : "tuberia 1.50";
    const cargaDisparoBase = 10.536 * 100 * Math.pow(flujoPorRetorno, 1.852) / (Math.pow(diametros[tuberiaDisparo], 4.8655) * Math.pow(150, 1.852));
    const cargaDisparoTramo = (longitudDisparoFt * cargaDisparoBase) / 100;
    const cargaDisparoCodo = (codo[tuberiaDisparo] * cargaDisparoBase) / 100;
    let diametroMax = 0; // Guardamos el diámetro máximo encontrado

    // Si el diámetro del disparo es distinto al diámetro del último tramo, hay reducción
    let cargaDisparoReduccion = 0;
    let longEqReduccionDisparo = 0;
    if (diametroAnterior && diametroAnterior !== tuberiaDisparo) {
        longEqReduccionDisparo = reduccion[tuberiaDisparo];
        cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
        }
    const cargaDisparoTotal = cargaDisparoTramo + cargaDisparoCodo + cargaDisparoReduccion;

    // === Resumen por diámetro ===
    const resumenTramosR = {};
    const resumenDisparosR = {};
    const addDiam = (obj, d) => {
        if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
        };

    const raizArea = Math.sqrt(area);
    let sumaLongitudes = 0;
    let siguienteUmbral = raizArea;

// --- Tramo especial: distancia al cuarto de máquinas ---
    const distanciaCM = parseFloat(datos.distCuarto) || 0;
if (distanciaCM > 0) {
    let flujoCM = flujoMaximo; // todo el flujo entra a este tramo
    let diametroCM = null;
    let velocidadCM = -Infinity;
    let cargaCM = null;
    let mejorTubCM = null;
    let mejorVelCM = null;
    let mejorCargaCM = null;

    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoCM * 0.408498 / (d * d);
        mejorTubCM = tub;
        mejorVelCM = vel;
        mejorCargaCM = 10.536 * 100 * Math.pow(flujoCM, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 6.5 && vel > velocidadCM) {
            diametroCM = tub;
            velocidadCM = vel;
            cargaCM = mejorCargaCM;
        }
    }

    if (!diametroCM) {
        diametroCM = mejorTubCM;
        velocidadCM = mejorVelCM;
        cargaCM = mejorCargaCM;
    }

    const longitudCM_ft = distanciaCM * 3.281;
    const cargaTramoCM = (longitudCM_ft * cargaCM) / 100;

    // Suponemos codos y tees estándar (ejemplo: 0 o 1)
    const cantidadCodosCM = 1;
    const longEqCodoCM = codo[diametroCM];
    const cargaCodoCM = (longEqCodoCM * cargaCM) / 100;

    const cantidadTeesCM = 0;
    const longEqTeeCM = 0;
    const cargaTeeCM = 0;

    const cargaTotalCM = cargaTramoCM + cargaCodoCM + cargaTeeCM;
    const tablaDistanciaCM = {
        distanciaCM: distanciaCM.toFixed(2),
        flujoCM: flujoCM.toFixed(2),
        tuberiaCM: diametroCM,
        velocidadCM: velocidadCM.toFixed(2),
        cargaBaseCM: cargaCM.toFixed(2),
        cargaTramoCM: cargaTramoCM.toFixed(2),
        cantidadCodosCM: cantidadCodosCM,
        longEqCodoCM: longEqCodoCM.toFixed(2),
        cargaCodoCM: cargaCodoCM.toFixed(2),
        cargaTotalCM: cargaTotalCM.toFixed(2)
    };

    // Agregar a resumen de materiales
    if (!resumenTramosR[diametroCM]) resumenTramosR[diametroCM] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosR[diametroCM].tuberia_m += distanciaCM;
    resumenTramosR[diametroCM].codos += cantidadCodosCM;

        for (let i = 0; i < numRetornos; i++) {
        let flujoActual = flujoRestante;

        // Elegir diámetro que dé velocidad ≤ 6.5 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = -Infinity;
        let cargaSeleccionada = null;
        let mejorTub = null;
        let mejorVel = null;
        let mejorCarga = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoActual * 0.408498 / (d * d);
            mejorTub = tub;
            mejorVel = velocidad;
            mejorCarga = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

            if (velocidad <= 6.5 && velocidad > velocidadSeleccionada) {
            velocidadSeleccionada = velocidad;
            diametroSeleccionado = tub;
            cargaSeleccionada = mejorCarga;
            }
        }

        if (!diametroSeleccionado) {
            diametroSeleccionado = mejorTub;
            velocidadSeleccionada = mejorVel;
            cargaSeleccionada = mejorCarga;
        }

        let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
        if (dPulgadas > diametroMax) diametroMax = dPulgadas;

        // Forzar diámetro del último tramo según tipoRetorno
        if (i === numRetornos - 1) {
            diametroSeleccionado = (tipoRetorno === "2.0") ? "tuberia 2.00" : "tuberia 1.50";
            const d = diametros[diametroSeleccionado];
            velocidadSeleccionada = flujoActual * 0.408498 / (d * d);
            cargaSeleccionada = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
        }

        // --- Accesorios base para esta fila ---
        const tipoAccesorio = (i === numRetornos - 1) ? "codo" : "tee";

        // Tee (si aplica)
        let longEqTeeRow = 0;
        let cargaTeeRow = 0;
        if (tipoAccesorio === "tee") {
            longEqTeeRow = (teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"]);
            cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
        }

        // Codo base (solo en el último tramo)
        const longEqCodoUnit = (codo[diametroSeleccionado] || codo["tuberia 18.00"]);
        let longEqCodoBaseRow = (tipoAccesorio === "codo") ? longEqCodoUnit : 0;
        let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

        // Reducción entre tramos (si cambia el diámetro)
        let longitudEqReduccion = 0;
        let cargaReduccion = 0;
        if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
            longitudEqReduccion = (reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"]);
            cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
        }

        // Carga por la tubería del tramo
        const cargaTramoRow = (longitudEntreRetornos / 0.3048) * (cargaSeleccionada / 100);

        // --- Codos extra por múltiplos de √area ---
        sumaLongitudes += longitudEntreRetornos;       // acumulado global
        let extraCount = 0;
        while (sumaLongitudes >= siguienteUmbral) {
            extraCount += 1;
            siguienteUmbral += raizArea;                 // siguiente múltiplo
        }

        const cantidadTees = (tipoAccesorio === "tee") ? 1 : 0;          // 1 tee en tramos intermedios
        const codosBase = (tipoAccesorio === "codo") ? 1 : 0;            // 1 codo en el último tramo
        const totalCodosFila = codosBase + extraCount;                    // codos base + codos extra por √area
        const cantidadReducciones = (longitudEqReduccion > 0) ? 1 : 0;    // 1 si cambió el diámetro respecto al tramo anterior
        let longEqCodoExtraRow = extraCount * longEqCodoUnit;
        let cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;

        // Codo total mostrado en la fila (base + extras)
        let longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
        let cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

        // Carga total de la fila (tubería + tee + codo total + reducción)
        const cargaTotalFilaNum = +(cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion).toFixed(2);
        const cargaTotal2 = cargaTotalFilaNum + cargaDisparoTotal;

        // === Resumen por diámetro (materiales del tramo) ===
        addDiam(resumenTramosR, diametroSeleccionado);
        resumenTramosR[diametroSeleccionado].tuberia_m += longitudEntreRetornos;
        if (tipoAccesorio === "tee") resumenTramosR[diametroSeleccionado].tees += 1;
        else resumenTramosR[diametroSeleccionado].codos += 1;      // codo base del último tramo
        resumenTramosR[diametroSeleccionado].codos += extraCount;   // codos extra (0, 1, 2, ...)
        if (longitudEqReduccion > 0) resumenTramosR[diametroSeleccionado].reducciones += 1;

        // === Resumen materiales del disparo ===
        addDiam(resumenDisparosR, tuberiaDisparo);
        resumenDisparosR[tuberiaDisparo].tuberia_m += longitudDisparo;
        resumenDisparosR[tuberiaDisparo].codos += 1;
        if (diametroSeleccionado !== tuberiaDisparo) resumenDisparosR[tuberiaDisparo].reducciones += 1;

        let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
        if (diametroMax > dDisparo) {
            longEqReduccionDisparo = reduccion[tuberiaDisparo];
            cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
        } else {
            longEqReduccionDisparo = 0;
            cargaDisparoReduccion = 0;
        }

        // === Empuje de la fila a la tabla 1 ===
        resultadoR.push({
            tramo: i + 1,
            flujo: flujoActual.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),

            cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
            cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
            longitud: longitudEntreRetornos.toFixed(2),

            // Tee mostrado solo si aplica
            cantidadTees: cantidadTees,
            longEqTee: longEqTeeRow.toFixed(2),
            cargaTee: cargaTeeRow.toFixed(2),

            // Codo mostrado siempre como TOTAL (base + extra si los hubo)
            cantidadCodos: totalCodosFila,
            longEqCodo: longEqCodoUnit.toFixed(2),
            cargaCodo: cargaCodoTotalRow.toFixed(2),

            // Reducción entre tramos
            cantidadReducciones: cantidadReducciones,
            longEqReduccion: longitudEqReduccion.toFixed(2),
            cargaReduccion: cargaReduccion.toFixed(2),

            // Total de la fila (incluye codos extra si hubo)
            cargaTotal: cargaTotalFilaNum.toFixed(2),

            // Datos del disparo
            flujoDisparo: flujoPorRetorno,
            diametroDisparo: tuberiaDisparo,
            velocidadDisparo: flujoPorRetorno * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
            cargaBaseDisparo: cargaDisparoBase,
            cargaDisparo: cargaDisparoTramo,
            longitudDisparo: longitudDisparo,
            longEqCodoDisparo: codo[tuberiaDisparo],
            cargaCodoDisparo: cargaDisparoCodo,
            longEqReduccionDisparo: longEqReduccionDisparo,
            cargaReduccionDisparo: cargaDisparoReduccion,
            cargaDisparoTotal: cargaDisparoTotal,

            cargaTotal2: cargaTotal2
        });

        // Acumulados
        sumaCargaTramos += cargaTotalFilaNum;

        // Para siguiente iteración
        flujoRestante -= flujoPorRetorno;
        if (flujoRestante < 0) flujoRestante = 0;
        diametroAnterior = diametroSeleccionado;
        }

        // Al final:
        const sumaFinal = sumaCargaTramos + cargaDisparoTotal + parseFloat(tablaDistanciaCM.cargaTotalCM);
        return { resultadoR, sumaFinal, resumenTramosR, resumenDisparosR, tablaDistanciaCM };
    }
}

function desnatador(flujoMaximo, tipoDesnatador) {
    const area = parseFloat(datos.area) || 0;
    const diametros = {
        //"tuberia 0.75": 0.81,
        //"tuberia 1.00": 1.03,
        "tuberia 1.50": 1.61,
        "tuberia 2.00": 2.07,
        "tuberia 2.50": 2.47,
        "tuberia 3.00": 3.07,
        "tuberia 4.00": 4.03,
        "tuberia 6.00": 6.07,
        "tuberia 8.00": 7.98,
        "tuberia 10.00": 9.98,
        "tuberia 12.00": 11.89,
        "tuberia 14.00": 13.13,
        "tuberia 16.00": 14.94,
        "tuberia 18.00": 16.81
    };
        const teeLinea = {
        //"tuberia 0.75": 2.40,
        //"tuberia 1.00": 3.20,
        "tuberia 1.50": 5.60,
        "tuberia 2.00": 7.70,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 12.0,
        "tuberia 4.00": 2.80,
        "tuberia 6.00": 3.80,
        "tuberia 8.00": 4.70,
        "tuberia 10.00": 5.20,
        "tuberia 12.00": 6.00,
        "tuberia 14.00": 6.00,
        "tuberia 16.00": 6.00,
        "tuberia 18.00": 6.00
    };
        const teeBranch = {
        //"tuberia 0.75": 5.30,
        //"tuberia 1.00": 6.60,
        "tuberia 1.50": 9.90,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 13.0,
        "tuberia 3.00": 17.0,
        "tuberia 4.00": 12.0,
        "tuberia 6.00": 18.0,
        "tuberia 8.00": 24.0,
        "tuberia 10.00": 30.0,
        "tuberia 12.00": 34.0,
        "tuberia 14.00": 34.0,
        "tuberia 16.00": 34.0,
        "tuberia 18.00": 34.0
    };

        const codo = {
        //"tuberia 0.75": 4.40,
        //"tuberia 1.00": 5.20,
        "tuberia 1.50": 7.40,
        "tuberia 2.00": 8.50,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 11.0,
        "tuberia 4.00": 5.90,
        "tuberia 6.00": 8.90,
        "tuberia 8.00": 12.0,
        "tuberia 10.00": 14.0,
        "tuberia 12.00": 17.0,
        "tuberia 14.00": 17.0,
        "tuberia 16.00": 17.0,
        "tuberia 18.00": 17.0
    };

        const reduccion = {
        //"tuberia 0.75": 8.0,
        //"tuberia 1.00": 8.0,
        "tuberia 1.50": 10.0,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 12.0,
        "tuberia 3.00": 15.0,
        "tuberia 4.00": 20.0,
        "tuberia 6.00": 25.0,
        "tuberia 8.00": 30.0,
        "tuberia 10.00": 35.0,
        "tuberia 12.00": 40.0,
        "tuberia 14.00": 45.0,
        "tuberia 16.00": 50.0,
        "tuberia 18.00": 55.0
    };

    let numDesnatadorInicial = Math.ceil(area / 50);
    let flujoPorDesnatador = flujoMaximo / numDesnatadorInicial;
    let numDesnatadorFinal = numDesnatadorInicial;
    if (tipoDesnatador === "2.0" && flujoPorDesnatador > 50) {
        numDesnatadorFinal = Math.ceil(flujoMaximo / 50); 
    } else if (tipoDesnatador === "1.5" && flujoPorDesnatador > 35) {
        numDesnatadorFinal = Math.ceil(flujoMaximo / 35); 
    }
    flujoPorDesnatador = flujoMaximo / numDesnatadorFinal;
    const longitudTotal = Math.sqrt(area) * 3.5;
    const longitudEntreDesnatadores = longitudTotal / numDesnatadorFinal;
    const resultadoD = [];
    let sumaCargaTramos = 0;  // Acumulador fuera del ciclo
    let flujoRestante = flujoMaximo;
    let diametroAnterior = null;
    const profMin = parseFloat(datos.profMin) || 0;
    const profMax = parseFloat(datos.profMax) || 0;
    const profundidad = Math.max(profMin, profMax); 
    const longitudDisparo = ((profundidad - 0.5) + 1); 
    const longitudDisparoFt = longitudDisparo / 0.3048;
    const tuberiaDisparo = tipoDesnatador === "2.0" ? "tuberia 2.00" : "tuberia 1.50";
    const cargaDisparoBase = 10.536 * 100 * Math.pow(flujoPorDesnatador, 1.852) / (Math.pow(diametros[tuberiaDisparo], 4.8655) * Math.pow(150, 1.852));
    const cargaDisparoTramo = (longitudDisparoFt * cargaDisparoBase) / 100;
    const cargaDisparoCodo = (codo[tuberiaDisparo] * cargaDisparoBase) / 100;
    let diametroMax = 0; // Guardamos el diámetro máximo encontrado

    // Si el diámetro del disparo es distinto al diámetro del último tramo, hay reducción
    let cargaDisparoReduccion = 0;
    let longEqReduccionDisparo = 0;
    if (diametroAnterior && diametroAnterior !== tuberiaDisparo) {
        longEqReduccionDisparo = reduccion[tuberiaDisparo];
        cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
        }
    const cargaDisparoTotal = cargaDisparoTramo + cargaDisparoCodo + cargaDisparoReduccion;

    // === Resumen por diámetro ===
    const resumenTramosD = {};
    const resumenDisparosD = {};
    const addDiam = (obj, d) => {
        if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
        };

    const raizArea = Math.sqrt(area);
    let sumaLongitudes = 0;
    let siguienteUmbral = raizArea;

// --- Tramo especial: distancia al cuarto de máquinas ---
    const distanciaCMD = parseFloat(datos.distCuarto) || 0;
if (distanciaCMD > 0) {
    let flujoCMD = flujoMaximo; // todo el flujo entra a este tramo
    let diametroCMD = null;
    let velocidadCMD = -Infinity;
    let cargaCMD = null;
    let mejorTubCMD = null;
    let mejorVelCMD = null;
    let mejorCargaCMD = null;

    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoCMD * 0.408498 / (d * d);
        mejorTubCMD = tub;
        mejorVelCMD = vel;
        mejorCargaCMD = 10.536 * 100 * Math.pow(flujoCMD, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 4.5 && vel > velocidadCMD) {
            diametroCMD = tub;
            velocidadCMD = vel;
            cargaCMD = mejorCargaCMD;
        }
    }

    if (!diametroCMD) {
        diametroCMD = mejorTubCMD;
        velocidadCMD = mejorVelCMD;
        cargaCMD = mejorCargaCMD;
    }

    const longitudCMD_ft = distanciaCMD * 3.281;
    const cargaTramoCMD = (longitudCMD_ft * cargaCMD) / 100;

    // Suponemos codos y tees estándar (ejemplo: 0 o 1)
    const cantidadCodosCMD = 1;
    const longEqCodoCMD = codo[diametroCMD];
    const cargaCodoCMD = (longEqCodoCMD * cargaCMD) / 100;

    const cantidadTeesCMD = 0;
    const longEqTeeCMD = 0;
    const cargaTeeCMD = 0;

    const cargaTotalCMD = cargaTramoCMD + cargaCodoCMD + cargaTeeCMD;
    const tablaDistanciaCMD = {
        distanciaCMD: distanciaCMD.toFixed(2),
        flujoCMD: flujoCMD.toFixed(2),
        tuberiaCMD: diametroCMD,
        velocidadCMD: velocidadCMD.toFixed(2),
        cargaBaseCMD: cargaCMD.toFixed(2),
        cargaTramoCMD: cargaTramoCMD.toFixed(2),
        cantidadCodosCMD: cantidadCodosCMD,
        longEqCodoCMD: longEqCodoCMD.toFixed(2),
        cargaCodoCMD: cargaCodoCMD.toFixed(2),
        cargaTotalCMD: cargaTotalCMD.toFixed(2)
    };

    // Agregar a resumen de materiales
    if (!resumenTramosD[diametroCMD]) resumenTramosD[diametroCMD] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosD[diametroCMD].tuberia_m += distanciaCMD;
    resumenTramosD[diametroCMD].codos += cantidadCodosCMD;

        for (let i = 0; i < numDesnatadorFinal; i++) {
        let flujoActual = flujoRestante;

        // Elegir diámetro que dé velocidad ≤ 4.5 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = -Infinity;
        let cargaSeleccionada = null;
        let mejorTub = null;
        let mejorVel = null;
        let mejorCarga = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoActual * 0.408498 / (d * d);
            mejorTub = tub;
            mejorVel = velocidad;
            mejorCarga = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

            if (velocidad <= 4.5 && velocidad > velocidadSeleccionada) {
            velocidadSeleccionada = velocidad;
            diametroSeleccionado = tub;
            cargaSeleccionada = mejorCarga;
            }
        }

        if (!diametroSeleccionado) {
            diametroSeleccionado = mejorTub;
            velocidadSeleccionada = mejorVel;
            cargaSeleccionada = mejorCarga;
        }

        let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
        if (dPulgadas > diametroMax) diametroMax = dPulgadas;

        // Forzar diámetro del último tramo según tipoDesnatador
        if (i === numDesnatadorFinal - 1) {
            diametroSeleccionado = (tipoDesnatador === "2.0") ? "tuberia 2.00" : "tuberia 1.50";
            const d = diametros[diametroSeleccionado];
            velocidadSeleccionada = flujoActual * 0.408498 / (d * d);
            cargaSeleccionada = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
        }

        // --- Accesorios base para esta fila ---
        const tipoAccesorio = (i === numDesnatadorFinal - 1) ? "codo" : "tee";

        // Tee (si aplica)
        let longEqTeeRow = 0;
        let cargaTeeRow = 0;
        if (tipoAccesorio === "tee") {
            longEqTeeRow = (teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"]);
            cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
        }

        // Codo base (solo en el último tramo)
        const longEqCodoUnit = (codo[diametroSeleccionado] || codo["tuberia 18.00"]);
        let longEqCodoBaseRow = (tipoAccesorio === "codo") ? longEqCodoUnit : 0;
        let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

        // Reducción entre tramos (si cambia el diámetro)
        let longitudEqReduccion = 0;
        let cargaReduccion = 0;
        if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
            longitudEqReduccion = (reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"]);
            cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
        }

        // Carga por la tubería del tramo
        const cargaTramoRow = (longitudEntreDesnatadores / 0.3048) * (cargaSeleccionada / 100);

        // --- Codos extra por múltiplos de √area ---
        sumaLongitudes += longitudEntreDesnatadores;       // acumulado global
        let extraCount = 0;
        while (sumaLongitudes >= siguienteUmbral) {
            extraCount += 1;
            siguienteUmbral += raizArea;                 // siguiente múltiplo
        }

        const cantidadTees = (tipoAccesorio === "tee") ? 1 : 0;          // 1 tee en tramos intermedios
        const codosBase = (tipoAccesorio === "codo") ? 1 : 0;            // 1 codo en el último tramo
        const totalCodosFila = codosBase + extraCount;                    // codos base + codos extra por √area
        const cantidadReducciones = (longitudEqReduccion > 0) ? 1 : 0;    // 1 si cambió el diámetro respecto al tramo anterior
        let longEqCodoExtraRow = extraCount * longEqCodoUnit;
        let cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;

        // Codo total mostrado en la fila (base + extras)
        let longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
        let cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

        // Carga total de la fila (tubería + tee + codo total + reducción)
        const cargaTotalFilaNum = +(cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion).toFixed(2);
        const cargaTotal2 = cargaTotalFilaNum + cargaDisparoTotal;

        // === Resumen por diámetro (materiales del tramo) ===
        addDiam(resumenTramosD, diametroSeleccionado);
        resumenTramosD[diametroSeleccionado].tuberia_m += longitudEntreDesnatadores;
        if (tipoAccesorio === "tee") resumenTramosD[diametroSeleccionado].tees += 1;
        else resumenTramosD[diametroSeleccionado].codos += 1;      // codo base del último tramo
        resumenTramosD[diametroSeleccionado].codos += extraCount;   // codos extra (0, 1, 2, ...)
        if (longitudEqReduccion > 0) resumenTramosD[diametroSeleccionado].reducciones += 1;

        // === Resumen materiales del disparo ===
        addDiam(resumenDisparosD, tuberiaDisparo);
        resumenDisparosD[tuberiaDisparo].tuberia_m += longitudDisparo;
        resumenDisparosD[tuberiaDisparo].codos += 1;
        if (diametroSeleccionado !== tuberiaDisparo) resumenDisparosD[tuberiaDisparo].reducciones += 1;

        let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
        if (diametroMax > dDisparo) {
            longEqReduccionDisparo = reduccion[tuberiaDisparo];
            cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
        } else {
            longEqReduccionDisparo = 0;
            cargaDisparoReduccion = 0;
        }

        // === Empuje de la fila a la tabla 1 ===
        resultadoD.push({
            tramo: i + 1,
            flujo: flujoActual.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),

            cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
            cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
            longitud: longitudEntreDesnatadores.toFixed(2),

            // Tee mostrado solo si aplica
            cantidadTees: cantidadTees,
            longEqTee: longEqTeeRow.toFixed(2),
            cargaTee: cargaTeeRow.toFixed(2),

            // Codo mostrado siempre como TOTAL (base + extra si los hubo)
            cantidadCodos: totalCodosFila,
            longEqCodo: longEqCodoUnit.toFixed(2),
            cargaCodo: cargaCodoTotalRow.toFixed(2),

            // Reducción entre tramos
            cantidadReducciones: cantidadReducciones,
            longEqReduccion: longitudEqReduccion.toFixed(2),
            cargaReduccion: cargaReduccion.toFixed(2),

            // Total de la fila (incluye codos extra si hubo)
            cargaTotal: cargaTotalFilaNum.toFixed(2),

            // Datos del disparo
            flujoDisparo: flujoPorDesnatador,
            diametroDisparo: tuberiaDisparo,
            velocidadDisparo: flujoPorDesnatador * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
            cargaBaseDisparo: cargaDisparoBase,
            cargaDisparo: cargaDisparoTramo,
            longitudDisparo: longitudDisparo,
            longEqCodoDisparo: codo[tuberiaDisparo],
            cargaCodoDisparo: cargaDisparoCodo,
            longEqReduccionDisparo: longEqReduccionDisparo,
            cargaReduccionDisparo: cargaDisparoReduccion,
            cargaDisparoTotal: cargaDisparoTotal,

            cargaTotal2: cargaTotal2
        });

        // Acumulados
        sumaCargaTramos += cargaTotalFilaNum;

        // Para siguiente iteración
        flujoRestante -= flujoPorDesnatador;
        if (flujoRestante < 0) flujoRestante = 0;
        diametroAnterior = diametroSeleccionado;
        }

        // Al final:
        const sumaFinal = sumaCargaTramos + cargaDisparoTotal;
        return { resultadoD, sumaFinal, resumenTramosD, resumenDisparosD, tablaDistanciaCMD };
    }
}

function drenFondo(flujoMaximo, tipoDrenFondo) {
    const area = parseFloat(datos.area) || 0;
    const diametros = {
        //"tuberia 0.75": 0.81,
        //"tuberia 1.00": 1.03,
        "tuberia 1.50": 1.61,
        "tuberia 2.00": 2.07,
        "tuberia 2.50": 2.47,
        "tuberia 3.00": 3.07,
        "tuberia 4.00": 4.03,
        "tuberia 6.00": 6.07,
        "tuberia 8.00": 7.98,
        "tuberia 10.00": 9.98,
        "tuberia 12.00": 11.89,
        "tuberia 14.00": 13.13,
        "tuberia 16.00": 14.94,
        "tuberia 18.00": 16.81
    };
        const teeLinea = {
        //"tuberia 0.75": 2.40,
        //"tuberia 1.00": 3.20,
        "tuberia 1.50": 5.60,
        "tuberia 2.00": 7.70,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 12.0,
        "tuberia 4.00": 2.80,
        "tuberia 6.00": 3.80,
        "tuberia 8.00": 4.70,
        "tuberia 10.00": 5.20,
        "tuberia 12.00": 6.00,
        "tuberia 14.00": 6.00,
        "tuberia 16.00": 6.00,
        "tuberia 18.00": 6.00
    };
        const teeBranch = {
        //"tuberia 0.75": 5.30,
        //"tuberia 1.00": 6.60,
        "tuberia 1.50": 9.90,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 13.0,
        "tuberia 3.00": 17.0,
        "tuberia 4.00": 12.0,
        "tuberia 6.00": 18.0,
        "tuberia 8.00": 24.0,
        "tuberia 10.00": 30.0,
        "tuberia 12.00": 34.0,
        "tuberia 14.00": 34.0,
        "tuberia 16.00": 34.0,
        "tuberia 18.00": 34.0
    };

        const codo = {
        //"tuberia 0.75": 4.40,
        //"tuberia 1.00": 5.20,
        "tuberia 1.50": 7.40,
        "tuberia 2.00": 8.50,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 11.0,
        "tuberia 4.00": 5.90,
        "tuberia 6.00": 8.90,
        "tuberia 8.00": 12.0,
        "tuberia 10.00": 14.0,
        "tuberia 12.00": 17.0,
        "tuberia 14.00": 17.0,
        "tuberia 16.00": 17.0,
        "tuberia 18.00": 17.0
    };

        const reduccion = {
        //"tuberia 0.75": 8.0,
        //"tuberia 1.00": 8.0,
        "tuberia 1.50": 10.0,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 12.0,
        "tuberia 3.00": 15.0,
        "tuberia 4.00": 20.0,
        "tuberia 6.00": 25.0,
        "tuberia 8.00": 30.0,
        "tuberia 10.00": 35.0,
        "tuberia 12.00": 40.0,
        "tuberia 14.00": 45.0,
        "tuberia 16.00": 50.0,
        "tuberia 18.00": 55.0
    };

    // === Capacidad del dren según tipo ===
    let capacidadDren = 0;
    if (tipoDrenFondo === "1.5") capacidadDren = 50;
    else if (tipoDrenFondo === "2.0") capacidadDren = 95;
    else if (tipoDrenFondo === "7.5") capacidadDren = 125;
    else if (tipoDrenFondo === "8.0") capacidadDren = 130;
    else if (tipoDrenFondo === "9.0") capacidadDren = 135;
    else if (tipoDrenFondo === "12.0") capacidadDren = 235;
    else if (tipoDrenFondo === "18.0") capacidadDren = 450;

    // === Número de drenes ===
    let numDrenFondoFinal = Math.ceil((flujoMaximo * 2) / capacidadDren);
    if (numDrenFondoFinal % 2 !== 0) numDrenFondoFinal++;

        // === Cálculos básicos ===
    const raizArea = Math.sqrt(area);
    const flujoPorDren = flujoMaximo / numDrenFondoFinal;
    const longitudEntreDrenes = raizArea / (numDrenFondoFinal + 1);
    const resultadoDF = [];
    let sumaCargaTramos = 0;  // Acumulador fuera del ciclo
    let flujoRestante = flujoMaximo;
    let diametroAnterior = null;
    const profMin = parseFloat(datos.profMin) || 0;
    const profMax = parseFloat(datos.profMax) || 0;
    const profundidad = Math.max(profMin, profMax); 
    let diametroMax = 0; // Guardamos el diámetro máximo encontrado

    // === Resumen por diámetro ===
    const resumenTramosDF = {};
    const addDiam = (obj, d) => {
        if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
        };

// --- Tramo especial: distancia al cuarto de máquinas ---
const distanciaCMDF = parseFloat(datos.distCuarto) || 0;
if (distanciaCMDF > 0) {
    let flujoCMDF = flujoMaximo; // todo el flujo entra a este tramo
    let diametroCMDF = null;
    let velocidadCMDF = -Infinity;
    let cargaCMDF = null;
    let mejorTubCMDF = null;
    let mejorVelCMDF = null;
    let mejorCargaCMDF = null;

    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoCMDF * 0.408498 / (d * d);
        mejorTubCMDF = tub;
        mejorVelCMDF = vel;
        mejorCargaCMDF = 10.536 * 100 * Math.pow(flujoCMDF, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 4.5 && vel > velocidadCMDF) {
            diametroCMDF = tub;
            velocidadCMDF = vel;
            cargaCMDF = mejorCargaCMDF;
        }
    }

    if (!diametroCMDF) {
        diametroCMDF = mejorTubCMDF;
        velocidadCMDF = mejorVelCMDF;
        cargaCMDF = mejorCargaCMDF;
    }

    const longitudCMDF_ft = distanciaCMDF * 3.281;
    const cargaTramoCMDF = (longitudCMDF_ft * cargaCMDF) / 100;

    // Suponemos codos y tees estándar (ejemplo: 0 o 1)
    const cantidadCodosCMDF = 1;
    const longEqCodoCMDF = codo[diametroCMDF];
    const cargaCodoCMDF = (longEqCodoCMDF * cargaCMDF) / 100;

    const cantidadTeesCMDF = 0;
    const longEqTeeCMDF = 0;
    const cargaTeeCMDF = 0;

    const cargaTotalCMDF = cargaTramoCMDF + cargaCodoCMDF + cargaTeeCMDF;
    const tablaDistanciaCMDF = {
        distanciaCMDF: distanciaCMDF.toFixed(2),
        flujoCMDF: flujoCMDF.toFixed(2),
        tuberiaCMDF: diametroCMDF,
        velocidadCMDF: velocidadCMDF.toFixed(2),
        cargaBaseCMDF: cargaCMDF.toFixed(2),
        cargaTramoCMDF: cargaTramoCMDF.toFixed(2),
        cantidadCodosCMDF: cantidadCodosCMDF,
        longEqCodoCMDF: longEqCodoCMDF.toFixed(2),
        cargaCodoCMDF: cargaCodoCMDF.toFixed(2),
        cargaTotalCMDF: cargaTotalCMDF.toFixed(2)
    };

        // Agregar a resumen de materiales
    if (!resumenTramosDF[diametroCMDF]) resumenTramosDF[diametroCMDF] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosDF[diametroCMDF].tuberia_m += distanciaCMDF;
    resumenTramosDF[diametroCMDF].codos += cantidadCodosCMDF;

        for (let i = 0; i < numDrenFondoFinal; i++) {
        let flujoActual = flujoRestante;

        // Elegir diámetro que dé velocidad ≤ 4.5 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = -Infinity;
        let cargaSeleccionada = null;
        let mejorTub = null;
        let mejorVel = null;
        let mejorCarga = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoActual * 0.408498 / (d * d);
            mejorTub = tub;
            mejorVel = velocidad;
            mejorCarga = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

            if (velocidad <= 4.5 && velocidad > velocidadSeleccionada) {
            velocidadSeleccionada = velocidad;
            diametroSeleccionado = tub;
            cargaSeleccionada = mejorCarga;
            }
        }

        if (!diametroSeleccionado) {
            diametroSeleccionado = mejorTub;
            velocidadSeleccionada = mejorVel;
            cargaSeleccionada = mejorCarga;
        }

        let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
        if (dPulgadas > diametroMax) diametroMax = dPulgadas;

        // --- Accesorios base para esta fila ---
        const tipoAccesorio = (i === numDrenFondoFinal - 1) ? "codo" : "tee";

        // Tee (si aplica)
        let longEqTeeRow = 0;
        let cargaTeeRow = 0;
        if (tipoAccesorio === "tee") {
            longEqTeeRow = (teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"]);
            cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
        }

        // Codo base (solo en el último tramo)
        const longEqCodoUnit = (codo[diametroSeleccionado] || codo["tuberia 18.00"]);
        let longEqCodoBaseRow = (tipoAccesorio === "codo") ? longEqCodoUnit : 0;
        let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

        // Reducción entre tramos (si cambia el diámetro)
        let longitudEqReduccion = 0;
        let cargaReduccion = 0;
        if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
            longitudEqReduccion = (reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"]);
            cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
        }

        // Carga por la tubería del tramo
        const cargaTramoRow = (longitudEntreDrenes / 0.3048) * (cargaSeleccionada / 100);
        const cantidadTees = (tipoAccesorio === "tee") ? 1 : 0;          // 1 tee en tramos intermedios
        const codosBase = (tipoAccesorio === "codo") ? 1 : 0;            // 1 codo en el último tramo
        const totalCodosFila = codosBase + 0;                    // codos base + codos extra por √area
        const cantidadReducciones = (longitudEqReduccion > 0) ? 1 : 0;    // 1 si cambió el diámetro respecto al tramo anterior
        let longEqCodoExtraRow = 1 * longEqCodoUnit;
        let cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;

        // Codo total mostrado en la fila (base + extras)
        let longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
        let cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

        // Carga total de la fila (tubería + tee + codo total + reducción)
        const cargaTotalFilaNum = +(cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion).toFixed(2);
        const cargaTotal2 = cargaTotalFilaNum + 0;

        // === Resumen por diámetro (materiales del tramo) ===
        addDiam(resumenTramosDF, diametroSeleccionado);
        resumenTramosDF[diametroSeleccionado].tuberia_m += longitudEntreDrenes;
        if (tipoAccesorio === "tee") resumenTramosDF[diametroSeleccionado].tees += 1;
        else resumenTramosDF[diametroSeleccionado].codos += 1;      // codo base del último tramo
        if (longitudEqReduccion > 0) resumenTramosDF[diametroSeleccionado].reducciones += 1;

        // === Empuje de la fila a la tabla 1 ===
        resultadoDF.push({
            tramo: i + 1,
            flujo: flujoActual.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),

            cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
            cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
            longitud: longitudEntreDrenes.toFixed(2),

            // Tee mostrado solo si aplica
            cantidadTees: cantidadTees,
            longEqTee: longEqTeeRow.toFixed(2),
            cargaTee: cargaTeeRow.toFixed(2),

            // Codo mostrado siempre como TOTAL (base + extra si los hubo)
            cantidadCodos: totalCodosFila,
            longEqCodo: longEqCodoUnit.toFixed(2),
            cargaCodo: cargaCodoTotalRow.toFixed(2),

            // Reducción entre tramos
            cantidadReducciones: cantidadReducciones,
            longEqReduccion: longitudEqReduccion.toFixed(2),
            cargaReduccion: cargaReduccion.toFixed(2),

            // Total de la fila (incluye codos extra si hubo)
            cargaTotal: cargaTotalFilaNum.toFixed(2),

            cargaTotal2: cargaTotal2
        });

        // Acumulados
        sumaCargaTramos += cargaTotalFilaNum;

        // Para siguiente iteración
        flujoRestante -= flujoPorDren;
        if (flujoRestante < 0) flujoRestante = 0;
        diametroAnterior = diametroSeleccionado;
        }

        // Al final:
        const sumaFinal = sumaCargaTramos + parseFloat(tablaDistanciaCMDF.cargaTotalCMDF);
        return { resultadoDF, sumaFinal, resumenTramosDF, tablaDistanciaCMDF };
    }
}

function drenCanal(flujoMaximo, tipoDrenCanal) {
    const largoInfinity = parseFloat(datos.largoInfinity) || 0;
    const diametros = {
        //"tuberia 0.75": 0.81,
        //"tuberia 1.00": 1.03,
        "tuberia 1.50": 1.61,
        "tuberia 2.00": 2.07,
        "tuberia 2.50": 2.47,
        "tuberia 3.00": 3.07,
        "tuberia 4.00": 4.03,
        "tuberia 6.00": 6.07,
        "tuberia 8.00": 7.98,
        "tuberia 10.00": 9.98,
        "tuberia 12.00": 11.89,
        "tuberia 14.00": 13.13,
        "tuberia 16.00": 14.94,
        "tuberia 18.00": 16.81
    };
        const teeLinea = {
        //"tuberia 0.75": 2.40,
        //"tuberia 1.00": 3.20,
        "tuberia 1.50": 5.60,
        "tuberia 2.00": 7.70,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 12.0,
        "tuberia 4.00": 2.80,
        "tuberia 6.00": 3.80,
        "tuberia 8.00": 4.70,
        "tuberia 10.00": 5.20,
        "tuberia 12.00": 6.00,
        "tuberia 14.00": 6.00,
        "tuberia 16.00": 6.00,
        "tuberia 18.00": 6.00
    };
        const teeBranch = {
        //"tuberia 0.75": 5.30,
        //"tuberia 1.00": 6.60,
        "tuberia 1.50": 9.90,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 13.0,
        "tuberia 3.00": 17.0,
        "tuberia 4.00": 12.0,
        "tuberia 6.00": 18.0,
        "tuberia 8.00": 24.0,
        "tuberia 10.00": 30.0,
        "tuberia 12.00": 34.0,
        "tuberia 14.00": 34.0,
        "tuberia 16.00": 34.0,
        "tuberia 18.00": 34.0
    };

        const codo = {
        //"tuberia 0.75": 4.40,
        //"tuberia 1.00": 5.20,
        "tuberia 1.50": 7.40,
        "tuberia 2.00": 8.50,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 11.0,
        "tuberia 4.00": 5.90,
        "tuberia 6.00": 8.90,
        "tuberia 8.00": 12.0,
        "tuberia 10.00": 14.0,
        "tuberia 12.00": 17.0,
        "tuberia 14.00": 17.0,
        "tuberia 16.00": 17.0,
        "tuberia 18.00": 17.0
    };

        const reduccion = {
        //"tuberia 0.75": 8.0,
        //"tuberia 1.00": 8.0,
        "tuberia 1.50": 10.0,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 12.0,
        "tuberia 3.00": 15.0,
        "tuberia 4.00": 20.0,
        "tuberia 6.00": 25.0,
        "tuberia 8.00": 30.0,
        "tuberia 10.00": 35.0,
        "tuberia 12.00": 40.0,
        "tuberia 14.00": 45.0,
        "tuberia 16.00": 50.0,
        "tuberia 18.00": 55.0
    };

    // === Capacidad del dren según tipo ===
    let capacidadDrenCanal = 0;
    if (tipoDrenCanal === "1.5") capacidadDrenCanal = 50;
    else if (tipoDrenCanal === "2.0") capacidadDrenCanal = 95;
    else if (tipoDrenCanal === "7.5") capacidadDrenCanal = 125;
    else if (tipoDrenCanal === "8.0") capacidadDrenCanal = 130;
    else if (tipoDrenCanal === "9.0") capacidadDrenCanal = 135;

    // === Número de drenes ===
    let numDrenCanalFinal = Math.ceil(flujoMaximo / capacidadDrenCanal);
    if (numDrenCanalFinal % 2 !== 0) numDrenCanalFinal++;

        // === Cálculos básicos ===
    const flujoPorDrenCanal = flujoMaximo / numDrenCanalFinal;
    const longitudEntreDrenesCanal = largoInfinity / (numDrenCanalFinal + 1);
    const resultadoDC = [];
    let sumaCargaTramos = 0;  // Acumulador fuera del ciclo
    let flujoRestante = flujoMaximo;
    let diametroAnterior = null;
    const profMin = parseFloat(datos.profMin) || 0;
    const profMax = parseFloat(datos.profMax) || 0;
    const profundidad = Math.max(profMin, profMax); 
    let diametroMax = 0; // Guardamos el diámetro máximo encontrado

    // === Resumen por diámetro ===
    const resumenTramosDC = {};
    const addDiam = (obj, d) => {
        if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
        };

// --- Tramo especial: distancia al cuarto de máquinas ---
const distanciaCMDC = parseFloat(datos.distCuarto) || 0;
if (distanciaCMDC > 0) {
    let flujoCMDC = flujoMaximo; // todo el flujo entra a este tramo
    let diametroCMDC = null;
    let velocidadCMDC = -Infinity;
    let cargaCMDC = null;
    let mejorTubCMDC = null;
    let mejorVelCMDC = null;
    let mejorCargaCMDC = null;

    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoCMDC * 0.408498 / (d * d);
        mejorTubCMDC = tub;
        mejorVelCMDC = vel;
        mejorCargaCMDC = 10.536 * 100 * Math.pow(flujoCMDC, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 4.5 && vel > velocidadCMDC) {
            diametroCMDC = tub;
            velocidadCMDC = vel;
            cargaCMDC = mejorCargaCMDC;
        }
    }

    if (!diametroCMDC) {
        diametroCMDC = mejorTubCMDC;
        velocidadCMDC = mejorVelCMDC;
        cargaCMDC = mejorCargaCMDC;
    }

    const longitudCMDC_ft = distanciaCMDC * 3.281;
    const cargaTramoCMDC = (longitudCMDC_ft * cargaCMDC) / 100;

    // Suponemos codos y tees estándar (ejemplo: 0 o 1)
    const cantidadCodosCMDC = 1;
    const longEqCodoCMDC = codo[diametroCMDC];
    const cargaCodoCMDC = (longEqCodoCMDC * cargaCMDC) / 100;

    const cantidadTeesCMDC = 0;
    const longEqTeeCMDC = 0;
    const cargaTeeCMDC = 0;

    const cargaTotalCMDC = cargaTramoCMDC + cargaCodoCMDC + cargaTeeCMDC;
    const tablaDistanciaCMDC = {
        distanciaCMDC: distanciaCMDC.toFixed(2),
        flujoCMDC: flujoCMDC.toFixed(2),
        tuberiaCMDC: diametroCMDC,
        velocidadCMDC: velocidadCMDC.toFixed(2),
        cargaBaseCMDC: cargaCMDC.toFixed(2),
        cargaTramoCMDC: cargaTramoCMDC.toFixed(2),
        cantidadCodosCMDC: cantidadCodosCMDC,
        longEqCodoCMDC: longEqCodoCMDC.toFixed(2),
        cargaCodoCMDC: cargaCodoCMDC.toFixed(2),
        cargaTotalCMDC: cargaTotalCMDC.toFixed(2)
    };

        // Agregar a resumen de materiales
    if (!resumenTramosDC[diametroCMDC]) resumenTramosDC[diametroCMDC] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosDC[diametroCMDC].tuberia_m += distanciaCMDC;
    resumenTramosDC[diametroCMDC].codos += cantidadCodosCMDC;

        for (let i = 0; i < numDrenCanalFinal; i++) {
        let flujoActual = flujoRestante;

        // Elegir diámetro que dé velocidad ≤ 4.5 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = -Infinity;
        let cargaSeleccionada = null;
        let mejorTub = null;
        let mejorVel = null;
        let mejorCarga = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoActual * 0.408498 / (d * d);
            mejorTub = tub;
            mejorVel = velocidad;
            mejorCarga = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

            if (velocidad <= 4.5 && velocidad > velocidadSeleccionada) {
            velocidadSeleccionada = velocidad;
            diametroSeleccionado = tub;
            cargaSeleccionada = mejorCarga;
            }
        }

        if (!diametroSeleccionado) {
            diametroSeleccionado = mejorTub;
            velocidadSeleccionada = mejorVel;
            cargaSeleccionada = mejorCarga;
        }

        let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
        if (dPulgadas > diametroMax) diametroMax = dPulgadas;

        // --- Accesorios base para esta fila ---
        const tipoAccesorio = (i === numDrenCanalFinal - 1) ? "codo" : "tee";

        // Tee (si aplica)
        let longEqTeeRow = 0;
        let cargaTeeRow = 0;
        if (tipoAccesorio === "tee") {
            longEqTeeRow = (teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"]);
            cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
        }

        // Codo base (solo en el último tramo)
        const longEqCodoUnit = (codo[diametroSeleccionado] || codo["tuberia 18.00"]);
        let longEqCodoBaseRow = (tipoAccesorio === "codo") ? longEqCodoUnit : 0;
        let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

        // Reducción entre tramos (si cambia el diámetro)
        let longitudEqReduccion = 0;
        let cargaReduccion = 0;
        if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
            longitudEqReduccion = (reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"]);
            cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
        }

        // Carga por la tubería del tramo
        const cargaTramoRow = (longitudEntreDrenesCanal / 0.3048) * (cargaSeleccionada / 100);
        const cantidadTees = (tipoAccesorio === "tee") ? 1 : 0;          // 1 tee en tramos intermedios
        const codosBase = (tipoAccesorio === "codo") ? 1 : 0;            // 1 codo en el último tramo
        const totalCodosFila = codosBase + 0;                    // codos base + codos extra por √area
        const cantidadReducciones = (longitudEqReduccion > 0) ? 1 : 0;    // 1 si cambió el diámetro respecto al tramo anterior
        let longEqCodoExtraRow = 1 * longEqCodoUnit;
        let cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;

        // Codo total mostrado en la fila (base + extras)
        let longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
        let cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

        // Carga total de la fila (tubería + tee + codo total + reducción)
        const cargaTotalFilaNum = +(cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion).toFixed(2);
        const cargaTotal2 = cargaTotalFilaNum + 0;

        // === Resumen por diámetro (materiales del tramo) ===
        addDiam(resumenTramosDC, diametroSeleccionado);
        resumenTramosDC[diametroSeleccionado].tuberia_m += longitudEntreDrenesCanal;
        if (tipoAccesorio === "tee") resumenTramosDC[diametroSeleccionado].tees += 1;
        else resumenTramosDC[diametroSeleccionado].codos += 1;      // codo base del último tramo
        if (longitudEqReduccion > 0) resumenTramosDC[diametroSeleccionado].reducciones += 1;

        // === Empuje de la fila a la tabla 1 ===
        resultadoDC.push({
            tramo: i + 1,
            flujo: flujoActual.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),

            cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
            cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
            longitud: longitudEntreDrenesCanal.toFixed(2),

            // Tee mostrado solo si aplica
            cantidadTees: cantidadTees,
            longEqTee: longEqTeeRow.toFixed(2),
            cargaTee: cargaTeeRow.toFixed(2),

            // Codo mostrado siempre como TOTAL (base + extra si los hubo)
            cantidadCodos: totalCodosFila,
            longEqCodo: longEqCodoUnit.toFixed(2),
            cargaCodo: cargaCodoTotalRow.toFixed(2),

            // Reducción entre tramos
            cantidadReducciones: cantidadReducciones,
            longEqReduccion: longitudEqReduccion.toFixed(2),
            cargaReduccion: cargaReduccion.toFixed(2),

            // Total de la fila (incluye codos extra si hubo)
            cargaTotal: cargaTotalFilaNum.toFixed(2),

            cargaTotal2: cargaTotal2
        });

        // Acumulados
        sumaCargaTramos += cargaTotalFilaNum;

        // Para siguiente iteración
        flujoRestante -= flujoPorDrenCanal;
        if (flujoRestante < 0) flujoRestante = 0;
        diametroAnterior = diametroSeleccionado;
        }

        // Al final:
        const sumaFinal = sumaCargaTramos + parseFloat(tablaDistanciaCMDC.cargaTotalCMDC);
        return { resultadoDC, sumaFinal, resumenTramosDC, tablaDistanciaCMDC };
    }
}

function barredora(flujoMaximo, tipoBarredora) {
    const area = parseFloat(datos.area) || 0;
    const diametros = {
        //"tuberia 0.75": 0.81,
        //"tuberia 1.00": 1.03,
        "tuberia 1.50": 1.61,
        "tuberia 2.00": 2.07,
        "tuberia 2.50": 2.47,
        "tuberia 3.00": 3.07,
        "tuberia 4.00": 4.03,
        "tuberia 6.00": 6.07,
        "tuberia 8.00": 7.98,
        "tuberia 10.00": 9.98,
        "tuberia 12.00": 11.89,
        "tuberia 14.00": 13.13,
        "tuberia 16.00": 14.94,
        "tuberia 18.00": 16.81
    };
        const teeLinea = {
        //"tuberia 0.75": 2.40,
        //"tuberia 1.00": 3.20,
        "tuberia 1.50": 5.60,
        "tuberia 2.00": 7.70,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 12.0,
        "tuberia 4.00": 2.80,
        "tuberia 6.00": 3.80,
        "tuberia 8.00": 4.70,
        "tuberia 10.00": 5.20,
        "tuberia 12.00": 6.00,
        "tuberia 14.00": 6.00,
        "tuberia 16.00": 6.00,
        "tuberia 18.00": 6.00
    };
        const teeBranch = {
        //"tuberia 0.75": 5.30,
        //"tuberia 1.00": 6.60,
        "tuberia 1.50": 9.90,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 13.0,
        "tuberia 3.00": 17.0,
        "tuberia 4.00": 12.0,
        "tuberia 6.00": 18.0,
        "tuberia 8.00": 24.0,
        "tuberia 10.00": 30.0,
        "tuberia 12.00": 34.0,
        "tuberia 14.00": 34.0,
        "tuberia 16.00": 34.0,
        "tuberia 18.00": 34.0
    };

        const codo = {
        //"tuberia 0.75": 4.40,
        //"tuberia 1.00": 5.20,
        "tuberia 1.50": 7.40,
        "tuberia 2.00": 8.50,
        "tuberia 2.50": 9.30,
        "tuberia 3.00": 11.0,
        "tuberia 4.00": 5.90,
        "tuberia 6.00": 8.90,
        "tuberia 8.00": 12.0,
        "tuberia 10.00": 14.0,
        "tuberia 12.00": 17.0,
        "tuberia 14.00": 17.0,
        "tuberia 16.00": 17.0,
        "tuberia 18.00": 17.0
    };

        const reduccion = {
        //"tuberia 0.75": 8.0,
        //"tuberia 1.00": 8.0,
        "tuberia 1.50": 10.0,
        "tuberia 2.00": 12.0,
        "tuberia 2.50": 12.0,
        "tuberia 3.00": 15.0,
        "tuberia 4.00": 20.0,
        "tuberia 6.00": 25.0,
        "tuberia 8.00": 30.0,
        "tuberia 10.00": 35.0,
        "tuberia 12.00": 40.0,
        "tuberia 14.00": 45.0,
        "tuberia 16.00": 50.0,
        "tuberia 18.00": 55.0
    };

    // === Cálculo de barredoras ===
    const mangueraBarredora = parseFloat(datos.mangueraBarredora) || 7.5;
    const largoMangueraFinal = mangueraBarredora - (mangueraBarredora * 0.05);
    const areaSemiCirculo = (Math.PI * Math.pow(largoMangueraFinal, 2)) / 2;
    let numBarredoraA = area / areaSemiCirculo;
    let numBarredoraB = Math.sqrt(area) / (largoMangueraFinal * 2);
    // Selección según la condición
    let numBarredoras;
    if (largoMangueraFinal > Math.sqrt(area)) {
        numBarredoras = numBarredoraB;
    } else {
        numBarredoras = numBarredoraA;
    }
    numBarredoras = Math.ceil(numBarredoras); 
    const flujoMaximoAjustado = (flujoMaximo > 120) ? 120 : flujoMaximo;
    const flujoPorBarredora = flujoMaximoAjustado / numBarredoras;
    const longitudTotal = Math.sqrt(area) * 3.5;
    const longitudEntreBarredoras = longitudTotal / numBarredoras;
    const resultadoB = [];
    let sumaCargaTramos = 0;  // Acumulador fuera del ciclo
    let flujoRestante = flujoMaximoAjustado;
    let diametroAnterior = null;
    const profMin = parseFloat(datos.profMin) || 0;
    const profMax = parseFloat(datos.profMax) || 0;
    const profundidad = Math.max(profMin, profMax); 
    let diametroMax = 0; // Guardamos el diámetro máximo encontrado
    const longitudDisparo = ((profundidad - 0.3) + 1); 
    const longitudDisparoFt = longitudDisparo / 0.3048;

    // === Selección del diámetro del disparo con restricción de velocidad ≤ 8 ft/s ===
    let tuberiaDisparo = null;
    let velocidadDisparoSel = -Infinity;
    let cargaDisparoSel = null;
    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoPorBarredora * 0.408498 / (d * d);
        const carga = 10.536 * 100 * Math.pow(flujoPorBarredora, 1.852) /
                    (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 8.0 && vel > velocidadDisparoSel) {
            tuberiaDisparo = tub;
            velocidadDisparoSel = vel;
            cargaDisparoSel = carga;
        }
    }
    // Si ninguno cumple, elegir el más grande
    if (!tuberiaDisparo) {
        tuberiaDisparo = "tuberia 18.00";
        const d = diametros[tuberiaDisparo];
        velocidadDisparoSel = flujoPorBarredora * 0.408498 / (d * d);
        cargaDisparoSel = 10.536 * 100 * Math.pow(flujoPorBarredora, 1.852) /
                        (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
    }
    // === Cálculo de cargas del disparo ===
    const cargaDisparoBase = cargaDisparoSel;
    const cargaDisparoTramo = (longitudDisparoFt * cargaDisparoBase) / 100;
    const cargaDisparoCodo = (codo[tuberiaDisparo] * cargaDisparoBase) / 100;
    let cargaDisparoReduccion = 0;
    let longEqReduccionDisparo = 0;
    if (diametroAnterior && diametroAnterior !== tuberiaDisparo) {
        longEqReduccionDisparo = reduccion[tuberiaDisparo];
        cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
    }
    const cargaDisparoTotal = cargaDisparoTramo + cargaDisparoCodo + cargaDisparoReduccion;

    // === Resumen por diámetro ===
    const resumenTramosB = {};
    const resumenDisparosB = {};
    const addDiam = (obj, d) => {
        if (!obj[d]) obj[d] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
        };

    const raizArea = Math.sqrt(area);
    let sumaLongitudes = 0;
    let siguienteUmbral = raizArea;

// --- Tramo especial: distancia al cuarto de máquinas ---
const distanciaCMB = parseFloat(datos.distCuarto) || 0;
if (distanciaCMB > 0) {
    let flujoCMB = flujoMaximoAjustado; // todo el flujo entra a este tramo
    let diametroCMB = null;
    let velocidadCMB = -Infinity;
    let cargaCMB = null;
    let mejorTubCMB = null;
    let mejorVelCMB = null;
    let mejorCargaCMB = null;

    for (let tub in diametros) {
        const d = diametros[tub];
        const vel = flujoCMB * 0.408498 / (d * d);
        mejorTubCMB = tub;
        mejorVelCMB = vel;
        mejorCargaCMB = 10.536 * 100 * Math.pow(flujoCMB, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

        if (vel <= 8.0 && vel > velocidadCMB) {
            diametroCMB = tub;
            velocidadCMB = vel;
            cargaCMB = mejorCargaCMB;
        }
    }

    if (!diametroCMB) {
        diametroCMB = mejorTubCMB;
        velocidadCMB = mejorVelCMB;
        cargaCMB = mejorCargaCMB;
    }

    const longitudCMB_ft = distanciaCMB * 3.281;
    const cargaTramoCMB = (longitudCMB_ft * cargaCMB) / 100;

    // Suponemos codos y tees estándar (ejemplo: 0 o 1)
    const cantidadCodosCMB = 1;
    const longEqCodoCMB = codo[diametroCMB];
    const cargaCodoCMB = (longEqCodoCMB * cargaCMB) / 100;

    const cantidadTeesCMB = 0;
    const longEqTeeCMB = 0;
    const cargaTeeCMB = 0;

    const cargaTotalCMB = cargaTramoCMB + cargaCodoCMB + cargaTeeCMB;
    const tablaDistanciaCMB = {
        distanciaCMB: distanciaCMB.toFixed(2),
        flujoCMB: flujoCMB.toFixed(2),
        tuberiaCMB: diametroCMB,
        velocidadCMB: velocidadCMB.toFixed(2),
        cargaBaseCMB: cargaCMB.toFixed(2),
        cargaTramoCMB: cargaTramoCMB.toFixed(2),
        cantidadCodosCMB: cantidadCodosCMB,
        longEqCodoCMB: longEqCodoCMB.toFixed(2),
        cargaCodoCMB: cargaCodoCMB.toFixed(2),
        cargaTotalCMB: cargaTotalCMB.toFixed(2)
    };

    // Agregar a resumen de materiales
    if (!resumenTramosB[diametroCMB]) resumenTramosB[diametroCMB] = { tuberia_m: 0, tees: 0, codos: 0, reducciones: 0 };
    resumenTramosB[diametroCMB].tuberia_m += distanciaCMB;
    resumenTramosB[diametroCMB].codos += cantidadCodosCMB;

        for (let i = 0; i < numBarredoras; i++) {
        let flujoActual = flujoRestante;

        // Elegir diámetro que dé velocidad ≤ 8.0 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = -Infinity;
        let cargaSeleccionada = null;
        let mejorTub = null;
        let mejorVel = null;
        let mejorCarga = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoActual * 0.408498 / (d * d);
            mejorTub = tub;
            mejorVel = velocidad;
            mejorCarga = 10.536 * 100 * Math.pow(flujoActual, 1.852) / (Math.pow(d, 4.8655) * Math.pow(150, 1.852));

            if (velocidad <= 8.0 && velocidad > velocidadSeleccionada) {
            velocidadSeleccionada = velocidad;
            diametroSeleccionado = tub;
            cargaSeleccionada = mejorCarga;
            }
        }

        if (!diametroSeleccionado) {
            diametroSeleccionado = mejorTub;
            velocidadSeleccionada = mejorVel;
            cargaSeleccionada = mejorCarga;
        }

        let dPulgadas = parseFloat(diametroSeleccionado.replace("tuberia ", ""));
        if (dPulgadas > diametroMax) diametroMax = dPulgadas;

        // --- Accesorios base para esta fila ---
        const tipoAccesorio = (i === numBarredoras - 1) ? "codo" : "tee";

        // Tee (si aplica)
        let longEqTeeRow = 0;
        let cargaTeeRow = 0;
        if (tipoAccesorio === "tee") {
            longEqTeeRow = (teeLinea[diametroSeleccionado] || teeLinea["tuberia 18.00"]);
            cargaTeeRow = (longEqTeeRow * cargaSeleccionada) / 100;
        }

        // Codo base (solo en el último tramo)
        const longEqCodoUnit = (codo[diametroSeleccionado] || codo["tuberia 18.00"]);
        let longEqCodoBaseRow = (tipoAccesorio === "codo") ? longEqCodoUnit : 0;
        let cargaCodoBaseRow = (longEqCodoBaseRow * cargaSeleccionada) / 100;

        // Reducción entre tramos (si cambia el diámetro)
        let longitudEqReduccion = 0;
        let cargaReduccion = 0;
        if (diametroAnterior && diametroAnterior !== diametroSeleccionado) {
            longitudEqReduccion = (reduccion[diametroSeleccionado] || reduccion["tuberia 18.00"]);
            cargaReduccion = (longitudEqReduccion * cargaSeleccionada) / 100;
        }

        // Carga por la tubería del tramo
        const cargaTramoRow = (longitudEntreBarredoras / 0.3048) * (cargaSeleccionada / 100);

        // --- Codos extra por múltiplos de √area ---
        sumaLongitudes += longitudEntreBarredoras;       // acumulado global
        let extraCount = 0;
        while (sumaLongitudes >= siguienteUmbral) {
            extraCount += 1;
            siguienteUmbral += raizArea;                 // siguiente múltiplo
        }

        const cantidadTees = (tipoAccesorio === "tee") ? 1 : 0;          // 1 tee en tramos intermedios
        const codosBase = (tipoAccesorio === "codo") ? 1 : 0;            // 1 codo en el último tramo
        const totalCodosFila = codosBase + extraCount;                    // codos base + codos extra por √area
        const cantidadReducciones = (longitudEqReduccion > 0) ? 1 : 0;    // 1 si cambió el diámetro respecto al tramo anterior
        let longEqCodoExtraRow = extraCount * longEqCodoUnit;
        let cargaCodoExtraRow = (longEqCodoExtraRow * cargaSeleccionada) / 100;

        // Codo total mostrado en la fila (base + extras)
        let longEqCodoTotalRow = longEqCodoBaseRow + longEqCodoExtraRow;
        let cargaCodoTotalRow = cargaCodoBaseRow + cargaCodoExtraRow;

        // Carga total de la fila (tubería + tee + codo total + reducción)
        const cargaTotalFilaNum = +(cargaTramoRow + cargaTeeRow + cargaCodoTotalRow + cargaReduccion).toFixed(2);
        const cargaTotal2 = cargaTotalFilaNum + cargaDisparoTotal;

        // === Resumen por diámetro (materiales del tramo) ===
        addDiam(resumenTramosB, diametroSeleccionado);
        resumenTramosB[diametroSeleccionado].tuberia_m += longitudEntreBarredoras;
        if (tipoAccesorio === "tee") resumenTramosB[diametroSeleccionado].tees += 1;
        else resumenTramosB[diametroSeleccionado].codos += 1;      // codo base del último tramo
        resumenTramosB[diametroSeleccionado].codos += extraCount;   // codos extra (0, 1, 2, ...)
        if (longitudEqReduccion > 0) resumenTramosB[diametroSeleccionado].reducciones += 1;

        // === Resumen materiales del disparo ===
        addDiam(resumenDisparosB, tuberiaDisparo);
        resumenDisparosB[tuberiaDisparo].tuberia_m += longitudDisparo;
        resumenDisparosB[tuberiaDisparo].codos += 1;
        if (diametroSeleccionado !== tuberiaDisparo) resumenDisparosB[tuberiaDisparo].reducciones += 1;

        let dDisparo = parseFloat(tuberiaDisparo.replace("tuberia ", ""));
        if (diametroMax > dDisparo) {
            longEqReduccionDisparo = reduccion[tuberiaDisparo];
            cargaDisparoReduccion = (longEqReduccionDisparo * cargaDisparoBase) / 100;
        } else {
            longEqReduccionDisparo = 0;
            cargaDisparoReduccion = 0;
        }

        // === Empuje de la fila a la tabla 1 ===
        resultadoB.push({
            tramo: i + 1,
            flujo: flujoActual.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),

            cargaBase: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A",
            cargaTramo: cargaSeleccionada ? cargaTramoRow.toFixed(2) : "N/A",
            longitud: longitudEntreBarredoras.toFixed(2),

            // Tee mostrado solo si aplica
            cantidadTees: cantidadTees,
            longEqTee: longEqTeeRow.toFixed(2),
            cargaTee: cargaTeeRow.toFixed(2),

            // Codo mostrado siempre como TOTAL (base + extra si los hubo)
            cantidadCodos: totalCodosFila,
            longEqCodo: longEqCodoUnit.toFixed(2),
            cargaCodo: cargaCodoTotalRow.toFixed(2),

            // Reducción entre tramos
            cantidadReducciones: cantidadReducciones,
            longEqReduccion: longitudEqReduccion.toFixed(2),
            cargaReduccion: cargaReduccion.toFixed(2),

            // Total de la fila (incluye codos extra si hubo)
            cargaTotal: cargaTotalFilaNum.toFixed(2),

            // Datos del disparo
            flujoDisparo: flujoPorBarredora,
            diametroDisparo: tuberiaDisparo,
            velocidadDisparo: flujoPorBarredora * 0.408498 / Math.pow(diametros[tuberiaDisparo], 2),
            cargaBaseDisparo: cargaDisparoBase,
            cargaDisparo: cargaDisparoTramo,
            longitudDisparo: longitudDisparo,
            longEqCodoDisparo: codo[tuberiaDisparo],
            cargaCodoDisparo: cargaDisparoCodo,
            longEqReduccionDisparo: longEqReduccionDisparo,
            cargaReduccionDisparo: cargaDisparoReduccion,
            cargaDisparoTotal: cargaDisparoTotal,

            cargaTotal2: cargaTotal2
        });

        // Acumulados
        sumaCargaTramos += cargaTotalFilaNum;

        // Para siguiente iteración
        flujoRestante -= flujoPorBarredora;
        if (flujoRestante < 0) flujoRestante = 0;
        diametroAnterior = diametroSeleccionado;
        }

        // Al final:
        const sumaFinal = sumaCargaTramos + cargaDisparoTotal + parseFloat(tablaDistanciaCMB.cargaTotalCMB);
        return { resultadoB, sumaFinal, resumenTramosB, resumenDisparosB, tablaDistanciaCMB };
    }
}

const temperatura = {
    "guadalajara": {
        min: [9.5, 10.3, 12.3, 14.3, 16.4, 17.3, 16.5, 16.4, 16.5, 14.9, 12.1, 10.3],
        max: [24.7, 26.5, 29, 31.2, 32.5, 30.5, 27.5, 27.3, 27.1, 27.1, 26.4, 24.7]
    },
    "mexicali": {
        min: [5.8, 7.6, 10, 12.8, 16.7, 20.9, 25.6, 25.5, 22.1, 16.1, 9.8, 5.7],
        max: [20.5, 23, 26, 29.7, 35, 40, 42.3, 41.5, 38.7, 32.5, 25.3, 20.4]
    },
    "losCabos": {
        min: [13, 12.7, 13.5, 15.4, 17, 19, 22.8, 24.2, 23.9, 21.4, 17.5, 14.5],
        max: [25.4, 25.9, 26.9, 29, 30.7, 31.7, 33.3, 33.7, 33, 32.1, 29.4, 26.8]
    },
    "hermosillo": {
        min: [9.4, 10.6, 12.4, 15, 18.5, 23.5, 25.6, 25.4, 24.1, 19.3, 13, 9.7],
        max: [23.7, 25.7, 28, 31.8, 35.3, 39.5, 39, 37.8, 37.2, 33.6, 28, 23.8]
    },
    "chihuahua": {
        min: [1.3, 3, 6.5, 9.3, 13.3, 17.6, 18.25, 17.25, 15, 10, 5, 1.5],
        max: [18, 20.3, 24, 27.3, 31.3, 33.3, 31.75, 30, 28.6, 26.25, 22, 18]
    },
    "torreon": {
        min: [6.8, 8.6, 11.9, 15.6, 19, 20.8, 20.5, 20.3, 18.6, 15.2, 10.3, 7.4],
        max: [22.3, 25.3, 26, 32.5, 35.3, 35.4, 34.3, 33.7, 31.8, 29.5, 26.1, 22.8]
    },
    "monterrey": {
        min: [8.2, 10, 13.2, 16.7, 20.2, 22, 22.3, 22.5, 20.9, 17.2, 12.7, 9.1],
        max: [20.7, 23.2, 26.9, 30, 32.2, 33.8, 34.8, 34.5, 31.5, 27.6, 24.1, 21.2]
    },
    "tampico": {
        min: [4, 13, 15, 16, 21, 23, 22, 23, 22, 16, 8, 10],
        max: [29, 29, 30, 32, 33, 34, 44, 34, 33, 32, 30, 33]
    },
    "veracruz": {
        min: [17, 17, 20, 22, 24, 24, 23, 23, 23, 22, 19, 18],
        max: [26, 27, 29, 31, 32, 32, 31, 32, 32, 30, 29, 27]
    },
    "sanLuisPotosi": {
        min: [5.5, 6.8, 9.3, 11.9, 13.7, 14.1, 13.4, 13.4, 12.9, 10.8, 8.2, 6.4],
        max: [20.6, 22.5, 25.4, 27.7, 28.4, 26.7, 24.8, 25, 23.8, 23.2, 22.4, 20.7]
    },
    "durango": {
        min: [1.3, 2.4, 5.3, 8.2, 11.1, 14, 14, 13.7, 12.2, 9.1, 5, 2.1],
        max: [20.5, 22.1, 24.5, 27.2, 30, 30.4, 28, 27.6, 26.7, 25.6, 23, 20.5]
    },
    "culiacan": {
        min: [10.9, 11.3, 12.1, 14.5, 18, 23.2, 24.1, 23.8, 23.6, 20.7, 15.6, 12.2],
        max: [27.8, 28.9, 30.5, 32.8, 34.9, 35.9, 35.5, 34.8, 34.4, 34.2, 31.5, 28.2]
    },
    "tepic": {
        min: [8, 8, 9, 10.3, 14, 18, 19, 19.75, 19.6, 17, 12.6, 9],
        max: [26, 27, 28.5, 30, 31, 30, 29, 28.75, 28, 28.6, 27.6, 26.5]
    },
    "colima": {
        min: [14, 14, 14.5, 16, 18.6, 21.5, 22, 22, 21.6, 20, 17.6, 15],
        max: [28, 28.6, 29.5, 31, 32, 31.5, 31, 30.75, 30.6, 31, 30, 28.5]
    },
    "aguascalientes": {
        min: [4, 5, 7, 9.3, 12.3, 14.25, 14, 14, 14.6, 10.25, 6.6, 4.25],
        max: [22.3, 24, 26.5, 28.6, 30, 28.5, 26.25, 26, 25.6, 25, 24, 22.5]
    },
    "zacatecas": {
        min: [1, 2, 3.75, 6.3, 9, 11.25, 11, 10.75, 9.3, 6.5, 3, 1.25],
        max: [17.6, 19.3, 22, 24, 25.6, 25, 23, 22.5, 22, 21.5, 20.3, 18.5]
    },
    "morelia": {
        min: [5.2, 6.1, 8.4, 10.6, 12.5, 13.4, 12.8, 12.9, 12.7, 10.5, 7.8, 5.9],
        max: [23.8, 25.6, 27.9, 30, 30.6, 28.4, 26.1, 26, 25.5, 25.5, 25.3, 24.2]
    },
    "leon": {
        min: [7.7, 8.9, 10.9, 13.8, 15.7, 16.4, 15.2, 15.2, 14.8, 12.5, 10, 8.3],
        max: [23.6, 25.7, 28.2, 30.5, 31.7, 29.9, 27.5, 27.6, 27.1, 26.9, 25.8, 24]
    },
    "queretaro": {
        min: [6, 7, 9.5, 12, 13.6, 14.75, 14.5, 14, 13.6, 11.5, 8.6, 6.25],
        max: [23, 25, 27, 28.6, 29.6, 28, 26.75, 26.6, 26, 25.5, 24.6, 23.5]
    },
    "pachuca": {
        min: [2.8, 3.4, 5.6, 7.8, 9.2, 9.4, 9.2, 8.8, 8.4, 6.9, 4.2, 3.5],
        max: [19.8, 20.7, 23, 24.6, 24.1, 22, 20.7, 20.8, 20.5, 20.4, 20, 19.7]
    },
    "ciudadDeMexico": {
        min: [7.4, 8.5, 10.4, 12.3, 13.2, 13.5, 12.5, 12.7, 12.7, 11.2, 9.7, 8.1],
        max: [21.7, 23.4, 25.7, 26.8, 26.8, 25.3, 23.8, 23.9, 23.3, 22.9, 22.9, 21.9]
    },
    "acapulco": {
        min: [23.3, 23.5, 23.5, 24, 25.1, 25.2, 25.1, 25.1, 24.7, 25.1, 24.8, 24.1],
        max: [30.4, 30.4, 30.4, 30.8, 31.6, 31.9, 32.3, 32.2, 31.6, 31.7, 31.4, 30.9]
    },
    "cuernavaca": {
        min: [12.2, 13.3, 15, 16.6, 17.3, 16.8, 16, 15.9, 15.7, 14.9, 13.7, 12.7],
        max: [25.2, 26.5, 28.8, 30.1, 29.7, 27.1, 26.2, 26.1, 25.1, 25.9, 25.8, 25.2]
    },
    "puebla": {
        min: [6, 7, 9, 11, 12, 13, 12, 12, 12, 10, 8, 6],
        max: [22, 23, 25, 27, 26, 25, 24, 24, 23, 23, 23, 21]
    },
    "tlaxcala": {
        min: [5, 6.6, 8, 9.3, 11, 11.5, 11, 11, 11, 9.5, 7, 5.5],
        max: [20.6, 21.6, 23.5, 24.3, 24.3, 23.25, 22.5, 22.5, 22, 21.5, 21, 20.5]
    },
    "oaxaca": {
        min: [9, 10, 12, 14, 15.3, 16, 15.5, 15, 15, 13.5, 11, 9.25],
        max: [25.75, 27.25, 29.25, 30.6, 29.3, 27, 26, 26, 26, 26, 26, 25.75]
    },
    "villahermosa": {
        min: [19.3, 19.7, 21.3, 23.1, 24.2, 24.2, 23.8, 23.8, 23.8, 23, 21.5, 19.9],
        max: [27.9, 29.2, 31.9, 33.9, 35.1, 34.4, 33.9, 34, 33, 31.2, 29.8, 28.3]
    },
    "tuxtlaGutierrez": {
        min: [17, 17.3, 18.25, 21, 22, 22, 21, 21, 21.3, 20.5, 19, 17.5],
        max: [28.25, 30, 31.5, 33.3, 33.3, 31.25, 31, 31, 30.3, 29.5, 28.6, 28]
    },
    "campeche": {
        min: [18.3, 19.3, 20.75, 22.3, 24, 24, 23.5, 23.75, 23.6, 22.25, 20.6, 19.25],
        max: [28, 29, 31, 33, 34, 33.25, 33, 33, 32, 31, 29.6, 28.25]
    },
    "merida": {
        min: [17.2, 17.3, 18.6, 20.2, 21.7, 21.6, 21.4, 21.3, 21.6, 20.8, 19.3, 17.5],
        max: [30.8, 31.5, 34, 35.6, 36.3, 35.3, 35, 34.9, 34.2, 32.7, 31.5, 30.6]
    },
    "cancun": {
        min: [19.8, 20.3, 21, 22.6, 23.9, 24.7, 24.8, 24.6, 24.3, 23.3, 21.9, 20.5],
        max: [28.3, 29.4, 30.7, 32.2, 33.5, 33.7, 34.3, 34.8, 33.7, 31.6, 29.8, 28.6]
    },
    "manzanillo": {
        min: [20.3, 19.8, 19.5, 20.5, 22.5, 24.6, 24.9, 24.8, 24.5, 24.3, 22.9, 21.5],
        max: [29.4, 29.2, 29, 29.4, 30.5, 31.6, 32.4, 32.5, 31.7, 31.9, 31.1, 30]
    },
    "puertoVallarta": {
        min: [16.7, 16.3, 16.9, 17.2, 20.2, 22.8, 22.9, 23, 22.9, 22.2, 19.7, 18],
        max: [28.8, 29, 29.2, 29.9, 31, 32.3, 33.3, 33.7, 33.6, 33.6, 32.3, 29.9]
    },
};

const velocidadViento = {
    "guadalajara": {
        max: [8.8, 9.2, 9.6, 9.5, 9.2, 8, 7, 7.4, 7.9, 7.9, 8, 8.2]
    },
    "mexicali": {
        max: [10.5, 11.4, 12.9, 14, 14, 13.4, 11.9, 10.8, 11.1, 11.1, 10.7, 10.4]
    },
    "losCabos": {
        max: [14.3, 13.6, 13.6, 13.2, 13.1, 12.9, 11.3, 11.6, 12.1, 12, 13.9, 14.6]
    },
    "hermosillo": {
        max: [12.4, 12.7, 13.4, 13.9, 14.1, 14.1, 12.8, 9.6, 10.7, 11.4, 12.3, 12.5]
    },
    "chihuahua": {
        max: [13.9, 15.4, 16.6, 16.6, 16, 13.4, 11.4, 9.9, 10.6, 11.8, 13, 13.2]
    },
    "torreon": {
        max: [10.2, 11.1, 11.7, 11.8, 11.5, 12.3, 12.2, 11.6, 11.6, 10.4, 9.6, 9.7]
    },
    "monterrey": {
        max: [10.8, 12.2, 13.1, 13.4, 13.9, 15.1, 15.2, 14.4, 12.9, 11.3, 10.7, 10.1]
    },
    "tampico": {
        max: [15.5, 16, 16.6, 16.7, 16.6, 15.5, 14.3, 12.7, 13.8, 14.7, 15.3, 15.6]
    },
    "veracruz": {
        max: [15.6, 15.3, 14.9, 14.8, 13.5, 12.3, 10.4, 10.3, 14.4, 15.7, 15.9, 15.7]
    },
    "sanLuisPotosi": {
        max: [13.9, 15, 15.5, 15.2, 14, 16.2, 16.2, 15.6, 15.5, 14.2, 12.5, 13]
    },
    "durango": {
        max: [11.9, 12.7, 13.3, 13.1, 12, 9.8, 9.5, 9.3, 9.4, 9.3, 10.5, 11.2]
    },
    "culiacan": {
        max: [9.1, 9.5, 10, 10.2, 11, 11.1, 9.9, 7.9, 7.9, 8.6, 8.8, 8.8]
    },
    "tepic": {
        max: [8.3, 8.7, 8.9, 9.1, 9.3, 9.3, 7.8, 6.9, 7, 7.5, 7.8, 7.9]
    },
    "colima": {
        max: [8.6, 9.1, 9.7, 10.2, 10.4, 10.1, 8.3, 7.9, 8, 7.5, 7.7, 8]
    },
    "aguascalientes": {
        max: [12.4, 13, 13.3, 13.1, 12, 12.3, 12.3, 12.4, 12.6, 12.1, 11.3, 11.6]
    },
    "zacatecas": {
        max: [15.1, 15.7, 16.3, 16, 14.5, 14.4, 14.5, 14.3, 14.2, 13.2, 13.2, 14.1]
    },
    "morelia": {
        max: [8, 8.6, 9.1, 9.1, 8.4, 7.2, 6.7, 6.8, 7.6, 7.5, 7.4, 7.4]
    },
    "leon": {
        max: [12.8, 13.3, 13.6, 13.3, 12.3, 13.7, 13.7, 14, 14.3, 14, 12.8, 12.1]
    },
    "queretaro": {
        max: [11.9, 12.7, 12.9, 12.7, 11.9, 13.1, 13.1, 13.1, 13.2, 13, 11.8, 11.1]
    },
    "pachuca": {
        max: [9.3, 10.1, 10.5, 10.6, 10.9, 11.4, 11.4, 11.2, 10.9, 10.5, 9.2, 8.5]
    },
    "ciudadDeMexico": {
        max: [7.9, 8.3, 8.6, 8.4, 7, 7.1, 7.1, 7, 7.6, 7.6, 7.1, 7.2]
    },
    "acapulco": {
        max: [9.7, 10.5, 10.8, 10.8, 11.1, 11.1, 10.4, 10.7, 11.2, 10.5, 9.1, 9]
    },
    "cuernavaca": {
        max: [8.4, 8.9, 9.1, 8.9, 7.8, 7.2, 7.3, 7, 6.9, 7.3, 7.5, 7.9]
    },
    "puebla": {
        max: [10.2, 10.9, 12.1, 13, 13, 12.2, 10.9, 10.2, 10.4, 10.5, 10.3, 10.1]
    },
    "tlaxcala": {
        max: [9.3, 9.8, 10, 9.5, 8.2, 9.3, 9.6, 9.4, 9.8, 9.8, 9.5, 8.6]
    },
    "oaxaca": {
        max: [10.2, 10, 9.7, 9.1, 8.5, 10, 10.7, 10.3, 10.3, 11.7, 11.8, 10.7]
    },
    "villahermosa": {
        max: [12.1, 11.9, 11.5, 10.9, 10.8, 12.9, 13.5, 12.9, 10.9, 11.8, 12, 12]
    },
    "tuxtlaGutierrez": {
        max: [12.6, 12.5, 12.3, 11.6, 10, 7.8, 7.2, 7.3, 8.9, 11.6, 12.1, 12.3]
    },
    "campeche": {
        max: [11.8, 12.3, 12.7, 12.9, 12.7, 11.6, 11.2, 10.4, 10.3, 11.3, 11.5, 11.5]
    },
    "merida": {
        max: [7.2, 7.8, 8.2, 8.2, 8.1, 7, 6.4, 5.9, 5.9, 6.7, 6.9, 7]
    },
    "cancun": {
        max: [14.1, 14.6, 15, 14.6, 13.6, 13, 11.8, 10.8, 11.6, 13.7, 13.9, 14]
    },
    "manzanillo": {
        max: [8.7, 9.1, 9.6, 9.7, 10.3, 10.3, 9.6, 9.5, 9.8, 9, 8, 8]
    },
    "puertoVallarta": {
        max: [10, 10.6, 10.9, 11.1, 11.1, 10.7, 9.1, 9.1, 9.4, 9.3, 9.4, 9.5]
    },
};

const humedad = {
    "guadalajara": {
        promedio: [77, 74, 66, 55, 45, 40, 30, 32, 41, 51, 63, 72]
    },
    "mexicali": {
        promedio: [38, 36, 32, 28, 24, 20, 22, 24, 26, 30, 34, 38]
    },
    "losCabos": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 65, 70, 75, 78]
    },
    "hermosillo": {
        promedio: [40, 38, 35, 30, 25, 20, 25, 30, 35, 40, 45, 50]
    },
    "chihuahua": {
        promedio: [48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26]
    },
    "torreon": {
        promedio: [43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21]
    },
    "monterrey": {
        promedio: [65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 43]
    },
    "tampico": {
        promedio: [76, 77, 75, 74, 74, 75, 76, 77, 77, 76, 75, 75]
    },
    "veracruz": {
        promedio: [78, 79, 78, 74, 74, 75, 76, 77, 77, 76, 75, 78]
    },
    "sanLuisPotosi": {
        promedio: [60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38]
    },
    "durango": {
        promedio: [55, 53, 51, 49, 47, 45, 43, 41, 39, 37, 35, 33]
    },
    "culiacan": {
        promedio: [72, 70, 68, 64, 64, 65, 70, 75, 75, 74, 73, 72]
    },
    "tepic": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "colima": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "aguascalientes": {
        promedio: [50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28]
    },
    "zacatecas": {
        promedio: [51, 49, 47, 29, 31, 33, 35, 37, 68, 66, 64, 62]
    },
    "morelia": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 79, 75, 73, 71]
    },
    "leon": {
        promedio: [54, 52, 50, 32, 34, 36, 38, 40, 77, 75, 73, 71]
    },
    "queretaro": {
        promedio: [60, 58, 56, 35, 37, 39, 41, 43, 72, 70, 68, 66]
    },
    "pachuca": {
        promedio: [60, 58, 51, 53, 55, 57, 59, 61, 82, 80, 78, 76]
    },
    "ciudadDeMexico": {
        promedio: [60, 58, 42, 44, 46, 48, 50, 52, 78, 76, 74, 72]
    },
    "acapulco": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "cuernavaca": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 65, 70, 75, 78]
    },
    "puebla": {
        promedio: [65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 43]
    },
    "tlaxcala": {
        promedio: [60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38]
    },
    "oaxaca": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 65, 70, 75, 78]
    },
    "villahermosa": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "tuxtlaGutierrez": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "campeche": {
        promedio: [78, 76, 73, 68, 63, 58, 63, 68, 73, 78, 83, 88]
    },
    "merida": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "cancun": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "manzanillo": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "puertoVallarta": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
};