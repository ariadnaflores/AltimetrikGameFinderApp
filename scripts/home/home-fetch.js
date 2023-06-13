const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';
const gameDataElement = document.getElementById('game-data');
const lastSearchesElement = document.getElementById('last-searches');
const searchInput = document.getElementById('search-input');
const searchSuggestionsElement = document.getElementById('search-suggestions');
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

  const title = document.createElement('h2');
  title.textContent = game.name;
  card.appendChild(title);

  const release = document.createElement('p');
  release.textContent = `Release: ${game.release}`;
  card.appendChild(release);

  const genres = document.createElement('p');
  genres.textContent = `Genres: ${game.genres.map(genre => genre.name).join(', ')}`;
  card.appendChild(genres);  

  const image = document.createElement('img');
  image.src = game.background_image;
  image.alt = game.name;
  card.appendChild(image);

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
      displaySelectedSearches();
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

function getSuggestions(searchTerm) {
  if (searchTerm === '') {
    searchSuggestionsElement.innerHTML = '';
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

searchSuggestionsElement.addEventListener('click', event => {
  const clickedElement = event.target;
  const suggestionElement = clickedElement.closest('li');

  if (suggestionElement) {
    selectedSuggestionIndex = Array.from(searchSuggestionsElement.children).indexOf(suggestionElement);
    selectSuggestion();
  }
});

let selectedSearches = [];

function selectSuggestion() {
  const selectedSuggestion = searchSuggestionsElement.children[selectedSuggestionIndex].textContent;
  searchInput.value = selectedSuggestion;
  searchGamesByTitle(selectedSuggestion);
  searchSuggestionsElement.innerHTML = '';

  selectedSearches.unshift(selectedSuggestion);
  selectedSearches = selectedSearches.slice(0, 2);

  console.log(selectedSearches);
  displaySelectedSearches();
}

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