const enemyCanvas = document.getElementById("enemyCanvas");
const eneymCtx = enemyCanvas.getContext("2d");

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
    
    eneymCtx.drawImage(currentImage, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
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
    eneymCtx.clearRect(0, 0, enemyCanvas.width, enemyCanvas.height);
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

    eneymCtx.fillStyle = "red";
    eneymCtx.fillRect(x, y, barWidth, barHeight);

    const healthRatio = enemy.health / enemy.maxHealth;
    eneymCtx.fillStyle = "limegreen";
    eneymCtx.fillRect(x, y, barWidth * healthRatio, barHeight);

    eneymCtx.strokeStyle = "black";
    eneymCtx.strokeRect(x, y, barWidth, barHeight);
}


function checkEnemyInOccupiedArea(enemy) {
    const enemyX = enemy.x * scale + offsetX;
    const enemyY = enemy.y * scale + offsetY;

    let insideAnyArea = false;

    towerAreas.forEach(area => {
        const dx = enemyX - area.x;
        const dy = enemyY - area.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= area.range) {
            insideAnyArea = true;

            if (!enemy.loggedZoneEntry) {
                console.log(`💥 Enemy entró en área de torre con rango ${area.range}`);
                enemy.loggedZoneEntry = true;
            }
        }
    });

    if (!insideAnyArea && enemy.loggedZoneEntry) {
        console.log(`🏃‍♂️ Enemy salió del área de torre`);
        enemy.loggedZoneEntry = false;
    }
}
