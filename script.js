// ===== PALABRA SECRETA PARA ACCEDER AL ADMIN =====
const PALABRA_SECRETA = "admin123"; // 👈 CAMBIA ESTO POR LA PALABRA QUE QUIERAS

// ===== CARGAR PROMOCIONES DESDE localStorage =====
function cargarPromociones() {
    const guardadas = localStorage.getItem("promociones");
    if (guardadas) {
        return JSON.parse(guardadas);
    } else {
        const promocionesDefault = [
            {
                id: 1,
                titulo: "🍕 2x1 en Pizzas",
                categoria: "restaurante",
                descuento: "50%",
                codigo: "PIZZA2X1",
                descripcion: "Válido en todas las pizzas grandes. No acumulable con otras ofertas.",
                fechaValidez: "31/05/2026",
                establecimiento: "Pizza House"
            },
            {
                id: 2,
                titulo: "☕ Café + Pastelito por 3€",
                categoria: "restaurante",
                descuento: "30%",
                codigo: "CAFE30",
                descripcion: "Desayuno completo con café y pastelito a elegir.",
                fechaValidez: "15/06/2026",
                establecimiento: "Cafetería Central"
            },
            {
                id: 3,
                titulo: "🛍️ 20% en Ropa",
                categoria: "tienda",
                descuento: "20%",
                codigo: "ROPA20",
                descripcion: "Descuento en toda la colección de primavera.",
                fechaValidez: "30/06/2026",
                establecimiento: "Fashion Store"
            },
            {
                id: 4,
                titulo: "🎬 Entrada 2x1 Cine",
                categoria: "ocio",
                descuento: "50%",
                codigo: "CINE2X1",
                descripcion: "Válido de lunes a jueves (no festivos).",
                fechaValidez: "31/07/2026",
                establecimiento: "Cine City"
            },
            {
                id: 5,
                titulo: "💆 Masaje Relajante 30€",
                categoria: "salud",
                descuento: "25%",
                codigo: "MASAJE25",
                descripcion: "Masaje de 50 minutos. Incluye aromaterapia.",
                fechaValidez: "30/05/2026",
                establecimiento: "Spa Zen"
            },
            {
                id: 6,
                titulo: "🍔 Hamburguesa + Bebida 8€",
                categoria: "restaurante",
                descuento: "40%",
                codigo: "BURGER40",
                descripcion: "Hamburguesa premium + bebida + patatas.",
                fechaValidez: "20/06/2026",
                establecimiento: "Burger House"
            },
            {
                id: 7,
                titulo: "👟 30% en Zapatillas",
                categoria: "tienda",
                descuento: "30%",
                codigo: "ZAPAS30",
                descripcion: "Descuento en todas las zapatillas de running.",
                fechaValidez: "15/07/2026",
                establecimiento: "Sport Center"
            },
            {
                id: 8,
                titulo: "🎮 Hora Gratis en Gaming",
                categoria: "ocio",
                descuento: "100%",
                codigo: "GAMINGFREE",
                descripcion: "Primera hora gratis en zona gaming.",
                fechaValidez: "31/05/2026",
                establecimiento: "Arena Gaming"
            },
            {
                id: 9,
                titulo: "💅 Manicura + Pedicura 25€",
                categoria: "salud",
                descuento: "35%",
                codigo: "NAILS35",
                descripcion: "Incluye esmaltado semipermanente.",
                fechaValidez: "30/06/2026",
                establecimiento: "Belleza Express"
            },
            {
                id: 10,
                titulo: "📚 15% en Libros",
                categoria: "tienda",
                descuento: "15%",
                codigo: "LIBROS15",
                descripcion: "Descuento en toda la sección de narrativa.",
                fechaValidez: "31/08/2026",
                establecimiento: "Librería Central"
            }
        ];
        localStorage.setItem("promociones", JSON.stringify(promocionesDefault));
        return promocionesDefault;
    }
}

