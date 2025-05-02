const projectileImages = {
    1: "../../images/projectiles/tower1/projectile.png", 
    2: "../../images/projectiles/tower2/projectile.png",  
    3: "../../images/projectiles/tower3/projectile.png",  
    4: "../../images/projectiles/tower4/projectile.png",  
};



const projectileSizes = {
    1: { width: 12, height: 12 },
    2: { width: 17, height: 17 },
    3: { width: 20, height: 20 },
    4: { width: 25, height: 25 },
};


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
    const towerX = tower.x * scale + offsetX;
    const towerY = tower.y * scale + offsetY;

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
        height: projectileSizes[projectileType].height,
        width: projectileSizes[projectileType].width,
        target: targetEnemy,
        damage: tower.damage,
        speed: 5,
        radius: 5,
        type: projectileType,
        image: new Image(),
        directionX,
        directionY,
        towerId: towerId,
        
    };

    projectile.image.src = projectileImages[projectileType];
    projectiles.push(projectile);
}

function updateProjectiles() {
    projectiles.forEach((projectile, index) => {
        if (!projectile.target || projectile.target.isDead) {
            projectiles.splice(index, 1);
            return;
        }

        const targetX = projectile.target.x * scale + offsetX;
        const targetY = projectile.target.y * scale + offsetY;

        const dx = targetX - projectile.x;
        const dy = targetY - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const directionX = dx / distance;
        const directionY = dy / distance;

        projectile.x += directionX * projectile.speed;
        projectile.y += directionY * projectile.speed;
 
        if (distance <= projectile.radius + 10) {

            const projectileSounds = {
                1: "../../audio/stone.mp3",
                2: "../../audio/stone.mp3",
                4: "../../audio/stone.mp3",
                3: "../../audio/fire.mp3"
            };
            
            if (projectileSounds[projectile.type]) {
                const impactSound = new Audio(projectileSounds[projectile.type]);
                if (impactSound.paused) {
                    impactSound.volume = 0.3; 
                    impactSound.play();
                } else{
                    impactSound.pause();
                    impactSound.currentTime = 0; 
                    impactSound.volume = 0.1; 
                    impactSound.play();
                }
            }
    
            const damageMultiplier = getDamageMultiplier(projectile.target.name, projectile.type);
            projectile.target.health -= projectile.damage * damageMultiplier;         

            impactParticles.push({
                x: projectile.x,
                y: projectile.y,
                frame: 0,
                frameTimer: 0,
                frameInterval: 5,
                maxFrames: 4,
                frames: impactFramesByType[projectile.type],
                radius: projectile.radius 
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

function getDamageMultiplier(enemyName, towerType) {
    const damageMultipler = {
        devilOrc: { 1: 0.5, 2: 0.5, 3: 2.0 },
        graySkull: { 4: 2.0 },
        carrionTropper: { 1: 0.5, 2: 0.5,  3: 2.0, 4: 0.5 },
        darkSeer: { 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.75 }
    };

    if (enemyName in damageMultipler && towerType in damageMultipler[enemyName]) {
        return damageMultipler[enemyName][towerType];
    } else {
        return 1; 
    }
}



function drawProjectiles() {
    projectiles.forEach(projectile => {
        enemyCtx.drawImage(
            projectile.image,
            projectile.x - projectile.radius,
            projectile.y - projectile.radius,
            projectile.width,
            projectile.height
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
