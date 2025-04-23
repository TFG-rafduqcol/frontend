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


const path = [
    { x: 160, y: 640 },
    { x: 160, y: 560 },
    { x: 250, y: 560 },
    { x: 250, y: 180 },
    { x: 800, y: 180 },

];

const images = [];
for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `../../images/enemies/golem/Golem_02_Walking_00${i}.png`;
    images.push(img);
}

let enemies = [ {
    x: path[0].x,  // posición inicial en x
    y: path[0].y,  // posición inicial en y
    speed: 2,  // velocidad del enemigo
    health: 100,  // salud inicial
    maxHealth: 100,  // salud máxima
    spriteFrame: 0,  // cuadro de la animación
    totalFrames: 4,  // cantidad total de cuadros en la animación
    frameTimer: 0,  // temporizador de los cuadros
    frameDelay: 5,  // retraso entre cuadros de la animación
    currentPoint: 0,  // punto actual del camino
    t: 0,  // factor de interpolación
    delay: 0,  // retraso para el movimiento
    isDead: false,  // estado del enemigo
}, 
// {
//     x: path[0].x,
//     y: path[0].y,
//     speed: 1,
//     health: 100, 
//     maxHealth: 100,
//     currentPoint: 0,
//     t: 0,
//     spriteFrame: 0,
//     totalFrames: images.length,
//     frameTimer: 0,
//     frameDelay: 10,
//     delay: 30

// }, 
// {
//     x: path[0].x,
//     y: path[0].y,
//     speed: 1.1,
//     health: 100, 
//     maxHealth: 100,
//     currentPoint: 0,
//     t: 0,
//     spriteFrame: 0,
//     totalFrames: images.length,
//     frameTimer: 0,
//     frameDelay: 10, 
//     delay: 60
// }, 
];



function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, offsetX, offsetY, mapImage.width * scale, mapImage.height * scale);
}

function drawZones() {
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; 
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; 

    towerZones.forEach((zone) => {
        const zoneX = zone.x * scale + offsetX;
        const zoneY = zone.y * scale + offsetY;
        const zoneW = zone.width * scale;
        const zoneH = zone.height * scale;

        ctx.fillRect(zoneX, zoneY, zoneW, zoneH);

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(zone.position, zoneX + zoneW / 2, zoneY + zoneH / 2);

        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    });
}

function drawPath() {
    ctx.beginPath();

    const startX = path[0].x * scale + offsetX;
    const startY = path[0].y * scale + offsetY;
    ctx.moveTo(startX, startY);

    for (let i = 1; i < path.length; i++) {
        const pointX = path[i].x * scale + offsetX;
        const pointY = path[i].y * scale + offsetY;
        ctx.lineTo(pointX, pointY);
    }

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    enemyCanvas.width = canvas.width;
    enemyCanvas.height = canvas.height;

    const scaleX = canvas.width / mapImage.width;
    const scaleY = canvas.height / mapImage.height;
    minZoom = Math.max(scaleX, scaleY);

    scale = minZoom;

    offsetX = (canvas.width - mapImage.width * scale) / 2;
    offsetY = (canvas.height - mapImage.height * scale) / 2;

    drawMap();
    drawZones(); 
    drawTowers();
    drawPath();
}

function limitScroll() {
    const mapWidth = mapImage.width * scale;
    const mapHeight = mapImage.height * scale;

    offsetX = Math.max(canvas.width - mapWidth, Math.min(offsetX, 0));
    offsetY = Math.max(canvas.height - mapHeight, Math.min(offsetY, 0));
}

function isInsideZone(x, y) {
    return towerZones.find(zone =>
        x >= (zone.x * scale + offsetX) && x <= (zone.x * scale + offsetX + zone.width * scale) &&
        y >= (zone.y * scale + offsetY) && y <= (zone.y * scale + offsetY + zone.height * scale) &&
        !zone.occupied
    );
}


function hideTowerMenuIfDraggedOrZoomed() {
    if (towerMenuVisible) {
        const menu = document.getElementById('towerMenu');
        menu.style.display = 'none';
        towerMenuVisible = false; 

        const previewDiv = document.getElementById('previewContainer');
        if (previewDiv) {
            previewDiv.style.display = 'none'; 
        }
        selectedTower = null; 
    }
    if (towerOptionMenuVisible) {
        const previewDiv = document.getElementById('towerEditMenu');
        previewDiv.style.display = 'none'; 
        towerOptionMenuVisible = false; 
    }
}

canvas.addEventListener('touchmove', () => {
    hideTowerMenuIfDraggedOrZoomed();
});

canvas.addEventListener('mousemove', () => {
    hideTowerMenuIfDraggedOrZoomed();
});

canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2) {
        hideTowerMenuIfDraggedOrZoomed();
    }
});

canvas.addEventListener("click", showTowerMenu);

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
        drawZones();   
        drawTowers();  
        drawPath();
        

    } else if (event.touches.length === 2) {
        const currentDistance = Math.hypot(
            event.touches[0].clientX - event.touches[1].clientX,
            event.touches[0].clientY - event.touches[1].clientY
        );
        const zoomFactor = currentDistance / initialDistance;
        initialDistance = currentDistance;

        const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const mouseX = (centerX - offsetX) / scale;
        const mouseY = (centerY - offsetY) / scale;

        scale *= zoomFactor;
        if (scale > maxZoom) scale = maxZoom;
        if (scale < minZoom) scale = minZoom;

        offsetX = centerX - mouseX * scale;
        offsetY = centerY - mouseY * scale;

        limitScroll();
        drawMap();
        drawZones();   
        drawTowers();  
        drawPath();
    }
});

function gameLoop() {



    drawMap();
    drawZones();
    drawPath(); 
    drawEnemies();
    
    checkAreasWithEnemies();
    updateProjectiles();
    drawProjectiles();

    updateImpactParticles();
    drawImpactParticles();

    requestAnimationFrame(gameLoop);
}


window.addEventListener('resize', resizeCanvas);


canvas.addEventListener('touchend', () => {
    isDragging = false;
});

mapImage.onload = () => {
    resizeCanvas();
    gameLoop(); 
};
