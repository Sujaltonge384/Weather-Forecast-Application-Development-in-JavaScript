// --- Constants & API Configuration ---
// Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
const API_KEY = '39450165cbcdc17742defa5e7ba8cf3a'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// --- DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const initialMessage = document.getElementById('initial-message');
const currentWeatherCard = document.getElementById('current-weather-card');
const forecastSection = document.getElementById('forecast-section');

// We'll create a container for our custom errors so we don't use alert()
const errorContainer = document.createElement('div');
errorContainer.className = 'hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mb-4';
cityInput.parentNode.insertBefore(errorContainer, cityInput.nextSibling);

// State variables
let isCelsius = true;
let currentTempCelsius = 0;

// --- Event Listeners ---

// 1. Search by City Name
searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (!cityName) {
        showError('Please enter a city name.'); // Custom error, not alert()
        return;
    }
    fetchWeatherData(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
});

// 2. Search by Current Location (Geolocation API)
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
            },
            (error) => {
                showError('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

// --- Core Fetch Logic ---

async function fetchWeatherData(currentWeatherUrl) {
    hideError();
    try {
        // Fetch Current Weather
        const currentRes = await fetch(currentWeatherUrl);
        if (!currentRes.ok) throw new Error('City not found or API error.');
        const currentData = await currentRes.json();

        // Extract coordinates for the 5-day forecast API call
        const { lat, lon } = currentData.coord;
        
        // Fetch 5-Day Forecast
        const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!forecastRes.ok) throw new Error('Could not fetch forecast data.');
        const forecastData = await forecastRes.json();

        // Pass data to UI rendering functions
        updateCurrentWeatherUI(currentData);
        updateForecastUI(forecastData);
        
        // TODO: Save to search history here

    } catch (error) {
        showError(error.message);
        // Hide weather cards if there's an error
        currentWeatherCard.classList.add('hidden');
        forecastSection.classList.add('hidden');
        initialMessage.classList.remove('hidden');
    }
}

// --- Helper Functions ---

function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
}

function hideError() {
    errorContainer.classList.add('hidden');
}

// Placeholders for the UI update functions (We will build these next)
function updateCurrentWeatherUI(data) {
    console.log("Current Weather Data:", data);
    // Logic to update the DOM with data goes here
}

function updateForecastUI(data) {
    console.log("Forecast Data:", data);
    // Logic to filter the 40 timestamps down to 5 days and update DOM goes here
}

// --- Global DOM Elements for UI Updates ---
const currentCityDate = document.getElementById('current-city-date');
const currentTemp = document.getElementById('current-temp');
const tempUnit = document.getElementById('temp-unit');
const toggleUnitBtn = document.getElementById('toggle-unit-btn');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('current-humidity');
const currentIcon = document.getElementById('current-icon');
const currentDesc = document.getElementById('current-desc');
const forecastContainer = document.getElementById('forecast-cards-container');
const historyContainer = document.getElementById('history-container');
const historyList = document.getElementById('history-list');

// --- 1. Current Weather & Core Rubric Requirements ---

function updateCurrentWeatherUI(data) {
    // Hide initial message and show the weather card
    initialMessage.classList.add('hidden');
    currentWeatherCard.classList.remove('hidden');
    forecastSection.classList.remove('hidden');

    // Extract data
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toISOString().split('T')[0];
    currentTempCelsius = data.main.temp; // Store globally for the toggle
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    const weatherCondition = data.weather[0].main.toLowerCase();
    const iconCode = data.weather[0].icon;

    // Update DOM
    currentCityDate.textContent = `${cityName} (${date})`;
    currentTemp.textContent = currentTempCelsius.toFixed(2);
    tempUnit.textContent = '°C';
    isCelsius = true;
    toggleUnitBtn.textContent = 'Switch to °F';
    currentWind.textContent = windSpeed;
    currentHumidity.textContent = humidity;
    currentIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    currentIcon.classList.remove('hidden');
    currentDesc.textContent = data.weather[0].description;

    // Requirement: Custom weather alerts for extreme temperatures (>40°C) [cite: 31]
    if (currentTempCelsius > 40) {
        showError(`⚠️ Extreme Weather Alert: Temperatures in ${cityName} are dangerously high (${currentTempCelsius.toFixed(1)}°C)!`);
    }

    // Requirement: Turn into a rainy background dynamically 
    if (weatherCondition.includes('rain')) {
        document.body.className = 'bg-blue-900 text-slate-100 transition-colors duration-500';
        currentWeatherCard.className = 'bg-blue-800 text-white p-6 md:p-8 rounded-xl shadow-md flex-col md:flex-row justify-between items-center relative overflow-hidden border border-blue-400';
    } else {
        // Reset to default sunny/clear UI
        document.body.className = 'bg-slate-50 text-slate-900 font-sans min-h-screen transition-colors duration-500';
        currentWeatherCard.className = 'bg-indigo-500 text-white p-6 md:p-8 rounded-xl shadow-md flex-col md:flex-row justify-between items-center relative overflow-hidden';
    }

    // Save to history
    saveSearchHistory(cityName);
}

