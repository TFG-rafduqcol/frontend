const player = localStorage.getItem('user')
if (!player) {
    alert("You are not authorized to access this page.");
    localStorage.clear(); 
    window.location.href = "../../index.html"; 
}
else {
    document.body.style.display = "flex";
}
