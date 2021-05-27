# weather-project-backend  
## Weather Tracking Tutorial - Part 1
This is a tutorial for creating a Node script for collecting weather data from openweathermap.org and storing it in a MariaDB or MySQL database. This script will be run via crontab using a shell script every 60 minutes in order to create historical data. This data will later be used to create a dashboard that will display weather trends over time for a given city (or cities).  

## Installation
Clone this repository with  
git clone <https://github.com/seale61/weather-project-backend.git>  
cd into weather-project-backend  
run npm install  
  
## weather.sql
This is the database script that will create the neccessary tables and load the cities_us table. The cities_us table contains the id, name, and geolocation for every incorporated city in the United States. A JSON file containing data for nearly every city on earth can be found [here](http://bulk.openweathermap.org/sample/city.list.json.gz) - **note**, this is a very large file.

## API Key
In order to access the APIs, you will need to create a free account and get an API key from [OpenWeatherMap.org](https://home.openweathermap.org). Once you have created an account and acquired and API key, subscribe to the "**Current Weather Data**" API, and optionally, "**One Call**" API. The "One Call" API will be used in a future tutorial, so if you wish to continue after this round, you might want to go ahead and subscribe to it now. These APIs are free to use, but there are some restrictions involved in how many times they can be accessed in a given time frame from a the same IP address. Please read the documentation.  

## .env
This project will require you to use a .env file to securely hold your database connection information and your OpenWeatherMap API key. Your .env file should contain the follow information.
  
DB_HOST=localhost  
DB_USER=your_database_username  
DB_PASS=your_database_password  
DATABASE=weather  
WEATHERKEY=your_api_key   

## Shell script and crontab 
In order to for your script to collect curremt weather data every hour, you will need to create a shell script to change into the right directory and actually run your script.  To do this create a text file called '"weather.sh" and enter the following using the actual path to you weather.js script:  
  
`#!/bin/sh`  
`cd /path/to/your/node/script`    
`node weather.js`    

