const enemyCanvas = document.getElementById("enemyCanvas");
const enemyCtx = enemyCanvas.getContext("2d");

// Llamar a la función cuando el botón se haga clic
document.getElementById('generateEnemyButton').addEventListener('click', generateEnemy);

function generateEnemy() {
    // Crear un enemigo con atributos predeterminados
    const newEnemy = {
        x: 0,  // posición inicial en x
        y: 0,  // posición inicial en y
        speed: 1.5,  // velocidad del enemigo
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
    };

    // Agregar el nuevo enemigo a la lista de enemigos
    enemies.push(newEnemy);

    // Imprimir en consola para ver el enemigo creado
    console.log('Nuevo enemigo creado:', newEnemy);
}




function moveEnemy(enemy) {
    if (enemy.delay > 0) {
        enemy.delay--;
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

function drawSprite(x, y, enemy) {
    const currentImage = images[enemy.spriteFrame];
    const imageWidth = 60; 
    const imageHeight = 60;
    
    enemyCtx.drawImage(currentImage, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
}

function updateAnimation(enemy) {
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameDelay) {
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.totalFrames;
        enemy.frameTimer = 0;
    }
}

function drawEnemies() {

    // Limpiar el canvas
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

function drawHealthBar(enemy) {
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

function checkEnemyInOccupiedArea(enemy) {
    const enemyX = enemy.x * scale + offsetX;
    const enemyY = enemy.y * scale + offsetY;

    towersArea.forEach(area => {
        const dx = enemyX - area.x;
        const dy = enemyY - area.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const towerDiv = document.getElementById(`tower${area.position}`);
        
        const towerProjectile = towerDiv.querySelector('.towerProjectile');
        const towerBack = towerDiv.querySelector('.towerBack');
        const towerFront = towerDiv.querySelector('.towerFront');
        const towerSticks = towerDiv.querySelector('.towerSticks');
        const towerStick1 = towerDiv.querySelector('.towerStick1');
        const towerStick2 = towerDiv.querySelector('.towerStick2');
        
        if (distance <= area.range) {
            if (!area.hasActiveProjectile) {
                console.log("🚀 Enemigo en zona ocupada:", enemy);
                enemy.loggedZoneEntry = true;
                const projectileType = area.towerNumber;
                area.hasActiveProjectile = true;

                towerProjectile.style.animationPlayState = 'running';

                if (!area.isMorter) {
                  
                    towerBack.style.animationPlayState = 'running';
                    towerFront.style.animationPlayState = 'running';
                } else {

                    towerStick1.style.animationPlayState = 'running';
                    towerStick2.style.animationPlayState = 'running';
                }

                const duration = 0.5 * 1000; 
                setTimeout(() => {
                    createProjectile(area.towerId, enemy, projectileType);
                }, duration / 2);           
            }
        } else {
            if (enemy.loggedZoneEntry) {
                enemy.loggedZoneEntry = false;

                if (!area.isMorter) {
                    towerDiv.addEventListener('animationiteration', () => {
                        towerBack.style.animationPlayState = 'paused';
                        towerFront.style.animationPlayState = 'paused';
                        towerProjectile.style.animationPlayState = 'paused';
                    }, { once: true });
                    
                } else {

                    towerSticks.addEventListener('animationiteration', () => {
                        towerStick1.style.animationPlayState = 'paused';
                        towerStick2.style.animationPlayState = 'paused';
                        towerProjectile.style.animationPlayState = 'paused';
                    }, { once: true });
                    
                }
            }
        }
    });
}
