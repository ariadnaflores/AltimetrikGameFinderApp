  function logout() {
    // Eliminar la sesión almacenada del usuario
    sessionStorage.removeItem('loggedIn');
  
    // Reemplazar la página actual con la página de inicio
    history.replaceState(null, null, '/index.html');

    // Redireccionar al usuario al home
    location.href = '/index.html';
  }

  // Obtener referencias a los elementos del modal
  const logoutLink = document.querySelector('.log-out');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogoutButton = document.getElementById('confirmLogout');
  const cancelLogoutButton = document.getElementById('cancelLogout');

  // Asignar evento de click al enlace de logout
  logoutLink.addEventListener('click', () => {
    // Función para abrir el modal
    function openLogoutModal() {
      logoutModal.style.display = 'block';
    }

    // Llamar a la función para abrir el modal
    openLogoutModal();
  });

  // Función para cerrar el modal
  function closeLogoutModal() {
    logoutModal.style.display = 'none';
  }

  // Asignar eventos de click a los botones del modal
  confirmLogoutButton.addEventListener('click', logout);
  cancelLogoutButton.addEventListener('click', closeLogoutModal);