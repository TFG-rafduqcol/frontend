document.addEventListener("DOMContentLoaded", function () {
    const defaultLang = "en"; 
    let currentLang = localStorage.getItem("language") || defaultLang;
    
    // Usar rutas relativas en lugar de basadas en origin
    // La ruta debería ser relativa a donde se encuentra la página actual
    function loadLanguage(lang) {
        // Determinar cuántos niveles de directorios tenemos que subir
        let pathPrefix = "../../";
        
        // Si estamos en la raíz, no necesitamos subir niveles
        if (window.location.pathname.endsWith('/www/') || window.location.pathname.endsWith('/www/index.html')) {
            pathPrefix = "";
        } 
        // Si estamos en /views/
        else if (window.location.pathname.includes('/www/views/') && !window.location.pathname.includes('/www/views/auth/')) {
            pathPrefix = "../";
        }
        
        fetch(`${pathPrefix}lang/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(translations => {
                document.querySelectorAll("[data-i18n]").forEach(element => {
                    const key = element.getAttribute("data-i18n");
                    if (translations[key]) {
                        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                            element.setAttribute("placeholder", translations[key]); 
                        } else {
                            element.innerHTML = translations[key];
                        }
                    }
                });
            })
            .catch(error => console.error("Error loading language file:", error));
    }    window.changeLanguage = function (lang) {
        localStorage.setItem("language", lang);
        loadLanguage(lang);
    };

    // Usar rutas relativas para cargar el selector de idioma
    let pathPrefix = "../../";
    if (window.location.pathname.endsWith('/www/') || window.location.pathname.endsWith('/www/index.html')) {
        pathPrefix = "";
    } 
    else if (window.location.pathname.includes('/www/views/') && !window.location.pathname.includes('/www/views/auth/')) {
        pathPrefix = "../";
    }

    fetch(`${pathPrefix}views/components/language-selector.html`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        const languageSelector = document.createElement("div");
        languageSelector.innerHTML = html;
        document.body.appendChild(languageSelector);
    })
    .catch(error => console.error('Error loading language selector component:', error));

loadLanguage(currentLang);
});