document.addEventListener("DOMContentLoaded", function () {


    const user = JSON.parse(localStorage.getItem('user'));  
    const userId = user.id;

    if (user) {
        document.getElementById("firstname").value = user.firstName || "";
        document.getElementById("lastname").value = user.lastName || "";
        document.getElementById("username").value = user.username || "";
        document.getElementById("email").value = user.email || "";
        
    } else {
        console.log("User data not found");
    }


    let firstName = document.getElementById("firstname");
    let lastName = document.getElementById("lastname");
    let email = document.getElementById("email");
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm-password");
    let valid = true;

    const saveButton = document.getElementById('save-button');

    function setError(input, message) {
        input.placeholder = message;
        input.classList.add("error");
        input.style.color = "";
        input.style.setProperty("--placeholder-color", "#9b111e");
    }
  
    saveButton.addEventListener("click", function () {

        [firstName, lastName, username, email, password, confirmPassword].forEach(input => {
            input.classList.remove("error");
            input.style.color = "";
        });


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

        if (username.value.trim() === "") {
            setError(username, "Username required!");
            valid = false;
        } else if (username.value.trim().length < 3 || username.value.trim().length > 10) {
            username.value = "";
            setError(username, "Username must be between 3 and 10 characters!");
            valid = false;
        }

        if (password.value.trim() !== "" && !isPasswordSecure(password.value.trim())) {
            password.value = "";
            setError(password, "Use 8+ chars, 1 uppercase, 1 uppercase and 1 number");
            valid = false;
        }

        if (confirmPassword.value.trim() !== password.value.trim()) {
            confirmPassword.value = "";
            setError(confirmPassword, "Passwords do not match!");
            valid = false;
        } 

        if (valid) {
            [firstName, lastName, username, email, password, confirmPassword].forEach(input => {
                input.classList.remove("error");
                input.style.color = "";
            });
            updateAdminProfile();
        }
    });

    document.getElementById("logout").addEventListener("click", logout);

    
function updateAdminProfile() {

    let formData = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim() === "" ? undefined : password.value.trim()
    };

    fetch(`${serverUrl}/api/auth/update/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
    })
        .then(response => {

            if (response.status === 401) {
                return response.json().then(data => {
                    alert(data.message);
                });
            }
            if (response.status === 400) {
                return response.json().then(data => {
                    if (data.error === "EmailAlreadyExists") {
                        email.value = "";
                        setError(email, 'This email is already taken by another user.');
                    } else {
                        alert(data.message || 'An error occurred');  
                    }
                });
            }
            if (response.ok) {
                return response.json().then(data => {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    location.href = "./index.html";
                });
            }
        })
        .catch(error => {
            console.error("User update failed:", error);
        });
    }
});

function isPasswordSecure(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
}


function logout() {
    localStorage.clear();
    window.location.href = '/www/views/auth/login'; 
}
