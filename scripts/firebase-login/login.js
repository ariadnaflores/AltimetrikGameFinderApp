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

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  // Crear una instancia de autenticación de Firebase
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      const user = userCredential.user;
      
      alert('Entraste');
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