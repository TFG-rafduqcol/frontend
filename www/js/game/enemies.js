const enemyCanvas = document.getElementById("enemyCanvas");
const enemyCtx = enemyCanvas.getContext("2d");

// Llamar a la función cuando el botón se haga clic
document.getElementById('generateEnemyButton').addEventListener('click', generateEnemy);

function generateEnemy() {
    // Crear un enemigo con atributos predeterminados
    const newEnemy = {
        x: 0,  // posición inicial en x
        y: 0,  // posición inicial en y
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
        loggedZoneEntry: false,  // indicador de entrada en la zona
        isDead: false,  // indicador de muerte
        deathTimer: 60,  // temporizador de muerte
        opacity: 1,  // opacidad del enemigo
    };

    // Agregar el nuevo enemigo a la lista de enemigos
    enemies.push(newEnemy);

    // Imprimir en consola para ver el enemigo creado
    console.log('Nuevo enemigo creado:', newEnemy);
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

    enemy.x = currentTarget.x + dx * enemy.t;
    enemy.y = currentTarget.y + dy * enemy.t;

    enemy.t += enemy.speed / distance;

    if (enemy.t >= 1) {
        enemy.t = 0;
        enemy.currentPoint++;

        if (enemy.currentPoint >= path.length - 1) {
            const index = enemies.indexOf(enemy);
            if (index > -1) enemies.splice(index, 1);
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
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.totalFrames;
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
    const currentImage = images[enemy.spriteFrame];
    const imageWidth = 60; 
    const imageHeight = 60;
    
    enemyCtx.globalAlpha = enemy.opacity;

    enemyCtx.drawImage(currentImage, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
    
    enemyCtx.globalAlpha = 1;
}


function drawHealthBar(enemy) {
    if (!enemy.isDead) {
        const barWidth = 40;
        const barHeight = 6;
        const x = enemy.x * scale + offsetX - barWidth / 2;
        const y = enemy.y * scale + offsetY - 40; 

        enemyCtx.fillStyle = "red";
        enemyCtx.fillRect(x, y, barWidth, barHeight);

        const healthRatio = enemy.health / enemy.maxHealth;
        enemyCtx.fillStyle = "limegreen";
        enemyCtx.fillRect(x, y, barWidth * healthRatio, barHeight);

        enemyCtx.strokeStyle = "black";
        enemyCtx.strokeRect(x, y, barWidth, barHeight);
    }   
}


function checkAreasWithEnemies() {
    towersArea.forEach(area => {
        const enemiesInArea = enemies.filter( enemy => { 
            const enemyX = enemy.x * scale + offsetX;
            const enemyY = enemy.y * scale + offsetY;
            const dx = enemyX - area.x * scale - offsetX;
            const dy = enemyY - area.y * scale - offsetY; 
            return Math.hypot(dx, dy) <= area.range && !enemy.isDead;
        });
        const towerDiv       = document.getElementById(`tower${area.position}`);
        const towerProjectile= towerDiv.querySelector('.towerProjectile');
        const towerBack      = towerDiv.querySelector('.towerBack');
        const towerFront     = towerDiv.querySelector('.towerFront');
        const towerSticks    = towerDiv.querySelector('.towerSticks');
        const towerStick1    = towerDiv.querySelector('.towerStick1');
        const towerStick2    = towerDiv.querySelector('.towerStick2');

        if (enemiesInArea.length > 0 && !area.animationInProgress) {
            if (!area.hasActiveProjectile) {
                area.hasActiveProjectile = true;
                const projectileType = area.towerNumber;
                const duration = 2000;

                if (!area.isMorter) {
                    [towerBack, towerFront, towerProjectile].forEach(el => restartAnimation(el, false));
                    [towerBack, towerFront, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                } else {
                    [towerStick1, towerStick2, towerProjectile].forEach(el => restartAnimation(el, true));
                    [towerStick1, towerStick2, towerProjectile].forEach(el => el.style.animationPlayState = 'running');
                }

                setTimeout(() => {
                    towerProjectile.style.display = 'none';
                    towerProjectile.style.animationPlayState = 'running';
                    createProjectile(area.towerId, enemiesInArea[0], projectileType);
                }, duration / 2);

                setTimeout(() => {
                    towerProjectile.style.display = 'block';
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
                    area.animationInProgress = false; 
                }, { once: true });
                
            } else {
                towerSticks.addEventListener('animationiteration', () => {
                    towerStick1.style.animationPlayState = 'paused';
                    towerStick2.style.animationPlayState = 'paused';
                    towerProjectile.style.animationPlayState = 'paused';
                    area.animationInProgress = false; 
                }, { once: true });
                
            }

        }
    });
}



