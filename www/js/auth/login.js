document.addEventListener("DOMContentLoaded", function () {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
        window.location.href = "../menu/index.html";
        return;
    }

    const email = document.getElementById("email");
    const password = document.getElementById("password");    const setInitialPlaceholders = () => {
        const lang = localStorage.getItem("language") || "en";
        fetch(`../../lang/${lang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(translations => {
                email.placeholder = translations.enter_email_placeholder || "Enter your email";
                password.placeholder = translations.enter_password_placeholder || "Enter your password";
                
                window.translations = translations;
            })
            .catch((error) => {
                console.error("Error loading language file:", error);
                email.placeholder = "Enter your email";
                password.placeholder = "Enter your password";
            });
    };

    setInitialPlaceholders();

    document.querySelector(".button-go").addEventListener("click", function () {
    
        let valid = true;

        [email, password].forEach(input => {
            input.classList.remove("error");
            input.style.color = "";
        });

        function setError(input, message) {
            input.placeholder = message;
            input.classList.add("error");
            input.style.color = "";
            input.style.setProperty("--placeholder-color", "#9b111e");
        }        if (email.value.trim() === "") {
            setError(email, window.translations?.email_required || "Email required!");
            valid = false;
        }

        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email.value.trim())) {
            email.value = "";
            setError(email, window.translations?.invalid_email || "Invalid email!");
            valid = false;
        }

        if (password.value.trim() === "") {
            setError(password, window.translations?.password_required || "Password required!");
            valid = false;
        } else  if (!isPasswordSecure(password.value.trim())) {
            password.value = "";
            setError(password, window.translations?.password_insecure || "Use 8+ chars, 1 uppercase and 1 number");
            valid = false;
        }

        if (valid) {
            fetch(`${serverUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value.trim(),
                    password: password.value.trim()
                })
            })
                .then(response => {                    if (response.status === 404) {
                        return response.json().then(data => {
                            email.value = "";
                            setError(email, data.message || window.translations?.email_not_registered || "Email not registered");
                        });
                    } else if (response.status === 401) {
                        return response.json().then(data => {
                            password.value = "";    
                            setError(password, window.translations?.invalid_password || "Invalid password");
                        });
                    } else if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(data => {
                            setError(email, data.message || window.translations?.invalid_credentials || "Invalid credentials");
                        });
                    }
                })
                .then(data => {
                    if (data && data.token) {
                        console.log("hola")
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        console.log(data)
                        if (data.user.isAdmin === true) {
                            window.location = "../admin/index.html";
                        } else {
                            localStorage.setItem("isAdmin", "false");
                            window.location = "../menu/index.html";
                        }
                    }
                }).catch(error => {
                    console.error("Error:", error);
                    alert(window.translations?.error_try_again || "An error occurred. Please try again later.");
                });
        }
    });

    function isPasswordSecure(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }    let style = document.createElement("style");
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