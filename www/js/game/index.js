params = new URLSearchParams(window.location.search);
const gameId = params.get('gameId');

const token = localStorage.getItem('token');

let gold = 350;
let lives = 1;
let round = 50;

const backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.volume = 0.1;  


function ensureBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(error => {
            console.log("No se pudo reproducir la música de fondo:", error);
        });
    }
}

ensureBackgroundMusic();