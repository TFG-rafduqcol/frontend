function updateDeathAnimation(enemy) {
    if (enemy.isDead && !enemy.smokeEffectGenerated) {
        createSmokeEffect(enemy.x, enemy.y);
        enemy.smokeEffectGenerated = true; 
    }

    updateSmokeParticles();
    drawSmokeParticles();

    if (enemy.opacity > 0) {
        enemy.deathTimer--;
        enemy.opacity = enemy.deathTimer / 60;
    } else {
        const index = enemies.indexOf(enemy);
        if (index > -1) {
            enemies.splice(index, 1); 
        }
    }

    if (enemy.frameTimer >= enemy.frameDelay) {
        enemy.spriteFrame = (enemy.spriteFrame + 1) % enemy.totalFrames;
        enemy.frameTimer = 0;
    }
    checkEnemiesAndEnableButtons();
}

let particles = [];

function createSmokeEffect(x, y) {
    const numberOfParticles = 10;

    for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 10 + 5, 
            speedX: (Math.random() - 0.5) * 2, 
            speedY: (Math.random() - 0.5) * 2, 
            opacity: 1, 
            life: Math.random() * 60 + 30,  
        });
    }
}

function updateSmokeParticles() {
    particles = particles.filter(particle => particle.opacity > 0 && particle.life > 0);

    particles.forEach(particle => {
        if (particle.life > 0) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity -= 0.02;  
            particle.life--;  

            if (particle.life <= 0) {
                particle.opacity = 0;
            }
        }
    });
}

function drawSmokeParticles() {
    particles.forEach(particle => {
        enemyCtx.globalAlpha = particle.opacity; 
        enemyCtx.beginPath();
        enemyCtx.arc(particle.x * scale + offsetX, particle.y * scale + offsetY, particle.size, 0, Math.PI * 2);
        enemyCtx.fillStyle = 'rgba(200, 200, 200, 1)'; 
        enemyCtx.fill();
        enemyCtx.globalAlpha = 1; 
    });
}
