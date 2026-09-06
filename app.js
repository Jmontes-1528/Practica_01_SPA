const botonActualizar = document.getElementById('btn-actualizar');
const estadoApi = document.getElementById('estado-api');
const tarjetas = document.querySelectorAll('.tarjeta-curso');

async function actualizarTasasCambio() {
    botonActualizar.disabled = true;
    botonActualizar.textContent = 'Consultando API...';
    estadoApi.textContent = 'Conectando con el servidor de divisas...';

    try {
        // Consultamos la API 
        const respuesta = await fetch('https://open.er-api.com/v6/latest/MXN');

        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const tasaUsd = datos.rates.USD;
        const tasaJpy = datos.rates.JPY;

        tarjetas.forEach(tarjeta => {
            const precioMxn = parseFloat(tarjeta.getAttribute('data-precio-mxn'));

            // Calculamos los nuevos importes
            const totalUsd = precioMxn * tasaUsd;
            const totalJpy = precioMxn * tasaJpy;

            const nodoUsd = tarjeta.querySelector('.precio-usd');
            const nodoJpy = tarjeta.querySelector('.precio-jpy');

            nodoUsd.textContent = `$${totalUsd.toFixed(2)} USD`;
            nodoJpy.textContent = `¥${Math.round(totalJpy).toLocaleString('ja-JP')} JPY`;
        });

        const fechaHora = new Date().toLocaleTimeString();
        estadoApi.textContent = `Precios actualizados vía API REST a las ${fechaHora}`;

    } catch (error) {
        console.error('Fallo la conexión con la API:', error);
        estadoApi.textContent = 'No se pudo conectar a la API. Intenta nuevamente.';
    } finally {
        botonActualizar.disabled = false;
        botonActualizar.textContent = 'Actualizar precios';
    }
}

botonActualizar.addEventListener('click', actualizarTasasCambio);
