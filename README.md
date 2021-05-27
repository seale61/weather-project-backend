# weather-project-backend
Weather tracking tutorial - Part 1. Node script for collecting weather data from openweathermap.org and storing it in a MariaDB database  

## Installation
Clone this repository with  
git clone <https://github.com/seale61/weather-project-backend.git>  
cd into weather-project-backend  
run npm install  
  
## weather.sql
This is the database script that will create the neccessary tables and load the cities table. The cities_us table contains the id, name, and geolocation for every incorporated city in the United States. The data for nearly every city on earth can be found [here](http://bulk.openweathermap.org/sample/city.list.json.gz).  

## API Key
In order to access the API, you will need to create a free account and API key [OpenWeatherMap.ORG](https://home.openweathermap.org)
