let serverUrl = "http://192.168.100.7:3000"; // IP correcta según el usuario

// Lista de IPs alternativas para probar SOLO por HTTP
const alternativeUrls = [
    "http://192.168.137.7:3000",    // IP correcta
    "http://192.168.137.1:3000",    // Otra IP de la red
    "http://192.168.100.7:3000",    // Segunda IP detectada
    "http://10.0.2.2:3000",         // Para emulador Android
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // Prueba de rangos de IP comunes en redes domésticas
    "http://192.168.1.100:3000",
    "http://192.168.1.101:3000",
    "http://192.168.0.100:3000",
    "http://192.168.0.101:3000"
];



window.serverUrl = serverUrl;

