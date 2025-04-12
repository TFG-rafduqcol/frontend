const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(window.location.search);

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


function previewTowerArea(menuLeft, menuTop, range, selectedTowerIndex) {

    const previewDiv = document.getElementById('previewContainer');  
    const previewArea = document.getElementById('previewArea');
    const towerBase = previewDiv.querySelector('.towerBase');
    const towerSticks = previewDiv.querySelector('.towerSticks'); 

    towerSticks.style.display = 'none';

    if (!previewDiv || !towerBase || (selectedTowerIndex === 4 && !towerSticks)) {
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

        const towerBack = previewDiv.querySelector('.towerBack');
        const towerFront = previewDiv.querySelector('.towerFront');

        applyTowerDesign(towerBack, towerFront, selectedTowerIndex, towerPath, towerStyles);

    
        towerBack.style.display = 'block'; 
        towerFront.style.display = 'block';
    } else {
        towerSticks.style.display = 'block';
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

                applyTowerDesign(towerBack, towerFront, towerNumber, towerPath, towerStyles);

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
        const previewDiv = document.getElementById('towerEditMenu');
        previewDiv.style.display = 'none'; 
        towerOptionMenuVisible = false;
        drawTowers(); 
    }
    else {
        console.error('Error al eliminar la torre:', response.statusText);
        alert('Hubo un problema al eliminar la torre. Inténtalo de nuevo.');
    }
}

