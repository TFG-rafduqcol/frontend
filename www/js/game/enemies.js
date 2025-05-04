const enemyCanvas = document.getElementById("enemyCanvas");
const enemyCtx = enemyCanvas.getContext("2d");

//document.getElementById('generateEnemyButton').addEventListener('click', generateEnemy);
document.getElementById('generateEnemyButton').addEventListener('click', generateHorde);


// Propiedades del enemigo
const enemy_props = [
    { name: "daggerkin", width: 35, height: 35, speed: 1.2, maxHealth: 40, totalFrames: 20, offsetX: -12, offsetY: -35, healthBarHeight: 40, lifes: 1 }, // Basico, neutro ante todo
    { name: "orcutter", width: 50, height: 50, speed: 0.65, maxHealth: 60, totalFrames: 20, offsetX: -15, offsetY: -45, healthBarHeight: 50, lifes: 1 }, // "Padre" de daggerkin, neutro ante todo
    { name: "oculom", width: 45, height: 45, speed: 1.1, maxHealth: 40, totalFrames: 18, offsetX: -25, offsetY: -20, healthBarHeight: 40, lifes: 1 }, // Primer enemigo volador no le afecta el mortero (4)
    { name: "devilOrc", width: 54, height: 54, speed: 0.65, maxHealth: 80, totalFrames: 20, offsetX: -15, offsetY: -45, healthBarHeight: 50, lifes: 1 }, // Debil ante el fuego (3), fuerte contra hierro (1) y piedra (2) 
    { name: "graySkull", width: 75, height: 75, speed: 0.5, maxHealth: 140, totalFrames: 20, offsetX: -22, offsetY: -70, healthBarHeight: 65, healthBarX: -2, lifes: 3 }, // Debil contra el mortero (4)
    { name: "carrionTropper", width: 45, height: 45, speed: 0.7, maxHealth: 90, totalFrames: 20, offsetX: -15, offsetY: -35, healthBarHeight: 45, lifes: 2 }, // Debil fuego (3), fuerte contra el resto (1,2,4)
    { name: "hellBat", width: 60, height: 60, speed: 0.8, maxHealth: 90, totalFrames: 18, offsetX: -35, offsetY: -40, healthBarHeight: 47, lifes: 2 }, // Segundo enemigo volador, debil ante el mortero (4)
    { name: "hexLord", width: 50, height: 50, speed: 0.8, maxHealth: 90, totalFrames: 20, offsetX: -15, offsetY: -40, healthBarHeight: 50, lifes: 4 }, // Cura los enemigos cada 10s
    { name: "darkSeer", width: 70, height: 70, speed: 0.6, maxHealth: 140, totalFrames: 20, offsetX: -30, offsetY: -65, healthBarHeight: 65, healthBarX: -4, lifes: 5 } // Fuerte contra TODO (1,2,3,4)
];


