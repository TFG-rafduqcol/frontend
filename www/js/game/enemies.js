function initBlockingOverlay() {
    let blockingOverlay = document.getElementById('blocking-overlay');
    if (!blockingOverlay) {
        blockingOverlay = document.createElement('div');
        blockingOverlay.id = 'blocking-overlay';
        document.body.appendChild(blockingOverlay);
        
        blockingOverlay.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        blockingOverlay.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        blockingOverlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        blockingOverlay.style.display = 'none';
    }
    return blockingOverlay;
}

document.addEventListener('DOMContentLoaded', initBlockingOverlay);

const enemyCanvas = document.getElementById("enemyCanvas");

document.getElementById('generateEnemyButton').addEventListener('click', generateHorde);
const enemyCtx = enemyCanvas.getContext("2d");

document.getElementById('generateEnemyButton').addEventListener('click', generateHorde);


const enemy_props = [
    { name: "daggerkin", width: 35, height: 35, speed: 30, maxHealth: 40, totalFrames: 20, offsetX: -12, offsetY: -35, healthBarHeight: 40, lifes: 1, gold: 10 }, // Básico, neutro ante todo
    { name: "orcutter", width: 50, height: 50, speed: 15, maxHealth: 60, totalFrames: 20, offsetX: -15, offsetY: -45, healthBarHeight: 50, lifes: 1, gold: 12 }, // "Padre" de daggerkin, neutro ante todo
    { name: "oculom", width: 45, height: 45, speed: 25, maxHealth: 40, totalFrames: 18, offsetX: -25, offsetY: -20, healthBarHeight: 40, lifes: 1, gold: 10 }, // Primer enemigo volador no le afecta el mortero (4)
    { name: "devilOrc", width: 54, height: 54, speed: 12, maxHealth: 90, totalFrames: 20, offsetX: -15, offsetY: -45, healthBarHeight: 50, lifes: 1, gold: 15 }, // Débil ante el fuego (3), fuerte contra hierro (1) y piedra (2) 
    { name: "graySkull", width: 75, height: 75, speed: 8, maxHealth: 140, totalFrames: 20, offsetX: -22, offsetY: -70, healthBarHeight: 65, healthBarX: -2, lifes: 3, gold: 25 }, // Débil contra el mortero (4)
    { name: "carrionTropper", width: 45, height: 45, speed: 14, maxHealth: 90, totalFrames: 20, offsetX: -15, offsetY: -35, healthBarHeight: 45, lifes: 2, gold: 20 }, // Débil fuego (3), fuerte contra el resto (1,2,4)
    { name: "hellBat", width: 60, height: 60, speed: 17, maxHealth: 90, totalFrames: 18, offsetX: -35, offsetY: -40, healthBarHeight: 47, lifes: 2, gold: 15 }, // Segundo enemigo volador, no le afecta el mortero (4)
    { name: "hexLord", width: 50, height: 50, speed: 17, maxHealth: 90, totalFrames: 20, offsetX: -15, offsetY: -40, healthBarHeight: 50, lifes: 4, gold: 20 }, // Neutro ante todo
    { name: "darkSeer", width: 70, height: 70, speed: 10, maxHealth: 140, totalFrames: 20, offsetX: -30, offsetY: -65, healthBarHeight: 65, healthBarX: -4, lifes: 5, gold: 30 } // Fuerte contra TODO (1,2,3,4)
];


function showLoadingPopup() {
    let popup = document.getElementById('loading-popup');
    if (!popup) return; 
    const lang = localStorage.getItem('language') || 'en';
    let msg = 'Generating new horde...';
    if (lang === 'es') msg = 'Generando nueva horda...';
    popup.textContent = msg;
    popup.style.display = 'block';
}

function hideLoadingPopup() {
    const popup = document.getElementById('loading-popup');
    if (popup) popup.style.display = 'none';
}

