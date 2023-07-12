const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';

const gameDataElement = document.getElementById('game-data');
const lastSearchesElement = document.getElementById('last-searches');
const searchInput = document.getElementById('search-input');
const searchSuggestionsElement = document.getElementById('search-suggestions');
const noSearchesMessage = document.querySelector('.games-list-game');

let lastSearches = [];
let selectedSuggestionIndex = -1;
let selectedSearches = [];

// Event Listeners
searchInput.addEventListener('input', handleSearchInputChange);
searchInput.addEventListener('click', showGamesList);
document.addEventListener('click', handleDocumentClick);

searchInput.addEventListener('keydown', handleSearchInputKeyDown);
searchSuggestionsElement.addEventListener('click', handleSuggestionClick);

const lastSearchElement = document.querySelector('.last-search');
lastSearchElement.addEventListener('click', showSearchHistory);

const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", handleDarkModeToggle);

// Fetch initial games
fetchGames(`${apiUrl}/games?key=${apiKey}`)
  .then(games => renderGames(games))
  .catch(error => console.log('Error:', error));

// Functions
function renderGames(games) {
  gameDataElement.innerHTML = '';

  games.forEach((game, index) => {
    const card = createCard(game);
    const indexElement = createIndexElement(index + 1);
    card.appendChild(indexElement);
    gameDataElement.appendChild(card);
  });
}

function createCard(game) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  image.src = game.background_image;
  image.alt = game.name;
  card.appendChild(image);

  const heartContainer = document.createElement('div');
  heartContainer.classList.add('heart-container');

  const heartIcon = document.createElement('img');
  heartIcon.src = './images/icons-home/heart.svg';
  heartIcon.alt = 'Heart icon';
  heartContainer.appendChild(heartIcon);

  card.appendChild(heartContainer);

  const title = document.createElement('h2');
  title.textContent = game.name;
  card.appendChild(title);

  const release = document.createElement('p');
  const releaseLabel = document.createElement('span');
  releaseLabel.textContent = 'Release:';
  releaseLabel.classList.add('release-label');
  release.appendChild(releaseLabel);

  const releaseDate = document.createElement('span');
  releaseDate.textContent = formatDate(game.released);
  releaseDate.classList.add('release-date');
  release.appendChild(releaseDate);

  card.appendChild(release);

  const genres = document.createElement('p');
  const genresLabel = document.createElement('span');
  genresLabel.textContent = 'Genres:';
  genresLabel.classList.add('genres-label');
  genres.appendChild(genresLabel);

  const genresList = document.createElement('span');
  genresList.textContent = ` ${game.genres.map(genre => genre.name).join(', ')}`;
  genresList.classList.add('genres-list');
  genres.appendChild(genresList);

  card.appendChild(genres);

  return card;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  return date.toLocaleDateString('en-US', options);
}

function createIndexElement(index) {
  const indexElement = document.createElement('p');
  indexElement.textContent = `#${index}`;
  indexElement.classList.add('card-index');
  return indexElement;
}

function fetchGames(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => data.results)
    .catch(error => {
      console.log('Error:', error);
      return [];
    });
}

function handleSearchInputChange(event) {
  const searchTerm = event.target.value;
  searchGamesByTitle(searchTerm);
  getSuggestions(searchTerm);
}

function searchGamesByTitle(searchTerm) {
  fetchGames(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(games => {
      renderGames(games);

      lastSearches.push(searchTerm);
      lastSearches = lastSearches.slice(-2);
    })
    .catch(error => console.log('Error:', error));
}

function getSuggestions(searchTerm) {
  if (searchTerm === '') {
    searchSuggestionsElement.innerHTML = '';
    return;
  }

  fetchGames(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
    .then(games => {
      const html = games.slice(0, 5).map(game => `<li>${game.name}</li><hr>`).join('');
      searchSuggestionsElement.innerHTML = html;
    })
    .catch(error => console.log('Error:', error));
}

function handleSuggestionClick(event) {
  const clickedElement = event.target;
  const suggestionElement = clickedElement.closest('li');

  if (suggestionElement) {
    selectedSuggestionIndex = Array.from(searchSuggestionsElement.children).indexOf(suggestionElement);
    selectSuggestion();
  }
}

function handleSearchInputKeyDown(event) {
  const key = event.key;
  const suggestions = Array.from(searchSuggestionsElement.children);

  if (key === 'ArrowUp') {
    event.preventDefault();
    selectedSuggestionIndex = selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1;
    highlightSuggestion();
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    selectedSuggestionIndex = selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0;
    highlightSuggestion();
  } else if (key === 'Enter') {
    event.preventDefault();
    if (selectedSuggestionIndex !== -1) {
      selectSuggestion();
    }
  }
}

function highlightSuggestion() {
  const suggestions = searchSuggestionsElement.children;
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].classList.toggle('selected', i === selectedSuggestionIndex);
  }
}

function selectSuggestion() {
  const selectedSuggestion = searchSuggestionsElement.children[selectedSuggestionIndex].textContent;
  searchInput.value = selectedSuggestion;
  searchGamesByTitle(selectedSuggestion);
  searchSuggestionsElement.innerHTML = '';

  selectedSearches.unshift(selectedSuggestion);
  selectedSearches = selectedSearches.slice(0, 2);
}

function showGamesList() {
  const gamesListGame = document.querySelector('.games-list-game');
  if (gamesListGame) {
    gamesListGame.style.display = 'block';
  }
}

function handleDocumentClick(event) {
  const target = event.target;
  const searchBar = target.closest('.search-bar');

  if (!searchBar) {
    searchInput.value = '';
    searchSuggestionsElement.innerHTML = '';
    noSearchesMessage.style.display = 'none';
  }
}

function showSearchHistory() {
  const gameDataElement = document.getElementById('game-data');
  gameDataElement.innerHTML = '';

  const lastSearchesToShow = selectedSearches.slice(0, 2);

  lastSearchesToShow.forEach((searchTerm, index) => {
    fetchGames(`${apiUrl}/games?key=${apiKey}&search=${searchTerm}`)
      .then(games => {
        if (games.length > 0) {
          const card = createCard(games[0]);
          const indexElement = createIndexElement(index + 1);
          card.appendChild(indexElement);
          gameDataElement.appendChild(card);
        }
      })
      .catch(error => console.log('Error:', error));
  });
}

function handleDarkModeToggle() {
  toggleButton.src = toggleButton.alt === "Dark mode on" ? "./images/on.svg" : "./images/off.svg";
  toggleButton.alt = toggleButton.alt === "Dark mode on" ? "Dark mode off" : "Dark mode on";
}