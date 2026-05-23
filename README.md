# 🌤️ Professional Weather Dashboard

A responsive, feature-rich weather forecast application built with vanilla JavaScript and Tailwind CSS. This dashboard provides real-time weather metrics, location-based tracking, and extended 5-day forecasts utilizing the OpenWeatherMap API.

## ✨ Key Features

* **Real-Time Forecasting:** Instant access to current temperature, humidity, wind speed, and dynamic weather conditions.
* **Smart Geolocation:** One-click "Use Current Location" functionality using the HTML5 Geolocation API.
* **5-Day Extended Forecast:** Daily breakdowns plotted at noon each day, complete with visual weather icons.
* **Persistent Search History:** Automatically saves recent searches using `localStorage` for quick re-access via a clean dropdown interface.
* **Interactive UI:** * Dynamic background color shifting based on weather conditions (e.g., shifts to deep blue during rain).
    * Instant °C to °F temperature toggle for current weather.
* **Robust Error Handling:** Custom, non-intrusive UI alerts for invalid queries or API failures (Zero native `alert()` boxes used).
* **Extreme Weather Alerts:** Built-in logic to flag dangerously high temperatures (above 40°C).

## 🛠️ Technologies Used

* **Frontend:** HTML5, Tailwind CSS (via CDN for rapid deployment)
* **Logic:** Vanilla JavaScript (ES6+ with Async/Await)
* **Data:** [OpenWeatherMap API](https://openweathermap.org/)
* **Version Control:** Git & GitHub

## 🚀 Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd weather-dashboard

   