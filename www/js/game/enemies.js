const enemyCanvas = document.getElementById("enemyCanvas");
const enemyCtx = enemyCanvas.getContext("2d");

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

        // Verificar si el enemigo entra en el área de la torre
        if (distance <= area.range) {
            if (!enemy.loggedZoneEntry) {
                console.log(`💥 Enemy entró en área de torre con rango ${area.range}`);
                enemy.loggedZoneEntry = true;
                
                const projectileType = 1; 
                createProjectile(area.towerId, enemy, projectileType); 
            }
        } else {
            enemy.loggedZoneEntry = false;
        }
    });
}
