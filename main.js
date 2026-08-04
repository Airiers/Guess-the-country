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

  // Mode Sing
  if (continent === 6) {
    const index = getSingIndex();

    if (index >= sing.length) {
      setSingIndex(0);
      return countries.find((c) => c.iso === sing[0]);
    }

    const iso = sing[index];
    setSingIndex(index + 1);

    return countries.find((c) => c.iso === iso);
  }

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
    return getCountry(continent);
  }

  const randomCountry =
    availableCountries[Math.floor(Math.random() * availableCountries.length)];

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
  "Océanie",
  "Sing",
];

let continent = 0;
country(continent);

const sing = [
  // Amériques
  "US", // United States
  "CA", // Canada
  "MX", // Mexico
  "PA", // Panama
  "HT", // Haiti
  "JM", // Jamaica
  "PE", // Peru
  "AG", // Antigua and Barbuda
  "LC", // Saint Lucia
  "CU", // Cuba
  "GD", // Grenada
  "SV", // El Salvador
  "DM", // Dominica
  "CO", // Colombia
  "VE", // Venezuela
  "HN", // Honduras
  "GY", // Guyana
  "GT", // Guatemala
  "BO", // Bolivia
  "AR", // Argentina
  "BS", // Bahamas
  "BR", // Brazil
  "CR", // Costa Rica
  "BZ", // Belize
  "NI", // Nicaragua
  "CL", // Chile
  "SC", // Seychelles
  "TT", // Trinidad and Tobago
  "PY", // Paraguay
  "UY", // Uruguay
  "SR", // Suriname
  "DO", // Dominican Republic
  "BB", // Barbados

  // Europe + Moyen-Orient
  "NO",
  "SE",
  "IS",
  "FI",
  "AM",
  "GE",
  "EE",
  "CH",
  "AT",
  "BE",
  "SK",
  "IT",
  "MK",
  "PL",
  "RO",
  "YE",
  "AL",
  "IE",
  "RU",
  "OM",
  "BG",
  "SA",
  "HU",
  "CY",
  "IQ",
  "IR",
  "SY",
  "LB",
  "IL",
  "JO",
  "AE",
  "KW",
  "BH",
  "NL",
  "LU",
  "DE",
  "PT",
  "FR",
  "GB",
  "DK",
  "ES",

  // Europe + Océanie + Afrique
  "UA",
  "AD",
  "HR",
  "MD",
  "CZ",
  "XK",
  "BY",
  "BA",
  "SI",
  "ME",
  "LV",
  "AZ",
  "SM",
  "MV",
  "VU",
  "RS",
  "KI",
  "FM",
  "MH",
  "TV",
  "TL",
  "PW",
  "GQ",
  "MY",
  "CV",
  "NZ",
  "KH",
  "WS",
  "ST",

  // Asie + Afrique
  "IN",
  "PK",
  "MM",
  "AF",
  "KP",
  "BT",
  "ID",
  "KG",
  "BN",
  "KZ",
  "VN",
  "CN",
  "JP",
  "MN",
  "LA",
  "BF",
  "PH",
  "TO",
  "TW",
  "LK",
  "TH",
  "SB",
  "TR",
  "TM",
  "TN",
  "MA",
  "CG",
  "ZW",
  "DJ",
  "BW",
  "MZ",
  "ZM",
  "KE",
  "GM",
  "GN",
  "DZ",
  "GH",

  // Afrique + reste du monde
  "BI",
  "LS",
  "MW",
  "NR",
  "ZA",
  "TJ",
  "AO",
  "NG",
  "TD",
  "LR",
  "EG",
  "BJ",
  "GA",
  "TZ",
  "SO",
  "CD",
  "ML",
  "SL",
  "CI",
  "UG",
  "NA",
  "SN",
  "LY",
  "CM",
  "CF",
  "ET",
  "GW",
  "MG",
  "RW",
  "NP",
  "SS",
  "NE",
  "KR",
  "QA",
  "ER",
  "GR",
  "MR",
  "LT",
  "PG",
  "VA",
  "VC",
  "TG",
  "SZ",
  "KN",
  "KM",
  "MU",
  "UZ",
  "EC",
  "BD",
  "SG",
  "MC",
  "LI",
  "MT",
  "PS",
  "FJ",
  "AU",
  "SD",
];

function getSingIndex() {
  return Number(localStorage.getItem("singIndex") || 0);
}

function setSingIndex(index) {
  localStorage.setItem("singIndex", index);
}

document.querySelector("#reveal").addEventListener("click", () => {
  document.querySelector("#name").style.visibility = "visible";
});

document.querySelector("#new").addEventListener("click", () => {
  country(continent);
  document.querySelector("#name").style.visibility = "hidden";
});

document.querySelector("#clearCache").addEventListener("click", () => {
  localStorage.removeItem("singIndex");
  localStorage.removeItem("usedCountries");
  console.log("Cache supprimé");
});

document.querySelector("#continent").addEventListener("click", () => {
  continent = (continent + 1) % continentList.length;
  document.querySelector("#continent").textContent = continentList[continent];
});
