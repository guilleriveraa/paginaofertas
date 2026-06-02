// ===== PANEL ADMIN - CON CLOUDINARY =====

// CONFIGURACIÓN DE CLOUDINARY
const CLOUDINARY_CLOUD_NAME = "dr5zziaja";  // ← REEMPLAZA CON TU CLOUD NAME
const CLOUDINARY_UPLOAD_PRESET = "promociones"; // ← EL PRESET QUE CREASTE

let promociones = [];
let editandoId = null;

// ===== CARGAR PROMOCIONES =====
function cargarPromociones() {
    const guardadas = localStorage.getItem("promociones");
    promociones = guardadas ? JSON.parse(guardadas) : [];
    return promociones;
}

// ===== INICIAR CLOUDINARY WIDGET =====
let myWidget;

function initCloudinaryWidget() {
    myWidget = cloudinary.createUploadWidget(
        {
            cloudName: CLOUDINARY_CLOUD_NAME,
            uploadPreset: CLOUDINARY_UPLOAD_PRESET,
            multiple: false,
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB máximo
            sources: ['local', 'camera', 'url'],
            showUploadMoreButton: false,
            cropping: true,
            croppingAspectRatio: 16 / 9,
            styles: {
                palette: {
                    window: "#FFFFFF",
                    sourceBg: "#F5F5F5",
                    border: "#E5E7EB",
                    action: "#6366f1",
                    inactive: "#64748B",
                    success: "#10b981"
                }
            }
        },
        (error, result) => {
            if (error) {
                mostrarToast("❌ Error al subir la imagen");
                console.error(error);
                return;
            }

            if (result && result.event === "success") {
                const imageUrl = result.info.secure_url;
                document.getElementById("imagen-url").value = imageUrl;
                document.getElementById("preview-img").src = imageUrl;
                document.getElementById("imagen-preview").style.display = "block";
                mostrarToast("✅ Imagen subida correctamente");
            }
        }
    );

    const uploadBtn = document.getElementById("upload-btn");
    if (uploadBtn) {
        uploadBtn.onclick = function () {
            myWidget.open();
        };
    }

    const removeBtn = document.getElementById("remove-img");
    if (removeBtn) {
        removeBtn.onclick = function () {
            document.getElementById("imagen-url").value = "";
            document.getElementById("imagen-preview").style.display = "none";
            document.getElementById("preview-img").src = "";
            mostrarToast("🗑️ Imagen eliminada");
        };
    }
}

function guardarPromocion() {
    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const descuento = document.getElementById("descuento").value.trim();
    const codigo = document.getElementById("codigo").value.trim().toUpperCase();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fechaValidez = document.getElementById("fechaValidez").value.trim();
    const establecimiento = document.getElementById("establecimiento").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const imagen = document.getElementById("imagen-url").value.trim();  // ← Importante: .value.trim()

    if (!titulo || !codigo || !descripcion || !fechaValidez || !establecimiento) {
        mostrarToast("❌ Por favor, completa todos los campos obligatorios");
        return;
    }

    if (editandoId !== null) {
        const index = promociones.findIndex(p => p.id === editandoId);
        if (index !== -1) {
            promociones[index] = {
                ...promociones[index],
                titulo,
                categoria,
                descuento,
                codigo,
                descripcion,
                fechaValidez,
                establecimiento,
                direccion: direccion || promociones[index].direccion || null,
                imagen: imagen !== "" ? imagen : null  // ← CORREGIDO: si está vacío, pone null
            };
            mostrarToast("✅ Promoción actualizada correctamente");
        }
        cancelarEdicion();
    } else {
        const nuevaId = Math.max(...promociones.map(p => p.id), 0) + 1;
        const nuevaPromocion = {
            id: nuevaId,
            titulo,
            categoria,
            descuento,
            codigo,
            descripcion,
            fechaValidez,
            establecimiento,
            direccion: direccion || null,
            imagen: imagen || null
        };
        promociones.push(nuevaPromocion);
        mostrarToast("✅ Promoción añadida correctamente");
    }

    localStorage.setItem("promociones", JSON.stringify(promociones));
    limpiarFormulario();
    renderizarLista();

    window.dispatchEvent(new StorageEvent("storage", { key: "promociones", newValue: JSON.stringify(promociones) }));
}

