# TowerDefense Frontend

## Descripción
TowerDefense es un juego de estrategia en el que los jugadores deben defender su base de las hordas enemigas utilizando torres con diferentes habilidades. El objetivo es sobrevivir el mayor número de rondas posible mientras mejoras tus torres y estrategias.

El frontend de este proyecto está desarrollado utilizando Capacitor y tecnologías web como HTML, CSS y JavaScript. Está diseñado para ser compatible con dispositivos móviles y navegadores.

## Características
- Generación de hordas enemigas.
- Sincronización de rondas entre el DOM y la lógica del juego.
- Interfaz multilenguaje.
- Estilo adaptado para dispositivos móviles.

## Requisitos
- Node.js instalado.
- Capacitor CLI instalado.
- Android Studio para compilar y probar la APK.

## Pasos para compilar la APK

1. **Instalar dependencias**:
   Ejecuta el siguiente comando en la carpeta del frontend:
   ```bash
   npm install
   ```

2. **Configurar Capacitor**:
   Asegúrate de que el archivo `capacitor.config.json` esté correctamente configurado con el ID y nombre de la aplicación.

3. **Sincronizar Capacitor**:
   Ejecuta:
   ```bash
   npx cap sync android
   ```

4. **Compilar la APK**:
   ./gradlew assembleRelease ò .gradlew assembleDebug, según si deseas una versión de lanzamiento o de depuración. Este comando generará el archivo APK en la ruta `android/app/build/outputs/apk/release/app-release-unsigned.apk` o `android/app/build/outputs/apk/debug/app-debug.apk`. En caso de ser la release, asegúrate de que el archivo `release-key.jks` esté configurado correctamente para firmar la APK. 


6. **Probar la APK**:
   Instala el archivo `app-release-signed.apk` en un dispositivo Android y verifica su funcionamiento.
