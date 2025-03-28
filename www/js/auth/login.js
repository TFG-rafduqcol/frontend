document.addEventListener("DOMContentLoaded", function () {

    const email = document.getElementById("email");
    const password = document.getElementById("password");

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
        }

        if (email.value.trim() === "") {
            setError(email, "Email required!");
            valid = false;
        }

        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email.value.trim())) {
            email.value = "";
            setError(email, "Invalid email!");
            valid = false;
        }

        if (password.value.trim() === "") {
            setError(password, "Password required!");
            valid = false;
        } else  if (!isPasswordSecure(password.value.trim())) {
            password.value = "";
            setError(password, "Use 8+ chars, 1 lowercase and 1 number");
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
                .then(response => {

                    if (response.status === 404) {
                        return response.json().then(data => {
                            email.value = "";
                            setError(email, data.message || "Email not registered");
                        });
                    } else if (response.status === 401) {
                        return response.json().then(data => {
                            password.value = "";    
                            setError(password, "Invalid password");
                        });
                    } else if (response.ok) {
                        return response.json();
                    } else {
                        return response.json().then(data => {
                            setError(email, data.message || "Invalid credentials");
                        });
                    }
                })
                .then(data => {
                    if (data && data.token) {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        if (data.user.isAdmin) {
                            window.location = "../admin/index.html";
                        } else {
                        window.location = "../menu/index.html";
                        }
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred. Please try again later.");
                });
        }
    });

    function isPasswordSecure(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }

    let style = document.createElement("style");
    style.innerHTML = "input::placeholder { color: var(--placeholder-color, #FFFF99); }";
    document.head.appendChild(style);
    
});
