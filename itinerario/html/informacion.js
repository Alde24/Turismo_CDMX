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

async function fetchCurrentWeather(lat, lon) {
    const API_KEY = "cc530c245167a8169a6af9a903c259b4";
    const BASE_URL = "https://api.openweathermap.org/data/2.5/";
    try {
        const response = await fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
        if (!response.ok) throw new Error("Error al obtener el clima");
        const weatherData = await response.json();
        displayCurrentWeather(weatherData);
    } catch (error) {
        console.error("Error al obtener el clima:", error);
    }
}

function displayCurrentWeather(data) {
    const weatherCard = document.getElementById("weatherCard");

    const weatherIcon = customIcons[data.weather[0].icon] || "http://localhost/ADS_Turismo404/clima/images/weather-icons/default.png";
    const temperature = Math.floor(data.main.temp);
    const maxTemp = Math.floor(data.main.temp_max);
    const minTemp = Math.floor(data.main.temp_min);

    const description = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

    weatherCard.innerHTML = `
        <img src="${weatherIcon}" alt="${data.weather[0].description}">
        <p><strong>${data.name}</strong></p>
        <p>${description}</p>
        <p><strong>${temperature}°C</strong></p>
        <p>Max. ${maxTemp}° | Min. ${minTemp}°</p>
    `;
}

// Llamada con latitud y longitud (Ejemplo: lat = 19.4326, lon = -99.1332 para Ciudad de México)
fetchCurrentWeather(19.4326, -99.1332);

