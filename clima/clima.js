const API_KEY = "cc530c245167a8169a6af9a903c259b4";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const CDMX_CENTER = { lat: 19.432608, lon: -99.133209 };
const RADIUS_KM = 50;
const weatherSuggestions = {
    Clear: [
        { icon: "sun.png", text: "No olvides tus gafas de sol" },
        { icon: "sunscreen.png", text: "Aplica bloqueador solar" },
    ],
    Rain: [
        { icon: "umbrella.png", text: "Lleva contigo un paraguas" },
        { icon: "raincoat.png", text: "Usa un impermeable" },
    ],
    Clouds: [
        { icon: "cloud.png", text: "Abrígate un poco, puede hacer frío" },
    ],
    Snow: [
        { icon: "snowflake.png", text: "Lleva ropa de abrigo" },
        { icon: "boots.png", text: "Usa botas resistentes" },
    ],
    Thunderstorm: [
        { icon: "stormy.png", text: "Evita salir durante la tormenta" },
    ],
};

const customIcons = {
    "01d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/sunny.png",
    "01n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/clear-night.png",
    "02d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/partly-cloudy.png",
    "02n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/partly-cloudy-night.png",
    "03d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/cloudy.png",
    "03n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/cloudy.png",
    "04d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/overcast.png",
    "04n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/overcast.png",
    "09d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/rainy.png",
    "09n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/rainy-night.png",
    "10d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/rainy-day.png",
    "10n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/rainy-night.png",
    "11d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/storm.png",
    "11n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/storm.png",
    "13d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/snow.png",
    "13n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/snow.png",
    "50d": "http://localhost/ADS_Turismo404/clima/images/weather-icons/mist.png",
    "50n": "http://localhost/ADS_Turismo404/clima/images/weather-icons/mist.png"
};

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en kilómetros
}

// Función para buscar sugerencias en tiempo real
document.getElementById("searchInput").addEventListener("input", async (event) => {
    const query = event.target.value.trim();

    if (query.length >= 3) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
            if (!response.ok) throw new Error("Error al buscar sugerencias");

            const cities = await response.json();
            showSuggestions(cities);
        } catch (error) {
            console.error("Error en las sugerencias:", error);
        }
    } else {
        clearSuggestions();
    }
});

// Mostrar sugerencias debajo del campo de búsqueda
async function showSuggestions(cities) {
    clearSuggestions(); // Limpiar sugerencias previas
    const suggestionsContainer = document.createElement("ul");
    suggestionsContainer.classList.add("suggestions");

    cities.forEach((city) => {
        const distance = haversineDistance(
            CDMX_CENTER.lat,
            CDMX_CENTER.lon,
            city.lat,
            city.lon
        );

        if (distance <= RADIUS_KM) {
            const suggestion = document.createElement("li");
            suggestion.textContent = `${city.name}, ${city.country}`;
            suggestion.addEventListener("click", () => {
                document.getElementById("searchInput").value = city.name;
                clearSuggestions();
                fetchWeather(city.lat, city.lon);
            });
            suggestionsContainer.appendChild(suggestion);
        }
    });

    if (!suggestionsContainer.childNodes.length) {
        const noResults = document.createElement("li");
        noResults.textContent = textContent;
        suggestionsContainer.appendChild(noResults);
    }

    document.querySelector(".search-bar").appendChild(suggestionsContainer);
}

// Limpiar las sugerencias
function clearSuggestions() {
    const existingSuggestions = document.querySelector(".suggestions");
    if (existingSuggestions) existingSuggestions.remove();
}

