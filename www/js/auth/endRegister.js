document.addEventListener("DOMContentLoaded", function () {
    
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm-password");

    // Cargar traducciones para los mensajes de error
    const loadTranslations = () => {
        const lang = localStorage.getItem("language") || "en";
        // Usar rutas relativas en lugar de basadas en origin
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

    loadTranslations();

    document.querySelector(".button-save").addEventListener("click", function () {
        console.log("hola");
        let valid = true;

        [username, password, confirmPassword].forEach(input => {
            input.classList.remove("error");
            input.style.color = "";
        });

        function setError(input, message) {
            input.placeholder = message;
            input.classList.add("error");
            input.style.color = "";
            input.style.setProperty("--placeholder-color", "#9b111e");
        }        if (username.value.trim() === "") {
            setError(username, window.translations?.username_required || "Username required!");
            valid = false;
        } else if (username.value.trim().length < 3 || username.value.trim().length > 10) {
            username.value = "";
            setError(username, window.translations?.username_length || "Username must be between 3 and 9 characters!");
            valid = false;
        }

        if (password.value.trim() === "") {
            setError(password, window.translations?.password_required || "Password required!");
            valid = false;
        } else if (!isPasswordSecure(password.value.trim())) {
            password.value = "";
            setError(password, window.translations?.password_insecure || "Use 8+ chars 1 lowercase and 1 number.");
            valid = false;
        }

        if (confirmPassword.value.trim() === "") {
            setError(confirmPassword, window.translations?.confirm_password_required || "Confirm your password!");
            valid = false;
        } else if (confirmPassword.value.trim() !== password.value.trim()) {
            confirmPassword.value = "";
            setError(confirmPassword, window.translations?.passwords_dont_match || "Passwords do not match!");
            valid = false;
        }

        if (valid) {

            let formData = {
                firstName: localStorage.getItem("firstName"),
                lastName: localStorage.getItem("lastName"),
                email: localStorage.getItem("email"),
                username: username.value.trim(),
                password: password.value.trim()
            };

            fetch(`${serverUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        return Promise.reject(errorData);
                    });
                }
                return response.json();  
            })            .then(data => {
                if (data.error) {
                    if (data.error === "EmailDuplicate") {
                        alert(`${window.translations?.registration_failed || "Registration failed"}: ${data.message}`);
                    } else {
                        alert(`${window.translations?.registration_failed || "Registration failed"}: ${data.error} - ${data.message}`);
                    }
                } else {
                    console.log("Success:", data);
                    localStorage.removeItem("firstName");
                    localStorage.removeItem("lastName");
                    localStorage.removeItem("email");
                    window.location.href = "login.html";
                }
            })
            .catch(error => {
                console.error("Error caught in catch block:", error);
                alert(`${window.translations?.registration_error || "There was an error registering the user"}: ${error.message || error}`);
            });
        }
    });    function isPasswordSecure(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }

    let style = document.createElement("style");
    style.innerHTML = `
        input::placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1; /* Para Firefox */
        }
        input::-webkit-input-placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1;
        }
        input:-moz-placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1;
        }
        input::-moz-placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1;
        }
        input:-ms-input-placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