async function generateHorde() {
    let blockingOverlay = document.getElementById('blocking-overlay');
    if (!blockingOverlay) {
        blockingOverlay = document.createElement('div');
        blockingOverlay.id = 'blocking-overlay';
        
        blockingOverlay.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        blockingOverlay.addEventListener('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        blockingOverlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        document.body.appendChild(blockingOverlay);
    }
      blockingOverlay.style.display = 'block';
    
    document.body.classList.add('no-scroll');
    
    if (typeof window.centerMapOnCoordinates === 'function') {
        window.centerMapOnCoordinates(460, 370);
    } else if (typeof window.centerMapOnPoint === 'function') {
        window.centerMapOnPoint(2);
    }
    
    canvas.removeEventListener("click", showTowerMenu);
    
    const roundElement = document.getElementById('round');
        
    const generateButton = document.getElementById('generateEnemyButton');
    generateButton.disabled = true;
    generateButton.style.display = 'none';


    canvas.removeEventListener("click", showTowerMenu);

    const toweEditMenu = document.getElementById('towerEditMenu');
    if (toweEditMenu) {
        toweEditMenu.style.pointerEvents = 'none';
    }

    towerEditMenu.style.display = 'none';

    const towersDivs = document.querySelectorAll('.tower');

    towersDivs.forEach(towerDiv => {
        towerDiv.addEventListener('click', towerClickHandler);
    });

    towersDivs.forEach(towerDiv => {
        towerDiv.removeEventListener('click', towerClickHandler);
    });



    if (roundElement.textContent === '0'){

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${serverUrl}/api/hordes/generateHorde/${gameId}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    earnedGold: 0,
                    lostedLives: 0, 
                    enemiesKilled: 0
                })
            });
        
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate horde');
            }
        
            const data = await response.json();
            console.log('Horde generated:', data);
        
            const enemiesData = data.enemies;
        
            for (let index = 0; index < enemiesData.length; index++) {
                const enemy = enemiesData[index];
                const baseProps = enemy_props.find(e => e.name === enemy.name);

                console.log('Enemy data:', enemy);
        
                const newEnemy = {
                name: enemy.name,
                x: path[0].x,
                y: path[0].y,
                xOffset: baseProps.offsetX,
                yOffset: baseProps.offsetY,
                healthBarHeight: baseProps.healthBarHeight || 0,
                healthBarX: baseProps.healthBarX || 0,
                width: baseProps.width,
                height: baseProps.height,
                speed: baseProps.speed,
                lifes: baseProps.lifes,
                gold: baseProps.gold,
                health: enemy.health,
                maxHealth: enemy.health,
                spawnTime: enemy.spawnTime,
                spriteFrame: 0,
                totalFrames: baseProps.totalFrames,
                frameTimer: 0,
                frameDelay: 5,
                currentPoint: 0,
                t: 0,
                delay: 0,
                loggedZoneEntry: false,
                isDead: false,
                deathTimer: 60,
                opacity: 1,
                spriteImages: []
                };
        
                newEnemy.spriteImages = loadEnemyImages(newEnemy.name, newEnemy.totalFrames);
        
                await new Promise(resolve => {
                setTimeout(() => {
                    enemies.push(newEnemy);
                    resolve();
                }, 1500);
                });
            }
        } catch (err) {
        console.error('Error generating horde:', err.message);
        }
    } else { 
        
        if (!nextHorde || nextHorde.length === 0) {
            console.warn('No hay horda preparada. Llamando a prepareNextHorde...');
            isHordePrepared = false;
            await prepareNextHorde();
            return;
        }
        isHordePrepared = false; 
        console.log(nextHorde);
    
        for (let i = 0; i < nextHorde.length; i++) {
            const enemy = nextHorde[i];
            enemies.push(enemy);
            console.log(`Enemigo añadido: ${enemy.name}`, enemy);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        nextHorde = []; 
        const generateButton = document.getElementById('generateEnemyButton');
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.style.display = 'flex';
        }
    }
    round++;
    if (roundElement) {
        roundElement.textContent = `${round}`;
        roundElement.offsetHeight;
    } 

  }
  
function towerClickHandler(event) {
    const towerDiv = event.currentTarget;
    const name = towerDiv.dataset.name;
    const position = towerDiv.dataset.position;

    previewEditMenuArea(event, name, position);
    event.stopPropagation();
}


function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  

