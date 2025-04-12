
function moveEnemy() {
    const currentTarget = path[enemy.currentPoint];
    const nextTarget = path[enemy.currentPoint + 1];

    if (nextTarget) {
        const dx = nextTarget.x - currentTarget.x;
        const dy = nextTarget.y - currentTarget.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (enemy.t >= 1) {
            enemy.t = 0;
            enemy.currentPoint++;
        }

        enemy.x = currentTarget.x + dx * enemy.t;
        enemy.y = currentTarget.y + dy * enemy.t;

        enemy.t += enemy.speed / distance;
    }
}

function drawSprite(x, y) {
    const currentImage = images[enemy.spriteFrame];
    const imageWidth = 60; 
    const imageHeight = 60;
    
    ctx.drawImage(currentImage, x - imageWidth / 2, y - imageHeight / 2, imageWidth, imageHeight);
}

function updateAnimation() {
    enemy.frameTimer++;
    if (enemy.frameTimer >= enemy.frameDelay) {
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.totalFrames;
        enemy.frameTimer = 0;
    }
}

