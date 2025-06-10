const translations = {
    es: {
        profile_title: "Perfil",
        max_round: "Ronda máxima:",
        games_played: "Partidas jugadas:",
        achievement_enemies_killed_title: "Cazador de Enemigos",
        achievement_enemies_killed_desc: "Mata enemigos para obtener estrellas.",
        achievement_towers_deployed_title: "Arquitecto Estratégico",
        achievement_towers_deployed_desc: "Coloca torres para mejorar tu defensa.",
        achievement_towers_upgraded_title: "Maestro de la Mejora",
        achievement_towers_upgraded_desc: "Mejora tus torres para aumentar su poder.",
        achievement_gold_earned_title: "Acumulador de Oro",
        achievement_gold_earned_desc: "Gana oro durante tus partidas.",
        achievement_gems_earned_title: "Rey de las Gemas",
        achievement_gems_earned_desc: "Gana gemas para mejorar tu experiencia.",
        achievement_rounds_passed_title: "Sobreviviente",
        achievement_rounds_passed_desc: "Sobrevive a muchas oleadas de enemigos.",
        achievement_games_played_title: "Veterano de Batallas",
        achievement_games_played_desc: "Juega muchas partidas para ser reconocido."
    },
    en: {
        profile_title: "Profile",
        max_round: "Max round:",
        games_played: "Games played:",
        achievement_enemies_killed_title: "Enemy Hunter",
        achievement_enemies_killed_desc: "Kill enemies to earn stars.",
        achievement_towers_deployed_title: "Strategic Architect",
        achievement_towers_deployed_desc: "Place towers to improve your defense.",
        achievement_towers_upgraded_title: "Upgrade Master",
        achievement_towers_upgraded_desc: "Upgrade your towers to increase their power.",
        achievement_gold_earned_title: "Gold Hoarder",
        achievement_gold_earned_desc: "Earn gold during your games.",
        achievement_gems_earned_title: "Gem King",
        achievement_gems_earned_desc: "Earn gems to enhance your experience.",
        achievement_rounds_passed_title: "Survivor",
        achievement_rounds_passed_desc: "Survive many waves of enemies.",
        achievement_games_played_title: "Battle Veteran",
        achievement_games_played_desc: "Play many games to be recognized."
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

const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    (async function initProfile() {
        document.getElementById("avatar").src = user.avatar || "";
        document.getElementById("username").textContent = `${user.username}`;
        document.getElementById("id").textContent = `#${user.id}`;
        document.getElementById("level").textContent = `${user.level}`;
        document.getElementById("range_url").src = `${user.range_url}`;
        document.getElementById("range").textContent = `${user.range}`;



        async function getStats() {
            const token = localStorage.getItem('token');

            const res = await fetch(`${serverUrl}/api/auth/stats/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error(`Error al obtener las estadísticas: ${res.status}`);
            return res.json();
        }

        const stats = await getStats();
        console.log("User stats:", stats);

        if (stats.max_round) {
            const maxRoundEl = document.getElementById('max-round');
            if (maxRoundEl) maxRoundEl.textContent = stats.rounds_passed;
        }
        if (stats.games_played) {
            const gamesPlayedEl = document.getElementById('games-played');
            if (gamesPlayedEl) gamesPlayedEl.textContent = stats.games_played;
        }

        const achievements = {
            enemies_killed: {
                title: t("achievement_enemies_killed_title"),
                description: t("achievement_enemies_killed_desc"),
                thresholds: [1000, 2500, 5000],
                desc_template: "Mata {n} enemigos para obtener estrellas."
            },
            towers_deployed: {
                title: t("achievement_towers_deployed_title"),
                description: t("achievement_towers_deployed_desc"),
                thresholds: [100, 300, 500],
                desc_template: "Coloca {n} torres para obtener estrellas."
            },
            towers_upgraded: {
                title: t("achievement_towers_upgraded_title"),
                description: t("achievement_towers_upgraded_desc"),
                thresholds: [100, 200, 300],
                desc_template: "Mejora {n} torres para obtener estrellas."
            },
            gold_earned: {
                title: t("achievement_gold_earned_title"),
                description: t("achievement_gold_earned_desc"),
                thresholds: [10000, 25000, 50000],
                desc_template: "Gana {n} de oro para obtener estrellas."
            },
            gems_earned: {
                title: t("achievement_gems_earned_title"),
                description: t("achievement_gems_earned_desc"),
                thresholds: [1000, 2500, 5000],
                desc_template: "Gana {n} gemas para obtener estrellas."
            },
            rounds_passed: {
                title: t("achievement_rounds_passed_title"),
                description: t("achievement_rounds_passed_desc"),
                thresholds: [50, 100, 200],
                desc_template: "Supera {n} rondas para obtener estrellas."
            },
            games_played: {
                title: t("achievement_games_played_title"),
                description: t("achievement_games_played_desc"),
                thresholds: [100, 250, 500],
                desc_template: "Juega {n} partidas para obtener estrellas."
            }
        };

        function getAchievementProgress(value, thresholds) {
            let stars = 0;
            if (value >= thresholds[0]) stars++;
            if (value >= thresholds[1]) stars++;
            if (value >= thresholds[2]) stars++;

            const max = thresholds[2];
            const percent = Math.min((value / max) * 100, 100);

            return { stars, percent };
        }

        function generateAchievementHTML(stats) {
            return Object.entries(achievements).map(([key, config]) => {
                const value = stats[key] || 0;
                const { stars, percent } = getAchievementProgress(value, config.thresholds);

                const starsHTML = Array(3).fill(0).map((_, i) => (
                    `<span class="star" style="color: ${i < stars ? '#FFD700' : '#ccc'}">&#9733;</span>`
                )).join('');

                const icons = {
                    enemies_killed: '<span class="achievement-icon" title="Enemigos derrotados" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">⚔️</span>',
                    towers_deployed: '<span class="achievement-icon" title="Torres colocadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🏹</span>',
                    towers_upgraded: '<span class="achievement-icon" title="Torres mejoradas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🔧</span>',
                    gold_earned: '<span class="achievement-icon" title="Oro ganado" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">💰</span>',
                    gems_earned: '<span class="achievement-icon" title="Gemas ganadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">💎</span>',
                    rounds_passed: '<span class="achievement-icon" title="Rondas superadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🛡️</span>',
                    games_played: '<span class="achievement-icon" title="Partidas jugadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🎮</span>'
                };
                const iconHTML = icons[key] || '<span class="achievement-icon" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🏆</span>';

                let level = 0;
                if (value >= config.thresholds[2]) level = 2;
                else if (value >= config.thresholds[1]) level = 1;
                else if (value >= config.thresholds[0]) level = 0;
                else level = 0;
                let nextMsg = '';
                if (stars < 3) {
                    let nextThreshold = config.thresholds[stars];
                    let template = config.desc_template || t('achievement_' + key + '_desc', config.description);
                    nextMsg = template.replace('{n}', nextThreshold);
                } else {
                    nextMsg = `<span style='color:#ffe066'>${t('achievement_completed', '¡Logro completado!')}</span>`;
                }
                const descriptionWithThresholds = `<span style='font-size:0.98em;color:#f7f7c6;'>${nextMsg}</span>`;

                return `
                    <div class="achievement">
                        <div style="display:flex;align-items:center;gap:0.5em;">
                            ${iconHTML}
                            <h2 class="achievement-title" style="margin:0;">${config.title}</h2>
                        </div>
                        <p class="achievement-description">${descriptionWithThresholds}</p>
                        <div class="progress-container">
                            <div class="achievement-progress">
                                <div class="progress-bar" style="width: ${percent}%;"></div>
                            </div>
                            <div class="achievement-stars">
                                ${starsHTML}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        const achievementsContainer = document.getElementById('achievements-container');
        achievementsContainer.innerHTML = generateAchievementHTML(stats);

    })();
} else {
    console.log("User data not found");
}

document.addEventListener("DOMContentLoaded", () => {
    document.title = t('profile_title', document.title);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key, el.textContent);
    });
});
