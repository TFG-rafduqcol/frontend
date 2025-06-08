const { useReducer } = require("react");

const RANKS = {
    SILVER: "Plata",
    GOLD: "Oro",
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
    const xpEarned = round * 20;
    const gemsEarned = round * 1;
    const user = JSON.parse(localStorage.getItem('user'));  
    user.gems += gemsEarned;
    console.log(user.experience, "experience before");
    user.experience += xpEarned;
    console.log(user.experience, "experience after");
    localStorage.setItem('user', JSON.stringify(user));
    
    document.getElementById('endgame-round').textContent = round;
    document.getElementById('endgame-xp').textContent = xpEarned;
    document.getElementById('endgame-gems').textContent = gemsEarned;
    
    const rankUpMessage = document.getElementById('rank-up-message');
    if (round >= 50 && userRank !== RANKS.MASTER) {
        let newRank;

        if (userRank === RANKS.SILVER) {
            newRank = RANKS.GOLD;
            user.avatar_url = "../../images/master.png";
        } else if (isHardMode && userRank === RANKS.SILVER) {
            newRank == RANKS.MASTER;
            user.avatar_url = "../../images/master.png";
        }
        user.rank = newRank;
        document.getElementById('new-rank').textContent = newRank;
        rankUpMessage.classList.add('show');
    } else {
        rankUpMessage.classList.remove('show');
    }
    
    document.getElementById('endgame-modal').style.display = 'flex';
    
    applyEndgameTranslations();
    
    // saveEndgameData(round, xpEarned, gemsEarned, userRank);
}

// async function saveEndgameData(round, xp, gems, currentRank) {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.error('No se encontró token de autenticación');
//             return;
//         }
        
//         const response = await fetch(`${serverUrl}/api/games/endgame`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//                 gameId: gameId,
//                 round: round,
//                 xpEarned: xp,
//                 gemsEarned: gems,
//                 currentRank: currentRank
//             })
//         });
        
//         if (!response.ok) {
//             const error = await response.json();
//             throw new Error(error.error || 'Error al guardar los datos de fin de partida');
//         }
        
//         const data = await response.json();
//         console.log('Datos de fin de partida guardados:', data);
        
//     } catch (err) {
//         console.error('Error guardando datos de fin de partida:', err.message);
//     }
// }

document.addEventListener('DOMContentLoaded', () => {

    
    document.getElementById('main-menu-button').addEventListener('click', () => {
        window.location.href = '../../views/menu/index.html';
    });
    
    // Aplicar traducciones cuando el DOM está listo
    applyEndgameTranslations();
    
    // Escuchar por cambios de idioma
    window.addEventListener('languageChanged', applyEndgameTranslations);
});

window.showEndgameModal = showEndgameModal;
