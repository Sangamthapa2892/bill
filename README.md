# Home Bill & Weather App

A web-based application that allows users to **calculate their home electricity bill** and **view current weather and forecast** based on their location. The app stores the latest bill locally so it persists between page reloads.

---

## Features

### Bill Calculator
- Input **previous** and **current** meter readings.
- Automatically calculates:
  - Units consumed
  - Total bill based on a fixed **unit price**
  - Date of calculation
- Stores the last bill in **local storage** and displays it on page load.
- Displays output in a clean, responsive layout.

### Weather & Forecast
- Detects user location using **browser geolocation**.
- Shows:
  - Current temperature, weather description, and icon.
  - 5-day weather forecast (daily summary at 12:00 PM).
- Uses the **OpenWeatherMap API**.

### UI
- Modern, responsive card layout.
- Animated landscape and ocean background.
- Separate sections for current weather, forecast, and bill calculator.

---

## Technologies Used
- **HTML5** & **CSS3** for layout and styling
- **JavaScript (ES6)** for interactivity
- **OpenWeatherMap API** for weather data
- **LocalStorage** for persistent bill data

---

## Setup & Usage

1. Clone the repository:
   ```bash
   git clone <repo-url>
