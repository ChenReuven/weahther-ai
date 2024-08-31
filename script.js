const cities = [
    { name: "Jerusalem", name_he: "ירושלים", lat: 31.7683, lon: 35.2137 },
    { name: "Tel Aviv", name_he: "תל אביב", lat: 32.0853, lon: 34.7818 },
    { name: "Haifa", name_he: "חיפה", lat: 32.7940, lon: 34.9896 },
    { name: "Eilat", name_he: "אילת", lat: 29.5581, lon: 34.9482 },
    { name: "Ashdod", name_he: "אשדוד", lat: 31.8044, lon: 34.6553 },
    { name: "Beersheba", name_he: "באר שבע", lat: 31.2518, lon: 34.7913 },
    { name: "Netanya", name_he: "נתניה", lat: 32.3215, lon: 34.8532 },
    { name: "Holon", name_he: "חולון", lat: 32.0158, lon: 34.7874 },
    { name: "Bnei Brak", name_he: "בני ברק", lat: 32.0840, lon: 34.8350 },
    { name: "Rishon LeZion", name_he: "ראשון לציון", lat: 31.9706, lon: 34.7925 },
    { name: "Ofakim", name_he: "אופקים", lat: 31.3142, lon: 34.6201 }
];

const translations = {
    en: {
        title: "Weather in Israel",
        placeholder: "Enter an Israeli city",
        getWeather: "Get Weather",
        windSpeed: "Wind Speed"
    },
    he: {
        title: "מזג האוויר בישראל",
        placeholder: "הכנס עיר בישראל",
        getWeather: "קבל מזג אוויר",
        windSpeed: "מהירות רוח"
    }
};

let currentLang = 'en';

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    const cityData = cities.find(c => c.name.toLowerCase() === city.toLowerCase() || c.name_he === city);
    if (cityData) {
        getWeather(cityData.lat, cityData.lon, cityData.name, cityData.name_he);
    } else {
        alert('City not found');
    }
});

document.getElementById('city-input').addEventListener('input', function() {
    const input = this.value;
    const suggestions = cities.filter(city => city.name.toLowerCase().startsWith(input.toLowerCase()) || city.name_he.startsWith(input));
    showSuggestions(suggestions);
});

document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
document.getElementById('lang-he').addEventListener('click', () => switchLanguage('he'));

async function getWeather(lat, lon, cityName, cityNameHe) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data, cityName, cityNameHe);
}

function displayWeather(data, cityName, cityNameHe) {
    if (!data.current_weather) {
        alert('Weather data not available');
        return;
    }
    const displayName = currentLang === 'he' ? cityNameHe : cityName;
    document.getElementById('city-name').textContent = displayName;
    document.getElementById('temperature').textContent = `${data.current_weather.temperature}°C`;
    document.getElementById('description').textContent = `${translations[currentLang].windSpeed}: ${data.current_weather.windspeed} m/s`;
    document.getElementById('weather-icon').src = getWeatherIcon(data.current_weather.weathercode);
    document.getElementById('weather-card').classList.remove('hidden');
}

function showSuggestions(suggestions) {
    const datalist = document.getElementById('city-suggestions');
    datalist.innerHTML = '';
    suggestions.forEach(city => {
        const option = document.createElement('option');
        option.value = currentLang === 'he' ? city.name_he : city.name;
        datalist.appendChild(option);
    });
}

function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', // Clear sky
        1: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', // Mainly clear
        2: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Partly cloudy
        3: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Overcast
        45: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Fog
        48: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Depositing rime fog
        51: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Drizzle: Light
        53: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Drizzle: Moderate
        55: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Drizzle: Dense intensity
        56: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Freezing Drizzle: Light
        57: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Freezing Drizzle: Dense intensity
        61: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain: Slight
        63: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain: Moderate
        65: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain: Heavy intensity
        66: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Freezing Rain: Light
        67: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Freezing Rain: Heavy intensity
        71: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow fall: Slight
        73: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow fall: Moderate
        75: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow fall: Heavy intensity
        77: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow grains
        80: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain showers: Slight
        81: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain showers: Moderate
        82: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Rain showers: Violent
        85: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow showers slight
        86: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Snow showers heavy
        95: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Thunderstorm: Slight or moderate
        96: 'https://cdn-icons-png.flaticon.com/512/414/414825.png', // Thunderstorm with slight hail
        99: 'https://cdn-icons-png.flaticon.com/512/414/414825.png' // Thunderstorm with heavy hail
    };
    return iconMap[weatherCode] || 'https://cdn-icons-png.flaticon.com/512/414/414825.png';
}

function switchLanguage(lang) {
    currentLang = lang;
    document.getElementById('title').textContent = translations[lang].title;
    document.getElementById('city-input').placeholder = translations[lang].placeholder;
    document.getElementById('get-weather-btn').textContent = translations[lang].getWeather;
    document.getElementById('description').textContent = translations[lang].windSpeed;
    const input = document.getElementById('city-input').value;
    const suggestions = cities.filter(city => city.name.toLowerCase().startsWith(input.toLowerCase()) || city.name_he.startsWith(input));
    showSuggestions(suggestions);
}