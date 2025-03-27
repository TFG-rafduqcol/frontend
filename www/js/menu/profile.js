const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

if (user) {

    document.getElementById("avatar").src = user.avatar || "";
    document.getElementById("username").textContent = `${user.username}`;
    document.getElementById("id").textContent = `#${user.id}`;
    document.getElementById("level").textContent = `${user.level}`;

    console.log(user.range);

    document.getElementById("range_url").src = `${user.range_url}`;
    document.getElementById("range").textContent = `${user.range}`;
} else {
    console.log("User data not found");
}

    

