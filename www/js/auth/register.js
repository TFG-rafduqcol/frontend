document.addEventListener("DOMContentLoaded", function () {
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let email = document.getElementById("email");


    loadTranslations();

    if (localStorage.getItem("firstName")) {
        firstName.value = localStorage.getItem("firstName");
    }
    if (localStorage.getItem("lastName")) {
        lastName.value = localStorage.getItem("lastName");
    }
    if (localStorage.getItem("email")) {
        email.value = localStorage.getItem("email");
    }

    document.querySelector(".button-next").addEventListener("click", async function () {
        let valid = true;

        [firstName, lastName, email].forEach(input => {
            input.classList.remove("error");
            input.style.color = "";
        });

        function setError(input, message) {
            input.placeholder = message;
            input.classList.add("error");
            input.style.setProperty("--placeholder-color", "#9b111e");
        }        if (firstName.value.trim() === "") {
            setError(firstName, window.translations?.firstname_required || "First name required!");
            valid = false;
        } else if (firstName.value.trim().length < 3 || firstName.value.trim().length > 50) {
            firstName.value = "";
            setError(firstName, window.translations?.firstname_length || "First name must be between 3 and 50 characters!");
            valid = false;
        }

        if (lastName.value.trim() === "") {
            setError(lastName, window.translations?.lastname_required || "Last name required!");
            valid = false;
        } else if (lastName.value.trim().length < 3 || lastName.value.trim().length > 50) {
            lastName.value = "";
            setError(lastName, window.translations?.lastname_length || "Last name must be between 3 and 50 characters!");
            valid = false;
        }

        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.value.trim() === "") {
            setError(email, window.translations?.email_required || "Email required!");
            valid = false;        } else if (!emailPattern.test(email.value.trim())) {
            email.value = "";
            setError(email, window.translations?.invalid_email || "Invalid email!");
            valid = false;
        }

        if (!valid) return; 

        try {
            let response = await fetch(`${serverUrl}/api/auth/checkEmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.value.trim() }),
            });

            let data = await response.json();

            if (response.ok) {
                if (data.exists) {
                    email.value = "";
                    setError(email, window.translations?.email_already_registered || "Email already registered!");
                    valid = false;
                    return;
                }

                localStorage.setItem("firstName", firstName.value.trim());
                localStorage.setItem("lastName", lastName.value.trim());
                localStorage.setItem("email", email.value.trim());

                window.location.href = "end_register.html";
            } else {
                console.error("Error en el servidor:", data.message);
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    });

    document.querySelector(".button-back").addEventListener("click", function () {
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");
        localStorage.removeItem("email");    });

    let style = document.createElement("style");
    style.innerHTML = `
        input::placeholder { 
            color: var(--placeholder-color, #FFFF99); 
            opacity: 1;
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