function moveEnemy(enemy, deltaTime) {
    if (enemy.delay > 0 || enemy.isDead) {  // Si el enemigo tiene un retraso o está muerto, no se mueve
        return;
    }

    const currentTarget = path[enemy.currentPoint];  // Punto actual al que se dirige el enemigo
    const nextTarget = path[enemy.currentPoint + 1]; 

    if (!nextTarget) return;

    const dx = nextTarget.x - currentTarget.x;
    const dy = nextTarget.y - currentTarget.y;
    const distance = Math.sqrt(dx * dx + dy * dy);  // Distancia entre el punto actual y el siguiente

    const directionX = dx / distance;       // Dirección en X normalizada 
    const directionY = dy / distance;       // Dirección en Y normalizada

    const speed = enemy.speed * deltaTime; // Distancia recorrida por fotograma

    enemy.x += directionX * speed;
    enemy.y += directionY * speed;


    const progress = Math.sqrt(                 // Progreso del enemigo hacia el siguiente punto 
        Math.pow(enemy.x - currentTarget.x, 2) +
        Math.pow(enemy.y - currentTarget.y, 2));

    if (progress >= distance) {     
        enemy.currentPoint++;
        enemy.x = nextTarget.x;
        enemy.y = nextTarget.y;

        if (enemy.currentPoint >= path.length - 1) {  // El enemigo ha llegado al final del camino, restamos vidas 
            const index = enemies.indexOf(enemy);
            console.log("Salud final del enemigo " +  enemy.name + " : " + enemy.health);
            if (index > -1) enemies.splice(index, 1);

            updateGame(false, 0, enemy.lifes);

            const gameCanvasContainer = document.getElementById('gameCanvasContainer');
            gameCanvasContainer.classList.add('red-border');
            
            setTimeout(() => {                      // Animación de "muerte"
                gameCanvasContainer.classList.remove('red-border');
            }, 300); 
        }
        checkEnemiesAndEnableButtons();   // Comprobamos si quedan enemigos y preparamos la siguiente horda
    }
}


function updateAnimation(enemy) {
    if (enemy.isDead) {       // Si el enemigo está muerto, llamamos a la animación de muerte
        updateDeathAnimation(enemy); 
        return;  
    }
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameDelay) {   // Si ha pasado el tiempo de espera, cambiamos el sprite
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.spriteImages.length;;
        enemy.frameTimer = 0;
    }
}

// Dibuja los enemigos en el canvas con sus respectivas posiciones y animaciones
function drawEnemies(deltaTime) {
    enemyCtx.clearRect(0, 0, enemyCanvas.width, enemyCanvas.height);

    enemies.forEach((enemy) => {
        moveEnemy(enemy, deltaTime); 
        
        if (enemy.currentPoint < path.length) { 
            updateAnimation(enemy);  
            drawSprite(enemy.x * scale + offsetX, enemy.y * scale + offsetY, enemy); // Dibuja el sprite del enemigo en la posición correcta
            drawHealthBar(enemy); 
        }
    });
}

function drawSprite(x, y, enemy) {

    const imageWidth = enemy.width;
    const imageHeight = enemy.height;

    const xCorrected = x + enemy.xOffset;
    const yCorrected = y + enemy.yOffset;

    const currentImage = enemy.spriteImages[enemy.spriteFrame];

    enemyCtx.globalAlpha = enemy.opacity;
    enemyCtx.drawImage(currentImage, xCorrected, yCorrected, imageWidth, imageHeight);
    enemyCtx.globalAlpha = 1;
}

function drawHealthBar(enemy) {
    if (!enemy.isDead) {
        const barWidth = 40;
        const barHeight = 6;
        const x = enemy.x * scale + offsetX - barWidth / 2 + enemy.healthBarX;
        const y = enemy.y * scale + offsetY - enemy.healthBarHeight; 

        enemyCtx.fillStyle = "red";
        enemyCtx.fillRect(x, y, barWidth, barHeight);

        const healthRatio = enemy.health / enemy.maxHealth;
        enemyCtx.fillStyle = "limegreen";
        enemyCtx.fillRect(x, y, barWidth * healthRatio, barHeight);

        enemyCtx.strokeStyle = "black";
        enemyCtx.strokeRect(x , y, barWidth, barHeight);
    }   
}


