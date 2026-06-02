// ===== SISTEMA DE CONTROL DE USOS DEL QR =====

// Generar ID único por dispositivo
function generarIdDispositivo() {
    let deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const userAgent = navigator.userAgent.substring(0, 50);
        deviceId = btoa(`${timestamp}-${random}-${userAgent}`).substring(0, 50);
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

const deviceId = generarIdDispositivo();

function getUsosQR() {
    const usos = localStorage.getItem("qr_usos");
    return usos ? JSON.parse(usos) : {};
}

function guardarUsosQR(usos) {
    localStorage.setItem("qr_usos", JSON.stringify(usos));
}

function verificarUsoQR(promocionId, deviceId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;
    if (!usos[key]) return false;
    return usos[key].includes(deviceId);
}

// ===== LÓGICA PARA LA PÁGINA DE DETALLE =====

// Cargar la promoción seleccionada
function cargarDetalle() {
    const id = localStorage.getItem("promocionSeleccionada");
    if (!id) {
        window.location.href = "index.html";
        return;
    }

    // Cargar promociones desde localStorage
    const promociones = JSON.parse(localStorage.getItem("promociones")) || [];
    const promo = promociones.find(p => p.id == id);

    if (!promo) {
        document.getElementById("detalle-content").innerHTML = `
            <div class="detalle-container">
                <div style="text-align: center; padding: 50px;">
                    <h2>❌ Oferta no encontrada</h2>
                    <a href="index.html" class="btn-volver">← Volver al inicio</a>
                </div>
            </div>
        `;
        return;
    }

    // Verificar si este dispositivo ya usó esta promoción
    const yaUsado = verificarUsoQR(promo.id, deviceId);

    // Generar QR
    const qr = qrcode(0, 'M');
    qr.addData(promo.codigo);
    qr.make();
    const qrDataURL = qr.createDataURL(6);

    // Guardar para usar en descarga
    window.qrDataURL = qrDataURL;
    window.codigoPromo = promo.codigo;

    // Mostrar el detalle (CON IMAGEN Y BOTONES DE COMPARTIR)
    document.getElementById("detalle-content").innerHTML = `
        <div class="detalle-container">
            <div class="detalle-header">
                ${promo.imagen ? `<img src="${promo.imagen}" alt="${escapeHTML(promo.titulo)}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">` : ''}
                <h1>${escapeHTML(promo.titulo)}</h1>
                <div class="establecimiento">${escapeHTML(promo.establecimiento)}</div>
            </div>
            <div class="detalle-body">
                <div style="text-align: center;">
                    <div class="detalle-descuento">-${escapeHTML(promo.descuento)}</div>
                </div>
                
                <div class="detalle-descripcion">
                    ${escapeHTML(promo.descripcion)}
                </div>
                
                <div class="detalle-info">
                    <p><strong>🏷️ Categoría:</strong> ${escapeHTML(promo.categoria)}</p>
                    <p><strong>📅 Fecha de validez:</strong> ${escapeHTML(promo.fechaValidez)}</p>
                    <p><strong>📍 Establecimiento:</strong> ${escapeHTML(promo.establecimiento)}</p>
                    ${promo.direccion ? `<p><strong>📌 Dirección:</strong> ${escapeHTML(promo.direccion)}</p>` : ''}
                </div>
                
                <div class="codigo-grande">
                    <span>${escapeHTML(promo.codigo)}</span>
                    <button class="btn-copiar" onclick="copiarCodigo('${escapeHTML(promo.codigo)}')">📋 Copiar código</button>
                </div>
                
                <div class="qr-section">
    <h3>📱 Canjear promoción</h3>
    ${yaUsado ? `
        <div class="aviso-usado">
            ⚠️ <strong>Esta promoción ya ha sido utilizada</strong>
            <p>Solo se puede usar una vez por dispositivo.</p>
        </div>
    ` : `
        <div class="qr-container">
            <p>Haz clic en el botón para generar tu QR y canjear la promoción</p>
            <button class="btn-usar-promocion" onclick="usarPromocion(${promo.id})">
                🎫 Usar esta promoción
            </button>
        </div>
    `}
</div>
                
                <!-- ===== BOTONES DE COMPARTIR ===== -->
                <div class="share-section">
                    <h3>📢 Comparte esta oferta</h3>
                    <div class="share-buttons">
                        <button class="share-btn share-whatsapp" onclick="compartirWhatsAppDetalle('${escapeHTML(promo.titulo)}')">💬 WhatsApp</button>
                        <button class="share-btn share-facebook" onclick="compartirFacebookDetalle()">📘 Facebook</button>
                        <button class="share-btn share-twitter" onclick="compartirTwitterDetalle('${escapeHTML(promo.titulo)}')">🐦 Twitter</button>
                        <button class="share-btn share-telegram" onclick="compartirTelegramDetalle('${escapeHTML(promo.titulo)}')">📡 Telegram</button>
                        <button class="share-btn share-copy" onclick="copiarEnlaceDetalle()">🔗 Copiar enlace</button>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="index.html" class="btn-volver">← Volver a todas las ofertas</a>
                </div>
            </div>
        </div>
    `;
}

// ===== FUNCIÓN PARA CANJEAR QR =====
function canjearQR(promocionId) {
    if (verificarUsoQR(promocionId, deviceId)) {
        mostrarMensaje("❌ Esta promoción ya ha sido canjeada en este dispositivo");
        return;
    }

    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;

    if (!usos[key]) {
        usos[key] = [];
    }

    usos[key].push(deviceId);
    guardarUsosQR(usos);

    mostrarMensaje("✅ ¡Descuento canjeado con éxito! Presenta este mensaje en el establecimiento.");

    setTimeout(() => {
        location.reload();
    }, 1500);
}

// ===== FUNCIONES PARA COMPARTIR =====

function getCurrentPromocionUrl() {
    return window.location.href;
}

function compartirWhatsAppDetalle(titulo) {
    const url = getCurrentPromocionUrl();
    const texto = `¡Mira esta oferta! ${titulo} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}

function compartirFacebookDetalle() {
    const url = getCurrentPromocionUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function compartirTwitterDetalle(titulo) {
    const url = getCurrentPromocionUrl();
    const texto = `¡Mira esta oferta! ${titulo}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function compartirTelegramDetalle(titulo) {
    const url = getCurrentPromocionUrl();
    const texto = `¡Mira esta oferta! ${titulo} - ${url}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`, '_blank');
}

function copiarEnlaceDetalle() {
    const url = getCurrentPromocionUrl();
    navigator.clipboard.writeText(url).then(() => {
        mostrarMensaje("✅ Enlace copiado al portapapeles");
    }).catch(() => {
        mostrarMensaje("❌ No se pudo copiar el enlace");
    });
}

// ===== FUNCIONES EXISTENTES =====

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarMensaje("✅ Código copiado: " + codigo);
    }).catch(() => {
        mostrarMensaje("❌ No se pudo copiar el código");
    });
}

