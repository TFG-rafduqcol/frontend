document.addEventListener("DOMContentLoaded", () => {

    loadTranslations(); 

    let selectedAvatarId = null;
    const user = JSON.parse(localStorage.getItem('user'));  

    if (user) {
        document.getElementById("gems").textContent = user.gems || 0;
    }

    function showModal(avatarId) {
        selectedAvatarId = avatarId;
        document.getElementById('confirm-modal').style.display = 'flex';
    }

    function hideModal() {
        document.getElementById('confirm-modal').style.display = 'none';
    }

    document.getElementById('confirm-button').addEventListener('click', () => {
        buyAvatar(selectedAvatarId);
        hideModal();
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
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
            gemText.classList.add('gems-span');
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
        shopAvatarContainer.innerHTML = ''; 
        
        const emptyShopContainer = document.createElement('div');
        emptyShopContainer.className = 'empty-shop-container';
        
        const iconElement = document.createElement('i');
        iconElement.className = 'fa-solid fa-medal'; 
        
        const titleElement = document.createElement('h2');
        titleElement.setAttribute('data-i18n', 'shop_no_avatars_available');
        titleElement.textContent = t('shop_no_avatars_available', 'No avatars available');
        
        const congratsElement = document.createElement('p');
        congratsElement.setAttribute('data-i18n', 'shop_collected_all');
        congratsElement.textContent = t('shop_collected_all', 'You have collected all available avatars!');
        
        const checkLaterElement = document.createElement('p');
        checkLaterElement.setAttribute('data-i18n', 'shop_check_later');
        checkLaterElement.textContent = t('shop_check_later', 'Check back later for new additions.');
        
        emptyShopContainer.appendChild(iconElement);
        emptyShopContainer.appendChild(titleElement);
        emptyShopContainer.appendChild(congratsElement);
        emptyShopContainer.appendChild(checkLaterElement);
        
        shopAvatarContainer.appendChild(emptyShopContainer);
        }
    })
    .catch(error => {
        console.error('Error fetching avatars:', error);
        document.getElementById('error-message').innerText = 'Error retrieving avatars.';
    });
    
    const translations = {
        es: {
            shop_title: "Tienda de Avatares",
            home: "Inicio",
            shop_error_insufficient_gems: "No tienes suficientes gemas para comprar este avatar.",
            shop_error_generic: "Ocurrió un error al intentar comprar el avatar.",
            shop_confirm_modal_message: "¿Estás seguro que quieres comprar este avatar?",
            shop_yes_buy: "Sí, comprar",
            shop_cancel: "Cancelar",
            shop_no_avatars_available: "No hay avatares disponibles en la tienda",
            shop_collected_all: "¡Felicidades! Ya has coleccionado todos los avatares disponibles.",
            shop_check_later: "Vuelve más tarde para ver nuevas adiciones."
        },
        en: {
            shop_title: "Avatar Shop",
            home: "Home",
            shop_error_insufficient_gems: "You don't have enough gems to buy this avatar.",
            shop_error_generic: "An error occurred while trying to buy the avatar.",
            shop_confirm_modal_message: "Are you sure you want to buy this avatar?",
            shop_yes_buy: "Yes, Buy",
            shop_cancel: "Cancel",
            shop_no_avatars_available: "No avatars available in the shop",
            shop_collected_all: "Congratulations! You have collected all available avatars.",
            shop_check_later: "Check back later for new additions."
        }
    };

    function getLang() {
        console.log(localStorage.getItem('language'));
        return (localStorage.getItem('language') || 'en');
    }

    function t(key, fallback) {
        const lang = getLang();
        if (translations[lang] && translations[lang][key]) {
            return translations[lang][key];
        }
        if (translations['es'][key]) return translations['es'][key];
        return fallback || key;
    }

    function applyShopTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = t(key, el.textContent);
        });
    }
    applyShopTranslations();

    function showErrorPopup(messageKey, fallback) {
        let popup = document.getElementById('shop-error-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'shop-error-popup';
            popup.className = 'shop-error-popup';
            popup.innerHTML = `<span id="shop-error-popup-msg"></span>`;
            document.body.appendChild(popup);
        }
        let msg = t(messageKey, fallback);
        document.getElementById('shop-error-popup-msg').textContent = msg;
        popup.setAttribute('data-i18n', messageKey);
        popup.setAttribute('data-i18n-text', msg);
        popup.style.display = 'block';
        popup.style.opacity = '1';
        if (popup._timeout) clearTimeout(popup._timeout);
        popup._timeout = setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => { popup.style.display = 'none'; }, 350);
        }, 2500);
    }

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
                    showErrorPopup('shop_error_insufficient_gems', 'No tienes suficientes gemas para comprar este avatar.');
                } else {
                    showErrorPopup('shop_error_generic', 'Ocurrió un error al intentar comprar el avatar.');
                }
                throw new Error(data.message || 'Error en la compra');
            }
            const user = JSON.parse(localStorage.getItem('user'));
            user.gems -= data.avatar.gems;
            localStorage.setItem('user', JSON.stringify(user));
            
            window.location.href = './index.html';
        })
        .catch(error => {
            console.error('Error comprando avatar:', error);
        });
    }
});
