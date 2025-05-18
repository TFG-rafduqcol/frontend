document.addEventListener("DOMContentLoaded", () => {

    let selectedAvatarId = null;
    const user = JSON.parse(localStorage.getItem('user'));  

    if (user) {
        document.getElementById("gems").textContent = user.gems || 0;
    }

    function showModal(avatarId) {
        selectedAvatarId = avatarId;
        document.getElementById('confirmModal').style.display = 'flex';
    }

    function hideModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }

    document.getElementById('confirmBuyBtn').addEventListener('click', () => {
        buyAvatar(selectedAvatarId);
        hideModal();
    });

    document.getElementById('cancelBuyBtn').addEventListener('click', () => {
        hideModal();
    });



    const token = localStorage.getItem('token'); 

    fetch(`${serverUrl}/api/avatars/getMyAvatars`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  
        }
    })
    .then(response => response.json())
    .then(data => {
    const shopAvatarContainer = document.getElementById('shop-avatars-container');

    if (data.remainings_avatars && data.remainings_avatars.length > 0) {

        data.remainings_avatars.forEach(avatar => {
            const shopAvatar = document.createElement('div');
            shopAvatar.classList.add('shop-avatar');

            const avatarImage = document.createElement('img');
            avatarImage.src = avatar.image_url;

            const priceContainer = document.createElement('div');
            priceContainer.classList.add('price-container'); 
            priceContainer.style.display = 'flex';
            priceContainer.style.alignItems = 'center';
            priceContainer.style.justifyContent = 'center';
            priceContainer.style.marginTop = '5px';

            const gemIcon = document.createElement('i');
            gemIcon.classList.add('fa-solid', 'fa-gem');

            const gemText = document.createElement('span');
            gemText.textContent = avatar.gems;

            priceContainer.appendChild(gemIcon);
            priceContainer.appendChild(gemText);

            

            shopAvatar.appendChild(avatarImage);
            shopAvatar.appendChild(priceContainer);
            
            shopAvatar.addEventListener('click', () => {
                showModal(avatar.id);
            });

            shopAvatarContainer.appendChild(shopAvatar);
        });
    } else {
        shopAvatarContainer.innerHTML = '<p>No remaining avatars available.</p>';

        }

    })
    .catch(error => {
        console.error('Error fetching avatars:', error);
        document.getElementById('error-message').innerText = 'Error retrieving avatars.';
    });
    
    function buyAvatar(avatarId) {
        fetch(`${serverUrl}/api/avatars/buyAvatar/${avatarId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'InsufficientCoins') {
                    alert('No tienes suficientes gemas para comprar este avatar.');
                } else {
                    alert('Ocurrió un error al intentar comprar el avatar.');
                }
                throw new Error(data.message || 'Error en la compra');
            }

            window.location.href = './index.html';
        })
        .catch(error => {
            console.error('Error comprando avatar:', error);
        });
    }


});
