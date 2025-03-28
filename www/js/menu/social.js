document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const containers = document.querySelectorAll("#find-user, #friends-list, #requests");
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("language") || "en"; 

  const translations = {
    en: {
      find_user: "Find User",
      your_friends: "Your Friends",
      requests: "Friend Requests",
      pending: "Pending",
      accept: "Accept",
      addFriend: "Send Request",
      reject: "Reject",
      yourself: "Yourself",
      removeFriend: "Remove",
      goodRequest: "Request sent successfully.",
      deleteSucess: "Friend removed successfully.",
      rejected: "Rejected",
      user_not_found: "User not found."
    },
    es: {
      find_user: "Buscar Jugador",
      your_friends: "Tus amigos",
      requests: "Solicitudes de Amistad",
      pending: "Pendiente",
      accept: "Aceptar",
      addFriend: "Enviar Solicitud",
      reject: "Rechazar",
      yourself: "Tú",
      removeFriend: "Eliminar", 
      goodRequest: "Solicitud enviada correctamente.", 
      deleteSucess: "Amigo eliminado correctamente.",
      rejected: "Rechazado",
      user_not_found: "Jugador no encontrado."
    }
  };

  const apiRequest = async (url, method = "GET", body = null) => {
    try {
      const options = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      alert("Error in the request.");
      return null;
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      containers.forEach(container => container.classList.add("hidden"));

      const target = document.getElementById(tab.dataset.target);
      if (target) {
        target.classList.remove("hidden");
      }

      if (target.id === "friends-list") {
        fetchData(`${serverUrl}/api/social/getMyFriends`, "friends-list");
      } else if (target.id === "requests") {
        fetchData(`${serverUrl}/api/social/getMyFriendRequests`, "requests");
      }
      applyTranslations(translations, lang);

    });
  });

  document.querySelector(".search-btn").addEventListener("click", () => {

    const searchValue = document.querySelector(".search-input").value.trim();
    if (searchValue) {
      const resultContainer = document.querySelector("#searchResult");
      resultContainer.innerHTML = "";
      resultContainer.removeAttribute("data-i18n");
  
      fetch(`${serverUrl}/api/social/getUserByUsernameOrId/${searchValue}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log(response);
          if (response.status === 404) {
            resultContainer.setAttribute("data-i18n", "user_not_found");
            applyTranslations(translations, lang);
            return null;
          }
          if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          if (data) {
            const items = data.users;
            items.forEach(item => {
              const card = createUserCard(item, "find-user");
              resultContainer.appendChild(card);
            });
          }
        })
        .catch(error => {
          console.error("Error fetching friends:", error);
          alert("Error fetching friends.");
        });
  
    } else {
      alert("Please enter a user ID or username.");
    }
  });
  
  const fetchData = async (url, containerId) => {
    const data = await apiRequest(url);
    if (!data) return;

    const container = document.querySelector(`#${containerId}`);
    const tab = document.querySelector(".tab.active");
    const targetId = document.getElementById(tab.dataset.target).id;

    if (targetId === "find-user") {
      const resultContainer = document.querySelector("#searchResult");
      resultContainer.innerHTML = "";
    } else {
      container.innerHTML = "";
    }

    const items = data.users || data.friends;
    if (items.length === 0) {
      const noData = document.createElement("div");
      noData.classList.add("no-data");
      noData.textContent = containerId === "find-user" ? "User not found." : "You have no friends yet.";
      container.appendChild(noData);
      return;
    }

    items.forEach(item => {
      const card = createUserCard(item, targetId);
      if (targetId === "find-user") {
        const resultContainer = document.querySelector("#searchResult");
        resultContainer.appendChild(card);

        const searchValue = document.querySelector(".search-input");
        searchValue.value = "";
      } else {
        container.appendChild(card);
      }
    });

    applyTranslations(translations, lang);
  };

  const createUserCard = (user, targetId) => {

    const card = document.createElement("div");
    card.classList.add(targetId === "find-user" ? "user-card" : "friend-card");

    const avatarContainer = document.createElement("div");
    avatarContainer.classList.add("avatar-logo");
    const avatarImage = document.createElement("img");
    avatarImage.src = user.avatar;
    avatarImage.alt = `${user.username}'s avatar`;
    avatarImage.classList.add("avatar");
    avatarContainer.appendChild(avatarImage);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container");
    const userInfo = document.createElement("div");
    userInfo.classList.add("friend-info");

    const xpLevel = document.createElement("div");
    xpLevel.classList.add("xp-level");
    xpLevel.textContent = `${user.level || user.experience}`;

    const username = document.createElement("div");
    username.classList.add("username");
    username.textContent = `${user.username}`;

    userInfo.appendChild(xpLevel);
    userInfo.appendChild(username);

    const rangeInfo = document.createElement("div");
    rangeInfo.classList.add("range-info");

    const range = document.createElement("div");
    range.classList.add("range");
    range.textContent = `${user.range || "N/A"}`;

    const rangeIcon = document.createElement("img");
    rangeIcon.src = "../../images/logo.png";
    rangeIcon.alt = user.range || "Default range";
    rangeIcon.classList.add("range-icon");

    rangeInfo.appendChild(range);
    rangeInfo.appendChild(rangeIcon);

    infoContainer.appendChild(userInfo);
    infoContainer.appendChild(rangeInfo);

    const actionBtnContainer = document.createElement("div");
    actionBtnContainer.classList.add("action-btn-container");

    let actionBtn = document.createElement("button");


    if (targetId === "find-user") {

      if (user.friendshipStatus === "not_friends" || user.friendshipStatus === "rejected_by_yourself") {
        actionBtn.classList.add("add-btn");
        actionBtn.textContent = "";
        actionBtn.setAttribute("data-i18n", "addFriend");
        actionBtn.addEventListener("click", () => sendFriendRequest(user.id));
      } else if (user.friendshipStatus === "already_send") {
        actionBtn.classList.add("pending-btn");
        actionBtn.textContent = "";
        actionBtn.setAttribute("data-i18n", "pending");
      } else if (user.friendshipStatus === "pending") {
        const acceptBtn = document.createElement("button");
        acceptBtn.classList.add("add-btn");
        acceptBtn.textContent = "";
        acceptBtn.setAttribute("data-i18n", "accept");
        actionBtnContainer.appendChild(acceptBtn);

        const rejectBtn = document.createElement("button");
        rejectBtn.classList.add("remove-btn");
        rejectBtn.textContent = "";
        rejectBtn.setAttribute("data-i18n", "reject");
        actionBtnContainer.appendChild(rejectBtn);

        acceptBtn.addEventListener("click", () => changeFriendRequestStatus(user.id, "accepted"));
        rejectBtn.addEventListener("click", () => changeFriendRequestStatus(user.id, "rejected"));
      } else if (user.friendshipStatus === "me") {
        actionBtn.classList.add("yourself-btn");
        actionBtn.textContent = "";
        actionBtn.setAttribute("data-i18n", "yourself");
        actionBtn.disabled = true;
      } else if (user.friendshipStatus === "rejected") {
        actionBtn.classList.add("remove-btn");
        actionBtn.textContent = "";
        actionBtn.setAttribute("data-i18n", "rejected");
        actionBtn.disabled = true;
      } 
      else {
        actionBtn.classList.add("remove-btn");
        actionBtn.textContent = "";
        actionBtn.setAttribute("data-i18n", "removeFriend");
        actionBtn.addEventListener("click", () => removeFriend(user.id));
      }
    } 
    
    else if (targetId === "friends-list") {
      actionBtn.classList.add("remove-btn");
      actionBtn.textContent = "";
      actionBtn.setAttribute("data-i18n", "removeFriend");
      actionBtn.addEventListener("click", () => removeFriend(user.id));
    }
    
    else if (targetId === "requests") {
      const acceptBtn = document.createElement("button");
      acceptBtn.classList.add("add-btn");
      acceptBtn.textContent = "";
      acceptBtn.setAttribute("data-i18n", "accept");
      actionBtnContainer.appendChild(acceptBtn);

      const rejectBtn = document.createElement("button");
      rejectBtn.classList.add("remove-btn");
      rejectBtn.textContent = "";
      rejectBtn.setAttribute("data-i18n", "reject");
      actionBtnContainer.appendChild(rejectBtn);

      acceptBtn.addEventListener("click", () => changeFriendRequestStatus(user.id, "accepted"));
      rejectBtn.addEventListener("click", () => changeFriendRequestStatus(user.id, "rejected"));
    }

    card.appendChild(avatarContainer);
    card.appendChild(infoContainer);

    if (targetId === "requests" || (targetId === "find-user" && user.friendshipStatus === "pending")) {
      card.appendChild(actionBtnContainer);
    } else {
      card.appendChild(actionBtn);
    }
    document.getElementById(targetId).appendChild(card);
    applyTranslations(translations, lang);

    return card;
  };

  const sendFriendRequest = async (userId) => {
    const data = await apiRequest(`${serverUrl}/api/social/sendFriendRequest/${userId}`, "POST");
    if (data) {
      document.getElementById("searchResult").innerHTML = "";
      document.getElementById("searchResult").setAttribute("data-i18n", "goodRequest");
      applyTranslations(translations, lang);
    }
  };

  const changeFriendRequestStatus = async (userId, status) => {
    const data = await apiRequest(`${serverUrl}/api/social/changeFriendRequestStatus/${userId}`, "POST", { status });
    if (data) fetchData(`${serverUrl}/api/social/getMyFriendRequests`, "requests");
  };

  const removeFriend = async (userId) => {
    const data = await apiRequest(`${serverUrl}/api/social/removeFriend/${userId}`, "DELETE");
    const tab = document.querySelector(".tab.active");
    const targetId = document.getElementById(tab.dataset.target).id;

    if (data && targetId === "friends-list"){
      fetchData(`${serverUrl}/api/social/getMyFriends`, "friends-list");
    } else{
      document.getElementById("searchResult").innerHTML = "";
      document.getElementById("searchResult").setAttribute("data-i18n", "deleteSucess");
      applyTranslations(translations, lang);
    }
  };

  const applyTranslations = (translations, lang) => {
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key] || key; 
    });
  };

});
