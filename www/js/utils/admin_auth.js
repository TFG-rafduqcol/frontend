const url = serverUrl + "/api/admin/isAdmin";
const token = localStorage.getItem("token");

async function checkAdminStatus() {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error("Error en la petición: " + response.status);
        }

        const data = await response.json();
        return data.isAdmin; 
    } catch (error) {
        console.error("Error verificando estado de admin:", error);
        return false;
    }
}

checkAdminStatus().then(isAdmin => {
    if (isAdmin) {
        document.body.style.display = "block";

    } else {
        alert("You are not authorized to access this page.");
        localStorage.clear(); 
        window.location.href = "/www/views/index.html";
    }
});
