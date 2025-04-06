const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const mapImage = new Image();
mapImage.src = '../../images/MapaAzteka.png';

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let initialDistance = 0;
let minZoom, maxZoom = 5;

// Definir las zonas clicables
const towerZones = [
    { x: 775, y: 580, width: 50, height: 50, occupied: false },
    { x: 520, y: 580, width: 50, height: 50, occupied: false },
    { x: 262, y: 420, width: 50, height: 50, occupied: false },
    { x: 262, y: 132, width: 50, height: 50, occupied: false },
    { x: 582, y: 132, width: 50, height: 50, occupied: false },
    { x: 647, y: 260, width: 50, height: 50, occupied: false },
    { x: 870, y: 70, width: 50, height: 50, occupied: false },
];

// Ajustar el tamaño del canvas al tamaño de la pantalla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calcular el zoom mínimo para que la imagen siempre llene la pantalla
    const scaleX = canvas.width / mapImage.width;
    const scaleY = canvas.height / mapImage.height;
    minZoom = Math.max(scaleX, scaleY);

    // Aplicar el zoom mínimo
    scale = minZoom;

    // Centrar la imagen correctamente
    offsetX = (canvas.width - mapImage.width * scale) / 2;
    offsetY = (canvas.height - mapImage.height * scale) / 2;

    drawMap();
    drawZones(); // Dibujar las zonas clicables
}

// Dibujar el mapa
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, offsetX, offsetY, mapImage.width * scale, mapImage.height * scale);
}

// Dibujar las zonas clicables
function drawZones() {
    ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Verde semitransparente
    towerZones.forEach(zone => {
        // Dibujar las zonas teniendo en cuenta el desplazamiento y el zoom
        ctx.fillRect(zone.x * scale + offsetX, zone.y * scale + offsetY, zone.width * scale, zone.height * scale);
    });
}



// Evitar que el mapa se desplace fuera de los límites
function limitScroll() {
    const mapWidth = mapImage.width * scale;
    const mapHeight = mapImage.height * scale;

    offsetX = Math.max(canvas.width - mapWidth, Math.min(offsetX, 0));
    offsetY = Math.max(canvas.height - mapHeight, Math.min(offsetY, 0));
}

// Verificar si un clic está dentro de una zona
function isInsideZone(x, y) {
    return towerZones.find(zone =>
        x >= (zone.x * scale + offsetX) && x <= (zone.x * scale + offsetX + zone.width * scale) &&
        y >= (zone.y * scale + offsetY) && y <= (zone.y * scale + offsetY + zone.height * scale) &&
        !zone.occupied
    );
}

// Colocar una torre en la zona
function placeTower(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const zone = isInsideZone(clickX, clickY);

    if (zone) {
        //zone.occupied = true;
        showTowerMenu(zone);
    }
}



let towerMenuVisible = false; // Para saber si el menú está visible

// Mostrar el menú de la torre
function showTowerMenu(zone) {
    const menu = document.getElementById('towerMenu');

    console.log(`Zona clicada: (${zone.x}, ${zone.y})`);

    // Calcular el centro de la zona en coordenadas del canvas
    const zoneCenterX = zone.x * scale + offsetX;
    const zoneTopY = zone.y * scale + offsetY;

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Calcular la posición del menú para que esté centrado encima de la zona clicada
    const menuLeft = zoneCenterX - (menuWidth / 2) - (window.innerHeight * 0.03); // Mover 5% más a la izquierda
    const menuTop = zoneTopY - menuHeight - (window.innerHeight * 0.04); // Moverlo 5% más arriba

    // Mostrar el menú en la posición calculada
    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${menuTop}px`;
    menu.style.display = 'block';
    menu.style.position = 'absolute';
    menu.style.zIndex = '1000';

    towerMenuVisible = true;

    console.log(`Menú de torres mostrado en: (${menuLeft}px, ${menuTop}px)`);
}


// Ocultar el menú si se hace clic fuera
function hideTowerMenuIfClickedOutside(event) {
    const menu = document.getElementById('towerMenu');
    const towerMenuRect = menu.getBoundingClientRect();
    const towerOptions = document.querySelectorAll('.towerOption');

    // Verificar si el clic no fue dentro del menú ni en sus opciones
    const isInsideMenu = event.clientX >= towerMenuRect.left &&
                         event.clientX <= towerMenuRect.right &&
                         event.clientY >= towerMenuRect.top &&
                         event.clientY <= towerMenuRect.bottom;

    const isInsideOption = Array.from(towerOptions).some(option => option.contains(event.target));

    if (!isInsideMenu && !isInsideOption) {
        menu.style.display = 'none';
        towerMenuVisible = false; // El menú ya no está visible
    }

    // Las opciones tmp son visibles

    
}

// Ocultar el menú si se arrastra o se hace zoom
function hideTowerMenuIfDraggedOrZoomed() {
    if (towerMenuVisible) {
        const menu = document.getElementById('towerMenu');
        menu.style.display = 'none';
        towerMenuVisible = false; // El menú ya no está visible
    }
}

// Detectar si el usuario está arrastrando
canvas.addEventListener('touchmove', () => {
    hideTowerMenuIfDraggedOrZoomed();
});

canvas.addEventListener('mousemove', () => {
    hideTowerMenuIfDraggedOrZoomed();
});

// Detectar si se hace zoom
canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2) {
        hideTowerMenuIfDraggedOrZoomed();
    }
});

// Escuchar clics en el documento para cerrar el menú
document.addEventListener('click', hideTowerMenuIfClickedOutside);







// Función de colocación de torre, como la tenías previamente
function placeTower(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const zone = isInsideZone(clickX, clickY);

    if (zone) {
        //zone.occupied = true;
        showTowerMenu(zone);
        
        // Detener la propagación del clic para evitar que se oculte el menú inmediatamente
        event.stopPropagation();
    }
}

// Evento de clic en el canvas
canvas.addEventListener("click", placeTower);

// Evento de clic en cualquier parte del documento para ocultar el menú si se hace fuera de él
document.addEventListener('click', hideTowerMenuIfClickedOutside);





// Evento de arrastre táctil (touch)
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
    event.preventDefault();

    if (event.touches.length === 1 && isDragging) {
        const dx = event.touches[0].clientX - lastX;
        const dy = event.touches[0].clientY - lastY;

        offsetX += dx;
        offsetY += dy;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;

        limitScroll();
        drawMap();
        drawZones(); // Redibujar las zonas clicables después del desplazamiento
    } else if (event.touches.length === 2) {
        const currentDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
        const zoomFactor = currentDistance / initialDistance;
        initialDistance = currentDistance;

        // Zoom centrado en el punto medio de los dedos
        const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const mouseX = (centerX - offsetX) / scale;
        const mouseY = (centerY - offsetY) / scale;

        // Aplicar zoom
        scale *= zoomFactor;

        // Limitar zoom
        if (scale > maxZoom) scale = maxZoom;
        if (scale < minZoom) scale = minZoom;

        // Ajustar desplazamiento
        offsetX = centerX - mouseX * scale;
        offsetY = centerY - mouseY * scale;

        limitScroll();
        drawMap();
        drawZones(); // Redibujar las zonas clicables después del zoom
    }
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Cargar la imagen y ajustar el canvas
mapImage.onload = () => {
    resizeCanvas();
    drawMap();
    drawZones(); // Dibujar las zonas clicables después de cargar la imagen
};

// Ajustar el canvas al cambiar el tamaño de la pantalla
window.addEventListener('resize', resizeCanvas);
