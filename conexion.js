// conexion.js
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzd97GDY05pWK-uO2aA0QpSAQCXVTvcJjp8OWC_O-8F5GOTV4IszetA-PvcuPk0qGY3HA/exec";

let misDatos = {}; 
let qrGenerado = false;

async function obtenerDatosDeGoogle() {
    try {
        const titleElement = document.getElementById('user-name');
        if(titleElement) titleElement.textContent = "Cargando datos...";
        
        // Aquí está la magia: Lee la variable CLIENTE_ID que pondremos en el HTML
        const clienteId = typeof CLIENTE_ID !== 'undefined' ? CLIENTE_ID : 'spingamma'; 
        
        const respuesta = await fetch(GOOGLE_SHEET_URL + "?id=" + clienteId);
        misDatos = await respuesta.json();
        
        if (misDatos.error) {
            if(titleElement) titleElement.textContent = "Usuario no encontrado";
            const descElement = document.getElementById('user-title');
            if(descElement) descElement.textContent = "Verifica el enlace";
            return; 
        }

        cargarDatos();
    } catch (error) {
        console.error("Error al conectar con Google Sheets:", error);
        const titleElement = document.getElementById('user-name');
        if(titleElement) titleElement.textContent = "Error de conexión";
    }
}

function configurarElemento(id, valor, esEnlace = false, prefijo = "") {
    const elemento = document.getElementById(id);
    if (!elemento) return; 

    if (!valor || String(valor).trim().toLowerCase() === "false") {
        elemento.classList.add('hidden');
    } else {
        elemento.classList.remove('hidden');
        if (esEnlace) {
            elemento.href = prefijo + valor;
        } else {
            if (elemento.tagName === 'IMG') {
                elemento.src = valor;
            } else {
                elemento.textContent = valor;
            }
        }
    }
}

function cargarDatos() {
    const pageTitle = document.getElementById('page-title');
    if(pageTitle) pageTitle.textContent = (misDatos.nombre || 'Perfil') + ' - Tarjeta';
    
    const footerName = document.getElementById('footer-name');
    if(footerName) footerName.textContent = misDatos.nombre || '';
    
    const yearElem = document.getElementById('year');
    if(yearElem) yearElem.textContent = new Date().getFullYear();

    // Textos e imagen
    configurarElemento('user-name', misDatos.nombre);
    configurarElemento('user-title', misDatos.profesion);
    configurarElemento('user-desc', misDatos.descripcion);
    configurarElemento('profile-img', misDatos.fotoPerfil);

    // Enlaces y redes
    configurarElemento('link-location', misDatos.ubicacionUrl, true);
    configurarElemento('link-phone', misDatos.telefonoLlamada, true, "tel:");
    configurarElemento('link-whatsapp', misDatos.numeroWhatsapp, true, "https://wa.me/");
    configurarElemento('link-facebook', misDatos.paginaFacebook, true);
    configurarElemento('link-tiktok', misDatos.paginaTiktok, true);
    configurarElemento('link-website', misDatos.paginaWeb, true);       
    configurarElemento('link-instagram', misDatos.paginaInstagram, true); 

    // Ocultar botón de QR
    const btnQR = document.getElementById('btn-qr');
    if (btnQR) {
        if (!misDatos.githubUrl || String(misDatos.githubUrl).trim().toLowerCase() === "false") {
            btnQR.classList.add('hidden');
        } else {
            btnQR.classList.remove('hidden');
        }
    }
}

function toggleQR() {
    const modal = document.getElementById('modal-qr');
    const imgQr = document.getElementById('img-qr-dinamico');
    
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        if (!qrGenerado && misDatos.githubUrl && String(misDatos.githubUrl).trim().toLowerCase() !== "false") {
            imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(misDatos.githubUrl)}`;
            qrGenerado = true;
        }
    } else {
        modal.classList.add('hidden');
    }
}

function compartirPerfil() {
    if (navigator.share) {
        navigator.share({
            title: 'Tarjeta de ' + (misDatos.nombre || 'Contacto'),
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
    }
}

document.addEventListener("DOMContentLoaded", obtenerDatosDeGoogle);