const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar la imagen del mapa
const mapImage = new Image();
mapImage.src = '../images/MapaAzteka.png'; // Ruta de la imagen del mapa

// Variables para zoom y desplazamiento
let scale = 1; // Nivel de zoom
let offsetX = 0; // Desplazamiento horizontal
let offsetY = 0; // Desplazamiento vertical
let isDragging = false; // Estado de si estamos arrastrando el mapa
let lastX = 0;
let lastY = 0;
let initialDistance = 0; // Distancia inicial entre dos dedos para el zoom
const initialZoom = 0.7;

// Definir los límites de zoom
const maxZoom = 10;
const minZoom = 0.6; // Siempre ocupará al menos el ancho completo

// Actualizar el tamaño del canvas para que ocupe toda la pantalla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Ajustar el nivel de zoom para que siempre ocupe el ancho completo del canvas
    scale = initialZoom;

    // Evitar que el zoom sea menor al mínimo
    if (scale < minZoom) {
        scale = minZoom;
    }

    // Redibujar el mapa
    limitScroll();
    drawMap();
}

// Dibujar el mapa en el canvas
function drawMap() {
    // Limpiar el canvas antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la imagen escalada y desplazada
    ctx.drawImage(mapImage, offsetX, offsetY, mapImage.width * scale, mapImage.height * scale);
}

// Limitar los desplazamientos dentro de los límites de la imagen
function limitScroll() {
    const mapWidth = mapImage.width * scale;
    const mapHeight = mapImage.height * scale;

    // No permitir desplazamiento horizontal fuera de los límites del mapa
    offsetX = Math.max(canvas.width - mapWidth, Math.min(offsetX, 0));

    // Limitar el desplazamiento vertical dentro del mapa
    offsetY = Math.max(canvas.height - mapHeight, Math.min(offsetY, 0));
}

// Manejar el evento de arrastre (drag) con el ratón
canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        offsetX += dx;
        offsetY += dy;
        lastX = event.clientX;
        lastY = event.clientY;

        limitScroll();
        drawMap();
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Manejar el evento de zoom (mouse wheel)
canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    console.log('Wheel event detected'); // Verificar que el evento se detecta

    // Determinar si estamos haciendo zoom in o zoom out
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;

    // Calcular el punto de zoom en las coordenadas del ratón
    const mouseX = (event.clientX - offsetX) / scale;
    const mouseY = (event.clientY - offsetY) / scale;

    // Actualizar el nivel de zoom
    scale *= zoomFactor;

    // Limitar el zoom al máximo y mínimo
    if (scale > maxZoom) {
        scale = maxZoom;
    } else if (scale < minZoom) {
        scale = minZoom;
    }

    // Ajustar la posición de desplazamiento para centrar el zoom en el mouse
    offsetX = event.clientX - mouseX * scale;
    offsetY = event.clientY - mouseY * scale;

    limitScroll();
    drawMap();
});

// Manejar eventos táctiles (touch)
canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
        isDragging = true;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        isDragging = false;
        initialDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
    }
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault(); // Impedir que se haga scroll en la pantalla

    if (event.touches.length === 1 && isDragging) {
        const dx = event.touches[0].clientX - lastX;
        const dy = event.touches[0].clientY - lastY;

        offsetX += dx;
        offsetY += dy;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;

        limitScroll();
        drawMap();
    } else if (event.touches.length === 2) {
        const currentDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
        const zoomFactor = currentDistance / initialDistance;
        initialDistance = currentDistance;

        // Calcular el punto de zoom en el centro de los dedos
        const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const mouseX = (centerX - offsetX) / scale;
        const mouseY = (centerY - offsetY) / scale;

        // Actualizar el nivel de zoom
        scale *= zoomFactor;

        // Limitar el zoom al máximo y mínimo
        if (scale > maxZoom) {
            scale = maxZoom;
        } else if (scale < minZoom) {
            scale = minZoom;
        }

        // Ajustar la posición de desplazamiento para centrar el zoom en el centro de los dedos
        offsetX = centerX - mouseX * scale;
        offsetY = centerY - mouseY * scale;

        limitScroll();
        drawMap();
    }
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Inicializar y redibujar cuando la imagen esté cargada
mapImage.onload = () => {
    console.log('Image loaded'); // Verificar que la imagen se carga
    resizeCanvas();
    drawMap();
};

// Ajustar tamaño del canvas cuando cambie el tamaño de la ventana
window.addEventListener('resize', resizeCanvas);