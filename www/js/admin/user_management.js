document.addEventListener("DOMContentLoaded", function () {

  document.body.style.display = "block";


  let currentPage = 1;
  let selectedUserId = null;
  const confirmModal = document.getElementById('confirm-modal');
  const confirmButton = document.getElementById('confirm-button');
  const cancelButton = document.getElementById('cancel-button');
  

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${serverUrl}/api/admin/getAllUsers`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`  
          }
          });
      const data = await response.json();

      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = '';

      data.users.forEach(user => {
        console.log(user);
        const row = `<tr>
                      <td>${user.id}</td>
                      <td>${user.username}</td>
                      <td>${user.isAdmin}</td>
                      <td>${user.email}</td>
                      <td>
                        <button class="deleteBtn" data-user-id="${user.id}">Eliminar</button>
                      </td>
                    </tr>`;
                    
        tbody.innerHTML += row;
      });

      const deleteButtons = document.querySelectorAll('.deleteBtn');
          deleteButtons.forEach(button => {
              button.addEventListener('click', function () {
                  selectedUserId = button.getAttribute('data-user-id');
                  confirmModal.style.display = 'block';
                  
              });
          });

      document.getElementById('pageInfo').textContent = `Página ${data.currentPage} de ${data.totalPages}`;

      document.getElementById('prevBtn').disabled = data.currentPage === 1;
      document.getElementById('nextBtn').disabled = data.currentPage === data.totalPages;

    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  }

  cancelButton.addEventListener('click', function() {
    confirmModal.style.display = 'none';
  });

  confirmButton.addEventListener('click', function () {

    deleteUser(selectedUserId);
    confirmModal.style.display = 'none'; 

  
  });

  function deleteUser(userId) {
    
      const token = localStorage.getItem('token');
      fetch(`${serverUrl}/api/admin/deleteUSer/${userId}`, {
        method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,  
              'Content-Type': 'application/json',
          }
      })
      .then(() => {
        confirmModal.style.display = 'none';  
          alert('Usuario eliminado correctamente');
          fetchUsers();  
      })
      .catch(err => {
          console.error('Error deleting user:', err);
          alert('Hubo un error al eliminar el usuario');
      });

  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchUsers(currentPage);
    }
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    currentPage++;
    fetchUsers(currentPage);
  });

  fetchUsers();
    
  });
