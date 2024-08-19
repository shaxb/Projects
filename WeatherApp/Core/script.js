// http://api.weatherapi.com/v1/forecast.json?key=3dfbd888e3dc4b02910103234241808&q=London&days=3&aqi=yes&alerts=no

let key = "3dfbd888e3dc4b02910103234241808";
let InputCity = "London";
let url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${InputCity}&days=3&aqi=yes&alerts=no`;

const Input = document.querySelector(".searchbar input");
const SearchBtn = document.querySelector(".searchbar button");
const city = document.querySelector(".weather h2");
const icon = document.querySelector(".weather .shape img");
const temp = document.querySelector(".weather .temp");
const day = document.querySelector(".weather .day");
const date = document.querySelector(".date");
const wind = document.querySelector(".info .wind .windVal");
const humidity = document.querySelector(".info .humidity .HumidityVal");
const pressure = document.querySelector(".info .pressure .pressureVal");
const forecast = document.querySelector(".forecast");



class BaseWeatherApp {
    constructor(CityName)
    {
        this.CityName = CityName;
        this.forecast = [];
    }

   async getWeather(CityName) {
     const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${CityName}&days=3&aqi=yes&alerts=no`);
     if (!response.ok) {
       throw new Error(`HTTP error! City not found: ${response.status}`);
     }
     const responseData = await response.json();
     return responseData;
   }

   // Convert to num
    removeDecimal(num) {
        return Math.trunc(Number(num)).toString();
    }


convertDate(dateString) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(dateString);
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();  

  const ordinal = (() => {
    const suffixes = ["st", "nd", "rd", "th"];
    const j = day % 10;
    const k = day % 100;
    if (j == 1 && k != 11) return day + suffixes[0];
    if (j == 2 && k != 12) return day + suffixes[1];
    if (j == 3 && k != 13) return day + suffixes[2];
    return day + suffixes[3];
  })();
  const month = months[date.getMonth()];
  return `${weekday}, ${ordinal} ${month}`;
}


timeDivider(timeString){
  const [date, time] = timeString.split(" ");
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":").map(Number);
  const sunrise = new Date(`${date}T06:00:00`);
  const sunset = new Date(`${date}T17:00:00`);
  const noon = new Date(`${date}T13:00:00`);
  const now = new Date(`${date}T${hours}:${minutes}:00`);

  if (now >= sunrise && now < noon) {
    return "morning";
  } else if (now >= noon && now < sunset) {
    return "noon";
  } else if (now >= sunset && now <= new Date(`${date}T20:00:00`)) {
    return "sunset";
  } else if (now > new Date(`${date}T20:00:00`) && now <= new Date(`${date}T23:59:59`)) {
    return "night";
  } else {
    return "night";
  }
}

    setBackgroundImage(timeString){
        const timePart = this.timeDivider(timeString);
        const images = {
            sunset: "../background-imges/SunSet.jpg",
            night: "../background-imges/Night.jpg",
            morning: "../background-imges/Morning.jpg",
            noon: "../background-imges/Afternoon.jpg"
        };
        document.body.style.backgroundImage = `url(${images[timePart]})`;
    }

    ForecastData(responseData) {
         
        for (const day of responseData["forecast"]["forecastday"]) {
            
            const forecastObj = {
                date:this.convertDate(day["date"]).split(",")[0],
                icon: `https:${day["day"]["condition"]["icon"]}`,
                temp: this.removeDecimal(day["day"]["mintemp_c"]) + " - " + this.removeDecimal(day["day"]["maxtemp_c"]) + "°C",
            };
            this.forecast.push(forecastObj);
        }
        return this.forecast;
    }




    FillWeatherData(responseData) {
        city.innerText = `${responseData["location"]["name"]}`;
        icon.src = `https:${responseData["current"]["condition"]["icon"]}`;
        temp.innerText = this.removeDecimal(responseData["current"]["temp_c"]) + "°C";
        day.innerText = responseData["current"]["condition"]["text"];
        date.innerText = this.convertDate(responseData["location"]["localtime"]);
        wind.innerText = this.removeDecimal(responseData["current"]["wind_kph"]);
        humidity.innerText = this.removeDecimal(responseData["current"]["humidity"]);
        pressure.innerText = this.removeDecimal(responseData["current"]["pressure_mb"]);

        this.setBackgroundImage(responseData["location"]["localtime"]);

        const forecastData = this.ForecastData(responseData);
        forecastData.forEach((day) => {
            const { date, icon, temp } = day;
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
            const forecastDate = document.createElement("p");
            const forecastIcon = document.createElement("img");
            const forecastTemp = document.createElement("p");
            forecastDate.innerText = date;
            forecastIcon.src = icon;
            forecastTemp.innerText = temp;
            forecastDiv.append(forecastDate, forecastIcon, forecastTemp);
            forecast.append(forecastDiv);
        })
    }
}


let WeatherApp = new BaseWeatherApp("London")

console.log(WeatherApp);

Input.addEventListener("keyup", (event) => {
    if(event.key == "Enter")
    {
        SearchBtn.click();
    }
});


SearchBtn.addEventListener("click", () => {
    InputCity = Input.value;
    WeatherApp.getWeather(InputCity).then((data) => {
        WeatherApp.forecast = [];
        forecast.innerHTML = "";
        WeatherApp.FillWeatherData(data);
        console.log(data);
        
        

    }).catch((error) => {
        alert(error["message"]);
    })
})
