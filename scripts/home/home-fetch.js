const apiUrl = 'https://api.rawg.io/api';
const apiKey = 'c979cee55209403d99dacc61c9eb4883';
const gameDataElement = document.getElementById('game-data');

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
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Búsqueda en tiempo real
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', event => {
  const searchTerm = event.target.value;
  searchGamesByTitle(searchTerm);
});