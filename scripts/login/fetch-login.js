const API_URL = "http://localhost:3000";

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;

  const apiUrl = `${API_URL}/users?email=${email}&password=${password}`;

  try {
    const response = await fetchLogin(apiUrl);
    if (response.length > 0) {
      // Login successful
      console.log('Login successful');
      sessionStorage.setItem('loggedIn', 'true'); // Set session flag
      window.location.href = 'home.html';
    } else {
      // Invalid credentials
      console.error('Error: Invalid credentials');
    }
  } catch (error) {
    console.log(error);
  }
});

// Check login status
function fetchLogin(apiUrl) {
  return fetch(apiUrl)
    .then((response) => response.json());
}

// Get reference to the registration link
const registerLink = document.getElementById("register-link");
// Listen for the click event of the registration link
registerLink.addEventListener("click", () => {
// Open the registration form
  window.location.href = "register.html";
});

//Show and hide password
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