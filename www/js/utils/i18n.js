document.addEventListener("DOMContentLoaded", function () {
    const defaultLang = "en"; 
    let currentLang = localStorage.getItem("language") || defaultLang;
    
    function loadLanguage(lang) {
        let pathPrefix = "../../";

        if (window.location.pathname.endsWith('/www/') || window.location.pathname.endsWith('/www/index.html')) {
            pathPrefix = "";
        } 
        else if (window.location.pathname.includes('/www/views/auth/')) {
            pathPrefix = "../../";
        }
        else if (window.location.pathname.includes('/www/views/menu/')) {
            pathPrefix = "../../";
        }
        else if (window.location.pathname.includes('/www/views/')) {
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

    let pathPrefix = "../../";
    if (window.location.pathname.endsWith('/www/') || window.location.pathname.endsWith('/www/index.html')) {
        pathPrefix = "";
    } 
    else if (window.location.pathname.includes('/www/views/auth/')) {
        pathPrefix = "../../";
    }
    else if (window.location.pathname.includes('/www/views/menu/')) {
        pathPrefix = "../../";
    }
    else if (window.location.pathname.includes('/www/views/')) {
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