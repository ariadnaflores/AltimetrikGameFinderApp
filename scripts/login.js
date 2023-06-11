// Importar los módulos necesarios de Firebase
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Obtener referencia al botón de inicio de sesión
const logIn = document.getElementById("login-button");

// Escuchar el evento click del botón de inicio de sesión
logIn.addEventListener("click", (e) => {
  e.preventDefault();

  // Obtener los valores del email y contraseña del formulario
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Crear una instancia de autenticación de Firebase
  const auth = getAuth();

  // Crear el usuario con el email y contraseña proporcionados
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // El usuario se ha registrado correctamente
      const user = userCredential.user;
      // Realizar acciones adicionales después del registro
      alert('User created')
    })
    .catch((error) => {
      // Ocurrió un error durante el registro
      const errorCode = error.code;
      const errorMessage = error.message;
      // Manejar el error de acuerdo a tus necesidades
      alert(errorMessage)
    });
});
