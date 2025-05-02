const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(window.location.search);


const towerZones = [
    { position: 1, x: 230, y: 645, width: 50, height: 50, occupied: false },
    { position: 2, x: 325, y: 420, width: 50, height: 50, occupied: false },
    { position: 3, x: 165, y: 390, width: 50, height: 50, occupied: false },
    { position: 4, x: 262, y: 132, width: 50, height: 50, occupied: false },
    { position: 5, x: 582, y: 132, width: 50, height: 50, occupied: false },
    { position: 6, x: 647, y: 260, width: 50, height: 50, occupied: false },
    { position: 7, x: 870, y: 70, width: 50, height: 50, occupied: false },
];

const towerProperties = {
    stoneCannon: { cost: 90, fire_rate: 3, range: 140, projectile_type: 'stone' },
    ironCannon: { cost: 100,  fire_rate: 2.5, range: 120, projectile_type: 'iron' },
    inferno: { cost: 125,  fire_rate: 4, range: 120, projectile_type: 'fire' },
    mortar: { cost: 150,  fire_rate: 6, range: 110, projectile_type: 'rock' },
};

const towerStyles = [ 
    { towerBaseWidth: '60%', towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '1%', backHeight: '11%', frontHeight: '14%', backBottom: '-32%', frontBottom: '-31%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '0%',backHeight: '14%', frontHeight: '20%', backBottom: '-25%', frontBottom: '-20%' },
    { towerBaseWidth: '60%' ,towerBaseTop: 0, towerBaseLeft: '23%', frontAndBackLeft: '0%',backHeight: '13%', frontHeight: '22%', backBottom: '-20%', frontBottom: '-12%' },
    { towerBaseWidth: '56%' ,towerBaseTop: '10%', towerBaseLeft: '26%',frontAndBackLeft: '4%',backHeight: '14%', frontHeight: '15%', backBottom: '0%', frontBottom: '0%' },
]

const projectileStyles = [
    { left: '42%', bottom: '27%', width: '17%', 'z-index': '1003' }, 
    { left: '41%', bottom: '30%',width: '20%', 'z-index': '1000'  }, 
    { left: '42%', bottom: '31%', width: '19%', 'z-index': '1000'  }, 
    { left: '28%', bottom: '58%', width: '46%', 'z-index': '1000'  }, 

]

const towerImages = {
    1: "../../images/towers/tower1/base.png",
    2: "../../images/towers/tower2/base.png",
    3: "../../images/towers/tower3/base.png",
    4: "../../images/towers/tower4/base.png",
};

let towersDeployed = [];

let towersArea = [];

const projectiles = [];

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


function showTowerMenu(event) {

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const zone = isInsideZone(clickX, clickY, false);

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
    const towerBack = previewDiv.querySelector('.towerBack');
    const towerFront = previewDiv.querySelector('.towerFront');
    const towerSticks = previewDiv.querySelector('.towerSticks'); 
    const towerProjectile = previewDiv.querySelector('.towerProjectile');

    towerSticks.style.display = 'none';
    towerFront.style.display = 'none';
    towerBack.style.display = 'none';
    towerProjectile.style.display = 'none';

    if (!previewDiv || !towerBase || !towerProjectile || (selectedTowerIndex === 4 && !towerSticks)) {
        console.error('No se encontraron elementos necesarios para la previsualización.');
        return;
    }

    previewDiv.style.left = `${menuLeft}px`;
    previewDiv.style.top = `${menuTop}px`;
    previewDiv.style.display = 'block'; 

    previewArea.style.width = `${range}px`; 
    previewArea.style.height = `${range}px`;

    const towerPath = `../../images/towers/tower${selectedTowerIndex}`;
    towerBase.style.backgroundImage = `url('${towerPath}/base.png')`;

    towerBase.style.top = towerStyles[selectedTowerIndex - 1].towerBaseTop;
    towerBase.style.left = towerStyles[selectedTowerIndex - 1].towerBaseLeft;
    towerBase.style.width = towerStyles[selectedTowerIndex - 1].towerBaseWidth;

    projectileDesign(towerProjectile, projectileStyles, selectedTowerIndex);

    if (selectedTowerIndex !== 4) {
        applyTowerDesign(towerBack, towerFront, selectedTowerIndex, towerPath, towerStyles);
        towerBack.style.display = 'block'; 
        towerFront.style.display = 'block';
        towerProjectile.style.animation = 'moveProjectile 2s infinite alternate';
    } else {
        towerSticks.style.display = 'block';
        towerProjectile.style.animation = 'moveMorterProjectile 2s infinite alternate';
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
            towerDiv.id = `tower${zone.position}`;
            towerDiv.style.left = `${menuLeft}px`;
            towerDiv.style.top = `${menuTop}px`;

            const towerBase = document.createElement('div');
            towerBase.className = 'towerBase';

            const towerProjectile = document.createElement('div');
            towerProjectile.className = 'towerProjectile';

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

            projectileDesign(towerProjectile, projectileStyles, towerNumber);

            if (towerNumber !== 4) {

                const towerBack = document.createElement('div');
                towerBack.className = 'towerBack';
                towerBack.style.animationPlayState = 'paused';
    
                const towerFront = document.createElement('div');
                towerFront.className = 'towerFront';
                towerFront.style.animationPlayState = 'paused';

                applyTowerDesign(towerBack, towerFront, towerNumber, towerPath, towerStyles);

                towerProjectile.style.animation = 'moveProjectile 2s infinite alternate';
                towerProjectile.style.animationPlayState = 'paused';

                towerDiv.appendChild(towerBack);
                towerDiv.appendChild(towerFront);
            } else {
                const towerSticks = document.createElement('div');
                towerSticks.className = 'towerSticks';
                towerSticks.style.display = 'block';
                towerSticks.style.animationPlayState = 'paused';

                const towerStick1 = document.createElement('div');
                towerStick1.className = 'towerStick1';
                towerStick1.style.backgroundImage = `url('${towerPath}/stick.png')`;
                towerStick1.style.animationPlayState = 'paused';


                const towerStick2 = document.createElement('div');
                towerStick2.className = 'towerStick2';
                towerStick2.style.backgroundImage = `url('${towerPath}/stick.png')`;
                towerStick2.style.animationPlayState = 'paused';

                towerProjectile.style.animation = 'moveMorterProjectile 2s infinite alternate';
                towerProjectile.style.animationPlayState = 'paused';

                towerSticks.appendChild(towerStick1);
                towerSticks.appendChild(towerStick2);
                towerDiv.appendChild(towerSticks);
            }
            towerDiv.appendChild(towerBase);
            towerDiv.appendChild(towerProjectile);
            document.getElementById("gameCanvasContainer").appendChild(towerDiv);

            towerDiv.addEventListener('click', function (event) {
                previewEditMenuArea(event, tower.name, tower.position);
            event.stopPropagation(); 
            });
        }
    });
}


