const apiKey = "0ccd8c7a0629e8ac9e29e86da14c2aac";

// Get HTML elements
const cityMenu = document.getElementById("cityMenu");
const citySearch = document.getElementById("citysearch");
const weatherData = document.getElementById("weatherdata");
const searchButton = document.getElementById("search");

// Store the selected city
let selectedCity = "Helsinki";

// Update selected city when dropdown changes
function selectCity() {

    selectedCity = cityMenu.value;

}

// Search button event
searchButton.addEventListener("click", function() {

    // Get the user's search input
    const searchQuery = citySearch.value.trim();

    // Only search if the input is not empty
    if (searchQuery) {
        getWeather(searchQuery);
    } else {
        weatherData.textContent = "Please enter a city name.";
    }

});

// Fetch and display weather data
async function getWeather(searchQuery) {

    // Use search query if provided, otherwise use selected dropdown city
    const city = searchQuery || selectedCity;

    // Display loading message
    weatherData.textContent = "Loading weather data...";

    try {

        // Send GET request to OpenWeatherMap API
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&mode=xml&appid=${apiKey}`
        );

        // Check if the response was successful
        if (!response.ok) {
            throw new Error("Weather data could not be loaded.");
        }

        // Read the response as text
        const xmlData = await response.text();

        // Parse XML data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");

        // Check for XML parsing errors
        if (xmlDoc.querySelector("parsererror")) {
            throw new Error("Invalid XML data received.");
        }

        // Extract information from XML
        const cityName = xmlDoc.querySelector("city")?.getAttribute("name");

        const temperature = xmlDoc.querySelector("temperature")?.getAttribute("value");

        const humidity = xmlDoc.querySelector("humidity")?.getAttribute("value");

        const clouds = xmlDoc.querySelector("clouds")?.getAttribute("name");

        // Display the weather information
        weatherData.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = cityName || city;

        const temp = document.createElement("p");
        temp.textContent = `Temperature: ${temperature ?? "Unavailable"} °C`;

        const humid = document.createElement("p");
        humid.textContent = `Humidity: ${humidity ?? "Unavailable"}%`;

        const cloud = document.createElement("p");
        cloud.textContent = `Cloudiness: ${clouds ?? "Unavailable"}`;

        weatherData.append(heading, temp, humid, cloud);

    } catch (error) {

        // Handle errors
        weatherData.textContent =
            "Error: " + error.message;

    }

}
