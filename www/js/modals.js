let modalLoaded = false;

function loadModal() {
    if (!modalLoaded) {
        url = 'http://127.0.0.1:8000/www/views/components/settings_modal.html';
       

        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById('modal-placeholder').innerHTML = data;
                modalLoaded = true;

                const modal = document.getElementById('modalContainer');
                const overlay = document.querySelector('.overlay');
                if (modal && overlay) {
                    modal.style.display = 'flex';
                    overlay.style.display = 'flex';
                }
            })
            .catch(error => console.error('Error loading the modal:', error));
    }
}

function openModal() {
    loadModal();

    const modalInterval = setInterval(() => {
        const modal = document.getElementById('modalContainer');
        const overlay = document.querySelector('.overlay');

        if (modal && overlay) {
            modal.style.display = 'flex';
            overlay.style.display = 'flex';
            clearInterval(modalInterval);
        }
    }, 100);
}

function closeModal() {
    const modal = document.getElementById('modalContainer');
    const overlay = document.querySelector('.overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token'); 
    window.location.href = 'http://127.0.0.1:8000/www/views/auth/login'; 
}
document.addEventListener('DOMContentLoaded', () => {
    const modalPlaceholder = document.getElementById('modal-placeholder');
    if (modalPlaceholder) {
        modalPlaceholder.addEventListener('click', function (event) {
            if (event.target.classList.contains('close-btn')) {
                closeModal();
            }
            if (event.target.id === 'logout-btn'){
                logout();
            }
        });
    } else {
        console.error("The modal container is not available.");
    }
});
 