// Servidor Express para servir el frontend en HTTPS
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8443;

// Ruta a los certificados (ajusta si es necesario)
const certPath = path.join(__dirname, 'certificates');
const options = {
  key: fs.readFileSync(path.join(certPath, 'key.pem')),
  cert: fs.readFileSync(path.join(certPath, 'cert.pem'))
};

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'www')));

// Redirigir todas las rutas al index.html (SPA)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Frontend servido en https://localhost:${PORT}`);
});
