// Importar los módulos necesarios de Firebase
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Obtener referencia al enlace de registro
const registerLink = document.getElementById("register-link");
// Escuchar el evento click del enlace de registro
registerLink.addEventListener("click", () => {
  // Abrir el formulario de registro
  window.location.href = "register.html";
});

// Aquí va el inicio de sesión
const signIn = document.getElementById("login-button");

signIn.addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;
  
  // Crear una instancia de autenticación de Firebase
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      const user = userCredential.user;
      
      alert('User logged');
      console.log('user logged')
      // Redireccionar a una página específica (home.html en este caso)
      window.location.href = 'home.html';
    })
    .catch((error) => {
      // Ocurrió un error durante el inicio de sesión
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
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