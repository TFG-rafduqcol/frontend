const projectileImages = {
    1: "../../images/projectiles/tower1/projectile.png", 
    2: "../../images/projectiles/tower2/projectile.png",  
    3: "../../images/projectiles/tower3/projectile.png",  
    4: "../../images/projectiles/tower4/projectile.png",  
};

// Tamano tipo de proyectil 
// Tipo 1: 12x12
// Tipo 2: 17x17
// Tipo 3: 20x20
// Tipo 4: 25x25

const impactFramesByType = {};

for (let type = 1; type <= 4; type++) {
    impactFramesByType[type] = [];

    for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = `../../images/projectiles/tower${type}/impact${i}.png`;
        impactFramesByType[type].push(img);
    }
}


let impactParticles = [];


function createProjectile(towerId, targetEnemy, projectileType) {
    const tower = towersArea.find(t => t.towerId === towerId);
    const towerX = tower.x; 
    const towerY = tower.y;

    const enemyX = targetEnemy.x * scale + offsetX;
    const enemyY = targetEnemy.y * scale + offsetY;

    const dx = enemyX - towerX;
    const dy = enemyY - towerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const directionX = dx / distance;
    const directionY = dy / distance;

    const projectile = {
        x: towerX + 12,
        y: towerY - 10,
        target: targetEnemy,
        speed: 0.5,
        radius: 5,
        type: projectileType,
        image: new Image(),
        isImageLoaded: false,
        directionX,
        directionY,
        towerId: towerId
    };

    projectile.image.src = projectileImages[projectileType];
    projectiles.push(projectile);
}


function updateProjectiles() {
    projectiles.forEach((projectile, index) => {
        projectile.x += projectile.directionX * projectile.speed;
        projectile.y += projectile.directionY * projectile.speed;

        const dx = (projectile.target.x * scale + offsetX) - projectile.x;
        const dy = (projectile.target.y * scale + offsetY) - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= projectile.radius + 10) {  
            projectile.target.health -= 10; 


            impactParticles.push({
                x: projectile.x,
                y: projectile.y,
                frame: 0,
                frameTimer: 0,
                frameInterval: 5,
                maxFrames: 4, 
                frames: impactFramesByType[projectile.type], 
            });

            if (projectile.target.health <= 0) {
                const enemyIndex = enemies.findIndex(enemy => enemy === projectile.target);
                if (enemyIndex !== -1) {
                    enemies[enemyIndex].isDead = true; 
                }                
            }
            projectiles.splice(index, 1);
        }
    });
}


function drawProjectiles() {
    projectiles.forEach(projectile => {
        enemyCtx.drawImage(
            projectile.image,
            projectile.x - projectile.radius,
            projectile.y - projectile.radius,
            35,
            20
        );
    });
}


function drawImpactParticles() {
    impactParticles.forEach(particle => {
        const img = particle.frames[particle.frame];
        if (img) {
            enemyCtx.drawImage(
                img,
                particle.x,
                particle.y,
                20, 
                20
            );
        }
    });
}



function updateImpactParticles() {
    impactParticles = impactParticles.filter(p => p.frame < p.maxFrames);

    impactParticles.forEach(p => {
        p.frameTimer++;
        if (p.frameTimer >= p.frameInterval) {
            p.frame++;
            p.frameTimer = 0;
        }
    });
}
