function moveEnemy(enemy) {
    const currentTarget = path[enemy.currentPoint];
    const nextTarget = path[enemy.currentPoint + 1];

    if (!nextTarget) return; // Si no hay siguiente punto, no hacemos nada

    const dx = nextTarget.x - currentTarget.x;
    const dy = nextTarget.y - currentTarget.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Incrementamos t basándonos en la velocidad y la distancia
    enemy.t += enemy.speed / distance;

    if (enemy.t >= 1) {
        // Cuando se completa el segmento, "snap" al enemigo al siguiente punto.
        enemy.x = nextTarget.x;
        enemy.y = nextTarget.y;
        enemy.t = 0;
        enemy.currentPoint++;
    } else {
        // Interpolación lineal entre el punto actual y el siguiente
        enemy.x = currentTarget.x + dx * enemy.t;
        enemy.y = currentTarget.y + dy * enemy.t;
    }
}

function drawSprite(x, y, enemy) {
    const currentImage = images[enemy.spriteFrame];
    const imageWidth = 60; 
    const imageHeight = 60;
    
    ctx.drawImage(currentImage, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
}

function updateAnimation(enemy) {
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameDelay) {
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.totalFrames;
        enemy.frameTimer = 0;
    }
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        moveEnemy(enemy);      
        if (enemy.currentPoint < path.length) { 
            updateAnimation(enemy);  
            drawSprite(enemy.x * scale + offsetX, enemy.y * scale + offsetY, enemy); 
        }
    });
}
