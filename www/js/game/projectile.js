const projectileImages = {
    1: "../../images/projectiles/tower1/projectile.png", 
    2: "../../images/projectiles/tower2/projectile.png",  
    3: "../../images/projectiles/tower3/projectile.png",  
    4: "../../images/projectiles/tower4/projectile.png",  
};


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
        x: towerX,
        y: towerY,
        target: targetEnemy,
        speed: 5,
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

        if (distance <= projectile.radius + 20) {  
            console.log("🎯 ¡Proyectil impactó al enemigo!");
            projectile.target.health -= 10; 

            projectiles.splice(index, 1);

            const tower = towersArea.find(t => t.towerId === projectile.towerId);
            tower.hasActiveProjectile = false;  
            
        }
    });
}


function drawProjectiles() {
    projectiles.forEach(projectile => {
        enemyCtx.drawImage(
            projectile.image,
            projectile.x - projectile.radius,
            projectile.y - projectile.radius,
            20,
            20
        );
    });
}
