const projectileImages = {
    1: "../../images/projectiles/tower1/projectile.png", 
    2: "../../images/projectiles/tower2/projectile.png",  
    3: "../../images/projectiles/tower3/projectile.png",  
    4: "../../images/projectiles/tower4/projectile.png",  
};


function createProjectile(towerId, targetEnemy, projectileType) {
    const tower = towersArea.find(t => t.towerId === towerId);
    const towerX = tower.x * scale + offsetX;
    const towerY = tower.y * scale + offsetY;

    const projectile = {
        x: towerX,
        y: towerY,
        target: targetEnemy,
        speed: 5,
        radius: 5,
        type: projectileType, 
        image: projectileImages[projectileType], 
        isImageloaded: false,
    };

    projectile.image.src = projectileImages[projectileType];

    projectile.image.onload = function() {
        projectile.isImageLoaded = true; 
    };

    projectiles.push(projectile);
}
function updateProjectiles() {
    projectiles.forEach((projectile, index) => {
        const dx = projectile.target.x - projectile.x;
        const dy = projectile.target.y - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const moveX = (dx / distance) * projectile.speed;
        const moveY = (dy / distance) * projectile.speed;

        projectile.x += moveX;
        projectile.y += moveY;

        if (distance <= projectile.radius) {
            console.log("¡Proyectil impactó al enemigo!");
            projectile.target.health -= 10; 
            projectiles.splice(index, 1); 
        }
    });
}


function drawProjectiles() {
    projectiles.forEach(projectile => {
        // Verificar si la imagen del proyectil se ha cargado completamente
        if (projectile.isImageLoaded) {
            // Dibujar la imagen del proyectil si ya está cargada
            enemyCtx.drawImage(projectile.image, projectile.x - projectile.radius, projectile.y - projectile.radius, 20, 20);
        } else {
            // Si la imagen no está cargada, dibujar un círculo rojo como marcador
            enemyCtx.beginPath();
            enemyCtx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
            enemyCtx.fillStyle = "#FF0000"; // Color rojo
            enemyCtx.fill();
            enemyCtx.closePath();
        }
    });
}
