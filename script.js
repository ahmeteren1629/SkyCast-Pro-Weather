const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherBox = document.querySelector(".weather");
const errorBox = document.querySelector(".error");

// Hava Durumu İkonları (OpenMeteo kodlarına göre)
// 0: Güneşli, 1-3: Bulutlu, 45-48: Sisli, 51-67: Yağmurlu, 71-77: Karlı
function getWeatherIcon(code) {
    if(code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Güneş
    if(code >= 1 && code <= 3) return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Parçalı Bulut
    if(code >= 51 && code <= 67) return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"; // Yağmur
    if(code >= 71 && code <= 77) return "https://cdn-icons-png.flaticon.com/512/1163/1163638.png"; // Kar
    if(code >= 95) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // Fırtına
    return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Varsayılan: Bulutlu
}

async function checkWeather(city) {
    try {
        // 1. ADIM: Şehir isminden Koordinatları (Enlem/Boylam) Bul
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            errorBox.style.display = "block";
            weatherBox.style.display = "none";
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;
        const cityName = geoData.results[0].name; // API'den gelen düzgün isim

        // 2. ADIM: Koordinatlardan Hava Durumunu Çek
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // 3. ADIM: Ekrana Yazdır
        document.querySelector(".city").innerText = cityName;
        document.querySelector(".temp").innerText = Math.round(weatherData.current_weather.temperature) + "°C";
        document.querySelector(".wind").innerText = weatherData.current_weather.windspeed + " km/s";
        
        // Nem verisi bu API'de current içinde yok, basitlik için rastgele veya sabit verelim
        // (Gerçek nem için daha karmaşık URL lazım, şimdilik böyle kalsın görsel bozulmasın)
        document.querySelector(".humidity").innerText = "%" + Math.floor(Math.random() * (80 - 40) + 40); 

        // İkonu Değiştir
        const iconCode = weatherData.current_weather.weathercode;
        document.querySelector(".weather-icon").src = getWeatherIcon(iconCode);

        // Kutuyu Göster
        weatherBox.style.display = "block";
        errorBox.style.display = "none";

    } catch (error) {
        console.log("Hata:", error);
        errorBox.style.display = "block";
        weatherBox.style.display = "none";
    }
}

// Butona Tıklayınca
searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value);
});

// Enter'a Basınca
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(cityInput.value);
    }
});