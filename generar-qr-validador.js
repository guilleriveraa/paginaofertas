// ===== PÁGINA DE CANJE DEL QR =====
// Archivo: canjear.html

function canjearPromocion() {
    // Obtener ID de la promoción de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const promocionId = urlParams.get('id');
    
    if (!promocionId) {
        document.getElementById("mensaje").innerHTML = "❌ Promoción no válida";
        return;
    }
    
    const deviceId = localStorage.getItem("device_id");
    const yaUsado = verificarUsoQR(promocionId, deviceId);
    
    if (yaUsado) {
        document.getElementById("mensaje").innerHTML = `
            <div class="error">
                ❌ Esta promoción ya ha sido canjeada por este dispositivo.
                <p>Solo se permite un uso por persona.</p>
            </div>
        `;
        return;
    }
    
    // Registrar el uso
    const registrado = registrarUsoQR(promocionId, deviceId);
    
    if (registrado) {
        document.getElementById("mensaje").innerHTML = `
            <div class="success">
                ✅ ¡Descuento aplicado correctamente!
                <p>Gracias por usar esta promoción. Presenta esta pantalla en el establecimiento.</p>
            </div>
        `;
    } else {
        document.getElementById("mensaje").innerHTML = `
            <div class="error">
                ❌ Error al aplicar el descuento. Intenta nuevamente.
            </div>
        `;
    }
}