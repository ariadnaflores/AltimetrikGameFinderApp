const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';
const gameDataElement = document.getElementById('game-data');
const lastSearchesElement = document.getElementById('last-searches');
const searchInput = document.getElementById('search-input');
const searchSuggestionsElement = document.getElementById('search-suggestions');
const noSearchesMessage = document.querySelector('.games-list-game');
const toggleButton = document.getElementById("toggleButton");
const overlay = document.querySelector('.search-overlay')

let lastSearches = [];
let selectedSuggestionIndex = -1;
let selectedSearches = [];
let pageNumber = 1;
let isFetching = false;
let cardIndex = 0;

// Event Listeners
searchInput.addEventListener('input', handleSearchInputChange);
searchInput.addEventListener('click', function() {
  showGamesList();
  showOverlayList();
});
document.addEventListener('click', handleDocumentClick);
searchInput.addEventListener('keydown', handleSearchInputKeyDown);
searchSuggestionsElement.addEventListener('click', handleSuggestionClick);
const lastSearchElement = document.querySelector('.last-search');
lastSearchElement.addEventListener('click', showSearchHistory);
toggleButton.addEventListener("click", handleDarkModeToggle);

// Fetch initial games
fetchAllGames();

// Functions
function renderGames(games) {
  games.forEach((game, index) => {
    const card = createCard(game);
    const indexElement = createIndexElement(cardIndex + index + 1);
    card.appendChild(indexElement);
    gameDataElement.appendChild(card);
  });
  cardIndex += games.length;
}

function createCard(game) {
  const card = document.createElement('div');
  card.classList.add('card');

  const image = document.createElement('img');
  if (game.background_image) {
    image.src = game.background_image;
  } else {
    image.src = './images/icons-home/default-image.jpeg';
  }
  image.alt = game.name;
  card.appendChild(image);

  const heartContainer = document.createElement('div');
  heartContainer.classList.add('heart-container');

  const heartIcon = document.createElement('img');
  heartIcon.src = './images/icons-home/heart.svg';
  heartIcon.alt = 'Heart icon';
  heartContainer.appendChild(heartIcon);

  card.appendChild(heartContainer);

  const gamesContainer = document.createElement('div');
  gamesContainer.classList.add('games-icons-container');
  
  // Crear el primer ícono SVG
  const gameIcon1 = document.createElement('img');
  gameIcon1.src = './images/icons-home/playstation.svg';
  gameIcon1.alt = 'Game icon';
  gamesContainer.appendChild(gameIcon1);
  
  // Crear el segundo ícono SVG
  const gameIcon2 = document.createElement('img');
  gameIcon2.src = './images/icons-home/xbox.svg';
  gameIcon2.alt = 'Game icon';
  gamesContainer.appendChild(gameIcon2);
  
  // Crear el tercer ícono SVG
  const gameIcon3 = document.createElement('img');
  gameIcon3.src = './images/icons-home/windows.svg';
  gameIcon3.alt = 'Game icon';
  gamesContainer.appendChild(gameIcon3);
  
  // Crear el cuarto ícono SVG
  const gameIcon4 = document.createElement('img');
  gameIcon4.src = './images/icons-home/switch.svg';
  gameIcon4.alt = 'Game icon';
  gamesContainer.appendChild(gameIcon4);
  
  card.appendChild(gamesContainer);
  

  const title = document.createElement('h2');
  title.textContent = game.name;
  card.appendChild(title);

  const release = document.createElement('p');
  const releaseLabel = document.createElement('span');
  releaseLabel.textContent = 'Release date:';
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

function createIndexElement(index) {
  const indexElement = document.createElement('p');
  indexElement.textContent = `#${index}`;
  indexElement.classList.add('card-index');
  return indexElement;
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

function fetchGames(search, page = 1, parentPlatform) {
  let url = `${apiUrl}/games?key=${apiKey}&page=${page}&search=${search}`;

  if (parentPlatform) {
    url += `&parent_platforms=${parentPlatform}`;
  }

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const gamesPromises = data.results.map(game => fetchGame(game));
      return Promise.all(gamesPromises);
    })
    .catch(error => {
      console.log('Error:', error);
      return [];
    });
}

/*function fetchGame(generalGame) {
  const url = `${apiUrl}/games/${generalGame.id}?key=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(game => Object.assign(generalGame, game))
    .catch(error => {
      console.log('Error:', error);
      return generalGame;
    });
}*/

/*async function fetchGame(generalGame){
  try {
    const response = await fetch(`${apiUrl}/games/${generalGame.id}?key=${apiKey}`);
    if (!response.ok) {
      console.error('Error: ');
    }
    else{
      const data = await response.json()
      const game = Object.assign(generalGame, data)
      return game
    }
  } catch (error) {
    console.error('Error:', error);
  }
}*/
async function fetchGame(generalGame) {
  try {
    const response = await fetch(`${apiUrl}/games/${generalGame.id}?key=${apiKey}`);
    if (!response.ok) {
      console.error('Error fetching game:', response.status);
      return generalGame;
    }
    
    const data = await response.json();
    const game = Object.assign(generalGame, data);
    return game;
  } catch (error) {
    console.error('Error fetching game:', error);
    return generalGame;
  }
}


