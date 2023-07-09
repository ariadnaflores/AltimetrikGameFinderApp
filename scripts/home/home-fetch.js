const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';
const gameDataElement = document.getElementById('game-data');
const lastSearchesElement = document.getElementById('last-searches');
const searchInput = document.getElementById('search-input');
const searchSuggestionsElement = document.getElementById('search-suggestions');
const noSearchesMessage = document.querySelector('.games-list-game');
let lastSearches = [];
let selectedSuggestionIndex = -1;

function renderGames(games) {
  gameDataElement.innerHTML = '';

  games.forEach((game, index) => {
    const card = createCard(game);
    const indexElement = createIndexElement(index + 1);
    card.appendChild(indexElement);
    gameDataElement.appendChild(card);
  });
  console.log(games);
}

function createCard(game) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  image.src = game.background_image;
  image.alt = game.name;
  card.appendChild(image);

  const heartContainer = document.createElement('div'); // Crea el contenedor para el heartIcon
  heartContainer.classList.add('heart-container'); // Agrega una clase CSS al contenedor si es necesario

  const heartIcon = document.createElement('img');
  heartIcon.src = './images/icons-home/heart.svg';
  heartIcon.alt = 'Heart icon';
  heartContainer.appendChild(heartIcon); // Agrega el heartIcon al contenedor

  card.appendChild(heartContainer); // Agrega el contenedor al card

  const title = document.createElement('h2');
  title.textContent = game.name;
  card.appendChild(title);

  const release = document.createElement('p');
  const releaseLabel = document.createElement('span');
  releaseLabel.textContent = 'Release:';
  releaseLabel.classList.add('release-label'); // Agrega una clase CSS al elemento
  release.appendChild(releaseLabel);

  const releaseDate = document.createElement('span');
  releaseDate.textContent = ` ${game.release}`;
  releaseDate.classList.add('release-date'); // Agrega una clase CSS al elemento
  release.appendChild(releaseDate);

  card.appendChild(release);

  const genres = document.createElement('p');
  const genresLabel = document.createElement('span');
  genresLabel.textContent = 'Genres:';
  genresLabel.classList.add('genres-label'); // Agrega una clase CSS al elemento
  genres.appendChild(genresLabel);

  const genresList = document.createElement('span');
  genresList.textContent = ` ${game.genres.map(genre => genre.name).join(', ')}`;
  genresList.classList.add('genres-list'); // Agrega una clase CSS al elemento
  genres.appendChild(genresList);

card.appendChild(genres);

  return card;
}

function createIndexElement(index) {
  const indexElement = document.createElement('p');
  indexElement.textContent = `#${index}`;
  indexElement.classList.add('card-index');
  return indexElement;
}

fetch(`${apiUrl}/games?key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const games = data.results;
    renderGames(games);
  })
  .catch(error => {
    console.log('Error:', error);
  });

function searchGamesByTitle(searchTerm) {
  fetch(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      const games = data.results;
      renderGames(games);

      lastSearches.push(searchTerm);
      lastSearches = lastSearches.slice(-2);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

searchInput.addEventListener('input', event => {
  const searchTerm = event.target.value;
  searchGamesByTitle(searchTerm);
  getSuggestions(searchTerm);
});


searchInput.addEventListener('click', () => {
  const gamesListGame = document.querySelector('.games-list-game');
  if (gamesListGame) {
    gamesListGame.style.display = 'block';
  }
});

// Agrega un evento de clic al documento
document.addEventListener('click', event => {
  const target = event.target;

  // Comprueba si el clic ocurrió fuera del buscador
  if (!target.closest('.search-bar')) {
    // Restablece los valores del buscador
    searchInput.value = '';
    searchSuggestionsElement.innerHTML = '';

    // Oculta el mensaje "No recent searches were found"
    noSearchesMessage.style.display = 'none';
  }
});

function getSuggestions(searchTerm) {
  if (searchTerm === '') {
    searchSuggestionsElement.innerHTML = '';
    return;
  }

  fetch(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      const games = data.results.slice(0, 5); // Limita los resultados a los 5 primeros juegos
      let html = '';

      games.forEach(game => {
        html += `<li>${game.name}</li>
        <hr>
        `;
      });

      searchSuggestionsElement.innerHTML = html;
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

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

searchInput.addEventListener('keydown', event => {
  const key = event.key;
  const suggestions = Array.from(searchSuggestionsElement.children);

  if (key === 'ArrowUp') {
    event.preventDefault();
    if (selectedSuggestionIndex > 0) {
      selectedSuggestionIndex--;
    } else {
      selectedSuggestionIndex = suggestions.length - 1;
    }
    highlightSuggestion();
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    if (selectedSuggestionIndex < suggestions.length - 1) {
      selectedSuggestionIndex++;
    } else {
      selectedSuggestionIndex = 0;
    }
    highlightSuggestion();
  } else if (key === 'Enter') {
    event.preventDefault();
    if (selectedSuggestionIndex !== -1) {
      selectSuggestion();
    }
  }
});

searchSuggestionsElement.addEventListener('click', event => {
  const clickedElement = event.target;
  const suggestionElement = clickedElement.closest('li');

  if (suggestionElement) {
    selectedSuggestionIndex = Array.from(searchSuggestionsElement.children).indexOf(suggestionElement);
    selectSuggestion();
  }
});

let selectedSearches = [];

const lastSearchElement = document.querySelector('.last-search');
lastSearchElement.addEventListener('click', showSearchHistory);

function selectSuggestion() {
  const selectedSuggestion = searchSuggestionsElement.children[selectedSuggestionIndex].textContent;
  searchInput.value = selectedSuggestion;
  searchGamesByTitle(selectedSuggestion);
  searchSuggestionsElement.innerHTML = '';

  selectedSearches.unshift(selectedSuggestion);
  selectedSearches = selectedSearches.slice(0, 2);

  console.log(selectedSearches);
}


function showSearchHistory() {
  const gameDataElement = document.getElementById('game-data');
  gameDataElement.innerHTML = '';

  const lastSearches = selectedSearches.slice(0, 2);

  lastSearches.forEach((searchTerm, index) => {
    fetch(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        const games = data.results;
        if (games.length > 0) {
          const card = createCard(games[0]);
          const indexElement = createIndexElement(index + 1);
          card.appendChild(indexElement);
          gameDataElement.appendChild(card);
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
}

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