// ===== EDITAR PROMOCIÓN =====
function editarPromocion(id) {
    const promo = promociones.find(p => p.id === id);
    if (!promo) return;

    editandoId = id;
    document.getElementById("form-titulo").innerHTML = "✏️ Editar promoción";
    document.getElementById("titulo").value = promo.titulo;
    document.getElementById("categoria").value = promo.categoria;
    document.getElementById("descuento").value = promo.descuento;
    document.getElementById("codigo").value = promo.codigo;
    document.getElementById("descripcion").value = promo.descripcion;
    document.getElementById("fechaValidez").value = promo.fechaValidez;
    document.getElementById("establecimiento").value = promo.establecimiento;
    document.getElementById("direccion").value = promo.direccion || "";

    if (promo.imagen) {
        document.getElementById("imagen-url").value = promo.imagen;
        document.getElementById("preview-img").src = promo.imagen;
        document.getElementById("imagen-preview").style.display = "block";
    } else {
        document.getElementById("imagen-url").value = "";
        document.getElementById("imagen-preview").style.display = "none";
    }

    document.querySelector(".btn-guardar").textContent = "✏️ Actualizar promoción";
    document.getElementById("btn-cancelar").style.display = "block";
}

// ===== ELIMINAR PROMOCIÓN =====
function eliminarPromocion(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta promoción?")) {
        promociones = promociones.filter(p => p.id !== id);
        localStorage.setItem("promociones", JSON.stringify(promociones));
        renderizarLista();
        mostrarToast("🗑️ Promoción eliminada");

        window.dispatchEvent(new StorageEvent("storage", { key: "promociones", newValue: JSON.stringify(promociones) }));

        if (editandoId === id) cancelarEdicion();
    }
}

// ===== CANCELAR EDICIÓN =====
function cancelarEdicion() {
    editandoId = null;
    limpiarFormulario();
    document.getElementById("form-titulo").innerHTML = "➕ Añadir nueva promoción";
    document.querySelector(".btn-guardar").textContent = "💾 Guardar promoción";
    document.getElementById("btn-cancelar").style.display = "none";
}

// ===== LIMPIAR FORMULARIO =====
function limpiarFormulario() {
    document.getElementById("titulo").value = "";
    document.getElementById("categoria").value = "restaurante";
    document.getElementById("descuento").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("fechaValidez").value = "";
    document.getElementById("establecimiento").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("imagen-url").value = "";
    document.getElementById("imagen-preview").style.display = "none";
    document.getElementById("preview-img").src = "";
}