const areaMovementSounds = {};

function checkAreasWithEnemies() {
    towersArea.forEach(area => {       // Añadimos el sonido de animación de disparo a cada torre
        if (!areaMovementSounds[area.position]) {
            areaMovementSounds[area.position] = new Audio("../../audio/movement.mp3");
            areaMovementSounds[area.position].volume = 1;
        }
        const movementSound = areaMovementSounds[area.position];

        const enemyInArea = enemies.find(enemy => {    // Detecta los enemigos como en el backend
            if (enemy.isDead) return false; 

            const flyingEnemies = ['oculom', 'hellBat'];
            if (area.isMorter && flyingEnemies.includes(enemy.name)) return false;

            const towerX = area.x * scale + offsetX;
            const towerY = area.y * scale + offsetY;
            const enemyX = enemy.x * scale + offsetX;
            const enemyY = enemy.y * scale + offsetY;

            const scaledRange = area.range * scale; 
            const dx = enemyX - towerX;
            const dy = enemyY - towerY;

            return Math.hypot(dx, dy) <= scaledRange;
        });


        const towerDiv = document.getElementById(`tower${area.position}`);
        if (!towerDiv) return; 
        const towerProjectile = towerDiv.querySelector('.towerProjectile');
        const towerBack = towerDiv.querySelector('.towerBack');
        const towerFront = towerDiv.querySelector('.towerFront');
        const towerSticks = towerDiv.querySelector('.towerSticks');
        const towerStick1 = towerDiv.querySelector('.towerStick1');
        const towerStick2 = towerDiv.querySelector('.towerStick2');

        function playSound() {
            if (movementSound.paused) {
                movementSound.currentTime = 0;
                movementSound.volume = 1; 
                movementSound.play();
            }
        }
        function stopSound() {
            if (!movementSound.paused) {
                movementSound.pause();
                movementSound.currentTime = 0; 
            }
        }
        
        if (enemyInArea  && !area.animationInProgress) {  // Si hay enemigos en el área y no hay una animación acabandose en curso
            if (!area.hasActiveProjectile) {            // Si la torre no tiene un proyectil activo (esta disparando)

                area.hasActiveProjectile = true;
                const projectileType = area.towerNumber;
                const duration = area.fireRate;
                playSound();
                // Creamos la animación de disparo
                if (!area.isMorter) {
                    [towerBack, towerFront, towerProjectile].forEach(el => restartAnimation(el, false, duration));
                    [towerBack, towerFront, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                } else {
                    [towerStick1, towerStick2, towerProjectile].forEach(el => restartAnimation(el, true, duration));
                    [towerStick1, towerStick2, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                }
                // Esperamos la mitad del tiempo de animación para ocultar el proyectil y crear el nuevo
                setTimeout(() => {
                    towerProjectile.style.display = 'none';
                    towerProjectile.style.animationPlayState = 'running';
                    createProjectile(area.towerId, enemyInArea, projectileType);
                }, duration / 2);

                setTimeout(() => {
                    towerProjectile.style.display = 'block';
                    stopSound();
                    area.hasActiveProjectile = false;
                  
                }, duration);
            } else {
                return;
            }
        } else {   // No quedan enemigos en el área y la animación se tiene que terminar
            if (area.hasActiveProjectile) area.animationInProgress = true;
            area.hasActiveProjectile = false;

            if (!area.isMorter) {
                towerDiv.addEventListener('animationiteration', () => {
                    towerBack.style.animationPlayState = 'paused';
                    towerFront.style.animationPlayState = 'paused';
                    towerProjectile.style.animationPlayState = 'paused';
                    stopSound();
                    area.animationInProgress = false; 
                }, { once: true });
                
            } else {
                towerSticks.addEventListener('animationiteration', () => {
                    towerStick1.style.animationPlayState = 'paused';
                    towerStick2.style.animationPlayState = 'paused';
                    towerProjectile.style.animationPlayState = 'paused';
                    stopSound();
                    area.animationInProgress = false; 

                }, { once: true });
                
            }
        }
    });
}

let gameEnded = false;
async function checkEnemiesAndEnableButtons() {

    const generateButton = document.getElementById('generateEnemyButton');
    const remainingEnemies = enemies.filter(enemy => !enemy.isDead);

    if (generateButton) {
        if (remainingEnemies.length > 0) {
            generateButton.style.display = 'none';
            generateButton.disabled = true;
        } else {
            generateButton.style.display = 'flex';
            generateButton.disabled = false;
        }
    }

    if (remainingEnemies.length === 0 && !gameEnded) {

        const blockingOverlay = document.getElementById('blocking-overlay');
            if (blockingOverlay) {
                blockingOverlay.style.display = 'none';
            }
          
            document.body.classList.remove('no-scroll');
            canvas.addEventListener("click", showTowerMenu);
            const towerDivs = document.querySelectorAll('.tower');
            towerDivs.forEach(towerDiv => {
                towerDiv.style.pointerEvents = 'auto';
            });
            const towersDivs = document.querySelectorAll('.tower');
            towersDivs.forEach(towerDiv => {
                towerDiv.addEventListener('click', function(event) {
                    const name = towerDiv.dataset.name;
                    const position = towerDiv.dataset.position;
                    previewEditMenuArea(event, name, position);
                    event.stopPropagation();
                });
            });
            const toweEditMenu = document.getElementById('towerEditMenu');
            if (toweEditMenu) {
                toweEditMenu.style.pointerEvents = 'auto';
            }

        if (!isHordePrepared) {
            await prepareNextHorde();
        }
    
    }
}

let nextHorde = []; 
let isHordePrepared = false;
async function prepareNextHorde () {
    showLoadingPopup();
    isHordePrepared = true;

    if (earnedGold > 0) {
            const goldElement = document.getElementById('gold');
            let goldText = goldElement.textContent;
            if (goldElement) {
                gold = Number(goldText) + earnedGold;
                goldText = gold.toString();
                goldElement.textContent = goldText;
            }
        }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${serverUrl}/api/hordes/generateHorde/${gameId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                earnedGold: earnedGold,
                lostedLives: lostedLives,
                enemiesKilled: enemiesKilled
            })
        }); 
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate horde');
      }

        earnedGold = 0;
        lostedLives = 0;
        enemiesKilled = 0;

        const data = await response.json();
        console.log('Horde generated:', data);

   
      const enemiesData = data.enemies;
  
      for (let index = 0; index < enemiesData.length; index++) {
        const enemy = enemiesData[index];
        const baseProps = enemy_props.find(e => e.name === enemy.name);

        console.log('Enemy data:', enemy);
  
        const newEnemy = {
            name: enemy.name,
            x: path[0].x,
            y: path[0].y,
            xOffset: baseProps.offsetX,
            yOffset: baseProps.offsetY,
            healthBarHeight: baseProps.healthBarHeight || 0,
            healthBarX: baseProps.healthBarX || 0,
            width: baseProps.width,
            height: baseProps.height,
            speed: baseProps.speed,
            lifes: baseProps.lifes,
            gold: baseProps.gold,
            health: enemy.health,
            maxHealth: enemy.health,
            spawnTime: enemy.spawnTime,
            spriteFrame: 0,
            totalFrames: baseProps.totalFrames,
            frameTimer: 0,
            frameDelay: 5,
            currentPoint: 0,
            t: 0,
            delay: 0,
            loggedZoneEntry: false,
            isDead: false,
            deathTimer: 60,
            opacity: 1,
            spriteImages: []
        };
  
        newEnemy.spriteImages = loadEnemyImages(newEnemy.name, newEnemy.totalFrames);
        nexHorde = [];

        await new Promise(resolve => {
            nextHorde.push(newEnemy);
            resolve();
        });
      }
        const generateButton = document.getElementById('generateEnemyButton');
        generateButton.disabled = false;
        generateButton.style.display = 'flex';
        hideLoadingPopup();
    } catch (err) {
        hideLoadingPopup();
        console.error('Error generating horde:', err.message);
    }
}

