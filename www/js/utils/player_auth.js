const isAdmin = localStorage.getItem('user').isAdmin === 'true';
if (!isAdmin) {
    alert("You are not authorized to access this page.");
    window.location.href = "http://127.0.0.1:8000/www/views/index.html"; 
}
else {
    document.body.style.display = "block";
}
