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