let promociones = cargarPromociones();
let filtroActual = "todos";
let textoBusqueda = "";

// ===== VERIFICAR PALABRA SECRETA EN EL BUSCADOR =====
function verificarPalabraSecreta(texto) {
    if (texto.toLowerCase() === PALABRA_SECRETA.toLowerCase()) {
        // Guardar en sessionStorage que el acceso está permitido
        sessionStorage.setItem("accesoAdmin", "true");
        mostrarToast("🔐 Acceso concedido. Redirigiendo al panel de administración...");
        setTimeout(() => {
            window.location.href = "admin.html";
        }, 1000);
        return true;
    }
    return false;
}

// ===== FUNCIÓN DE BÚSQUEDA =====
function buscarPromociones() {
    const input = document.getElementById("buscador");
    const texto = input.value;
    
    // Verificar si es la palabra secreta
    if (verificarPalabraSecreta(texto)) {
        input.value = "";
        return;
    }
    
    textoBusqueda = texto;
    const btnLimpiar = document.getElementById("btnLimpiarBusqueda");
    const resultadoSpan = document.getElementById("resultadoBusqueda");
    
    if (textoBusqueda.length > 0) {
        btnLimpiar.style.display = "block";
    } else {
        btnLimpiar.style.display = "none";
    }
    
    renderizarPromociones();
    
    // Mostrar cuántos resultados se encontraron
    const promocionesFiltradas = aplicarFiltros();
    if (textoBusqueda.length > 0) {
        resultadoSpan.innerHTML = `🔍 Se encontraron ${promocionesFiltradas.length} resultados para "${textoBusqueda}"`;
    } else {
        resultadoSpan.innerHTML = "";
    }
}

// ===== LIMPIAR BÚSQUEDA =====
function limpiarBusqueda() {
    document.getElementById("buscador").value = "";
    textoBusqueda = "";
    document.getElementById("btnLimpiarBusqueda").style.display = "none";
    document.getElementById("resultadoBusqueda").innerHTML = "";
    renderizarPromociones();
}

// ===== APLICAR FILTROS Y BÚSQUEDA =====
function aplicarFiltros() {
    let resultados = [...promociones];
    
    // Filtrar por categoría
    if (filtroActual !== "todos") {
        resultados = resultados.filter(p => p.categoria === filtroActual);
    }
    
    // Filtrar por búsqueda de texto
    if (textoBusqueda.length > 0) {
        const busquedaLower = textoBusqueda.toLowerCase();
        resultados = resultados.filter(p => 
            p.titulo.toLowerCase().includes(busquedaLower) ||
            p.establecimiento.toLowerCase().includes(busquedaLower) ||
            p.codigo.toLowerCase().includes(busquedaLower) ||
            p.descripcion.toLowerCase().includes(busquedaLower)
        );
    }
    
    return resultados;
}

