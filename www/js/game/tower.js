// Asegurarse de que el script solo se ejecute después de que la imagen del mapa cargue
window.addEventListener("load", function () {
    console.log("tower.js cargado correctamente");

    // Obtener el canvas y su contexto
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Definir zonas donde se pueden colocar torres
    const towerZones = [
        { x: 100, y: 200, width: 50, height: 50, occupied: false },
        { x: 300, y: 400, width: 50, height: 50, occupied: false },
        { x: 500, y: 150, width: 50, height: 50, occupied: false },
    ];

    // Definir el desplazamiento del canvas
    let offsetX = 0;
    let offsetY = 0;

    // Función para dibujar las zonas clicables (depuración)
    function drawZones() {
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Verde semitransparente
        towerZones.forEach(zone => {
            // Dibujar las zonas teniendo en cuenta el desplazamiento
            ctx.fillRect(zone.x - offsetX, zone.y - offsetY, zone.width, zone.height);
        });
    }

    // Función para verificar si un clic está dentro de una zona
    function isInsideZone(x, y) {
        return towerZones.find(zone =>
            x >= zone.x - offsetX && x <= zone.x + zone.width - offsetX &&
            y >= zone.y - offsetY && y <= zone.y + zone.height - offsetY &&
            !zone.occupied
        );
    }

    // Función para colocar una torre en la zona
    function placeTower(event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const zone = isInsideZone(clickX, clickY);

        if (zone) {
            zone.occupied = true;
            drawTower(zone.x + zone.width / 2, zone.y + zone.height / 2);
        }
    }

    // Función para dibujar una torre en el canvas
    function drawTower(x, y) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(x - offsetX, y - offsetY, 20, 0, Math.PI * 2); // Ajustar a la posición
        ctx.fill();
    }

    // Agregar el evento de clic al canvas
    canvas.addEventListener("click", placeTower);

    // Dibujar las zonas una vez que el mapa esté cargado
    drawZones();

    // Función para manejar el desplazamiento (scroll)
    function handleScroll(event) {
        // Cambiar el valor del desplazamiento de acuerdo con el movimiento de la rueda
        offsetX += event.deltaX * 0.5; // Modificar la velocidad del desplazamiento
        offsetY += event.deltaY * 0.5;

        // Limitar el desplazamiento para evitar que el mapa se desplace más allá de los bordes
        offsetX = Math.max(Math.min(offsetX, 0), -(mapImage.width * scale - canvas.width));
        offsetY = Math.max(Math.min(offsetY, 0), -(mapImage.height * scale - canvas.height));

        // Redibujar el mapa y las zonas después del desplazamiento
        drawMap();
        drawZones();
    }

    // Agregar el evento de scroll al canvas
    canvas.addEventListener("wheel", handleScroll);
});
