document.addEventListener('DOMContentLoaded', function() { 

    const funcionInput = document.getElementById('funcion');
    const limiteSupInput = document.getElementById('limite-sup');
    const limiteInfInput = document.getElementById('limite-inf');
    const calcularBtn = document.getElementById('calcular-sucesion');
    const resultado = document.getElementById('resultado-sucesion');

    calcularBtn.addEventListener('click', function() {
        const funcion = funcionInput.value;
        const limiteSup = parseInt(limiteSupInput.value);
        const limiteInf = parseInt(limiteInfInput.value);
        if (isNaN(limiteSup) || isNaN(limiteInf)) {
            alert('Por favor, ingresa límites válidos.');
            return;
        }
        fetch('/calcular_sucesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'            
            },
            body: JSON.stringify({
                funcion: funcion,
                limite_sup: limiteSup,
                limite_inf: limiteInf
            })      
        })
        .then(response => response.json())
        .then(data => {
            resultado.innerHTML = ''; // Limpiar resultados anteriores
            resultado.innerHTML = data.resultados
                .map((valor, index) => `<p>n=${limiteInf + index}: ${valor}</p>`)
                .join('');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al calcular la sucesión. Verifica la función y los límites ingresados.');
        });
    });
});