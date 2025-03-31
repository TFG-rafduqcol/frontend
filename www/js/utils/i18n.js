document.addEventListener("DOMContentLoaded", function () {
    const defaultLang = "en"; 
    let currentLang = localStorage.getItem("language") || defaultLang;
    const baseURL = `${window.location.origin}/www/lang/`;

    function loadLanguage(lang) {
        fetch(`${baseURL}${lang}.json`)
            .then(response => response.json())
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
    }

    window.changeLanguage = function (lang) {
        localStorage.setItem("language", lang);
        loadLanguage(lang);
    };

    fetch(`${window.location.origin}/www/views/components/language-selector.html`)
    .then(response => response.text())
    .then(html => {
        const languageSelector = document.createElement("div");
        languageSelector.innerHTML = html;
        document.body.appendChild(languageSelector);
    })
    .catch(error => console.error('Error loading language selector component:', error));

loadLanguage(currentLang);
});