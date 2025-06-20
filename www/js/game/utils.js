
function applyTowerDesign(towerBack, towerFront, selectedTowerIndex, towerPath, towerStyles) {
    
    towerBack.style.backgroundImage = `url('${towerPath}/back.png')`;
    towerFront.style.backgroundImage = `url('${towerPath}/front.png')`;
    towerBack.style.height = towerStyles[selectedTowerIndex - 1].backHeight; 
    towerFront.style.height = towerStyles[selectedTowerIndex - 1].frontHeight;

    towerBack.style.bottom = towerStyles[selectedTowerIndex - 1].backBottom;
    towerFront.style.bottom = towerStyles[selectedTowerIndex - 1].frontBottom;

    towerBack.style.left = towerStyles[selectedTowerIndex - 1].frontAndBackLeft;
    towerFront.style.left = towerStyles[selectedTowerIndex - 1].frontAndBackLeft;   
}

function projectileDesign(towerProjectile, projectileStyles, selectedTowerIndex) {
    
    const projectilePath = `../../images/projectiles/tower${selectedTowerIndex}/projectile.png`;
        towerProjectile.style.backgroundImage = `url('${projectilePath}')`;
        towerProjectile.style.left = projectileStyles[selectedTowerIndex - 1].left;
        towerProjectile.style.bottom = projectileStyles[selectedTowerIndex - 1].bottom;
        towerProjectile.style.width = projectileStyles[selectedTowerIndex - 1].width || '100%';
        towerProjectile.style.zIndex = projectileStyles[selectedTowerIndex - 1]['z-index'] || '1000';
        towerProjectile.style.display = 'block';
} 

function resetTowerMenuIcons() {
    document.querySelectorAll('.towerOption').forEach((option) => {
        const towerIcon = option.querySelector('img');
        towerIcon.src = towerIcon.getAttribute('data-original-src'); 
    });
}


function changeMenuTowerIcon(selectedTowerIndex) {
    towerOption = document.getElementById(`towerOption${selectedTowerIndex}`);
    const towerIcon = towerOption.querySelector('img');
    towerIcon.src = '../../images/tick.jpeg';
}

function changeDeleteTowerIcon() {
    const deleteTowerImg = document.getElementById('deleteTower');
    const deleteIcon = deleteTowerImg.querySelector('img');
    deleteIcon.src = '../../images/tick.jpeg';
}

function changeUpgradeTowerIcon() {
    const upgradeTowerImg = document.getElementById('upgradeTower');
    const upgradeIcon = upgradeTowerImg.querySelector('img');
    upgradeIcon.src = '../../images/tick.jpeg';
}


function resetDeleteTowerIcon() {   
    const deleteTowerImg = document.getElementById('deleteTower');
    const deleteIcon = deleteTowerImg.querySelector('img');
    deleteIcon.src = deleteIcon.getAttribute('data-original-src');
    deleteClickedOnce = false;
    deleteClickHandler = null;
}

function resetUpgradeTowerIcon() {
    const upgradeTowerImg = document.getElementById('upgradeTower');
    const upgradeIcon = upgradeTowerImg.querySelector('img');
    upgradeIcon.src = upgradeIcon.getAttribute('data-original-src');
    upgradeClickedOnce = false;
    upgradeClickHandler = null;
}

function restartAnimation(element, isMorter, duration) {
    durationInSeconds = duration  / 1000;
    if (isMorter) {
        element.style.animation = 'none';
        element.offsetHeight; 
        element.style.animation =  `moveMorterProjectile ${durationInSeconds}s infinite alternate`;
    } else {
        element.style.animation = 'none';
        element.offsetHeight; 
        element.style.animation = `moveProjectile ${durationInSeconds}s infinite alternate`;
    }
    
}


