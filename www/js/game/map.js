const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(window.location.search);

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
    { position: 1, x: 775, y: 580, width: 50, height: 50, occupied: false },
    { position: 2, x: 520, y: 580, width: 50, height: 50, occupied: false },
    { position: 3, x: 262, y: 420, width: 50, height: 50, occupied: false },
    { position: 4, x: 262, y: 132, width: 50, height: 50, occupied: false },
    { position: 5, x: 582, y: 132, width: 50, height: 50, occupied: false },
    { position: 6, x: 647, y: 260, width: 50, height: 50, occupied: false },
    { position: 7, x: 870, y: 70, width: 50, height: 50, occupied: false },
];


const towerProperties = {
    stoneCannon: { cost: 100, damage: 10, fire_rate: 3, range: 40, projectile_type: 'stone' },
    ironCannon: { cost: 125,  damage: 12, fire_rate: 2.5, range: 50, projectile_type: 'iron' },
    inferno: { cost: 150,  damage: 15, fire_rate: 4, range: 60, projectile_type: 'fire' },
    mortar: { cost: 120,  damage: 15, fire_rate: 4, range: 70, projectile_type: 'rock' },
};

const towerStyles = [ 
    { towerBaseWidth: '60%', towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '1%', backHeight: '11%', frontHeight: '13%', backBottom: '0%', frontBottom: '1%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '0%',backHeight: '14%', frontHeight: '20%', backBottom: '5%', frontBottom: '10%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '0%',backHeight: '13%', frontHeight: '22%', backBottom: '4%', frontBottom: '12%' },
    { towerBaseWidth: '56%' ,towerBaseTop: '10%', towerBaseLeft: '26%',frontAndBackLeft: '4%',backHeight: '14%', frontHeight: '15%', backBottom: '0%', frontBottom: '0%' },
]

const towerImages = {
    1: "../../images/towers/tower1/base.png",
    2: "../../images/towers/tower2/base.png",
    3: "../../images/towers/tower3/base.png",
    4: "../../images/towers/tower4/base.png",
};