// ===== ACTUALIZAR ESTADÍSTICAS =====
function actualizarEstadisticas() {
    const total = promociones.length;
    const statsContainer = document.getElementById("stats-container");
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">🏷️ ${total} Promociones activas</div>
            <div class="stat-card">⭐ Hasta ${Math.max(...promociones.map(p => parseInt(p.descuento) || 0))}% de descuento</div>
            <div class="stat-card">📱 QR válido por tiempo limitado</div>
        `;
    }
}

// ===== RENDERIZAR PROMOCIONES =====
function renderizarPromociones() {
    const grid = document.getElementById("entradas-grid");
    if (!grid) return;

    const promocionesFiltradas = aplicarFiltros();

    if (promocionesFiltradas.length === 0) {
        grid.innerHTML = `<div class="sin-resultados">❌ No hay promociones que coincidan con tu búsqueda</div>`;
        return;
    }

    grid.innerHTML = promocionesFiltradas.map(promo => `
        <div class="card" data-id="${promo.id}" onclick="verDetalle(${promo.id})" style="cursor: pointer;">
            ${promo.imagen ? `<img src="${promo.imagen}" alt="${promo.titulo}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px 12px 0 0;">` : ''}
            <div class="descuento-badge">-${promo.descuento}</div>
            <div class="card-badge">${getIconoCategoria(promo.categoria)} ${promo.categoria.charAt(0).toUpperCase() + promo.categoria.slice(1)}</div>
            <div class="card-content">
                <h2>${promo.titulo}</h2>
                <div class="card-categoria">${promo.establecimiento}</div>
                <p class="card-description">${promo.descripcion.substring(0, 80)}${promo.descripcion.length > 80 ? '...' : ''}</p>
                <div class="codigo-container">
                    <span class="codigo-label">CÓDIGO:</span>
                    <span class="codigo-value" onclick="event.stopPropagation(); copiarCodigo('${promo.codigo}')">${promo.codigo}</span>
                </div>
                <div class="fecha">📅 Válido hasta: ${promo.fechaValidez}</div>
                
                <!-- BOTONES DE COMPARTIR -->
                <div class="share-buttons" onclick="event.stopPropagation();">
                    <button class="share-btn share-whatsapp" onclick="compartirWhatsApp(${promo.id}, '${promo.titulo.replace(/'/g, "\\'")}')">
                        💬 WhatsApp
                    </button>
                    <button class="share-btn share-facebook" onclick="compartirFacebook(${promo.id}, '${promo.titulo.replace(/'/g, "\\'")}')">
                        📘 Facebook
                    </button>
                    <button class="share-btn share-twitter" onclick="compartirTwitter(${promo.id}, '${promo.titulo.replace(/'/g, "\\'")}')">
                        🐦 Twitter
                    </button>
                    <button class="share-btn share-telegram" onclick="compartirTelegram(${promo.id}, '${promo.titulo.replace(/'/g, "\\'")}')">
                        📡 Telegram
                    </button>
                    <button class="share-btn share-copy" onclick="copiarEnlace(${promo.id}, '${promo.titulo.replace(/'/g, "\\'")}')">
                        🔗 Copiar
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// ===== ICONO POR CATEGORÍA =====
function getIconoCategoria(categoria) {
    const iconos = {
        restaurante: "🍕",
        tienda: "🛍️",
        ocio: "🎬",
        salud: "💆",
        otros: "✨"
    };
    return iconos[categoria] || "🏷️";
}

// ===== GENERAR Y DESCARGAR QR =====
function generarYDescargarQR(texto, titulo) {
    try {
        const qr = qrcode(0, 'M');
        qr.addData(texto);
        qr.make();
        const imgData = qr.createDataURL(8);
        
        const enlace = document.createElement('a');
        enlace.href = imgData;
        enlace.download = `qr_${texto}.png`;
        enlace.click();
        
        mostrarToast(`✅ QR de "${titulo}" descargado`);
    } catch (error) {
        console.error("Error al generar QR:", error);
        mostrarToast("❌ Error al generar el QR");
    }
}

// ===== CERRAR MODAL =====
function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

// ===== COPIAR CÓDIGO =====
function copiarCodigo(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        mostrarToast(`✅ Código "${codigo}" copiado`);
    }).catch(() => {
        mostrarToast("❌ No se pudo copiar");
    });
}

// ===== MOSTRAR TOAST =====
function mostrarToast(mensaje) {
    const toastExistente = document.querySelector(".toast");
    if (toastExistente) toastExistente.remove();
    
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// ===== CONFIGURAR FILTROS =====
function configurarFiltros() {
    const botones = document.querySelectorAll(".filtro-btn");
    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            botones.forEach(btn => btn.classList.remove("activo"));
            boton.classList.add("activo");
            filtroActual = boton.getAttribute("data-filtro");
            renderizarPromociones();
        });
    });
}

// ===== ESCUCHAR CAMBIOS EN localStorage =====
window.addEventListener("storage", (e) => {
    if (e.key === "promociones") {
        promociones = JSON.parse(e.newValue);
        actualizarEstadisticas();
        renderizarPromociones();
    }
});

// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
    actualizarEstadisticas();
    renderizarPromociones();
    configurarFiltros();
    
    // Configurar buscador
    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("input", buscarPromociones);
    }
    
    const btnLimpiar = document.getElementById("btnLimpiarBusqueda");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarBusqueda);
    }
});

// Cerrar modal con ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarModal();
});

// Cerrar modal click fuera
document.getElementById("modal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal")) cerrarModal();
});
function renderizarPromociones() {
    const grid = document.getElementById("entradas-grid");
    if (!grid) return;

    const promocionesFiltradas = aplicarFiltros();

    if (promocionesFiltradas.length === 0) {
        grid.innerHTML = `<div class="sin-resultados">❌ No hay promociones que coincidan con tu búsqueda</div>`;
        return;
    }

    grid.innerHTML = promocionesFiltradas.map(promo => `
        <div class="card" data-id="${promo.id}" onclick="verDetalle(${promo.id})" style="cursor: pointer;">
            ${promo.imagen ? `<img src="${promo.imagen}" alt="${promo.titulo}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px 12px 0 0;">` : ''}
            <div class="descuento-badge">-${promo.descuento}</div>
            <div class="card-badge">${getIconoCategoria(promo.categoria)} ${promo.categoria.charAt(0).toUpperCase() + promo.categoria.slice(1)}</div>
            <div class="card-content">
                <h2>${promo.titulo}</h2>
                <div class="card-categoria">${promo.establecimiento}</div>
                <p class="card-description">${promo.descripcion.substring(0, 80)}${promo.descripcion.length > 80 ? '...' : ''}</p>
                <div class="codigo-container">
                    <span class="codigo-label">CÓDIGO:</span>
                    <span class="codigo-value" onclick="event.stopPropagation(); copiarCodigo('${promo.codigo}')">${promo.codigo}</span>
                </div>
                <div class="fecha">📅 Válido hasta: ${promo.fechaValidez}</div>
            </div>
        </div>
    `).join("");
}

// ===== FUNCIÓN PARA VER DETALLE DE LA OFERTA =====
function verDetalle(id) {
    // Guardar el ID de la promoción en localStorage para que la página de detalle lo lea
    localStorage.setItem("promocionSeleccionada", id);
    // Redirigir a la página de detalle
    window.location.href = "detalle.html";
}

// ===== FUNCIONES PARA COMPARTIR =====

// Obtener la URL actual de la promoción
function getPromocionUrl(id) {
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
    return `${baseUrl}detalle.html?id=${id}`;
}

// Compartir en WhatsApp
function compartirWhatsApp(id, titulo) {
    const url = getPromocionUrl(id);
    const texto = `¡Mira esta oferta! ${titulo} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}

// Compartir en Facebook
function compartirFacebook(id, titulo) {
    const url = getPromocionUrl(id);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

// Compartir en Twitter/X
function compartirTwitter(id, titulo) {
    const url = getPromocionUrl(id);
    const texto = `¡Mira esta oferta! ${titulo}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

// Compartir en Telegram
function compartirTelegram(id, titulo) {
    const url = getPromocionUrl(id);
    const texto = `¡Mira esta oferta! ${titulo} - ${url}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`, '_blank');
}

// Copiar enlace al portapapeles
function copiarEnlace(id, titulo) {
    const url = getPromocionUrl(id);
    navigator.clipboard.writeText(url).then(() => {
        mostrarToast("✅ Enlace copiado al portapapeles");
    }).catch(() => {
        mostrarToast("❌ No se pudo copiar el enlace");
    });
}
// ===== SISTEMA DE VERIFICACIÓN DE QR =====

function getUsosQR() {
    const usos = localStorage.getItem("qr_usos");
    return usos ? JSON.parse(usos) : {};
}

function verificarUsoQR(promocionId, deviceId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;
    
    if (!usos[key]) return false;
    return usos[key].includes(deviceId);
}