document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token'); 

    fetch(`${serverUrl}/api/avatars/getMyAvatars`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  
        }
    })
    .then(response => response.json())
    .then(data => {

        const active_avatar = data.active_avatar;

        if (active_avatar && active_avatar.image_url) {

            const activeAvatarContainer = document.getElementById('active-avatar-container');

            const activeAvatar = document.createElement('div');
            activeAvatar.classList.add('active-avatar');
            
            const avatarImage = document.createElement('img');
            avatarImage.src = data.active_avatar.image_url;

            activeAvatar.appendChild(avatarImage);
            activeAvatarContainer.appendChild(activeAvatar);
        }
        if (data.user_avatars && data.user_avatars.length > 0) {
            const userAvatarContainer = document.getElementById('avatars-container');
            
            const activeAvatar = data.user_avatars.find(avatar => avatar.id === active_avatar.id);
            if (activeAvatar) {
                const userAvatar = document.createElement('div');
                userAvatar.classList.add('user-avatar');
        
                const avatarImage = document.createElement('img');
                avatarImage.src = activeAvatar.image_url;
                avatarImage.style.border = '0.5vh solid #FFFF99';
                avatarImage.style.boxShadow = '0 0 15px 5px rgba(255, 255, 153, 0.7)';
        
                userAvatar.appendChild(avatarImage);
                userAvatarContainer.appendChild(userAvatar);
        
            }
        
            data.user_avatars.forEach(avatar => {
                if (avatar.id !== active_avatar.id) { 
                    const userAvatar = document.createElement('div');
                    userAvatar.classList.add('user-avatar');
        
                    const avatarImage = document.createElement('img');
                    avatarImage.src = avatar.image_url;
        
                    userAvatar.appendChild(avatarImage);
                    userAvatarContainer.appendChild(userAvatar);
        
                    userAvatar.addEventListener('click', () => {
                        changeMyActiveAvatar(avatar.id, avatar.image_url);
                    });
                }
            });
        }
        

        if (data.remainings_avatars && data.remainings_avatars.length > 0) {

            const remainingAvatarContainer = document.getElementById('avatars-container');


            data.remainings_avatars.forEach(avatar => {

                const remainingAvatar = document.createElement('div');
                remainingAvatar.classList.add('remaining-avatar');

                const avatarImage = document.createElement('img');
                avatarImage.src = avatar.image_url;

                const lockIcon = document.createElement('div');
                lockIcon.classList.add('lock-icon');

                const lockImage = document.createElement('img');
                lockImage.src = '../../images/lock.png';

                lockIcon.appendChild(lockImage);
                remainingAvatar.appendChild(avatarImage);
                remainingAvatar.appendChild(lockIcon);

                remainingAvatarContainer.appendChild(remainingAvatar);
            });


               }

    })
    .catch(error => {
        console.error('Error fetching avatars:', error);
        document.getElementById('error-message').innerText = 'Error retrieving avatars.';
    });
    
    function changeMyActiveAvatar(avatarId, imageUrl) {
        fetch(`${serverUrl}/api/avatars/changeMyActiveAvatar/${avatarId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': `application/json`
            }
        })
        .then(response => response.json())
        .then(data => {
            let user = JSON.parse(localStorage.getItem('user'));
            user.avatar = imageUrl;
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'index.html';
        })

        .catch(error => {
            console.error('Error changing active avatar:', error);
            document.getElementById('error-message').innerText = 'Error changing active avatar.';
        });
    }

});
