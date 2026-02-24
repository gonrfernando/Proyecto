document.addEventListener('DOMContentLoaded', function() {
    const hypothesisInput = document.getElementById('hypothesis');
    const addHypothesisButton = document.querySelector('button.btn-highlight'); 

    addHypothesisButton.addEventListener('click', function() {
        const value = hypothesisInput.value.trim();
        if (value === '') {
            alert('Por favor, ingresa una hipótesis.');
            return;
        }

        for (let i = 1; i <= 10; i++) {
            const hInput = document.getElementById('h' + i);
            if (hInput && hInput.value === '') {
                hInput.value = value;
                hypothesisInput.value = ''; 
                return;
            }
        }

        alert('Todas las hipótesis están llenas.');
    });


    const conclusionInput = document.getElementById('conclusion');
    const addConclusionButton = document.querySelector('#conclusion + button'); 
    addConclusionButton.addEventListener('click', function() {
        const value = conclusionInput.value.trim();
        if (value === '') {
            alert('Por favor, ingresa una conclusión.');
            return;
        }

        const qInput = document.getElementById('Q');
        if (qInput && qInput.value === '') {
            qInput.value = value;
            conclusionInput.value = ''; 
        } else {
            alert('La conclusión ya está establecida.');
        }
    });

    // Enviar hipotesis y conclusion
    const renglonCriticoButton = document.getElementById('renglon-critico');
    const metodoTautologiaButton = document.getElementById('metodo-tautologia');

    renglonCriticoButton.addEventListener('click', function() {
        sendData('/renglon-critico');
    });

    metodoTautologiaButton.addEventListener('click', function() {
        sendData('/metodo-tautologia');
    });

    function sendData(endpoint) {
        const hypotheses = [];
        for (let i = 1; i <= 10; i++) {
            const val = document.getElementById('h' + i).value.trim();
            if (val) hypotheses.push(val);
        }
        const conclusion = document.getElementById('Q').value.trim();

        if (hypotheses.length === 0 || !conclusion) {
            alert('Debes tener al menos una hipótesis y una conclusión.');
            return;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hypotheses, conclusion })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud');
            }
        })
        .then(data => {
            alert('Datos enviados correctamente.');
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    }
});
