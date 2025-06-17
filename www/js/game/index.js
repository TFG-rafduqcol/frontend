params = new URLSearchParams(window.location.search);
const gameId = params.get('gameId');

const token = localStorage.getItem('token');

let gold = 350;
let lives = 1;
let round = 51;

document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.volume = 0.10;
        document.body.addEventListener('click', () => {
            if (bgMusic.paused) bgMusic.play();
        }, { once: true });
    }
});



