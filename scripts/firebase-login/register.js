// Importar los módulos necesarios de Firebase
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const snackbar = document.getElementById("snackbar");
const snackbarMessage = document.getElementById("snackbar-message");
const snackbarButton = document.getElementById("snackbar-button");

// Obtener referencia al botón de registro
const register = document.getElementById("register-button");

// Escuchar el evento click del botón de registro
register.addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  // Obtener los valores del email y contraseña del formulario
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Crear el usuario con el email y contraseña proporcionados
  createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
      // El usuario se ha registrado correctamente
      const user = userCredential.user;

      // Realizar acciones adicionales después del registro
      showSnackbar("Usuario creado correctamente");
    })
    .catch((error) => {
      // Ocurrió un error durante el registro
      const errorCode = error.code;
      const errorMessage = error.message;
      // Manejar el error de acuerdo a tus necesidades
      showSnackbar(errorMessage);
    });
});

// Función para mostrar el snackbar con un mensaje
function showSnackbar(message) {
  snackbarMessage.textContent = message;
  snackbar.classList.add("show");
}

// Escuchar el evento click del botón del snackbar
snackbarButton.addEventListener("click", () => {
  snackbar.classList.remove("show");
  window.location.href = "index.html";
});