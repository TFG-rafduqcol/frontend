const RANKS = {
    SILVER: "Silver",
    GOLD: "Gold",
    MASTER: "Master"
};

const translations = {
    es: {
        endgame_title: "¡Fin de la Batalla!",
        round_reached: "Ronda alcanzada:",
        xp_earned: "Experiencia ganada:",
        gems_earned: "Gemas ganadas:",
        rank_up_congrats: "¡Felicidades! Has conseguido un nuevo rango:",
        main_menu: "Menú Principal",
        continue_button: "Continuar"
    },
    en: {
        endgame_title: "Battle End!",
        round_reached: "Round reached:",
        xp_earned: "Experience earned:",
        gems_earned: "Gems earned:",
        rank_up_congrats: "Congratulations! You have achieved a new rank:",
        main_menu: "Main Menu",
        continue_button: "Continue"
    }
};

function getLang() {
    return (localStorage.getItem('language') || 'es');
}

function t(key, fallback) {
    const lang = getLang();
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    if (translations['es'][key]) return translations['es'][key];
    return fallback || key;
}

function applyEndgameTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key, el.textContent);
    });
}

function showEndgameModal(round, userRank) {
    gameEnded = true;
    const xpEarned = round * 20;
    const gemsEarned = round * 1;
    const user = JSON.parse(localStorage.getItem('user'));
    const isHardMode = localStorage.getItem('isHardMode') === 'true';
    user.gems += gemsEarned;
    user.experience += xpEarned;
    if (user.gems > 999) user.gems = 999;
    if (user.experience > 31700) user.experience = 31700;
    localStorage.setItem('user', JSON.stringify(user));
    
    document.getElementById('endgame-round').textContent = round;
    document.getElementById('endgame-xp').textContent = xpEarned;
    document.getElementById('endgame-gems').textContent = gemsEarned;
    
    const rankUpMessage = document.getElementById('rank-up-message');
    if (round >= 50 && userRank !== RANKS.MASTER) {
        let newRank = null;

        if (userRank === RANKS.SILVER && !isHardMode) {
            newRank = RANKS.GOLD;
            user.avatar_url = "../../images/master.png";
        } else if (isHardMode && userRank === RANKS.SILVER) {
            newRank = RANKS.MASTER;
            user.avatar_url = "../../images/master.png";
        }
        if (newRank) {
            user.rank = newRank;
            document.getElementById('new-rank').textContent = newRank;
            rankUpMessage.classList.add('show');
        } else {
            rankUpMessage.classList.remove('show');
        }
    } else {
        rankUpMessage.classList.remove('show');
    }
    
    document.getElementById('endgame-modal').style.display = 'flex';
    
    applyEndgameTranslations();
    
    fetch(`${serverUrl}/api/games/endGame/${gameId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }, 
        body: JSON.stringify({
            round: round,
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Fin de partida guardado en backend:', data);
    })
    .catch(err => {
        console.error('Error guardando fin de partida en backend:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    
    document.getElementById('main-menu-button').addEventListener('click', () => {
        window.location.href = '../../views/menu/index.html';
    });
    
    applyEndgameTranslations();
    
    window.addEventListener('languageChanged', applyEndgameTranslations);
});

window.showEndgameModal = showEndgameModal;
