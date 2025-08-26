import "./styles.css";
import partiallyCloudyImg from "./partially_cloudy.avif";
import rainImg from "./rain.avif";
import clearImg from "./clear.avif";

class Weather {
  myKey = "8973SVWYGN2AETA7DAJ82YH9K";
  constructor(location) {
    this.location = location;
    this.weatherURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?key=${this.myKey}`;
  }
  async getWeatherInfo() {
    const response = await fetch(this.weatherURL);

    try {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  }
}

let currentUnit = "fahrenheit";
let hasWeatherData = false;
const container = document.querySelector("#container");
const basicInfo = document.querySelector(".basic-info");
const tempRange = document.querySelector(".basic-info .temp-range");
const todayInfo = document.querySelector(".today-info");
const forecastInfo = document.querySelector(".forecast-info");
const fahrenheitButton = document.querySelector(".fahrenheit");
const celsiusButton = document.querySelector(".celsius");
const input = document.querySelector("input");

input.addEventListener("change", renderWeatherInfo);

fahrenheitButton.addEventListener("click", () => {
  convertToFahrenheit();
  fahrenheitButton.className = "on";
  celsiusButton.className = "";
});

celsiusButton.addEventListener("click", () => {
  convertToCelsius();
  celsiusButton.className = "on";
  fahrenheitButton.className = "";
});

function convertToCelsius() {
  if (currentUnit === "celcius") return;
  if (!hasWeatherData) return;
  hasWeatherData;
  const temp = document.querySelector(".temperature");
  const lowestTemps = document.querySelectorAll(".lowest");
  const highestTemps = document.querySelectorAll(".highest");

  const celsiusTemp = (parseInt(temp.textContent) - 32) * (5 / 9);
  temp.textContent = celsiusTemp.toFixed(0);

  lowestTemps.forEach((lowest) => {
    const celsiusLowest = (parseInt(lowest.textContent) - 32) * (5 / 9);
    lowest.textContent = celsiusLowest.toFixed(0);
  });

  highestTemps.forEach((highest) => {
    const celsiusHighest = (parseInt(highest.textContent) - 32) * (5 / 9);
    highest.textContent = celsiusHighest.toFixed(0);
  });
  currentUnit = "celcius";
}

function convertToFahrenheit() {
  if (currentUnit === "fahrenheit") return;
  if (!hasWeatherData) return;
  const temp = document.querySelector(".temperature");
  const lowestTemps = document.querySelectorAll(".lowest");
  const highestTemps = document.querySelectorAll(".highest");

  const celsiusTemp = parseInt(temp.textContent) * (9 / 5) + 32;
  temp.textContent = celsiusTemp.toFixed(0);

  lowestTemps.forEach((lowest) => {
    const celsiusLowest = parseInt(lowest.textContent) * (9 / 5) + 32;
    lowest.textContent = celsiusLowest.toFixed(0);
  });

  highestTemps.forEach((highest) => {
    const celsiusHighest = parseInt(highest.textContent) * (9 / 5) + 32;
    highest.textContent = celsiusHighest.toFixed(0);
  });
  currentUnit = "fahrenheit";
}

function clearInfo() {
  basicInfo.innerHTML = "";
  tempRange.innerHTML = "";
  todayInfo.innerHTML = "";
  forecastInfo.innerHTML = "";
  hasWeatherData = false;
  currentUnit = "fahrenheit";
}

async function renderWeatherInfo() {
  clearInfo();
  const location = input.value;
  const weather = new Weather(location);
  const weatherData = await weather.getWeatherInfo();
  const currentConditions = weatherData.currentConditions;
  const days = weatherData.days;

  const address = document.createElement("p");
  const temp = document.createElement("p");
  const conditions = document.createElement("p");
  const lowestTemp = document.createElement("p");
  const dash = document.createElement("span");
  const highestTemp = document.createElement("p");
  const description = document.createElement("p");

  address.classList.add("address");
  temp.classList.add("temperature");
  conditions.classList.add("condition");
  lowestTemp.classList.add("lowest");
  dash.classList.add("dash");
  highestTemp.classList.add("highest");
  description.classList.add("description");

  address.textContent = weatherData.address;
  temp.textContent = currentConditions.temp;
  conditions.textContent = currentConditions.conditions;
  lowestTemp.textContent = days[0]["tempmin"];
  dash.textContent = "-";
  highestTemp.textContent = days[0]["tempmax"];
  description.textContent = weatherData.description;

  basicInfo.append(address);
  basicInfo.append(conditions);
  basicInfo.append(temp);
  tempRange.append(lowestTemp);
  tempRange.append(dash);
  tempRange.append(highestTemp);
  basicInfo.appendChild(tempRange);
  todayInfo.append(description);

  getBgImage(currentConditions.conditions.toLowerCase());

  for (let i = 0; i < days.length - 1; i++) {
    const container = document.createElement("div");
    container.classList.add("day-info");
    const date = document.createElement("p");
    date.classList.add("date");
    date.textContent = days[i]["datetime"];

    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.textContent = days[i]["icon"];

    const highestLowestContainer = document.createElement("div");
    highestLowestContainer.classList.add("temp-range");

    const lTemp = document.createElement("p");
    lTemp.classList.add("lowest");
    lTemp.textContent = days[i]["tempmin"];

    const dash = document.createElement("span");
    dash.classList.add("dash");
    dash.textContent = "-";

    const hTemp = document.createElement("p");
    hTemp.classList.add("highest");
    hTemp.textContent = days[i]["tempmax"];

    highestLowestContainer.appendChild(lTemp);
    highestLowestContainer.appendChild(dash);
    highestLowestContainer.appendChild(hTemp);

    container.appendChild(date);
    container.appendChild(icon);
    container.appendChild(highestLowestContainer);
    forecastInfo.appendChild(container);
  }
  hasWeatherData = true;
}

// Change the background color according to the weather conditions
async function getBgImage(weatherConditions) {
  container.style.backgroundImage = "";
  switch (weatherConditions) {
    case "rain":
    case "rain, partially cloudy":
      container.style.backgroundImage = `url(${rainImg})`;
      break;
    case "clear":
      container.style.backgroundImage = `url(${clearImg})`;
      break;
    case "partially cloudy":
      container.style.backgroundImage = `url(${partiallyCloudyImg})`;
      break;
  }
}
