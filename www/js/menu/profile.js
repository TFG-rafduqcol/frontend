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

        const achievements = {
            enemies_killed: {
                title: "Cazador de Enemigos",
                description: "Mata enemigos para obtener estrellas.",
                thresholds: [1000, 2500, 5000]
            },
            towers_placed: {
                title: "Arquitecto Estratégico",
                description: "Coloca torres para mejorar tu defensa.",
                thresholds: [50, 150, 300]
            },
            towers_uograded: {
                title: "Maestro de la Mejora",
                description: "Mejora tus torres para aumentar su poder.",
                thresholds: [10, 25, 50]
            },
            gold_earned: {
                title: "Acumulador de Oro",
                description: "Gana oro durante tus partidas.",
                thresholds: [10000, 25000, 50000]
            },
            gems_earned: {
                title: "Rey de las Gemas",
                description: "Gana gemas para mejorar tu experiencia.",
                thresholds: [1000, 2500, 5000]
            },
            rounds_passed: {
                title: "Sobreviviente",
                description: "Sobrevive a muchas oleadas de enemigos.",
                thresholds: [50, 100, 200]
            },
            games_played: {
                title: "Veterano de Batallas",
                description: "Juega muchas partidas para ser reconocido.",
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

                return `
                    <div class="achievement">
                        <h2 class="achievement-title">${config.title}</h2>
                        <p class="achievement-description">${config.description}</p>
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