// Requirement: Implement temperature unit toggle (°C/°F) only on today's temperature [cite: 30]
toggleUnitBtn.addEventListener('click', () => {
    if (isCelsius) {
        // Convert to Fahrenheit: (C * 9/5) + 32
        const fahrenheit = (currentTempCelsius * 9/5) + 32;
        currentTemp.textContent = fahrenheit.toFixed(2);
        tempUnit.textContent = '°F';
        toggleUnitBtn.textContent = 'Switch to °C';
        isCelsius = false;
    } else {
        // Switch back to Celsius
        currentTemp.textContent = currentTempCelsius.toFixed(2);
        tempUnit.textContent = '°C';
        toggleUnitBtn.textContent = 'Switch to °F';
        isCelsius = true;
    }
});

// --- 2. The 5-Day Forecast ---

function updateForecastUI(data) {
    forecastContainer.innerHTML = ''; // Clear previous cards
    
    // OpenWeather 5-day forecast returns 40 timestamps (every 3 hours). 
    // We filter this to grab just one reading per day (e.g., at 12:00:00).
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyData.forEach(day => {
        const date = day.dt_txt.split(' ')[0];
        const temp = day.main.temp.toFixed(2);
        const wind = day.wind.speed;
        const humidity = day.main.humidity;
        const iconCode = day.weather[0].icon;

        // Build HTML card [cite: 36]
        const cardHTML = `
            <div class="bg-slate-600 text-white p-4 rounded-xl shadow-sm flex flex-col space-y-2 items-center text-center hover:bg-slate-700 transition-colors">
                <h4 class="font-semibold text-slate-200">${date}</h4>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon" class="w-16 h-16 object-contain">
                <p class="text-sm w-full flex justify-between"><span>Temp:</span> <span class="font-bold">${temp}°C</span></p>
                <p class="text-sm w-full flex justify-between"><span>Wind:</span> <span class="font-bold">${wind} M/S</span></p>
                <p class="text-sm w-full flex justify-between"><span>Humidity:</span> <span class="font-bold">${humidity}%</span></p>
            </div>
        `;
        forecastContainer.innerHTML += cardHTML;
    });
}

// --- 3. Search History (Local Storage) ---

function saveSearchHistory(city) {
    // Get existing history from local storage [cite: 24]
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    
    // Remove the city if it already exists to prevent duplicates, then add to the top
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    
    // Keep only the 5 most recent searches
    if (history.length > 5) history.pop();
    
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    
    // Initially, there should not be any dropdown since there is no searched city [cite: 25]
    if (history.length === 0) {
        historyContainer.classList.add('hidden');
        return;
    }

    historyContainer.classList.remove('hidden');
    historyList.innerHTML = ''; // Clear list

    history.forEach(city => {
        const li = document.createElement('li');
        li.className = 'bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg cursor-pointer transition-colors border border-slate-200';
        li.textContent = city;
        
        // Clicking on any city in the dropdown menu should update the weather data [cite: 26]
        li.addEventListener('click', () => {
            cityInput.value = city; // Populate input
            fetchWeatherData(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        });
        
        historyList.appendChild(li);
    });
}

// Render history on page load
renderHistory();