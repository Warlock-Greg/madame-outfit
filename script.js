// === Configuration ===
const apiKey = "INSÈRE_TA_CLÉ_API_ICI"; // OpenWeatherMap API key
const city = "Paris"; // Tu peux changer la ville ici

// === Éléments du DOM ===
const weatherEl = document.getElementById("weather");
const suggestionEl = document.getElementById("suggestion");
const countEl = document.getElementById("outfitCount");
const galleryEl = document.getElementById("gallery");
const photoInput = document.getElementById("photoInput");
const tagsInput = document.getElementById("tagsInput");

// === Météo ===
async function loadWeather() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    weatherEl.textContent = `À ${city}, il fait ${temp}°C et ${desc}.`;
    suggestionEl.textContent = getOutfitSuggestion(temp);
  } catch (err) {
    weatherEl.textContent = "Impossible de charger la météo 😢";
  }
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
loadWeather();
updateGallery();
