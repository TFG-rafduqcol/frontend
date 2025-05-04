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
    { x: 160, y: 740 },
    { x: 160, y: 600 },
    { x: 260, y: 600 },
    { x: 260, y: 222 },
    { x: 820, y: 222 },

    { x: 820, y: 130 },
    { x: 860, y: 130 },
    { x: 860, y: 110 },
    { x: 1020, y: 110 },
    { x: 1020, y: 0 },

];

function loadEnemyImages(enemyName, frameCount) {
    const imgs = [];
    let loadedImagesCount = 0;

    for (let i = 1; i < frameCount; i++) {
        const img = new Image();

        img.src = `../../images/enemies/${enemyName}/walk_${i}.png`;

        img.onload = () => {
            loadedImagesCount++;
            if (loadedImagesCount === frameCount) {
                console.log('Todas las imágenes del enemigo están cargadas');
            }
        };

        imgs.push(img);
    }

    return imgs;
}



let enemies = [ 

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
    updateProjectiles();
    drawProjectiles();    
    drawEnemies(1);
    drawImpactParticles();
    drawSmokeParticles();
    drawPath();

}

function limitScroll() {
    const mapWidth = mapImage.width * scale;
    const mapHeight = mapImage.height * scale;

    offsetX = Math.max(canvas.width - mapWidth, Math.min(offsetX, 0));
    offsetY = Math.max(canvas.height - mapHeight, Math.min(offsetY, 0));
}

function isInsideZone(x, y, isOccupied) {
    return towerZones.find(zone =>
        x >= (zone.x * scale + offsetX) && x <= (zone.x * scale + offsetX + zone.width * scale) &&
        y >= (zone.y * scale + offsetY) && y <= (zone.y * scale + offsetY + zone.height * scale) &&
        zone.occupied === isOccupied
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
        resiveTowers();
        drawZones();   
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
        resiveTowers();
        drawZones();   
        drawPath();
    }
});


window.addEventListener('resize', resizeCanvas);


canvas.addEventListener('touchend', () => {
    isDragging = false;
});



let lastTime = 0;

function gameLoop(currentTime = 0) {
    const deltaTime = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;


    update();  
    render(deltaTime);  
    updateProjectiles(); 
    checkAreasWithEnemies(); 

    requestAnimationFrame(gameLoop);
}

function update() {
    updateProjectiles(); 
    updateImpactParticles();

}


function render(deltaTime) {
    enemyCtx.clearRect(0, 0, enemyCanvas.width, enemyCanvas.height);

    drawMap();
    drawZones(); 
    drawPath();
    drawEnemies(deltaTime); 
    drawProjectiles();
    drawImpactParticles();
    drawSmokeParticles();
}


mapImage.onload = () => {
    resizeCanvas(1); 
    gameLoop(); 
};
