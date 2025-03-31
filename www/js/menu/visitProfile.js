document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        alert("Usuario no encontrado.");
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/api/social/getUserById/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos del usuario.");
        }

        const data = await response.json();

        const user = data.player;

    
        document.getElementById("avatar").src = user.avatar || "";
        document.getElementById("username").textContent = `${user.username}`;
        document.getElementById("id").textContent = `#${user.id}`;
        document.getElementById("level").textContent = `${user.level}`;
        document.getElementById("range_url").src = `${user.range_url}`;
        document.getElementById("range").textContent = `${user.range}`;
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo cargar la información del usuario.");
    }
});
