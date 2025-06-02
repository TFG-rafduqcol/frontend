const loadTranslations = () => {
    const lang = localStorage.getItem("language") || "en";
    fetch(`../../lang/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            window.translations = translations;
        })
        .catch((error) => {
            console.error("Error loading language file:", error);
        });
};
