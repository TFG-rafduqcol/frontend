# Script para ejecutar Gradle con Java 17
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Imprime información sobre Java para verificar
Write-Host "Java Home: $env:JAVA_HOME"
& java -version

# Ejecuta Gradle con los argumentos proporcionados
Write-Host "Ejecutando: .\gradlew.bat $args"
& ".\gradlew.bat" $args
if ($LASTEXITCODE -ne 0) {
    Write-Host "Gradle falló con código de salida: $LASTEXITCODE"
} else {
    Write-Host "Gradle se ejecutó correctamente"
}
