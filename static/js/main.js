document.addEventListener('DOMContentLoaded', function() { //Esperamos a que la pagina cargue para ejecutar el js

    const hypothesisInput = document.getElementById('hypothesis'); //obtenemos el cuadro de entrada de texto de la hipotesis
    const addHypothesisButton = document.getElementById('boton-agregar-hypothesis'); //obtenemos el boton de agregar hipotesis

    addHypothesisButton.addEventListener('click', function() { //Esto se ejecuta cuando se hace click en el boton de agregar hipotesis
        const text = hypothesisInput.value.trim(); //en text guardamos la hipotesis que el usuario recien escribio
        if (text === '') { //Si no escribio nada
            alert('Por favor, ingresa una hipótesis.'); 
            return;
        }

        for (let i = 1; i <= 10; i++) { //Recorremos los 10 cuadritos de hipotesis para encontrar el primero vacio
            const hInput = document.getElementById('h' + i);
            if (hInput && hInput.value === '') {
                hInput.value = text; //Ponemos la hipotesis que el usuario escribio en el primer cuadrito vacio
                hypothesisInput.value = ''; 
                return;
            }
        }

        alert('Todas las hipótesis están llenas.'); //Si todas estaban llenas
    });


    const conclusionInput = document.getElementById('conclusion'); //obtenemos el cuadro de entrada de texto de la conclusion
    const addConclusionButton = document.getElementById('boton-agregar-conclusion'); //obtenemos el boton de agregar conclusion

    addConclusionButton.addEventListener('click', function() { //Esto se ejecuta cuando se hace click en el boton de agregar conclusion
        const text = conclusionInput.value.trim(); //en text guardamos la conclusion que el usuario recien escribio
        if (text === '') { //Si no escribio nada
            alert('Por favor, ingresa una conclusión.');
            return;
        }

        const qInput = document.getElementById('Q');
        if (qInput && qInput.value === '') { //Si el cuadrito de conclusion esta vacio, ponemos la conclusion que el usuario escribio
            qInput.value = text;
            conclusionInput.value = ''; 
        } else {
            alert('La conclusión ya está establecida.');
        }
    });

    // Enviar hipotesis y conclusion
    //Obtenemos los botones de cada metodo
    const renglonCriticoButton = document.getElementById('renglon-critico');
    const metodoTautologiaButton = document.getElementById('metodo-tautologia');

    renglonCriticoButton.addEventListener('click', function() { //Si hacen click en el boton de renglon critico, qe se haga el metodo de renglon critico
        sendData('/renglon-critico');
    });

    metodoTautologiaButton.addEventListener('click', function() { //Si hacen click en el boton de metodo tautologia, que se haga el metodo de tautologia
        sendData('/metodo-tautologia');
    });

    function sendData(link) { //Funcion que manda todas las hipotesis y cocnlusion al link que e le pase
        const hypotheses = [];
        for (let i = 1; i <= 10; i++) { //Iteramos por los 10 cuadros de hipotesis y guardamos el contenido de c/u
            const val = document.getElementById('h' + i).value.trim();
            if (val) hypotheses.push(val);
        }
        const conclusion = document.getElementById('Q').value.trim(); //Guardamos la conclusion

        if (hypotheses.length === 0 || !conclusion) { //Manejo de errores (campos vacios)
            alert('Debes tener al menos una hipótesis y una conclusión.');
            return;
        }

        fetch(link, { //Mandamos las hipot y concl a la ruta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ hypotheses, conclusion }) //convirte el objeto a JSON
        })
        .then(response => { //si llegamos aqui es porque se hizo la tabla de verdad bien y ya está guardada en session
            if (response.ok) {
                window.location.href = "/resultado"; //vamos a la ruta de mostrar la tabla
            }
        });
    }
});
