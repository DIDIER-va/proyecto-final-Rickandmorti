// ==========================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
// ==========================================

// Escribe tu nombre y documento exactos. Esto personalizará la aplicación.
const developerName = "DIDIER ANDRES VALENCIA LONDOÑO";
const developerId = "67659";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los favoritos (lo usaremos más adelante)
let favoritesArray = [];

// ==========================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');   
// ==========================================
// 3. INYECCIÓN DINÁMICA DE LA FIRMA (FOOTER)
// ==========================================

// Modificamos el contenido del footer en tiempo real
mainFooter.innerHTML = `<p>Developed with 💻 by <strong>${developerName}</strong> (ID: ${developerId})</p>`;

// ==========================================
// 4. FUNCIÓN PARA OBTENER DATOS (ASINCRONÍA)
// ==========================================

    //Mostramos un mensaje de carga, mientras llegan los datos
    async function fetchData(endpoint) {
    try {
        //Mostramos un mensaje de carga, mientras llegan los datos
        dataContainer.innerHTML = '<p class="loading-text">Loading multiverse data...</p>';

        //Hacemos la petición a la API
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();

        //La api de Rick and Morty guarda los items dentro de una propiedad llamada 'results'
        return data.results;

    } catch (error){
        console.error("Error:", error);
        dataContainer.innerHTML = '<p class="loading-text" style="color: red;">Connection error</P>';
    }
}

//============================================
// 5. FUNCIONES DE RENDERIZADO (DOM)
//============================================

//Función para pintar personajes (Incluye el boton de favoritos)
function renderCharacters(charactersData){
  charactersData.forEach(character => {
    const cardHtml = `
      <article class="data-card">
        <div class="card-info">
          <p class="info-label">Status: <span style="color: ${statusColor}">${character.status}</span></p>
          <p class="info-label">Species: ${character.species}</p>

          <!-- Boton para guardar favorito, Le pasamos el nombre del personaje en una funcion onclick -->
          <button class="btn-add-fav" onclick="addToFavorites('${character.name}', '${character.image}')">
            ⭐ Add to Favorites
          </button>
        </div>
      </article>
    `
    dataContainer.innerHTML += cardHtml;
  })
}
//Funcion para pintar ubicaciones (Locations)
function renderLocations(locationsData){
  dataContainer.innerHTML = '';
  locationsData.forEach(location => {
    dataContainer.innerHTML += `
      <article class="data-card">
        <div class="card-info">
          <h2>🌍 ${location.name}</h2>
          <p class="info-label">Type: <span style="color: white;">${location.type}</span></P>
          <p class="info-label">Dimension: ${location.dimension}</P>
        </div>
      </article>
    `;
  });
}

// Funcion para pintar episodios
function renderEpisodes(episodesData){
  dataContainer.innerHTML = '';
  episodesData.forEach(episode => {
    dataContainer.innerHTML += `
      <article class="data-card">
        <div class="card-info">
          <h2>🎬 ${episode.name}</h2>
          <p class="info-label">Code: <span style="color: lime">${episode.episode}</span></p>
          <p class="info-label">Air Date: ${episode.air_date}</p>
        </div>
      </article>
    `;
  });
}
//========================================================
//6. LÓGICA DE LOS FAVORITOS (LOCALSTORAGE)
//========================================================
//Esta función se ejecuta caundo damos click en el botón "add to favorites" de una terjeta
function addToFavorites(name, image){
    // Creamos un objeto con los datos del personaje
    const newFavorite = {name: name, image: image};

    // Agregamos el objeto a nuestro arreglo de favoritos
    favoritesArray.push(newFavorite);

    // Serializamos el arreglo en texto (JSON) y lo guardamos en la memoria del nevegador
    localStorage.setItem('myFavCharacters', JSON.stringify(favoritesArray));

    alert(`¡${name} Agregado a favoritos!`);
} 

// Función para leer la memoria y pintar los favoritos
function renderFavorites(){
  if (saveData) {
    //Si hay datos, los deserealizar
    favoritesArray = JSON.parse(saveData);

    if (favoritesArray.length === 0) {
      dataContainer.innerHTML = '<p class="loading-text">No favorites added yet.</p>';
      return;
    }

    //Pintamos cada favorito guardado
    favoritesArray.forEach(fav => {
      dataContainer.innerHTML += `
        <article class="data-card">
          <img src="${fav.image}" alt="${fav.name}">
          <div class="card-info">
            <h2> ⭐ ${fav.name}</h2>
          </div>
        </article>
      `
        });
    } else {
        // Si la memoria esta vacia
        dataContainer.innerHTML = '<p class="loading-text">No favorites added yet.</p>';
    }
}

// =========================================
// 7. MANEJO DE EVENTOS DEL MENU
// =========================================

//Funcion auxiliar para resaltar visualmente el boton seleccionado
function setActiveButton(activeBtn){
  btnCharacters.classList.remove('active');
  btnLocations.classList.remove('active');
  btnEpisodes.classList.remove('active');
  btnFavorites.classList.remove('active');

  activeBtn.classList.add('active');
}

//Evento: clic en personajes
btnCharacters.addEventListener('click', async () => {
  setActiveButton(btnCharacters);
  const data = await fetchData('/character');
  renderCharacters(data);
});

//Evento: clic en Ubicaciones
btnLocations.addEventListener('click', async () => {
  setActiveButton(btnLocations);
  const data = await fetchData('/location');
  renderLocations(data);
});

//Evento: clic en Episodios
btnEpisodes.addEventListener('click', async () => {
  setActiveButton(btnEpisodes);
  const data = await fetchData('/episode');
  renderEpisodes(data);
});

//Evento: Clic en Favoritos
btnFavorites.addEventListener('click', async () => {
  setActiveButton(btnFavorites);
  renderFavorites(); //Esta no llama a fetchData, solo LocalStorage
});

// =========================================
// 8. INICIO AUTOMATICO
// =========================================

//Recuperamos los favoritos al arrancar la pagina por si habia guardado
const previousFavs = localStorage.getItem('myFavCharacters');

if (myFavCharacters) {
  favoritesArray = JSON.parse(previousFavs);
}

//Simulamos un click en boton personajes para que la pantalla de inicio no salga en blanco
btnCharacters.click();