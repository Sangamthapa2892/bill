window.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "a4772a554d60d17a8d8560429b043952";

  // Weather Elements
  const statusDiv = document.getElementById("status");
  const weatherDiv = document.getElementById("weather");
  const placeSpan = document.getElementById("place");
  const tempP = document.getElementById("temp");
  const descP = document.getElementById("desc");
  const iconImg = document.getElementById("icon");

  // Bill Elements
  const calculateBtn = document.getElementById("calculateBtn");
  const outputDiv = document.getElementById("billOutput");
  const prevInput = document.getElementById("previous");
  const currInput = document.getElementById("current");
  const unitPrice = document.getElementById("price");

  // --- Weather Functions ---
  function showStatus(msg) {
    statusDiv.textContent = msg;
  }

  function showWeather(data) {
    placeSpan.textContent = `${data.name}, ${data.sys.country}`;
    tempP.textContent = Math.round(data.main.temp) + "°C";
    descP.textContent = data.weather[0].description;
    iconImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDiv.hidden = false;
    showStatus("");
  }

  function getWeather(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then(showWeather)
      .catch(() => showStatus("Unable to fetch weather"));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then(showForecast)
      .catch((err) => console.log("Unable to fetch forecast", err));
  }

  if ("geolocation" in navigator) {
    showStatus("Detecting your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeather(pos.coords.latitude, pos.coords.longitude),
      () => showStatus("Unable to get your location")
    );
  } else {
    showStatus("Geolocation is not supported by your browser.");
  }

  function showForecast(data) {
    const forecastDiv = document.querySelector(".forecast");
    forecastDiv.innerHTML = "";
    const dailyForecast = {};

    data.list.forEach((item) => {
      const [date, hour] = item.dt_txt.split(" ");
      if (hour === "12:00:00" && !dailyForecast[date])
        dailyForecast[date] = item;
    });

    Object.keys(dailyForecast).forEach((date) => {
      const item = dailyForecast[date];
      const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const temp = Math.round(item.main.temp) + "°C";
      const dayDiv = document.createElement("div");
      dayDiv.innerHTML = `<p>${dayName}</p><p>${temp}</p>`;
      forecastDiv.appendChild(dayDiv);

      const separator = document.createElement("div");
      separator.className = "separator";
      forecastDiv.appendChild(separator);
    });

    if (forecastDiv.lastChild) forecastDiv.removeChild(forecastDiv.lastChild);
  }

  // --- Bill Functions ---
  function renderBill(data) {
    if (!data) return;
    outputDiv.innerHTML = `
        <div style="display:flex; flex-direction:row; gap:60px; justify-content:space-between">
            <div style="display: flex; flex-direction:column">
                <span><strong>Previous Reading:</strong> ${data.previous}</span>
                <span><strong>Units:</strong> ${data.units} units</span>
            </div>
            <div style="display: flex; flex-direction:column">
                <span><strong>Current Reading:</strong> ${data.current}</span>
                <span><strong>Unit Price:</strong> ${data.price} per unit</span>
            </div>
        </div>
            <p><strong>Total Bill:</strong> ${data.total}</p>
            <p><strong>Date:</strong> ${data.date}</p>
        `;
  }

  // Load saved bill on page load
  const savedData = JSON.parse(localStorage.getItem("lastBill"));
  renderBill(savedData);

  // Calculate new bill
  calculateBtn.addEventListener("click", () => {
    const prev = parseFloat(prevInput.value);
    const curr = parseFloat(currInput.value);
    const price = parseFloat(unitPrice.value);

    if (!isNaN(prev) && !isNaN(curr) && curr >= prev) {
      const units = curr - prev;
      const total = units * price;
      const date = new Date().toLocaleDateString();

      const billData = { previous: prev, current: curr, units, total, date, price };
      localStorage.setItem("lastBill", JSON.stringify(billData));
      renderBill(billData);
    } else {
      outputDiv.innerHTML = `<p style="color:red;">Please enter valid readings. Current must be greater than or equal to Previous.</p>`;
    }
  });
});
