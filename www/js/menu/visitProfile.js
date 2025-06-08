const translations = {
    es: {
        profile_title: "Perfil",
        max_round: "Ronda máxima:",
        games_played: "Partidas jugadas:",
        achievement_enemies_killed_title: "Cazador de Enemigos",
        achievement_enemies_killed_desc: "Mata enemigos para obtener estrellas.",
        achievement_towers_placed_title: "Arquitecto Estratégico",
        achievement_towers_placed_desc: "Coloca torres para mejorar tu defensa.",
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
        achievement_towers_placed_title: "Strategic Architect",
        achievement_towers_placed_desc: "Place towers to improve your defense.",
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

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        alert("Usuario no encontrado.");
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/api/social/getUserById/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos del usuario.");
        }

        const data = await response.json();
        const user = data.player;

        document.getElementById("avatar").src = user.avatar || "";
        document.getElementById("username").textContent = `${user.username}`;
        document.getElementById("id").textContent = `#${user.id}`;
        document.getElementById("level").textContent = `${user.level}`;
        document.getElementById("range_url").src = `${user.range_url}`;
        document.getElementById("range").textContent = `${user.range}`;

        const statsRes = await fetch(`${serverUrl}/api/auth/stats/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (!statsRes.ok) throw new Error("Error al obtener estadísticas del usuario.");
        const stats = await statsRes.json();

        const maxRoundEl = document.getElementById('max-round');
        if (maxRoundEl && stats.max_round) maxRoundEl.textContent = stats.max_round;
        const gamesPlayedEl = document.getElementById('games-played');
        if (gamesPlayedEl && stats.games_played) gamesPlayedEl.textContent = stats.games_played;

        const achievements = {
            enemies_killed: {
                title: t("achievement_enemies_killed_title"),
                description: t("achievement_enemies_killed_desc"),
                thresholds: [1000, 2500, 5000]
            },
            towers_placed: {
                title: t("achievement_towers_placed_title"),
                description: t("achievement_towers_placed_desc"),
                thresholds: [50, 150, 300]
            },
            towers_uograded: {
                title: t("achievement_towers_upgraded_title"),
                description: t("achievement_towers_upgraded_desc"),
                thresholds: [10, 25, 50]
            },
            gold_earned: {
                title: t("achievement_gold_earned_title"),
                description: t("achievement_gold_earned_desc"),
                thresholds: [10000, 25000, 50000]
            },
            gems_earned: {
                title: t("achievement_gems_earned_title"),
                description: t("achievement_gems_earned_desc"),
                thresholds: [1000, 2500, 5000]
            },
            rounds_passed: {
                title: t("achievement_rounds_passed_title"),
                description: t("achievement_rounds_passed_desc"),
                thresholds: [50, 100, 200]
            },
            games_played: {
                title: t("achievement_games_played_title"),
                description: t("achievement_games_played_desc"),
                thresholds: [10, 25, 50]
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
                    towers_placed: '<span class="achievement-icon" title="Torres colocadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🏹</span>',
                    towers_uograded: '<span class="achievement-icon" title="Torres mejoradas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🔧</span>',
                    gold_earned: '<span class="achievement-icon" title="Oro ganado" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">💰</span>',
                    gems_earned: '<span class="achievement-icon" title="Gemas ganadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">💎</span>',
                    rounds_passed: '<span class="achievement-icon" title="Rondas superadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🛡️</span>',
                    games_played: '<span class="achievement-icon" title="Partidas jugadas" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🎮</span>'
                };
                const iconHTML = icons[key] || '<span class="achievement-icon" style="font-size:2.1em;vertical-align:middle;margin-right:0.5em;">🏆</span>';

                let nextMsg = '';
                if (stars < 3) {
                    if (stars === 0) {
                        nextMsg = `Kill ${config.thresholds[0]} enemies to earn a star.`;
                    } else if (stars === 1) {
                        nextMsg = `Kill ${config.thresholds[1]} enemies to earn a star.`;
                    } else if (stars === 2) {
                        nextMsg = `Kill ${config.thresholds[2]} enemies to earn a star.`;
                    }
                } else {
                    nextMsg = `<span style='color:#ffe066'>Achievement completed!</span>`;
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

        document.title = t('profile_title', document.title);
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key, el.textContent);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la información del usuario.");
    }
});
