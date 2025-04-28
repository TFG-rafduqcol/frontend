params = new URLSearchParams(window.location.search);
const gameId = params.get('gameId');

const token = localStorage.getItem('token');

let gold = 500;
let lives = 20;
let round = 1;

// const backgroundMusic = document.getElementById('backgroundMusic');
// backgroundMusic.volume = 0.3;
