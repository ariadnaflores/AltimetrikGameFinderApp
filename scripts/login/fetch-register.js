const API_URL = "http://localhost:3000";

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const payload = { email, password };

  fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      // Realizar acciones adicionales después del registro
      showSnackbar("Usuario creado correctamente");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Función para mostrar el snackbar con un mensaje
const snackbarMessage = document.getElementById("snackbar-message");

function showSnackbar(message) {
  snackbarMessage.textContent = message;
  snackbar.classList.add("show");
}

// Escuchar el evento click del botón del snackbar
const snackbarButton = document.getElementById("snackbar-button");

snackbarButton.addEventListener("click", () => {
  snackbar.classList.remove("show");
  window.location.href = "index.html";
})