// Select DOM elements
const cityInput = document.getElementById("city");
const searchButton = document.querySelector("button");
const weatherIcon = document.getElementById("weather-icon");
const tempDiv = document.getElementById("temp-div");
const weatherInfo = document.getElementById("weather-info");
const hourlyForecast = document.getElementById("hourly-forecast");

// API Key and Base URL
const API_KEY = "e2e545676940f4ec24ca5d2774c70938";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const HOURLY_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Function to fetch weather data
async function fetchWeather(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error("City not found");
  }
  return response.json();
}

// Function to fetch hourly forecast data
async function fetchHourlyForecast(city) {
  const response = await fetch(
    `${HOURLY_URL}?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) {
    throw new Error("Hourly forecast not found");
  }
  return response.json();
}

// Function to update the UI with weather data
function updateUI(weatherData, hourlyData) {
  // Display current weather
  const temperature = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;
  const iconCode = weatherData.weather[0].icon;

  tempDiv.innerHTML = `<p>${temperature}°C</p>`;
  weatherInfo.innerHTML = `<p>${
    description.charAt(0).toUpperCase() + description.slice(1)
  }</p>`;
  weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.style.display = "block";

  // Clear previous hourly forecast
  hourlyForecast.innerHTML = "";

  // Display hourly forecast
  hourlyData.list.slice(0, 5).forEach((item) => {
    const hour = new Date(item.dt * 1000).getHours();
    const temp = Math.round(item.main.temp);
    const iconCode = item.weather[0].icon;

    const hourlyItem = document.createElement("div");
    hourlyItem.classList.add("hourly-item");
    hourlyItem.innerHTML = `
            <p>${hour}:00</p>
            <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon" />
            <p>${temp}°C</p>
        `;
    hourlyForecast.appendChild(hourlyItem);
  });
}

// Event listener for the search button
searchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();

  if (city) {
    try {
      const weatherData = await fetchWeather(city);
      const hourlyData = await fetchHourlyForecast(city);
      updateUI(weatherData, hourlyData);
    } catch (error) {
      alert(error.message);
      // Clear previous data on error
      tempDiv.innerHTML = "";
      weatherInfo.innerHTML = "";
      weatherIcon.style.display = "none";
      hourlyForecast.innerHTML = "";
    }
  } else {
    alert("Please enter a city name.");
  }
});

// Optional: Allow pressing "Enter" to search
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
