// ===== GENERAR ID ÚNICO POR DISPOSITIVO =====

// Función para generar un ID único para este dispositivo
function generarIdDispositivo() {
    let deviceId = localStorage.getItem("device_id");
    
    if (!deviceId) {
        // Generar ID único usando timestamp + random + userAgent
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const userAgent = navigator.userAgent.substring(0, 50);
        
        deviceId = btoa(`${timestamp}-${random}-${userAgent}`).substring(0, 50);
        localStorage.setItem("device_id", deviceId);
    }
    
    return deviceId;
}

// Obtener el ID del dispositivo actual
const deviceId = generarIdDispositivo();