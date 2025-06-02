const player = localStorage.getItem('user')
if (!player) {
    alert("You are not authorized to access this page.");
    window.location.href = "../../index.html"; // Usamos ruta relativa en vez de absoluta
}
else {
    document.body.style.display = "flex";
}
