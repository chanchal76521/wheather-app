const API_KEY = "dd9d9b747f167779aa4c576c58523d80";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const date = document.getElementById("date");


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});


cityInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city !== "") {
            getWeather(city);
        }
    }
});


async function getWeather(city) {

    if (API_KEY === "YOUR_API_KEY") {

        showError(
            "Please add your WeatherMap API key in script.js"
        );

        return;
    }

    loading.style.display = "block";
    weatherResult.style.display = "none";
    errorMessage.textContent = "";

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("City not found.");
            }

            if (response.status === 401) {
                throw new Error("Invalid API key.");
            }

            throw new Error("Unable to fetch weather data.");
        }

        const data = await response.json();

        displayWeather(data);

    } catch (error) {

        showError(error.message);

    } finally {

        loading.style.display = "none";
    }
}


function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        Math.round(data.main.temp);

    condition.textContent =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    const today = new Date();

    date.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    weatherResult.style.display = "block";
}


function showError(message) {

    errorMessage.textContent = message;

    weatherResult.style.display = "none";
}