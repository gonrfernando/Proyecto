document.addEventListener('DOMContentLoaded', function() { 

    //Declarar las variables para los elementos gráficos del input y el resultado
    const funcionInput = document.getElementById('funcion');
    const limiteSupInput = document.getElementById('limite-sup');
    const limiteInfInput = document.getElementById('limite-inf');
    const calcularBtn = document.getElementById('calcular-sucesion');
    const resultado = document.getElementById('resultado-sucesion');
    const valorN = document.getElementById('valor-n-sucesion');
    const equivalencias = document.getElementById('equivalencias-sucesion');

    calcularBtn.addEventListener('click', function() {
        //Leemos los valores de los inputs
        const funcion = funcionInput.value;
        const limiteSup = parseInt(limiteSupInput.value);
        const limiteInf = parseInt(limiteInfInput.value);
        //Checamos que los limites sean números válidos
        if (isNaN(limiteSup) || isNaN(limiteInf)) {
            alert('Por favor, ingresa límites válidos.');
            return;
        }
        //Enviamos los datos al backend para calcular la sucesión
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
            resultado.innerHTML = '<p>Resultados:</p>'; // Limpiar resultados anteriores
            valorN.innerHTML = '<p>Valores de n:</p>'; // Limpiar valores de n
            equivalencias.innerHTML = '<p>Equivalencias:</p>'; // Limpiar equivalencias
            // La lista de resultados se muestra en el div resultado, cada término con su n correspondiente
            for (let i = 0; i < data.resultados.length; i++) {
                const n = limiteInf + i;
                valorN.innerHTML += `<p>n=${n}</p>`;
                equivalencias.innerHTML += `<p>${data.equivalencias[i]}</p>`;
                resultado.innerHTML += `<p>${data.resultados[i]}</p>`;
            }
            // Mostrar la sumatoria y el producto en los inputs correspondientes
            document.getElementById('sumatoria-sucesion').value = data.sumatoria;
            document.getElementById('producto-sucesion').value = data.producto;
        })
        .catch(error => {
            console.error('Error:', error);  //En caso de que haya un error al calcular la sucesión
            alert('Ocurrió un error al calcular la sucesión. Verifica la función y los límites ingresados.');
        }); 
    });
});