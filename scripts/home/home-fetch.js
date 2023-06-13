const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';
const gameDataElement = document.getElementById('game-data');
const lastSearchesElement = document.getElementById('last-searches');
const searchInput = document.getElementById('search-input');
const searchSuggestionsElement = document.getElementById('search-suggestions');
let lastSearches = [];
let selectedSuggestionIndex = -1;

// Realizar la solicitud a la API utilizando fetch para mostrar todos los datos
fetch(`${apiUrl}/games?key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    // Manipular los datos obtenidos
    const games = data.results;
    let html = '';

    games.forEach(game => {
      // Construir la estructura HTML con los datos del juego
      html += `<h2>${game.name}</h2>`;
      html += `<p>Rating: ${game.rating}</p>`;
      html += `<img src="${game.background_image}" alt="${game.name}" /><br><br>`;
    });

    // Insertar la estructura HTML en el elemento <div>
    gameDataElement.innerHTML = html;
    // Mostrar los datos en la consola
    console.log(games);
  })
  .catch(error => {
    // Manejar errores en caso de que la solicitud falle
    console.log('Error:', error);
  });

// Función para buscar por título de juego
function searchGamesByTitle(searchTerm) {
  fetch(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      const games = data.results;
      let html = '';

      games.forEach(game => {
        html += `<h2>${game.name}</h2>`;
        html += `<p>Rating: ${game.rating}</p>`;
        html += `<img src="${game.background_image}" alt="${game.name}" /><br><br>`;
      });

      gameDataElement.innerHTML = html;
      console.log(games);

      lastSearches.push(searchTerm); // Add current search term to the lastSearches array
      lastSearches = lastSearches.slice(-2); // Limit the array to the last 2 searches
      displaySelectedSearches(); // Actualizar la visualización de las últimas búsquedas
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Búsqueda en tiempo real
searchInput.addEventListener('input', event => {
  const searchTerm = event.target.value;
  searchGamesByTitle(searchTerm);
  getSuggestions(searchTerm); // Get search suggestions based on current input
});

// Obtener sugerencias de búsqueda basadas en el término de búsqueda actual
function getSuggestions(searchTerm) {
  if (searchTerm === '') {
    searchSuggestionsElement.innerHTML = ''; // Clear suggestions if input is empty
    return;
  }

  fetch(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      const games = data.results;
      let html = '';

      games.forEach(game => {
        html += `<li>${game.name}</li>`;
      });

      searchSuggestionsElement.innerHTML = html;
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Resaltar la sugerencia seleccionada
function highlightSuggestion() {
  const suggestions = searchSuggestionsElement.children;
  for (let i = 0; i < suggestions.length; i++) {
    if (i === selectedSuggestionIndex) {
      suggestions[i].classList.add('selected');
    } else {
      suggestions[i].classList.remove('selected');
    }
  }
}

// Event listener para las teclas de flecha hacia arriba y abajo
searchInput.addEventListener('keydown', event => {
  const key = event.key;

  if (key === 'ArrowUp') {
    event.preventDefault();
    if (selectedSuggestionIndex > 0) {
      selectedSuggestionIndex--;
      highlightSuggestion();
    }
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    if (selectedSuggestionIndex < searchSuggestionsElement.children.length - 1) {
      selectedSuggestionIndex++;
      highlightSuggestion();
    }
  } else if (key === 'Enter') {
    event.preventDefault();
    if (selectedSuggestionIndex !== -1) {
      selectSuggestion();
    }
  }
});

// Event listener para hacer clic en una sugerencia
searchSuggestionsElement.addEventListener('click', event => {
  const clickedElement = event.target;
  const suggestionElement = clickedElement.closest('li');

  if (suggestionElement) {
    selectedSuggestionIndex = Array.from(searchSuggestionsElement.children).indexOf(suggestionElement);
    selectSuggestion();
  }
});

// Array para almacenar las búsquedas seleccionadas por el usuario
let selectedSearches = [];

// Función para seleccionar una sugerencia
function selectSuggestion() {
  const selectedSuggestion = searchSuggestionsElement.children[selectedSuggestionIndex].textContent;
  searchInput.value = selectedSuggestion;
  searchGamesByTitle(selectedSuggestion);
  searchSuggestionsElement.innerHTML = ''; // Limpiar las sugerencias después de seleccionar una

  // Agregar la búsqueda seleccionada al array de búsquedas seleccionadas
  selectedSearches.unshift(selectedSuggestion);

  // Limitar el array a las dos últimas búsquedas seleccionadas
  selectedSearches = selectedSearches.slice(0, 2);

  // Mostrar las búsquedas seleccionadas en la consola
  console.log(selectedSearches);

  // Mostrar las búsquedas seleccionadas en el historial
  displaySelectedSearches();
}

// Función para mostrar las búsquedas seleccionadas en el historial
function displaySelectedSearches() {
  lastSearchesElement.innerHTML = '';
  const container = document.createElement('div');

  selectedSearches.forEach(searchTerm => {
    const searchItem = document.createElement('p');
    searchItem.textContent = searchTerm;
    container.appendChild(searchItem);
  });

  lastSearchesElement.appendChild(container);
}