function descargarQR() {
    const enlace = document.createElement('a');
    enlace.href = window.qrDataURL;
    enlace.download = `qr_${window.codigoPromo}.png`;
    enlace.click();
    mostrarMensaje("✅ QR descargado correctamente");
}

function mostrarMensaje(mensaje) {
    const toast = document.createElement("div");
    toast.className = "cookie-toast";
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("mostrar");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("mostrar");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
// ===== FUNCIÓN PARA USAR PROMOCIÓN (MUESTRA QR Y DESCARGA) =====
function usarPromocion(promocionId) {
    // Verificar si ya se usó
    if (verificarUsoQR(promocionId, deviceId)) {
        mostrarMensaje("❌ Esta promoción ya ha sido canjeada en este dispositivo");
        return;
    }
    
    // Obtener la promoción actual
    const promociones = JSON.parse(localStorage.getItem("promociones")) || [];
    const promo = promociones.find(p => p.id == promocionId);
    
    if (!promo) {
        mostrarMensaje("❌ Promoción no encontrada");
        return;
    }
    
    // Generar QR
    const qr = qrcode(0, 'M');
    qr.addData(promo.codigo);
    qr.make();
    const qrDataURL = qr.createDataURL(8);
    
    // Descargar automáticamente el QR
    const enlace = document.createElement('a');
    enlace.href = qrDataURL;
    enlace.download = `qr_${promo.codigo}.png`;
    enlace.click();
    
    // Mostrar el QR en un modal grande
    mostrarModalQR(qrDataURL, promo);
    
    // Registrar el uso
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;
    
    if (!usos[key]) {
        usos[key] = [];
    }
    
    usos[key].push(deviceId);
    guardarUsosQR(usos);
    
    mostrarMensaje("✅ QR descargado. Presenta este QR en el establecimiento.");
    
    // Recargar después de 2 segundos para actualizar el estado
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// Función para mostrar QR en modal
function mostrarModalQR(qrDataURL, promo) {
    // Eliminar modal existente si hay
    const modalExistente = document.getElementById("modal-qr-usar");
    if (modalExistente) modalExistente.remove();
    
    const modal = document.createElement("div");
    modal.id = "modal-qr-usar";
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 20px; text-align: center; max-width: 90%;">
            <h3 style="margin-bottom: 15px;">🎫 ${escapeHTML(promo.titulo)}</h3>
            <img src="${qrDataURL}" style="max-width: 250px; margin: 10px auto;">
            <p style="margin-top: 15px; color: #666;">Muestra este QR en el establecimiento</p>
            <p style="font-size: 12px; color: #999;">Código: ${escapeHTML(promo.codigo)}</p>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 15px; padding: 8px 20px; background: #6366f1; color: white; border: none; border-radius: 50px; cursor: pointer;">Cerrar</button>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// Cargar cuando la página esté lista
document.addEventListener("DOMContentLoaded", cargarDetalle);