let towerOptionMenuVisible = false;
let deleteClickHandler = null;
let deleteClickedOnce = false;

function previewEditMenuArea(event, towerName, zonePosition) {
    const towerDiv = document.getElementById('towerEditMenu');
    const towerAreaDiv = document.getElementById('towerArea');
    

    const deleteTowerDiv = document.getElementById('deleteTower');
    const upgradeTowerDiv = document.getElementById('upgradeTower');

    if (!towerDiv || !deleteTowerDiv || !upgradeTowerDiv) {
        console.error('No se encontraron elementos necesarios para la previsualización.');
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const editTower = isInsideZone(clickX, clickY, true);

    if (!editTower) return;
    
    const editMenuLeft = (editTower.x + editTower.width / 2) * scale + offsetX;
    const editMenuTop = (editTower.y + editTower.height / 2) * scale + offsetY;


    towerDiv.style.left = `${editMenuLeft}px`;
    towerDiv.style.top = `${editMenuTop}px`;
    towerDiv.style.display = 'block';

    towerOptionMenuVisible = true;
    range = towerProperties[towerName].range;

    towerAreaDiv.style.width = `${range}px`; 
    towerAreaDiv.style.height = `${range}px`;
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

        const zone = towerZones.find(z => z.position === zonePosition);
        if (zone) {
            zone.occupied = true;
        }
        
        const towerNumber = {
            stoneCannon: 1,
            ironCannon: 2,
            inferno: 3,
            mortar: 4
        }[towerName] || 1;


        towersArea.push({
            position: zonePosition,
            range: towerProperties[towerName].range,
            x: zone.x,
            y: zone.y,
            damage: towerData.damage,
            towerId: towerData.id,
            isMorter: towerName === 'mortar',
            towerNumber: towerNumber,
            hasActiveProjectile: false,
            animationInProgress: false,
        });

        console.log('Torre desplegada en TowerArea:', towersArea);

        const menu = document.getElementById('towerMenu');
        menu.style.display = 'none';
        towerMenuVisible = false;

        drawTowers(); 

        updateGame(false, -towerProperties[towerName].cost, undefined)


    } catch (error) {
        console.error('Error al desplegar la torre:', error);
        alert('Hubo un problema al desplegar la torre. Inténtalo de nuevo.');
    }
}


function resiveTowers() {
    towersArea.forEach(state => {

        const zone = towerZones.find(z => z.position === state.position);
        const menuLeft = (zone.x + zone.width / 2) * scale + offsetX;
        const menuTop = (zone.y + zone.height / 2) * scale + offsetY;

        const towerDiv = document.getElementById(`tower${state.position}`);
        towerDiv.style.left = `${menuLeft}px`;
        towerDiv.style.top = `${menuTop}px`;
    });
}

async function deleteTower(zonePosition) {
    const token = localStorage.getItem('token');
    const towerDeployed = towersDeployed.find(tower => tower.position === zonePosition);
    const towerId = towerDeployed.id;
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

        updateGame(false, towerProperties[towerDeployed.name].cost / 2, undefined);
        drawTowers(); 
    }
    else {
        console.error('Error al eliminar la torre:', response.statusText);
        alert('Hubo un problema al eliminar la torre. Inténtalo de nuevo.');
    }
}

async function updateGame(newRound, towerPrice, minusLives) {
    const token = localStorage.getItem('token');
    const gameId = params.get('gameId');

    if (minusLives !== undefined) {
        lives -= minusLives;
        const livesElement = document.getElementById('lives');
        if (livesElement) {
            livesElement.textContent = `${lives}`;
        }
    }


    try {
        const response = await fetch(`${serverUrl}/api/games/updateGame/${gameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                round: newRound ? round + 1 : undefined,
                gold: gold + towerPrice, 
                lives: minusLives !== undefined ? lives - minusLives : undefined
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating game:', errorData);
            return;
        }

        const updatedGame = await response.json();
        console.log('Game updated successfully:', updatedGame);

        const goldElement = document.getElementById('gold');
        gold = updatedGame.gold;
        if (goldElement) {
            goldElement.textContent = `${updatedGame.gold}`; 
        }

        const roundElement = document.getElementById('round');
        round = updatedGame.round;
        if (roundElement) {
            roundElement.textContent = `${updatedGame.round}`; 
        }
        
        return updatedGame;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
