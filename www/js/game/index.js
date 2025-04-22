params = new URLSearchParams(window.location.search);
const gameId = params.get('gameId');

const token = localStorage.getItem('token');

reponse = fetch(`${serverUrl}/api/games/getGame/${gameId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,    
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Game session data:", data);
  })
  .catch(error => {
    console.error("Error fetching game session:", error);
  });

