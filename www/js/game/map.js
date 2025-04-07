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


const towerProperties = {
    canon: { cost: 100, damage: 10, fire_rate: 3, range: 40, projectile_type: 'bullet' },
    magic: { cost: 125,  damage: 12, fire_rate: 2.5, range: 50, projectile_type: 'magic_ball' },
    mortar: { cost: 150,  damage: 15, fire_rate: 4, range: 60, projectile_type: 'bomb' },
    archer: { cost: 120,  damage: 15, fire_rate: 4, range: 60, projectile_type: 'arrow' },
};


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
    ctx.fillStyle = "rgba(0, 255, 0, 0)"; // Verde semitransparente
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



let towerMenuVisible = false; 
let selectedTower = null;

// Mostrar el menú de la torre
function showTowerMenu(zone) {
    const menu = document.getElementById('towerMenu');

    const zoneCenterX = (zone.x + zone.width / 2) * scale + offsetX;
    const zoneCenterY = (zone.y + zone.height / 2) * scale + offsetY;

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    const menuLeft = zoneCenterX - menuWidth / 2; 
    const menuTop = zoneCenterY - menuHeight / 2;

    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${menuTop}px`;

    menu.style.display = 'block';

    towerMenuVisible = true;

    // Poner punto en el centro de la zona con canvas
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Color rojo semitransparente
    ctx.beginPath();
    ctx.arc(zoneCenterX, zoneCenterY, 5, 0, Math.PI * 2); // Radio de 5 píxeles
    ctx.fill();

    ctx.closePath();

    resetTowerMenuIcons(); 
    


    document.querySelectorAll('.towerOption').forEach((option, index) => {
        option.addEventListener('click', () => {
            const towerNames = ['canon', 'magic', 'mortar', 'archer'];
            selectedTower = towerNames[index];

            previewTowerArea(menuLeft, menuTop, towerProperties[selectedTower].range, index+1);
            
            resetTowerMenuIcons();
            changeMenuTowerIcon(index+1)
        });
    });
}

function resetTowerMenuIcons() {
    document.querySelectorAll('.towerOption').forEach((option) => {
        const towerIcon = option.querySelector('img');
        towerIcon.src = towerIcon.getAttribute('data-original-src'); 
    });
}


function changeMenuTowerIcon(selectedTowerIndex) {
    towerOption = document.getElementById(`towerOption${selectedTowerIndex}`);
    const towerIcon = towerOption.querySelector('img');
    towerIcon.src = '../../images/pencil.png';
}



const towerStyles = [ 
    { towerBaseWidth: '60%', towerBaseTop: 0, towerBaseLet: '23%', frontAndBackLeft: '1%', backHeight: '11%', frontHeight: '13%', backBottom: '0%', frontBottom: '1%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLet: '23%', frontAndBackLeft: '0%',backHeight: '14%', frontHeight: '20%', backBottom: '5%', frontBottom: '10%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLet: '23%', frontAndBackLeft: '0%',backHeight: '13%', frontHeight: '22%', backBottom: '4%', frontBottom: '12%' },
    { towerBaseWidth: '56%' ,towerBaseTop: '10%', towerBaseLet: '26%',frontAndBackLeft: '4%',backHeight: '14%', frontHeight: '15%', backBottom: '0%', frontBottom: '0%' },

]


function previewTowerArea(menuLeft, menuTop, range, selectedTowerIndex) {
    const previewDiv = document.getElementById('previewContainer');  
    const previewArea = document.getElementById('previewArea');
    const towerBase = previewDiv.querySelector('.towerBase');
    const towerBack = previewDiv.querySelector('.towerBack');
    const towerFront = previewDiv.querySelector('.towerFront');
    const towerSticks = previewDiv.querySelector('.towerSticks'); 

    towerBack.style.display = 'none';
    towerFront.style.display = 'none';
    towerSticks.style.display = 'none';

    if (!previewDiv || !towerBase || (!towerBack && selectedTowerIndex !== 4) || (!towerFront && selectedTowerIndex !== 4) || (selectedTowerIndex === 4 && !towerSticks)) {
        console.error('No se encontraron elementos necesarios para la previsualización.');
        return;
    }

    // Establecer posición y tamaño del contenedor
    previewDiv.style.left = `${menuLeft}px`;
    previewDiv.style.top = `${menuTop}px`;

    previewDiv.style.display = 'block'; 

    
    previewArea.style.width = `${range * 2}px`; 
    previewArea.style.height = `${range * 2}px`;

    // Determinar la ruta en función del índice
    const towerPath = `../../images/towers/tower${selectedTowerIndex}`;

    // Cambiar las imágenes
    towerBase.style.backgroundImage = `url('${towerPath}/base.png')`;

    if (selectedTowerIndex !== 4) {
        towerBack.style.backgroundImage = `url('${towerPath}/back.png')`;
        towerFront.style.backgroundImage = `url('${towerPath}/front.png')`;
        towerBack.style.height = towerStyles[selectedTowerIndex - 1].backHeight; 
        towerFront.style.height = towerStyles[selectedTowerIndex - 1].frontHeight;

        towerBack.style.bottom = towerStyles[selectedTowerIndex - 1].backBottom;
        towerFront.style.bottom = towerStyles[selectedTowerIndex - 1].frontBottom;

        towerBack.style.left = towerStyles[selectedTowerIndex - 1].frontAndBackLeft;
        towerFront.style.left = towerStyles[selectedTowerIndex - 1].frontAndBackLeft;

        towerBack.style.display = 'block'; 
        towerFront.style.display = 'block';
    } else {

    
        towerSticks.style.display = 'block';
    }

    towerBase.style.top = towerStyles[selectedTowerIndex - 1].towerBaseTop;
    towerBase.style.left = towerStyles[selectedTowerIndex - 1].towerBaseLet;
    towerBase.style.width = towerStyles[selectedTowerIndex - 1].towerBaseWidth;
}

// Ocultar el menú si se arrastra o se hace zoom
function hideTowerMenuIfDraggedOrZoomed() {
    if (towerMenuVisible) {
        const menu = document.getElementById('towerMenu');
        menu.style.display = 'none';
        towerMenuVisible = false; // El menú ya no está visible

        const previewDiv = document.getElementById('previewContainer');
        if (previewDiv) {
            previewDiv.style.display = 'none'; // Ocultar la previsualización
        }
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
