const user = JSON.parse(localStorage.getItem('user'));  

if (user) {

    const experience = user.experience;    
    const baseExperience = 2000; 
    const additionalExperience = 300; 
    const level = Math.floor((experience - baseExperience) / additionalExperience) + 1;
    const maxExperience = 2000 + level * 300;
    const progressPercentage = (experience / maxExperience) * 100;

    document.getElementById("level").textContent = `${level}`;
    document.getElementById("experience").textContent = `${experience} / ${maxExperience}`;
    document.getElementById("xp-fill").style.width = `${progressPercentage}%`;

    document.getElementById("gold").textContent = user.gold || 0;
    document.getElementById("gems").textContent = user.gems || 0;
    document.getElementById("username").textContent = user.username || "User";
    document.getElementById("avatar").src = user.avatar || "";
    document.getElementById("range").src = user.range_url || "";
    console.log(user);
} else {
    console.log("User data not found");
}