function fetchAllGames() {
  isFetching = true;
  fetchGames('', pageNumber)
    .then(games => {
      renderGames(games);
      pageNumber++;
      isFetching = false;
    })
    .catch(error => {
      console.log('Error:', error);
      isFetching = false;
    });
}

function handleSearchInputChange(event) {
  const searchTerm = event.target.value;

  searchGamesByTitle(searchTerm);
  getSuggestions(searchTerm);
}

function searchGamesByTitle(searchTerm) {
  fetchGames(searchTerm)
    .then(games => {
      gameDataElement.innerHTML = '';
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

  fetchGames(searchTerm)
    .then(games => {
      const html = games.slice(0, 4).map(game => `<li>${game.name}</li><hr>`).join('');
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

//overlay.style.display = "none";

  function showOverlayList() {
    overlay.style.display = "block";
  }

function handleDocumentClick(event) {
  const target = event.target;
  const searchBar = target.closest('.search-bar');

  if (!searchBar) {
    searchInput.value = '';
    searchSuggestionsElement.innerHTML = '';
    noSearchesMessage.style.display = 'none';
    overlay.style.display = "none"
    gameDataElement.classList.remove("overlay-active"); // Quitar la clase overlay-active del contenedor de los cards

  }
  else{
    overlay.style.display = "block";
    gameDataElement.classList.add("overlay-active"); // Agregar la clase overlay-active al contenedor de los cards

  }
}

function showSearchHistory() {
  const gameDataElement = document.getElementById('game-data');
  gameDataElement.innerHTML = '';

  const lastSearchesToShow = selectedSearches.slice(0, 2);

  if (searchInput.value.length === 0 && lastSearchesToShow.length === 0) {
    const noSearchesMessage = document.createElement('p');
    noSearchesMessage.textContent = 'No last searches were found.';
    gameDataElement.appendChild(noSearchesMessage);
  } else {
    lastSearchesToShow.forEach((searchTerm, index) => {
      fetchGames(searchTerm)
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
}


function handleDarkModeToggle() {
  toggleButton.src = toggleButton.alt === "Dark mode on" ? "./images/on.svg" : "./images/off.svg";
  toggleButton.alt = toggleButton.alt === "Dark mode on" ? "Dark mode off" : "Dark mode on";
}

/*function infiniteScroll() {
  const shouldFetch = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 700;
  if (shouldFetch && !isFetching) {
    fetchAllGames();
  }

}
  window.addEventListener('scroll', infiniteScroll);*/

const singleCard = document.querySelector('.single-disabled');
const multipleCards = document.querySelector('.multiple-enabled');

singleCard.addEventListener("click", function () {
  const isEnabled = singleCard.getAttribute('data-enabled') === 'true';
  if (isEnabled) {
    return; // Si ya está activo, no se hace nada
  }

  singleCard.setAttribute('data-enabled', 'true');
  singleCard.src = "../images/icons-home/single-enabled.svg";

  multipleCards.setAttribute('data-enabled', 'false');
  multipleCards.src = "../images/icons-home/multiple-disabled.svg";

  gameDataElement.classList.add("single-column"); // Agregar la clase single-column al contenedor de los cards

});

multipleCards.addEventListener("click", function () {
  const isEnabled = multipleCards.getAttribute('data-enabled') === 'true';
  if (isEnabled) {
    return; // Si ya está activo, no se hace nada
  }

  multipleCards.setAttribute('data-enabled', 'true');
  multipleCards.src = "../images/icons-home/multiple-enabled.svg";

  singleCard.setAttribute('data-enabled', 'false');
  singleCard.src = "../images/icons-home/single-disabled.svg";

  gameDataElement.classList.remove("single-column"); // Quitar la clase single-column del contenedor de los cards

});

  const modal = document.getElementById('modal');

  // Agregar un evento de clic a gameDataElement (delegación de eventos)
  gameDataElement.addEventListener('click', function (event) {
    // Verificar si el clic ocurrió en una card (clase 'card')
    const clickedCard = event.target.closest('.card');
    if (!clickedCard) return; // No se hizo clic en una card, salir

      // Obtener los elementos en la card que contienen la información del juego
      const titleElement = clickedCard.querySelector('h2');
      const releaseDateElement = clickedCard.querySelector('.release-date');
      const genresListElement = clickedCard.querySelector('.genres-list');

      // Obtener los datos del juego desde los elementos de la card
      const title = titleElement.textContent;
      const releaseDate = releaseDateElement.textContent;
      const genresList = genresListElement.textContent;

      // Actualizar el contenido del modal con los datos del juego
      const modal = document.getElementById('modal');
      modal.innerHTML = `
        <h2>${title}</h2>
        <p><span class="release-label">Release date:</span> ${releaseDate}</p>
        <p><span class="genres-label">Genres:</span> ${genresList}</p>
      `;
    modal.showModal(); // Mostrar el modal
  });

  // Cerrar el modal cuando se hace clic fuera de su contenido
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.close();
    }
  });