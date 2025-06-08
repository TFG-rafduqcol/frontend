// Detectar si estamos en app móvil o navegador
const isMobile = window.Capacitor !== undefined || window.cordova !== undefined;

// Cambia la IP si necesitas acceder desde el móvil a tu PC
const serverUrl = 'https://192.168.100.7:3443'; // Siempre usar la IP del PC
window.serverUrl = serverUrl;



