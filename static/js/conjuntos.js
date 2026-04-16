document.addEventListener('DOMContentLoaded', function() { 
    const conjuntoU = document.getElementById('conjuntoU'); 
    const conjuntoA = document.getElementById('conjuntoA'); 
    const conjuntoB = document.getElementById('conjuntoB'); 
    const conjuntoC = document.getElementById('conjuntoC'); 
    const conjuntoUtext = document.getElementById('conjuntoU-text');
    const conjuntoAtext = document.getElementById('conjuntoA-text');
    const conjuntoBtext = document.getElementById('conjuntoB-text');
    const conjuntoCtext = document.getElementById('conjuntoC-text');
    var conjuntoUset = new Set();
    var conjuntoAset = new Set();
    var conjuntoBset = new Set();
    var conjuntoCset = new Set();
    var conjunto1Set = new Set();
    var conjunto2Set = new Set();
    var conjunto3Set = new Set();
    var resultadoSet = new Set();

    var reader = new FileReader();
    function onload(event, conjunto) {
        const text = event.target.result;
        var lineas = text.split('\n');
        for (var i = 0; i < lineas.length; i++) {
            switch(conjunto) {
                case "U":
                    conjuntoUset.add(lineas[i]);
                    conjuntoUtext.value = Array.from(conjuntoUset).join(', ');
                    break;
                case "A":
                    conjuntoAset.add(lineas[i]);
                    conjuntoAtext.value = Array.from(conjuntoAset).join(', ');
                    break;
                case "B":
                    conjuntoBset.add(lineas[i]);
                    conjuntoBtext.value = Array.from(conjuntoBset).join(', ');
                    break;
                case "C":
                    conjuntoCset.add(lineas[i]);
                    conjuntoCtext.value = Array.from(conjuntoCset).join(', ');
                    break;
            }

        }
    }

    conjuntoU.addEventListener('change', function() {
        reader.readAsText(conjuntoU.files[0]);
        reader.onload = function(event) { onload(event, "U"); };
    });

    conjuntoA.addEventListener('change', function() {
        reader.readAsText(conjuntoA.files[0]);
        reader.onload = function(event) { onload(event, "A"); };
    });

    conjuntoB.addEventListener('change', function() {
        reader.readAsText(conjuntoB.files[0]);
        reader.onload = function(event) { onload(event, "B"); };
    });

    conjuntoC.addEventListener('change', function() {
        reader.readAsText(conjuntoC.files[0]);
        reader.onload = function(event) { onload(event, "C"); };
    }); 


    // ---------------------------- Manejeo de botones y operaciones ------------------------------


    const botonU = document.getElementById('U');
    const botonA = document.getElementById('A');
    const botonB = document.getElementById('B');
    const botonC = document.getElementById('C');
    const botonUnion = document.getElementById('operacion-union');
    const botonInterseccion = document.getElementById('operacion-interseccion');
    const botonDiferencia = document.getElementById('operacion-diferencia');
    const botonDiferenciaSimetrica = document.getElementById('operacion-simetrica');
    const operacionSeleccionadaText = document.getElementById('operacion-seleccionada');
    const resultadoConjuntos = document.getElementById('resultado-conjuntos-text');
    const botonRealizarOperacion = document.getElementById('boton-realizar-operacion');
    const botonBorrarOperacion = document.getElementById('borrar-operacion');

    var conjuntoSeleccionado1 = null;
    var conjuntoSeleccionado2 = null;
    var operacionSeleccionada = null;
    var conjuntoSeleccionado3 = null;
    var operacionSeleccionada2 = null;

    function actualizarSeleccion(conjunto) {
        // Check if this set is already selected
        if(conjuntoSeleccionado1 === conjunto) {
            alert('Este conjunto ya ha sido seleccionado. Elige otro.');
        } else if(conjuntoSeleccionado2 === conjunto) {
            alert('Este conjunto ya ha sido seleccionado. Elige otro.');
        } else if(conjuntoSeleccionado3 === conjunto) {
            alert('Este conjunto ya ha sido seleccionado. Elige otro.');
        } else if (conjuntoSeleccionado1 === null) {
            conjuntoSeleccionado1 = conjunto;
            operacionSeleccionadaText.value = conjunto + ' ';
        } else if (operacionSeleccionada === null) {
            alert('Por favor, selecciona una operación antes de elegir el segundo conjunto.');
        } else if (conjuntoSeleccionado2 === null) {
            conjuntoSeleccionado2 = conjunto;
            operacionSeleccionadaText.value += conjunto + ' ';
        } else if (operacionSeleccionada2 === null) {
            alert('Por favor, selecciona la segunda operación antes de elegir el tercer conjunto.');
        } else if (conjuntoSeleccionado3 === null) {
            conjuntoSeleccionado3 = conjunto;
            operacionSeleccionadaText.value += conjunto + ' ';
        } else {
            alert('Ya has seleccionado tres conjuntos. Por favor, realiza una operación o reinicia la selección.');
        }
    }

    function actualizarOperacion(operacion) {
        if (conjuntoSeleccionado1 === null) {
            alert('Por favor, selecciona un conjunto');
            return;
        } else if (operacionSeleccionada === null) {
            operacionSeleccionada = operacion;
            switch(operacion) {
                case 'union':
                    operacionSeleccionadaText.value += 'U ';
                    break;
                case 'interseccion':
                    operacionSeleccionadaText.value += '∩ ';
                    break;
                case 'diferencia':
                    operacionSeleccionadaText.value += '- ';
                    break;
                case 'simetrica':
                    operacionSeleccionadaText.value += '△ ';
                    break;
            }
        } else if (conjuntoSeleccionado2 === null) {
            alert('Por favor, selecciona el segundo conjunto antes de la segunda operación.');
            return;
        } else if (operacionSeleccionada2 === null) {
            operacionSeleccionada2 = operacion;
            switch(operacion) {
                case 'union':
                    operacionSeleccionadaText.value += 'U ';
                    break;
                case 'interseccion':
                    operacionSeleccionadaText.value += '∩ ';
                    break;
                case 'diferencia':
                    operacionSeleccionadaText.value += '- ';
                    break;
                case 'simetrica':
                    operacionSeleccionadaText.value += '△ ';
                    break;
            }
        } else {
            alert('Ya has seleccionado dos operaciones.');
        }
    }

    botonU.addEventListener('click', function() {
        actualizarSeleccion('U');
    });

    botonA.addEventListener('click', function() {
        actualizarSeleccion('A');
    });
    
    botonB.addEventListener('click', function() {
        actualizarSeleccion('B');
    });

    botonC.addEventListener('click', function() {
        actualizarSeleccion('C');
    });

    botonUnion.addEventListener('click', function() {
        actualizarOperacion('union');
    });

    botonInterseccion.addEventListener('click', function() {
        actualizarOperacion('interseccion');
    });

    botonDiferencia.addEventListener('click', function() {
        actualizarOperacion('diferencia');
    });

    botonDiferenciaSimetrica.addEventListener('click', function() {
        actualizarOperacion('simetrica');
    }); 

    botonBorrarOperacion.addEventListener('click', function() {
        conjuntoSeleccionado1 = null;
        conjuntoSeleccionado2 = null;
        conjuntoSeleccionado3 = null;
        operacionSeleccionada = null;
        operacionSeleccionada2 = null;
        operacionSeleccionadaText.value = '';
        resultadoConjuntos.value = '';
    });

    botonRealizarOperacion.addEventListener('click', function() {
        if (conjuntoSeleccionado1 === null || operacionSeleccionada === null || conjuntoSeleccionado2 === null) {
            alert('Por favor, selecciona al meons dos conjuntos y una operación antes de realizarla.');
            return;
        }
        
        if (conjuntoSeleccionado1 === 'U') {
            conjunto1Set = conjuntoUset;
        } else if (conjuntoSeleccionado1 === 'A') {
            conjunto1Set = conjuntoAset;
        } else if (conjuntoSeleccionado1 === 'B') {
            conjunto1Set = conjuntoBset;
        } else if (conjuntoSeleccionado1 === 'C') {
            conjunto1Set = conjuntoCset;
        }
        if (conjuntoSeleccionado2 === 'U') {
            conjunto2Set = conjuntoUset;
        } else if (conjuntoSeleccionado2 === 'A') {
            conjunto2Set = conjuntoAset;
        } else if (conjuntoSeleccionado2 === 'B') {
            conjunto2Set = conjuntoBset;
        } else if (conjuntoSeleccionado2 === 'C') {
            conjunto2Set = conjuntoCset;
        }
        if (conjuntoSeleccionado3 === 'U') {
            conjunto3Set = conjuntoUset;
        } else if (conjuntoSeleccionado3 === 'A') {
            conjunto3Set = conjuntoAset;
        } else if (conjuntoSeleccionado3 === 'B') {
            conjunto3Set = conjuntoBset;
        } else if (conjuntoSeleccionado3 === 'C') {
            conjunto3Set = conjuntoCset;
        }

        fetch("/realizar-operacion", { //Mandamos la operacion al python para que la ejecute y nos devuelva el resultado
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                conjunto1: Array.from(conjunto1Set),
                conjunto2: Array.from(conjunto2Set),
                operacion: operacionSeleccionada,
                conjunto3: Array.from(conjunto3Set),
                operacion2: operacionSeleccionada2
            })
        })
        .then(response => response.json())
        .then(data => {
            resultadoSet = new Set(data.resultado);
            resultadoConjuntos.value = Array.from(resultadoSet).join(', ');
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});