function calcular() {
    const vol = volumen();
    const flujoVol = flujoVolumen();
    const flujoInf = flujoInfinity();
    const flujoMax = flujoMaximo(flujoVol, flujoInf);
    const resultadoFlujo = velocidadCargaFlujo(flujoMax);
    const velFlujo = resultadoFlujo.velocidadFlujo;
    const cargaFlujo = resultadoFlujo.cargaFlujo;
    const tubSuccion = tuberiaSeleccionada(velFlujo, "succion");
    const tubDescarga = tuberiaSeleccionada(velFlujo, "descarga");
    
    const retornoDatos = retornos(flujoMax, "1.5");
let retornoHTML = "";
retornoDatos.forEach(dato => {
  retornoHTML += `<li>Tramo ${dato.tramo}: ${dato.flujo} gpm, ${dato.tuberia}, ${dato.velocidad} ft/s, carga: ${dato.carga} ft</li>`;
});

    
    
    let velFlujoTexto = "";
    for (let tub in velFlujo) {
        velFlujoTexto += `<li><strong>${tub}:</strong> ${velFlujo[tub].toFixed(2)} ft/s, carga: ${cargaFlujo[tub].toFixed(2)} ft hd</li>`;
        }

    const nuevaVentana = window.open("", "_blank", "width=400,height=300");

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
        </style>
      </head>
      <body>
        <h2>Estos son los valores calculados:</h2>
        <ul>
          <li><strong>Volumen:</strong> ${vol}</li>
          <li><strong>Flujo volumen:</strong> ${flujoVol}</li>
          <li><strong>Flujo infinity:</strong> ${flujoInf}</li>
          <li><strong>Tubería seleccionada succión:</strong> ${tubSuccion}</li>
          <li><strong>Tubería seleccionada descarga:</strong> ${tubDescarga}</li>
            <li><strong>Velocidad flujo:</strong></li>
            <ul>
            ${velFlujoTexto}
            </ul>
<li><strong>Retornos:</strong></li>
<ul>${retornoHTML}</ul>

        </ul>
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
    let area = document.getElementById('area').value;
    let profProm = document.getElementById('profProm').value;
    let vol = parseFloat((area * profProm).toFixed(1));
 //   document.getElementById('volumen').innerText = 'Volumen: ' + vol + ' m3';
    return vol;
}

function flujoVolumen() {
    let vol = volumen();
    let rotacion1 = document.getElementById('rotacion').value;
    let flujoVolumen = parseFloat((vol * 1000 / 60 / rotacion1).toFixed(1));
    let flujoVolumen2 = parseFloat((flujoVolumen / 3.7854).toFixed(1));    
  //  document.getElementById('flujoVolumen2').innerText = 'Flujo filtrado: ' + flujoVolumen2 + ' gpm';
    return flujoVolumen2;
}

function flujoInfinity(){
    let muroInfinity = document.getElementById('largoInfinity').value;
    let alturaCortina = document.getElementById('alturaDesborde').value;
    let flujoInfinity = parseFloat((36*(muroInfinity/.3048)*((alturaCortina/25.4)**1.5)).toFixed(1));
 //   document.getElementById('flujoInfinity').innerText = 'Flujo infinity: ' + flujoInfinity + ' gpm';
    return flujoInfinity;
}

function flujoMaximo(flujoVolumen2, flujoInfinity/*, /*flujoBombaCalor, flujoPanel, flujoCaldera, flujoGenerador*/){
    let flujoMaximo = Math.max(flujoVolumen2, flujoInfinity/*, flujoBombaCalor, flujoPanel, flujoCaldera, flujoGenerador*/);

    return flujoMaximo;
}

function velocidadCargaFlujo(flujoMaximo){
    const diametroTuberia = {
        "tuberia 0.75" : 0.81,
        "tuberia 1.00" : 1.03,
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

function retornos(flujoMaximo, tipoRetorno = "1.5") {
    const area = parseFloat(document.getElementById('area').value);
    const diametros = {
        "tuberia 0.75": 0.81,
        "tuberia 1.00": 1.03,
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

    const flujoPorRetorno = tipoRetorno === "2.0" ? 40 : 26;
    const numRetornos = Math.ceil(flujoMaximo / flujoPorRetorno);

    const longitudTotal = Math.sqrt(area) * 4;
    const longitudEntreRetornos = longitudTotal / numRetornos;

    const resultado = [];

    let flujoRestante = flujoMaximo;

    for (let i = 0; i < numRetornos; i++) {
        // Elegir diámetro que dé velocidad ≤ 6.5 ft/s
        let diametroSeleccionado = null;
        let velocidadSeleccionada = Infinity;
        let cargaSeleccionada = null;

        for (let tub in diametros) {
            const d = diametros[tub];
            const velocidad = flujoRestante * 0.408498 / (d * d);
            if (velocidad <= 6.5 && velocidad < velocidadSeleccionada) {
                velocidadSeleccionada = velocidad;
                diametroSeleccionado = tub;
                // Haz el cálculo de carga aquí para ese flujo y diámetro
                const carga = 10.536 * longitudEntreRetornos * Math.pow(flujoRestante, 1.852) /
                    (Math.pow(d, 4.8655) * Math.pow(150, 1.852));
                cargaSeleccionada = carga;
            }
        }

        resultado.push({
            tramo: i + 1,
            flujo: flujoRestante.toFixed(2),
            tuberia: diametroSeleccionado || "Ninguna cumple",
            velocidad: velocidadSeleccionada.toFixed(2),
            carga: cargaSeleccionada ? cargaSeleccionada.toFixed(2) : "N/A"
        });

        flujoRestante -= flujoPorRetorno;
        if (flujoRestante < 0) flujoRestante = 0;
    }

    return resultado;
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

