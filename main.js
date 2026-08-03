const CACHE_TIME = 20 * 60 * 1000;

function getUsedCountries() {
  const cache = JSON.parse(localStorage.getItem("usedCountries")) || {};

  const now = Date.now();

  Object.keys(cache).forEach((iso) => {
    if (now - cache[iso] > CACHE_TIME) {
      delete cache[iso];
    }
  });

  localStorage.setItem("usedCountries", JSON.stringify(cache));

  return cache;
}

function addUsedCountry(country) {
  const cache = getUsedCountries();

  cache[country.iso] = Date.now();

  localStorage.setItem("usedCountries", JSON.stringify(cache));
}

async function getCountry(continent = null) {
  const response = await fetch("./countries.json");
  let countries = await response.json();

  if (continent) {
    countries = countries.filter(
      (country) => country.continent === continentList[continent],
    );
  }

  const usedCountries = getUsedCountries();

  const availableCountries = countries.filter(
    (country) => !usedCountries[country.iso],
  );

  if (availableCountries.length === 0) {
    localStorage.removeItem("usedCountries");
  }

  const pool = availableCountries;

  const randomCountry = pool[Math.floor(Math.random() * pool.length)];

  addUsedCountry(randomCountry);

  return randomCountry;
}

function country(continent) {
  getCountry(continent)
    .then((country) => {
      console.log(country.name);

      document.querySelector("#flag").innerHTML = `
        <img
          src="https://flagcdn.com/h240/${country.iso.toLowerCase()}.png"
          height="240"
          alt="Flag">`;

      document.querySelector("#name").innerText = country.name;
    })
    .catch((err) => console.error(err));
}

const continentList = [
  "Tous les pays",
  "Europe",
  "Amérique",
  "Afrique",
  "Asie",
];
let continent = 0;
country(continent);

document.querySelector("#reveal").addEventListener("click", () => {
  document.querySelector("#name").style.visibility = "visible";
});

document.querySelector("#new").addEventListener("click", () => {
  country(continent);
  document.querySelector("#name").style.visibility = "hidden";
});

document.querySelector("#clearCache").addEventListener("click", () => {
  localStorage.removeItem("usedCountries");
  console.log("Cache supprimé");
});

document.querySelector("#continent").addEventListener("click", () => {
  continent = (continent + 1) % 5;
  document.querySelector("#continent").textContent = continentList[continent];
});
