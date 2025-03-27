let currentPage = 1;
const limit = 120;

async function fetchUsers() {
  try {
    const token = localStorage.getItem('token');
    console.log(token);
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
                const userId = button.getAttribute('data-user-id');
                deleteUser(userId);
            });
        });

    document.getElementById('pageInfo').textContent = `Página ${data.currentPage} de ${data.totalPages}`;

    document.getElementById('prevBtn').disabled = data.currentPage === 1;
    document.getElementById('nextBtn').disabled = data.currentPage === data.totalPages;

  } catch (err) {
    console.error('Error al obtener usuarios:', err);
  }
}

function deleteUser(userId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este usuario?');
  
  if (confirmDelete) {
      const token = localStorage.getItem('token');
      fetch(`${serverUrl}/api/admin/deleteUSer/${userId}`, {
        method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,  
              'Content-Type': 'application/json',
          }
      })
      .then(() => {
          alert('Usuario eliminado');
          fetchUsers();  
      })
      .catch(err => {
          console.error('Error deleting user:', err);
          alert('Hubo un error al eliminar el usuario');
      });
  }
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