function generateEnemy() {
    const baseProps = enemy_props.find(e => e.name === "devilOrc");

    const newEnemy = {
        name: "devilOrc",  
        x: 0,
        y: 0,
        xOffset: baseProps.offsetX,
        yOffset: baseProps.offsetY, 
        healthBarHeight: baseProps.healthBarHeight || 0,
        healthBarX: baseProps.healthBarX || 0,
        width: baseProps.width,
        height: baseProps.height,
        speed: baseProps.speed,
        lifes: baseProps.lifes,
        health: baseProps.maxHealth,
        maxHealth: baseProps.maxHealth,
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
    enemies.push(newEnemy);

    console.log('Nuevo enemigo creado:', newEnemy);
}

async function generateHorde() {
    try {
      const response = await fetch(`${serverUrl}/api/hordes/generateHorde/${gameId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate horde');
      }
  
      const data = await response.json();
      console.log('Horde generated:', data);
  
      const baseProps = enemy_props.find(e => e.name === "devilOrc");
  
      // Usamos un bucle para crear los enemigos con un retraso de 1 segundo entre cada uno
      const newEnemies = data.enemies.map((enemyData, index) => {
        const newEnemy = {
          name: "devilOrc",
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
          health: enemyData.health,
          maxHealth: enemyData.health,
          spriteFrame: 0,
          totalFrames: baseProps.totalFrames,
          frameTimer: 0,
          frameDelay: 5,
          currentPoint: 0,
          t: 0 , // % de avance entre dos puntos
          delay: 0,
          loggedZoneEntry: false,
          isDead: false,
          deathTimer: 60,
          opacity: 1,
          spriteImages: [] 
        };
      
        // Carga las imágenes del sprite
        newEnemy.spriteImages = loadEnemyImages(newEnemy.name, newEnemy.totalFrames);
      
        // Agregar el nuevo enemigo con un retraso
        setTimeout(() => {
          enemies.push(newEnemy);
          console.log(`Enemigo ${newEnemy.name} añadido con retraso`);
        }, index * 1000); // Retraso de 1 segundo entre cada enemigo (1000 ms)

        return newEnemy;
      });
    } catch (err) {
      console.error('Error generating horde:', err.message);
    }
}

function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  

function moveEnemy(enemy) {
    if (enemy.delay > 0 || enemy.isDead) {
        return;
    }

    const currentTarget = path[enemy.currentPoint];
    const nextTarget = path[enemy.currentPoint + 1];

    if (!nextTarget) return;

    const dx = nextTarget.x - currentTarget.x;
    const dy = nextTarget.y - currentTarget.y;
    const distance = Math.sqrt(dx * dx + dy * dy);



    const directionX = dx / distance;
    const directionY = dy / distance;
    const speed = enemy.speed;

    enemy.x += directionX * speed;
    enemy.y += directionY * speed;


    const progress = Math.sqrt(
        Math.pow(enemy.x - currentTarget.x, 2) +
        Math.pow(enemy.y - currentTarget.y, 2)
    );

    if (progress >= distance) {
        enemy.currentPoint++;
        enemy.x = nextTarget.x;
        enemy.y = nextTarget.y;

        //let loseSound = new Audio("../../audio/lose.mp3");
        //loseSound.volume = 0.3;


        if (enemy.currentPoint >= path.length - 1) {
        
            try {
                // if (loseSound.paused) {
                //     loseSound.play();
                // } else {
                //     loseSound.pause();
                //     loseSound.currentTime = 0;
                //     loseSound.play();
                // }
        
                const index = enemies.indexOf(enemy);
                if (index > -1) enemies.splice(index, 1);
        
                updateGame(false, 0, enemy.lifes);
        
                const gameCanvasContainer = document.getElementById('gameCanvasContainer');
                gameCanvasContainer.classList.add('red-border');
                
                setTimeout(() => {
                    gameCanvasContainer.classList.remove('red-border');
                }, 300); 
            } catch (error) {
                console.log("Error al reproducir el sonido: ", error);
            }
        }
        
    }
}

function updateAnimation(enemy) {
    if (enemy.isDead) {
        updateDeathAnimation(enemy); 
        return;  
    }
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameDelay) {
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.spriteImages.length;;
        enemy.frameTimer = 0;
    }
}


function drawEnemies() {
    enemyCtx.clearRect(0, 0, enemyCanvas.width, enemyCanvas.height);
    enemies.forEach((enemy) => {
        moveEnemy(enemy);      
        if (enemy.currentPoint < path.length) { 
            updateAnimation(enemy);  
            drawSprite(enemy.x * scale + offsetX, enemy.y * scale + offsetY, enemy); 
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


function checkAreasWithEnemies() {
    towersArea.forEach(area => {
     

        const enemiesInArea = enemies.filter( enemy => { 
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

        //const movementSound = new Audio("../../audio/movement.mp3");

        function playSound() {
            if (movementSound.paused) {
                movementSound.volume = 0.2;
                movementSound.play();
            }
        }
        
        function stopSound() {
            if (!movementSound.paused) {
                movementSound.pause();
                movementSound.currentTime = 0; 
            }
        }
        
        if (enemiesInArea.length > 0 && !area.animationInProgress) {

            if (!area.hasActiveProjectile) {
                area.hasActiveProjectile = true;
                const projectileType = area.towerNumber;
                const duration = area.fireRate;
                //playSound();
 
                if (!area.isMorter) {
                    [towerBack, towerFront, towerProjectile].forEach(el => restartAnimation(el, false, duration));
                    [towerBack, towerFront, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                } else {
                    [towerStick1, towerStick2, towerProjectile].forEach(el => restartAnimation(el, true, duration));
                    [towerStick1, towerStick2, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                }

                setTimeout(() => {
                    towerProjectile.style.display = 'none';
                    towerProjectile.style.animationPlayState = 'running';
                    createProjectile(area.towerId, enemiesInArea[0], projectileType);
                }, duration / 2);

                setTimeout(() => {
                    towerProjectile.style.display = 'block';
                    //stopSound();
                    area.hasActiveProjectile = false;
                  
                }, duration);
            } else {
                return;
            }
        } else {
            if (area.hasActiveProjectile) area.animationInProgress = true;
            area.hasActiveProjectile = false;

            if (!area.isMorter) {
                towerDiv.addEventListener('animationiteration', () => {
                    towerBack.style.animationPlayState = 'paused';
                    towerFront.style.animationPlayState = 'paused';
                    towerProjectile.style.animationPlayState = 'paused';
                    //stopSound();
                    area.animationInProgress = false; 
                }, { once: true });
                
            } else {
                towerSticks.addEventListener('animationiteration', () => {
                    towerStick1.style.animationPlayState = 'paused';
                    towerStick2.style.animationPlayState = 'paused';
                    towerProjectile.style.animationPlayState = 'paused';
                    //stopSound();
                    area.animationInProgress = false; 

                }, { once: true });
                
            }

        }
    });
}


