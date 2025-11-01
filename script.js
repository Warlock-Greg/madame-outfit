// === Configuration ===
const defaultCity = "Paris";
const defaultCoords = { lat: 48.8566, lon: 2.3522 };

// === Éléments du DOM ===
const weatherEl = document.getElementById("weather");
const suggestionEl = document.getElementById("suggestion");
const countEl = document.getElementById("outfitCount");
const galleryEl = document.getElementById("gallery");
const photoInput = document.getElementById("photoInput");
const tagsInput = document.getElementById("tagsInput");

// === Météo ===
async function loadWeather(lat, lon, cityName = defaultCity) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    const data = await res.json();

    const temp = Math.round(data.current.temperature_2m);
    const desc = getWeatherDescription(data.current.weather_code);

    weatherEl.textContent = `À ${cityName}, il fait ${temp}°C et ${desc}.`;
    suggestionEl.textContent = getOutfitSuggestion(temp);
  } catch (err) {
    weatherEl.textContent = "Impossible de charger la météo 😢";
  }
}

// Code météo → texte lisible
function getWeatherDescription(code) {
  const descriptions = {
    0: "ciel dégagé",
    1: "quelques nuages",
    2: "nuageux",
    3: "très nuageux",
    45: "brouillard",
    48: "brouillard givrant",
    51: "bruine légère",
    61: "pluie faible",
    63: "pluie modérée",
    65: "pluie forte",
    71: "neige faible",
    73: "neige modérée",
    75: "neige forte",
    95: "orages",
  };
  return descriptions[code] || "conditions indéterminées";
}

function getOutfitSuggestion(temp) {
  if (temp < 10) return "🧥 Il fait froid ! Opte pour un manteau et des bottes.";
  if (temp < 20) return "🧶 Un pull léger ou une veste feront l’affaire.";
  if (temp < 27) return "👚 Temps agréable, choisis quelque chose de confortable.";
  return "🌞 Chaleur ! Une robe légère ou un short, et reste hydratée !";
}

// === Gestion des tenues ===
let outfits = JSON.parse(localStorage.getItem("outfits")) || [];

function updateGallery() {
  galleryEl.innerHTML = "";
  outfits.forEach((o) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = o.image;
    card.appendChild(img);

    const tagContainer = document.createElement("div");
    tagContainer.className = "tags";
    o.tags.forEach((t) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t.trim();
      tagContainer.appendChild(tag);
    });
    card.appendChild(tagContainer);

    galleryEl.appendChild(card);
  });
  countEl.textContent = outfits.length;
}

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imgData = reader.result;
    const tags = tagsInput.value ? tagsInput.value.split(",") : [];
    outfits.push({ image: imgData, tags });
    localStorage.setItem("outfits", JSON.stringify(outfits));
    tagsInput.value = "";
    updateGallery();
  };
  reader.readAsDataURL(file);
});

// === Initialisation ===
function initWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        loadWeather(lat, lon, "ta position");
      },
      () => loadWeather(defaultCoords.lat, defaultCoords.lon, defaultCity)
    );
  } else {
    loadWeather(defaultCoords.lat, defaultCoords.lon, defaultCity);
  }
}

initWeather();
updateGallery();
