// cookies.js
(function() {
    // Si ya aceptó las cookies, no mostrar nada
    if (localStorage.getItem('cookies_aceptadas') === 'true') {
        return;
    }

    // Función para eliminar el popup
    function cerrarPopup() {
        var popup = document.getElementById('cookiesPopup');
        if (popup) popup.remove();
    }

    // Función: Solo necesarias
    function soloNecesarias() {
        localStorage.setItem('cookies_aceptadas', 'true');
        localStorage.setItem('cookies_analiticas', 'false');
        localStorage.setItem('cookies_marketing', 'false');
        cerrarPopup();
    }

    // Función: Aceptar todas
    function aceptarTodas() {
        localStorage.setItem('cookies_aceptadas', 'true');
        localStorage.setItem('cookies_analiticas', 'true');
        localStorage.setItem('cookies_marketing', 'true');
        cerrarPopup();
    }

    // Función: Configurar
    function configurarCookies() {
        alert('Configuración de cookies - Personaliza tus preferencias aquí');
    }

    // Crear el popup
    var popup = document.createElement('div');
    popup.id = 'cookiesPopup';
    popup.className = 'cookie-popup';
    popup.innerHTML = `
        <div class="cookie-box">
            <h3>Uso de cookies</h3>
            <p>Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenidos. Puedes aceptar todas las cookies o configurar tus preferencias.</p>
            <div class="cookie-buttons">
                <button class="solo-necesarias">Solo necesarias</button>
                <span class="cookie-separator">|</span>
                <button class="aceptar-todas">Aceptar todas</button>
                <span class="cookie-separator">|</span>
                <button class="configurar">Configurar</button>
            </div>
        </div>
    `;

    // Añadir eventos
    popup.querySelector('.solo-necesarias').addEventListener('click', soloNecesarias);
    popup.querySelector('.aceptar-todas').addEventListener('click', aceptarTodas);
    popup.querySelector('.configurar').addEventListener('click', configurarCookies);

    // Añadir al body
    document.body.appendChild(popup);
})();