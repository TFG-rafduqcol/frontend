const user = JSON.parse(localStorage.getItem('user'));  

if (user) {

    const experience = user.experience;    
    const baseExperience = 2000; 
    const additionalExperience = 300; 
    const level = Math.floor((experience - baseExperience) / additionalExperience) + 1;
    const maxExperience = 2000 + level * 300;
    const progressPercentage = (experience / maxExperience) * 100;

    document.getElementById("level").textContent = `${level}`;
    document.getElementById("experience").textContent = `${experience} / ${maxExperience}`;
    document.getElementById("xp-fill").style.width = `${progressPercentage}%`;

    document.getElementById("gems").textContent = user.gems || 0;
    document.getElementById("username").textContent = user.username || "User";
    document.getElementById("avatar").src = user.avatar || "";
    document.getElementById("range").src = user.range_url || "";

    const normalModeBtn = document.getElementById('normal-mode-btn');
    const hardModeBtn = document.getElementById('hard-mode-btn');

    function startGame(hardMode) {
        try {
            const token = localStorage.getItem('token');
            fetch(`${serverUrl}/api/games/createGame`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    path: "game.html",
                    hardMode: hardMode
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                localStorage.setItem("isHardMode", hardMode);
                return response.json();
            })
            .then(data => {
                console.log("Game created successfully:", data);
                window.location.href = "../game/index.html?gameId=" + data.id;
            })
            .catch(error => {
                console.error("Error creating game:", error);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    if (normalModeBtn && hardModeBtn) {
        normalModeBtn.addEventListener('click', function() {
            startGame(false);
        });
        hardModeBtn.addEventListener('click', function() {
            startGame(true);
        });
    }

} else {
    console.log("User data not found");
}

document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.volume = 0.15;
        document.body.addEventListener('click', () => {
            if (bgMusic.paused) bgMusic.play();
        }, { once: true });
    }
});
