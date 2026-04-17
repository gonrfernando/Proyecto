document.addEventListener('DOMContentLoaded', function() { 
    // ---------------------------- Manejeo de archivos ------------------------------
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
            lineas[i] = lineas[i].replace(/\r$/, ''); // Quita un posible /r que aparece después de cada línea en Windows en ciertos archivos txt
            if(lineas[i] === '') {
                continue; // Si la línea está vacía, la ignoramos
            }   
            switch(conjunto) { //Dependiendo del conjunto elegido, se coloca su contenido en el recuadro correspondiente y se almacena su contenido en su conjunto set
                case "U":
                    conjuntoUtext.value = "";
                    conjuntoUset.add(lineas[i]);
                    conjuntoUtext.value = Array.from(conjuntoUset).join(', ');
                    break;
                case "A":
                    conjuntoAtext.value = "";
                    conjuntoAset.add(lineas[i]);
                    conjuntoAtext.value = Array.from(conjuntoAset).join(', ');
                    break;
                case "B":
                    conjuntoBtext.value = "";
                    conjuntoBset.add(lineas[i]);
                    conjuntoBtext.value = Array.from(conjuntoBset).join(', ');
                    break;
                case "C":
                    conjuntoCtext.value = "";
                    conjuntoCset.add(lineas[i]);
                    conjuntoCtext.value = Array.from(conjuntoCset).join(', ');
                    break;
            }

        }
    }

    // Funciones que detectan cuando se carga un archivo en alguno de los inputs destinados
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
        operacionSeleccionadaText.value += conjunto + ' ';
    }

    function actualizarOperacion(operacion) {
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
        var segundoParentesis = false;
        if(operacionSeleccionadaText.value === '') {
            alert('Por favor, selecciona al meons dos conjuntos y una operación antes de realizarla.');
        } else {
            conjuntoSeleccionado1 = null;
            conjuntoSeleccionado2 = null;
            conjuntoSeleccionado3 = null;
            operacionSeleccionada = null;
            operacionSeleccionada2 = null;
            for (var i = 0; i < operacionSeleccionadaText.value.length; i++) {
                if(operacionSeleccionadaText.value[i] === ' ') {
                    continue;
                }
                if(operacionSeleccionadaText.value[i] === '(') {
                    if(conjuntoSeleccionado1 === null) {
                    continue; // Si encontramos un paréntesis de apertura y aún no hemos seleccionado ningún conjunto, lo ignoramos
                    } else if(operacionSeleccionada === null) {
                        continue; // Si encontramos un paréntesis de apertura y aún no hemos seleccionado ninguna operación, lo ignoramos
                    } else if(conjuntoSeleccionado2 === null) {
                        segundoParentesis = true;
                    }
                }else if(conjuntoSeleccionado1 === null && (operacionSeleccionadaText.value[i] === 'U' || operacionSeleccionadaText.value[i] === 'A' || operacionSeleccionadaText.value[i] === 'B' || operacionSeleccionadaText.value[i] === 'C')) {
                    conjuntoSeleccionado1 = operacionSeleccionadaText.value[i];
                } else if(operacionSeleccionada === null && (operacionSeleccionadaText.value[i] === 'U' || operacionSeleccionadaText.value[i] === '∩' || operacionSeleccionadaText.value[i] === '-' || operacionSeleccionadaText.value[i] === '△')) {
                    switch(operacionSeleccionadaText.value[i]) {
                        case 'U':
                            operacionSeleccionada = 'union';
                            break;
                        case '∩':
                            operacionSeleccionada = 'interseccion';
                            break;
                        case '-':
                            operacionSeleccionada = 'diferencia';
                            break;
                        case '△':
                            operacionSeleccionada = 'simetrica';
                            break;
                    }
                }else if(conjuntoSeleccionado2 === null && (operacionSeleccionadaText.value[i] === 'U' || operacionSeleccionadaText.value[i] === 'A' || operacionSeleccionadaText.value[i] === 'B' || operacionSeleccionadaText.value[i] === 'C')) {
                    conjuntoSeleccionado2 = operacionSeleccionadaText.value[i];
                } else if(operacionSeleccionada2 === null && (operacionSeleccionadaText.value[i] === 'U' || operacionSeleccionadaText.value[i] === '∩' || operacionSeleccionadaText.value[i] === '-' || operacionSeleccionadaText.value[i] === '△')) {
                    switch(operacionSeleccionadaText.value[i]) {
                        case 'U':
                            operacionSeleccionada2 = 'union';
                            break;
                        case '∩':
                            operacionSeleccionada2 = 'interseccion';
                            break;
                        case '-':
                            operacionSeleccionada2 = 'diferencia';
                            break;
                        case '△':
                            operacionSeleccionada2 = 'simetrica';
                            break;
                    }
                }else if(conjuntoSeleccionado3 === null && (operacionSeleccionadaText.value[i] === 'U' || operacionSeleccionadaText.value[i] === 'A' || operacionSeleccionadaText.value[i] === 'B' || operacionSeleccionadaText.value[i] === 'C')) {
                    conjuntoSeleccionado3 = operacionSeleccionadaText.value[i];
                }
            }
            if(segundoParentesis) {
                if(conjuntoSeleccionado3){
                    var aux = conjuntoSeleccionado1
                    conjuntoSeleccionado1 = conjuntoSeleccionado2;
                    conjuntoSeleccionado2 = conjuntoSeleccionado3;
                    conjuntoSeleccionado3 = aux;
                    aux = operacionSeleccionada;
                    operacionSeleccionada = operacionSeleccionada2;
                    operacionSeleccionada2 = aux;
                }
            }
            console.log(conjuntoSeleccionado1, operacionSeleccionada, conjuntoSeleccionado2, operacionSeleccionada2, conjuntoSeleccionado3);
            if(conjuntoSeleccionado2 === null || operacionSeleccionada === null) {
                alert('Por favor, selecciona al meons dos conjuntos y una operación antes de realizarla.');
                return;
            }
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