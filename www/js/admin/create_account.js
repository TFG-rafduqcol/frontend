document.addEventListener("DOMContentLoaded", function () {


    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const role = document.getElementById("role");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");

    document.querySelector(".button-create").addEventListener("click", function () {
        console.log("hola")
    
        let valid = true;

        [firstName, lastName, username, email, password, confirmPassword].forEach(input => {
            input.classList.remove("error");
            input.style.color = "";
        });

        function setError(input, message) {
            input.placeholder = message;
            input.classList.add("error");
            input.style.color = "";
            input.style.setProperty("--placeholder-color", "#9b111e");
        }


        if (username.value.trim() === "") {
            setError(username, "Username required!");
            valid = false;
        } else if (username.value.trim().length < 3 || username.value.trim().length > 10) {
            username.value = "";
            setError(username, "Username must be between 3 and 9 characters!");
            valid = false;
        }

        if (firstName.value.trim() === "") {
            setError(firstName, "First name required!");
            valid = false;
        } else if (firstName.value.trim().length < 3 || firstName.value.trim().length > 50) {
            firstName.value = "";
            setError(firstName, "First name must be between 3 and 50 characters!");
            valid = false;
        }

        if (lastName.value.trim() === "") {
            setError(lastName, "Last name required!");
            valid = false;
        } else if (lastName.value.trim().length < 3 || lastName.value.trim().length > 50) {
            lastName.value = "";
            setError(lastName, "Last name must be between 3 and 50 characters!");
            valid = false;
        }

        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.value.trim() === "") {
            setError(email, "Email required!");
            valid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            email.value = "";
            setError(email, "Invalid email!");
            valid = false;
        }

        if (password.value.trim() === "") {
            setError(password, "Password required!");
            valid = false;
        } else if (!isPasswordSecure(password.value.trim())) {
            password.value = "";
            setError(password, "Use 8+ chars 1 lowercase and 1 number.");
            valid = false;
        }

        if (confirmPassword.value.trim() === "") {
            setError(confirmPassword, "Confirm your password!");
            valid = false;
        } else if (confirmPassword.value.trim() !== password.value.trim()) {
            confirmPassword.value = "";
            setError(confirmPassword, "Passwords do not match!");
            valid = false;
        }
        console.log(role.value.trim())

        const parsed_role = role.value.trim() == "admin" ? true : false;
        console.log(parsed_role)

        if (valid) {

            let formData = {
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                username: username.value.trim(),
                password: password.value.trim(),
                role: parsed_role
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
            })
            .then(data => {
                if (data.error) {
                    if (data.error === "EmailDuplicate") {
                        alert(`Registration failed: ${data.message}`);
                    } else {
                        alert(`Registration failed: ${data.error} - ${data.message}`);
                    }
                } else {
                    console.log("Success:", data);
                    
                }
            })
            .catch(error => {
                console.error("Error caught in catch block:", error);
                alert("There was an error registering the user: " + (error.message || error));
            });
        }
    });

    function isPasswordSecure(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordPattern.test(password);
    }


});