// ===== RENDERIZAR LISTA =====
function renderizarLista() {
    const contenedor = document.getElementById("lista-promos");
    if (!contenedor) return;

    if (promociones.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--gray); text-align: center;">No hay promociones aún. ¡Crea la primera!</p>';
        return;
    }

    contenedor.innerHTML = promociones.map(promo => `
        <div class="promo-item">
            <div class="promo-info">
                <strong>${escapeHTML(promo.titulo)}</strong>
                <small>${escapeHTML(promo.establecimiento)} | Código: ${escapeHTML(promo.codigo)} | Vence: ${escapeHTML(promo.fechaValidez)}</small>
                ${promo.direccion ? `<small>📍 ${escapeHTML(promo.direccion)}</small>` : ''}
                ${promo.imagen ? '<small>🖼️ Con imagen</small>' : '<small>📷 Sin imagen</small>'}
            </div>
            <div class="promo-acciones">
                <button class="btn-editar" onclick="editarPromocion(${promo.id})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="eliminarPromocion(${promo.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join("");
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

// ===== ESCAPAR HTML =====
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ===== VERIFICAR ACCESO ADMIN =====
function verificarAccesoAdmin() {
    const accesoPermitido = sessionStorage.getItem("accesoAdmin");
    if (!accesoPermitido) {
        alert("⚠️ Acceso denegado. Debes usar la palabra secreta en el buscador de la página principal.");
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
    sessionStorage.removeItem("accesoAdmin");
    window.location.href = "index.html";
}

// ===== AGREGAR BOTÓN CERRAR SESIÓN =====
function agregarBotonCerrarSesion() {
    const adminContainer = document.querySelector(".admin-container");
    if (adminContainer && !document.getElementById("btn-cerrar-sesion")) {
        const btnCerrar = document.createElement("button");
        btnCerrar.id = "btn-cerrar-sesion";
        btnCerrar.textContent = "🚪 Cerrar sesión";
        btnCerrar.className = "btn-cerrar-sesion";
        btnCerrar.onclick = cerrarSesion;

        const btnVolver = document.querySelector(".btn-volver");
        if (btnVolver) {
            btnVolver.parentNode.insertBefore(btnCerrar, btnVolver.nextSibling);
        }
    }
}

// ===== SISTEMA DE CONTROL DE USOS DEL QR =====

// Estructura de datos para guardar usos
// Formato: {
//   "promocion_1": ["device_id_1", "device_id_2"],
//   "promocion_2": ["device_id_3"]
// }

function getUsosQR() {
    const usos = localStorage.getItem("qr_usos");
    return usos ? JSON.parse(usos) : {};
}

function guardarUsosQR(usos) {
    localStorage.setItem("qr_usos", JSON.stringify(usos));
}

// Verificar si un dispositivo ya usó una promoción
function verificarUsoQR(promocionId, deviceId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;

    if (!usos[key]) return false;
    return usos[key].includes(deviceId);
}

// Registrar uso de QR
function registrarUsoQR(promocionId, deviceId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;

    if (!usos[key]) {
        usos[key] = [];
    }

    if (!usos[key].includes(deviceId)) {
        usos[key].push(deviceId);
        guardarUsosQR(usos);
        return true;
    }
    return false;
}

// Resetear usos de una promoción
function resetearUsosPromocion(promocionId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;

    if (usos[key]) {
        delete usos[key];
        guardarUsosQR(usos);
        mostrarToast("✅ Usos reseteados correctamente");
        cargarListaUsosAdmin();
        return true;
    }
    return false;
}

// Obtener dispositivos que usaron una promoción
function getDispositivosPorPromocion(promocionId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;
    return usos[key] || [];
}

// ===== FUNCIONES PARA EL ADMIN =====

function cargarSelectPromociones() {
    const select = document.getElementById("select-promo-usos");
    if (!select) return;

    const promociones = JSON.parse(localStorage.getItem("promociones")) || [];

    select.innerHTML = '<option value="">-- Selecciona una promoción --</option>';

    promociones.forEach(promo => {
        const option = document.createElement("option");
        option.value = promo.id;
        option.textContent = `${promo.titulo} (${promo.establecimiento})`;
        select.appendChild(option);
    });

    select.addEventListener("change", function () {
        const promocionId = this.value;
        if (promocionId) {
            cargarInfoUsos(promocionId);
        } else {
            document.getElementById("info-usos").style.display = "none";
        }
    });
}

function cargarInfoUsos(promocionId) {
    const dispositivos = getDispositivosPorPromocion(promocionId);
    const container = document.getElementById("lista-dispositivos");
    const infoDiv = document.getElementById("info-usos");

    if (dispositivos.length === 0) {
        container.innerHTML = "<p style='color: var(--gray);'>❌ Ningún dispositivo ha usado esta promoción todavía.</p>";
    } else {
        container.innerHTML = `
            <div class="dispositivo-stats">
                <p>📊 <strong>Total de usos:</strong> ${dispositivos.length}</p>
                <div class="lista-devices">
                    ${dispositivos.map((device, index) => `
                        <div class="device-item">
                            <span>📱 Dispositivo ${index + 1}:</span>
                            <code>${device.substring(0, 20)}...</code>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    infoDiv.style.display = "block";
    window.promocionIdActual = promocionId;
}

function resetearUsosPromocion() {
    if (window.promocionIdActual) {
        if (confirm("¿Estás seguro de que quieres resetear todos los usos de esta promoción? Los dispositivos podrán volver a usarla.")) {
            resetearUsosPromocion(window.promocionIdActual);
            cargarInfoUsos(window.promocionIdActual);
        }
    }
}

// ===== SISTEMA DE CONTROL DE USOS DEL QR =====

// Estructura de datos para guardar usos
function getUsosQR() {
    const usos = localStorage.getItem("qr_usos");
    return usos ? JSON.parse(usos) : {};
}

function guardarUsosQR(usos) {
    localStorage.setItem("qr_usos", JSON.stringify(usos));
}

// Obtener dispositivos que usaron una promoción
function getDispositivosPorPromocion(promocionId) {
    const usos = getUsosQR();
    const key = `promocion_${promocionId}`;
    return usos[key] || [];
}

// Resetear usos de una promoción
function resetearUsosPromocion() {
    const select = document.getElementById("select-promo-usos");
    if (!select || !select.value) {
        mostrarToast("❌ Selecciona una promoción primero");
        return;
    }
    
    const promocionId = select.value;
    
    if (confirm("¿Estás seguro de que quieres resetear todos los usos de esta promoción? Los dispositivos podrán volver a usarla.")) {
        const usos = getUsosQR();
        const key = `promocion_${promocionId}`;
        
        if (usos[key]) {
            delete usos[key];
            guardarUsosQR(usos);
            mostrarToast("✅ Usos reseteados correctamente");
            cargarInfoUsos(promocionId);
        } else {
            mostrarToast("⚠️ Esta promoción no tenía usos registrados");
        }
    }
}

// Cargar información de usos de una promoción
function cargarInfoUsos(promocionId) {
    const dispositivos = getDispositivosPorPromocion(promocionId);
    const container = document.getElementById("lista-dispositivos");
    const infoDiv = document.getElementById("info-usos");
    
    if (!container || !infoDiv) return;
    
    if (dispositivos.length === 0) {
        container.innerHTML = "<p style='color: var(--gray);'>❌ Ningún dispositivo ha usado esta promoción todavía.</p>";
    } else {
        container.innerHTML = `
            <div class="dispositivo-stats">
                <p>📊 <strong>Total de usos:</strong> ${dispositivos.length}</p>
                <div class="lista-devices">
                    ${dispositivos.map((device, index) => `
                        <div class="device-item">
                            <span>📱 Dispositivo ${index + 1}:</span>
                            <code>${device.substring(0, 25)}...</code>
                            <small style="color: #666;">(${new Date().toLocaleDateString()})</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    infoDiv.style.display = "block";
}

// Cargar el select con las promociones
function cargarSelectPromociones() {
    const select = document.getElementById("select-promo-usos");
    if (!select) {
        console.log("No se encontró el select #select-promo-usos");
        return;
    }
    
    const promociones = JSON.parse(localStorage.getItem("promociones")) || [];
    
    if (promociones.length === 0) {
        select.innerHTML = '<option value="">-- No hay promociones creadas --</option>';
        return;
    }
    
    select.innerHTML = '<option value="">-- Selecciona una promoción --</option>';
    
    promociones.forEach(promo => {
        const option = document.createElement("option");
        option.value = promo.id;
        option.textContent = `${promo.titulo} (${promo.establecimiento})`;
        select.appendChild(option);
    });
    
    // Añadir evento al select
    select.onchange = function() {
        const promocionId = this.value;
        if (promocionId) {
            cargarInfoUsos(promocionId);
        } else {
            const infoDiv = document.getElementById("info-usos");
            if (infoDiv) infoDiv.style.display = "none";
        }
    };
}

// Inicializar el panel de usos
function initPanelUsos() {
    cargarSelectPromociones();
}

// ===== INICIALIZAR =====
document.addEventListener("DOMContentLoaded", () => {
    if (verificarAccesoAdmin()) {
        cargarPromociones();
        renderizarLista();
        initCloudinaryWidget();
        initPanelUsos();
        agregarBotonCerrarSesion();
    }
});