// Función para buscar el clima al dar clic en el botón de búsqueda
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value.trim();

    if (query) {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`);
            if (!response.ok) throw new Error("No se encontró la ciudad");

            const [location] = await response.json();
            if (location) {
                fetchWeather(location.lat, location.lon);
            } else {
                alert("No se encontró la ciudad.");
            }
        } catch (error) {
            console.error("Error al buscar el clima:", error);
        }
    }
});

// Obtener el clima basado en latitud y longitud
async function fetchWeather(lat, lon) {

    fetch(`${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`)
    .then(response => {
        if (!response.ok) throw new Error("Error al obtener el clima");
        return response.json();
    })
    .then(data => {
        updateLocationPill(data.city.name); // Actualiza la cápsula con el nombre de la ciudad
        displayWeather(data);
    })
    .catch(error => console.error("Error al obtener el clima:", error));


    const distance = haversineDistance(CDMX_CENTER.lat, CDMX_CENTER.lon, lat, lon);
    if (distance > RADIUS_KM) {
        showMessage("La ubicación está fuera del área permitida", "error");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
        if (!response.ok) throw new Error("Error al obtener el clima");

        const weatherData = await response.json();
        displayWeather(weatherData);
    } catch (error) {
        console.error("Error al obtener el clima:", error);
    }
}

// Mostrar el clima en la interfaz
function displayWeather(data) {
    const weatherContainer = document.getElementById("weatherContainer");
    const suggestionsContainer = document.getElementById("suggestionsContainer");
 

    weatherContainer.innerHTML = "";
    additionalWeatherInfo.innerHTML = "";
    suggestionsContainer.innerHTML = "";

    const today = new Date();
    const currentHour = today.getHours();
    const todayIndex = today.getDay();
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // Día actual: obtener la entrada más cercana a la hora actual
    const todayData = data.list.reduce((closest, forecast) => {
        const forecastHour = new Date(forecast.dt * 1000).getHours();
        const diffCurrent = Math.abs(forecastHour - currentHour);
        const diffClosest = Math.abs(new Date(closest.dt * 1000).getHours() - currentHour);
        return diffCurrent < diffClosest ? forecast : closest;
    });

    // Resto de los días: obtener el clima de las 12:00 PM
    const filteredData = data.list.filter((forecast) =>
        new Date(forecast.dt * 1000).getHours() === 12
    );

    const combinedData = [todayData, ...filteredData.slice(0, 4)];

    combinedData.forEach((forecast, index) => {
        const weatherBox = document.createElement("div");
        weatherBox.classList.add("weather-box");

        const forecastDate = new Date(forecast.dt * 1000);
        const dayIndex = (todayIndex + index) % 7;
        const day = daysOfWeek[dayIndex];
        const temperature = Math.floor(forecast.main.temp);
        const maxTemp = Math.floor(forecast.main.temp_max);
        const minTemp = Math.floor(forecast.main.temp_min);
        const weatherIcon =
            customIcons[forecast.weather[0].icon] ||
            "http://localhost/ADS_Turismo404/clima/images/weather-icons/default.png";

        weatherBox.innerHTML = `
            <p><strong>${day}</strong></p>
            <img src="${weatherIcon}" alt="${forecast.weather[0].description}">
            <p>${capitalizeWords(forecast.weather[0].description)}</p>
            <p><strong>${temperature}°C</strong></p>
            <p>Max. ${maxTemp}° | ${minTemp}° Min.</p>
        `;

        weatherContainer.appendChild(weatherBox);
        const currentWeather = data.list[0].weather[0].main; // Clima actual (e.g., "Clear", "Rain")
        displaySuggestions(currentWeather);

    });
  
    // Tarjeta de Humedad
    const humidity = data.list[0].main.humidity;  
    const humidityCard = document.createElement("div");
    humidityCard.classList.add("additional-info-card");
    humidityCard.innerHTML = `
        <img src="http://localhost/ADS_Turismo404/clima/images/weather-icons/drop.png" alt="Humedad" />
        <p><strong>Humedad:</strong> ${humidity}%</p>
    `;
    additionalWeatherInfo.appendChild(humidityCard);

    // Tarjeta de Sensación Térmica
    const feelsLike = Math.floor(data.list[0].main.feels_like);  
    const feelsLikeCard = document.createElement("div");
    feelsLikeCard.classList.add("additional-info-card");
    feelsLikeCard.innerHTML = `
        <img src="http://localhost/ADS_Turismo404/clima/images/weather-icons/warm.png" alt="Sensación Térmica" />
        <p><strong>Sensación térmica:</strong> ${feelsLike}°C</p>
    `;
    additionalWeatherInfo.appendChild(feelsLikeCard);

    // Tarjeta de Salida del Sol
    const sunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString("es-ES", { timeStyle: "short" });
    const sunriseCard = document.createElement("div");
    sunriseCard.classList.add("additional-info-card");
    sunriseCard.innerHTML = `
        <img src="http://localhost/ADS_Turismo404/clima/images/weather-icons/sunrise.png" alt="Salida del Sol" />
        <p><strong>Salida del sol:</strong> ${sunrise}</p>
    `;
    additionalWeatherInfo.appendChild(sunriseCard);

    // Tarjeta de Puesta del Sol
    const sunset = new Date(data.city.sunset * 1000).toLocaleTimeString("es-ES", { timeStyle: "short" });
    const sunsetCard = document.createElement("div");
    sunsetCard.classList.add("additional-info-card");
    sunsetCard.innerHTML = `
        <img src="http://localhost/ADS_Turismo404/clima/images/weather-icons/sunset.png" alt="Puesta del Sol" />
        <p><strong>Puesta del sol:</strong> ${sunset}</p>
    `;
    additionalWeatherInfo.appendChild(sunsetCard);
}




// Función para verificar la conexión con la API
async function checkConnection() {
    try {
        const response = await fetch(`${BASE_URL}weather?q=test&appid=${API_KEY}`);
        if (response.ok) {
            console.log("Conexión exitosa con la API");
        } else {
            throw new Error("Conexión fallida con la API");
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
    }
}

// Verificar conexión al cargar la página
checkConnection();

// Función para mostrar mensajes de estado
function showMessage(message, type = 'info') {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;

    document.body.appendChild(messageBox);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

function updateCapsules(itineraryId, itineraryStatus, weatherStatus) {
    const itineraryCapsule = document.querySelector('.indicator-capsule:nth-child(1)');
    const statusCapsule = document.querySelector('.indicator-capsule:nth-child(2)');
    const weatherCapsule = document.querySelector('.indicator-capsule:nth-child(3)');

    // Actualizar el texto
    itineraryCapsule.textContent = itineraryId;
    statusCapsule.textContent = itineraryStatus.text;
    weatherCapsule.textContent = weatherStatus.text;

    // Actualizar colores
    statusCapsule.className = `indicator-capsule ${itineraryStatus.color}`;
    weatherCapsule.className = `indicator-capsule ${weatherStatus.color}`;
}

// Ejemplo de uso
updateCapsules(
    "#236372 - CDMX",
    { text: "En curso", color: "indicator-yellow" },
    { text: "Despejado", color: "indicator-green" }
);

function capitalizeWords(text) {
    return text
        .toLowerCase() 
        .split(' ') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
        .join(' '); 
}

function updateLocationPill(locationName) {
    const locationPill = document.getElementById("locationPill");
    if (locationPill) {
        const safeLocationName = locationName || "  Ubicación desconocida"; 
        locationPill.innerHTML = `
            <img src="http://localhost/ADS_Turismo404/clima/images/location.png" alt="Icono de ubicación" class="location-icon">
            <span>${safeLocationName}</span>
        `;
        locationPill.style.display = "inline-flex";
    } else {
        console.error("locationPill no se encuentra en el DOM");
    }
}

if (location) {
    fetchWeather(location.lat, location.lon);
    updateLocationPill(location.name); 
}

function displaySuggestions(weatherCondition) {
    const suggestionsContainer = document.getElementById("suggestionsContainer");
    suggestionsContainer.innerHTML = "";

    if (weatherSuggestions[weatherCondition]) {
        weatherSuggestions[weatherCondition].forEach((suggestion) => {
            const suggestionCard = document.createElement("div");
            suggestionCard.classList.add("suggestion-card");
            suggestionCard.innerHTML = `
                <img src="http://localhost/ADS_Turismo404/clima/images/weather-icons/${suggestion.icon}" alt="${suggestion.text}" />
                <p>${suggestion.text}</p>
            `;
            suggestionsContainer.appendChild(suggestionCard);
        });
    } else {
        suggestionsContainer.innerHTML = "<p>No hay sugerencias disponibles para el clima actual.</p>";
    }
}


function goBack() {
    window.history.back();
}