const API_URL = 'http://localhost:3000';
let currentSlide = 1;

const token = localStorage.getItem("jwt");
if (token) {
  location.href = '/home.html';
}

window.addEventListener('load', function() {
  const form = this.document.forms[0];
  form.addEventListener('submit', submitForm);
});

function submitForm(event) {
  event.preventDefault();

  const inputEmail = document.querySelector('#username');
  const inputPassword = document.querySelector('#password');
  const dataUser = {
    email: inputEmail.value,
    password: inputPassword.value
  };

  if (!isEmailValid(inputEmail.value) || !isPasswordValid(inputPassword.value)) {
    showError("Some of the data entered is not valid");
    return;
  }

  if (inputEmail.value === "" || inputPassword.value === "") {
    showError("Credentials cannot be empty");
    return;
  }

  fetchLogin(`${API_URL}/login`, dataUser)
    .then(response => {
      if (response.status !== 200) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('jwt', data.accessToken);
      localStorage.setItem('id', data.user.id);
      location.href = '/home.html';
    })
    .catch(() => {
      showError("Some of the data entered is not valid");
    });
}

function showError(error) {
  const errorContainer = document.querySelector('#error-container');
  errorContainer.classList.remove('hidden');
  errorContainer.innerHTML = `<small>${error}</small>`;
}

function fetchLogin(apiUrl, payload) {
  const settings = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(payload),
  };

  return fetch(apiUrl, settings);
}

function isEmailValid(email) {
  // Validación básica de formato de correo electrónico
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
}

function isPasswordValid(password) {
  // Validación básica de la longitud mínima de la contraseña
  return password.length >= 6;
}  