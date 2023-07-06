const API_URL = "http://localhost:3000";

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;

  const apiUrl = `${API_URL}/users?email=${email}&password=${password}`;

  fetchLogin(apiUrl)
    .then((response) => {
      if (response.length > 0) {
        // Inicio de sesión exitoso
        alert('Inicio de sesión exitoso');
        window.location.href = 'home.html';
      } else {
        // Credenciales inválidas
        alert('Credenciales inválidas');
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function fetchLogin(apiUrl) {
  return fetch(apiUrl)
    .then((response) => response.json());
}

// Obtener referencia al enlace de registro
const registerLink = document.getElementById("register-link");
// Escuchar el evento click del enlace de registro
registerLink.addEventListener("click", () => {
  // Abrir el formulario de registro
  window.location.href = "register.html";
});

//Mostrar y ocultar contraseña
const togglePassword = document.querySelector(".toggle-password");
togglePassword.addEventListener("click", function () {
  const password = document.querySelector("#input-password");
  const type = password.getAttribute("type") === "password" ? "text" : "password";

  password.setAttribute("type", type);

  if (togglePassword.src.match("images/icons-login/eye-slash.svg")) {
    togglePassword.src = "images/icons-login/eye.svg"
  } else {
      togglePassword.src = "images/icons-login/eye-slash.svg"
  }
});

//Dark Mode ON - OFF
document.addEventListener("DOMContentLoaded", function() {
  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", function() {
    if (toggleButton.alt === "Dark mode on") {
      toggleButton.src = "./images/on.svg";
      toggleButton.alt = "Dark mode off";
    } else {
      toggleButton.src = "./images/off.svg";
      toggleButton.alt = "Dark mode on";
    }
  });
});