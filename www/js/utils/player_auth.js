const player = localStorage.getItem('user')
if (!player) {
    alert("You are not authorized to access this page.");
    window.location.href = "/www/views/index.html"; 
}
else {
    document.body.style.display = "flex";
}
