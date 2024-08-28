function volumen() {
    let area1 = document.getElementById('area').value;
    let profProm = document.getElementById('profProm').value;
    let vol = parseFloat((area1 * profProm).toFixed(1));
    document.getElementById('volumen').innerText = 'Volumen: ' + vol + ' m3';
    return {vol, area1};
}

function flujoVolumen() {
    let {vol} = volumen();
    let rotacion1 = document.getElementById('rotacion').value;
    let flujoVolumen = parseFloat((vol * 1000 / 60 / rotacion1).toFixed(1));
    let flujoVolumen2 = parseFloat((flujoVolumen / 3.7854).toFixed(1));    
    document.getElementById('flujoVolumen').innerText = 'Flujo Volumen: ' + flujoVolumen + ' lpm';
    document.getElementById('flujoVolumen2').innerText = 'Flujo Volumen: ' + flujoVolumen2 + ' gpm';
    return flujoVolumen2;
}

function procesarFormulario() {
    let opcionSiNo = document.getElementById('opcionSiNo').value;
    let calentamiento = document.getElementById('calentamiento').value;

    document.getElementById('resultadoOpcionSiNo').innerText = 'Selección desborde: ' + opcionSiNo;
    document.getElementById('resultadoCalentamiento').innerText = 'Selección calentamiento: ' + calentamiento;
}

function ubicacion1(){
    let ubicacion1 = document.getElementById('ubicacion').value;
    document.getElementById('ubicacion1').innerText = 'Ubicación: ' + ubicacion1;

}

function masaEvaporada(){
    let {area1} = volumen();
    
}

function perdidaEvaporacion(){

}

function perdidaTuberia(){

}

function perdidaRadiacion(){

}

function perdidaConveccion(){

}

function perdidaTransmision(){

}

function perdidaInfinity(){

}

function tablasCalor(){

}


function velocidadFlujo() {
    const velocidadSuccion = 5.95;
    const velocidadDescarga = 7.95;
}

function diametroTuberia() {

}



function retorno() {
    let flujoVolumen2 = flujoVolumen();
    let {area1} = volumen();
    const flujoRetorno1 = 20;
    const flujoRetorno2 = 40;
    let numeroRetornos1 = parseFloat((flujoVolumen2 / flujoRetorno1).toFixed(0));
    let numeroRetornos2 = parseFloat((flujoVolumen2 / flujoRetorno2).toFixed(0));
    let tuberiaRetorno1 = parseFloat(((Math.sqrt(area1))*4).toFixed(1));
    document.getElementById('tuberiaRetorno1').innerText = 'Tuberia retornos: ' + tuberiaRetorno1 + ' m';
    document.getElementById('numeroRetornos1').innerText = 'Numero de retornos 1.5in: ' + numeroRetornos1 + ' piezas';
    document.getElementById('numeroRetornos2').innerText = 'Numero de retornos 2.0in: ' + numeroRetornos2 + ' piezas';


}