let towersDeployed = [];



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
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Verde semitransparente (ligeramente visible)
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Color para las zonas

    towerZones.forEach((zone) => {
        const zoneX = zone.x * scale + offsetX;
        const zoneY = zone.y * scale + offsetY;
        const zoneW = zone.width * scale;
        const zoneH = zone.height * scale;

        // Dibujar la zona
        ctx.fillRect(zoneX, zoneY, zoneW, zoneH);

        // Dibujar el índice en el centro de la zona
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(zone.position, zoneX + zoneW / 2, zoneY + zoneH / 2);

        // Restaurar color para la siguiente zona
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
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
let currentZone = null;
let lastMenuLeft = 0;
let lastMenuTop = 0;

function towerOptionClickHandler(event) {
    const option = event.currentTarget;
    const index = parseInt(option.getAttribute('data-index'), 10);
    const towerNames = ['stoneCannon', 'ironCannon', 'inferno', 'mortar'];
    const clickedTower = towerNames[index];

    if (selectedTower === clickedTower) {
        deployTower(clickedTower, currentZone.position);
        return;
    }

    selectedTower = clickedTower;
    previewTowerArea(lastMenuLeft, lastMenuTop, towerProperties[selectedTower].range, index + 1);
    resetTowerMenuIcons();
    changeMenuTowerIcon(index + 1);
}



// Mostrar el menú de la torre
function showTowerMenu(event) {

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const zone = isInsideZone(clickX, clickY);

    if (!zone) return;

    currentZone = zone;
    const menu = document.getElementById('towerMenu');

    const menuLeft = (zone.x + zone.width / 2) * scale + offsetX;
    const menuTop = (zone.y + zone.height / 2) * scale + offsetY;
 
    lastMenuLeft = menuLeft;
    lastMenuTop = menuTop;

    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${menuTop}px`;
    menu.style.display = 'block';

    towerMenuVisible = true;
    resetTowerMenuIcons();

    document.querySelectorAll('.towerOption').forEach((option, index) => {
        option.removeEventListener('click', towerOptionClickHandler);
        option.setAttribute('data-index', index);
        option.addEventListener('click', towerOptionClickHandler);
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
    towerIcon.src = '../../images/tick.jpeg';
}

function changeDeleteTowerIcon() {
    const deleteTowerImg = document.getElementById('deleteTower');
    const deleteIcon = deleteTowerImg.querySelector('img');
    deleteIcon.src = '../../images/tick.jpeg';
}

function resetDeleteTowerIcon() {   
    const deleteTowerImg = document.getElementById('deleteTower');
    const deleteIcon = deleteTowerImg.querySelector('img');
    deleteIcon.src = deleteIcon.getAttribute('data-original-src');
    deleteClickedOnce = false;
    deleteClickHandler = null;
}



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

    previewDiv.style.left = `${menuLeft}px`;
    previewDiv.style.top = `${menuTop}px`;
    previewDiv.style.display = 'block'; 

    previewArea.style.width = `${range * 2}px`; 
    previewArea.style.height = `${range * 2}px`;

    const towerPath = `../../images/towers/tower${selectedTowerIndex}`;
    towerBase.style.backgroundImage = `url('${towerPath}/base.png')`;

    towerBase.style.top = towerStyles[selectedTowerIndex - 1].towerBaseTop;
    towerBase.style.left = towerStyles[selectedTowerIndex - 1].towerBaseLeft;
    towerBase.style.width = towerStyles[selectedTowerIndex - 1].towerBaseWidth;

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

}


async function deployTower(towerName, zonePosition) {
    selectedTower = null;
    const token = localStorage.getItem('token');
    const dataToSend = {
        gameId: params.get('gameId'),
        name: towerName,
        position: zonePosition
    };
    
    try {
        const response = await fetch(`${serverUrl}/api/towers/deployTower`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.statusText);
        }
        const previewDiv = document.getElementById('previewContainer');  
        if (previewDiv) {
            previewDiv.style.display = 'none';
        }

        const responseData = await response.json();

        const { gameId, projectileId, ...towerData } = responseData.tower;
        towersDeployed.push(towerData);
        console.log('Torre desplegada:', towersDeployed);

        const menu = document.getElementById('towerMenu');
        menu.style.display = 'none';
        towerMenuVisible = false;

        drawTowers(); 

    } catch (error) {
        console.error('Error al desplegar la torre:', error);
        alert('Hubo un problema al desplegar la torre. Inténtalo de nuevo.');
    }
}

function drawTowers() {

    document.querySelectorAll('.tower').forEach(tower => tower.remove());
    towersDeployed.forEach(tower => {
        const zone = towerZones.find(z => z.position === tower.position);

        if (zone) {
            
            const zoneCenterX = (zone.x + zone.width / 2) * scale + offsetX;
            const zoneCenterY = (zone.y + zone.height / 2) * scale + offsetY;

            const menuLeft = zoneCenterX;
            const menuTop = zoneCenterY;

            const towerDiv = document.createElement('div');
            towerDiv.className = 'tower';
            towerDiv.style.left = `${menuLeft}px`;
            towerDiv.style.top = `${menuTop}px`;

            const towerBase = document.createElement('div');
            towerBase.className = 'towerBase';

            const towerNumbers = {
                stoneCannon: 1,
                ironCannon: 2,
                inferno: 3,
                mortar: 4
            };

            const towerNumber = towerNumbers[tower.name] || 1;
            const towerPath = `../../images/towers/tower${towerNumber}`;

            towerBase.style.backgroundImage = `url('${towerPath}/base.png')`;
            towerBase.style.top = towerStyles[towerNumber - 1].towerBaseTop;

            towerBase.style.left = towerStyles[towerNumber - 1].towerBaseLeft;
            towerBase.style.width = towerStyles[towerNumber - 1].towerBaseWidth;

            if (towerNumber !== 4) {

                const towerBack = document.createElement('div');
                towerBack.className = 'towerBack';
    
                const towerFront = document.createElement('div');
                towerFront.className = 'towerFront';

                towerBack.style.backgroundImage = `url('${towerPath}/back.png')`;
                towerFront.style.backgroundImage = `url('${towerPath}/front.png')`;

                towerBack.style.height = towerStyles[towerNumber - 1].backHeight;
                towerFront.style.height = towerStyles[towerNumber - 1].frontHeight;

                towerBack.style.bottom = towerStyles[towerNumber - 1].backBottom;
                towerFront.style.bottom = towerStyles[towerNumber - 1].frontBottom;

                towerBack.style.left = towerStyles[towerNumber - 1].frontAndBackLeft;
                towerFront.style.left = towerStyles[towerNumber - 1].frontAndBackLeft;

                towerDiv.appendChild(towerBack);
                towerDiv.appendChild(towerFront);
            } else {
                const towerSticks = document.createElement('div');
                towerSticks.className = 'towerSticks';
                towerSticks.style.display = 'block';

                const towerStick1 = document.createElement('div');
                towerStick1.className = 'towerStick1';
                towerStick1.style.backgroundImage = `url('${towerPath}/stick.png')`;

                const towerStick2 = document.createElement('div');
                towerStick2.className = 'towerStick2';
                towerStick2.style.backgroundImage = `url('${towerPath}/stick.png')`;


                towerSticks.appendChild(towerStick1);
                towerSticks.appendChild(towerStick2);
                towerDiv.appendChild(towerSticks);
            }

            towerDiv.appendChild(towerBase);
            document.getElementById("gameCanvasContainer").appendChild(towerDiv);

            towerDiv.addEventListener('click', (event) => {
                previewEditMenuArea(menuLeft, menuTop, tower.name, tower.position, event);
            event.stopPropagation(); 
            });
        }
    });
}


let towerOptionMenuVisible = false;
let deleteClickHandler = null;
let deleteClickedOnce = false;

function previewEditMenuArea(menuLeft, menuTop, towerName, zonePosition) {
    console.log('Entrando a previewEditMenuArea');
    const towerDiv = document.getElementById('towerEditMenu');
    const towerAreaDiv = document.getElementById('towerArea');

    const deleteTowerDiv = document.getElementById('deleteTower');
    const upgradeTowerDiv = document.getElementById('upgradeTower');

    if (!towerDiv || !deleteTowerDiv || !upgradeTowerDiv) {
        console.error('No se encontraron elementos necesarios para la previsualización.');
        return;
    }

    towerDiv.style.left = `${menuLeft}px`;
    towerDiv.style.top = `${menuTop}px`;
    towerDiv.style.display = 'block';

    towerOptionMenuVisible = true;
    range = towerProperties[towerName].range;

    towerAreaDiv.style.width = `${range * 2}px`; 
    towerAreaDiv.style.height = `${range * 2}px`;
    towerAreaDiv.style.zIndex = 999;


    if (deleteClickHandler) {
        deleteTowerDiv.removeEventListener('click', deleteClickHandler);
    }

    // Reset estado
    deleteClickedOnce = false;
    resetDeleteTowerIcon();
    deleteClickHandler = function () {
        if (!deleteClickedOnce) {
            deleteClickedOnce = true;
            changeDeleteTowerIcon();
        } else {
            deleteTower(zonePosition);
        }
    };

    deleteTowerDiv.addEventListener('click', deleteClickHandler);
}
    
async function deleteTower(zonePosition) {
    const token = localStorage.getItem('token');
    const towerId= towersDeployed.find(tower => tower.position === zonePosition).id;
    const response = await fetch(`${serverUrl}/api/towers/deleteTower/${towerId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (response.ok) {
        towersDeployed = towersDeployed.filter(tower => tower.position !== zonePosition);
        const zone = towerZones.find(z => z.position === zonePosition);
        if (zone) {
            zone.occupied = false;
        }
        drawTowers(); 
    }
    else {
        console.error('Error al eliminar la torre:', response.statusText);
        alert('Hubo un problema al eliminar la torre. Inténtalo de nuevo.');
    }
}
       


// Ocultar el menú si se arrastra o se hace zoom
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


// Evento de clic en el canvas
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
        drawZones();   // Redibuja zonas
        drawTowers();  // Redibuja torres
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
        drawZones();   // Redibuja zonas
        drawTowers();  // Redibuja torres
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
    drawTowers(); // Dibujar las torres después de cargar la imagen
};

// Ajustar el canvas al cambiar el tamaño de la pantalla
window.addEventListener('resize', resizeCanvas);
