# weather-project-backend  
## Weather Tracking Tutorial - Part 1
This is a tutorial for creating a Node script, weather.js, that collects weather data from openweathermap.org and stores it in a MariaDB or MySQL database. This script will be run via crontab using a shell script every 60 minutes in order to create historical weather data. Then, we will create a second script, weather_daily.js, that will process this data and store the highs and lows for the previous date (or a given date) and store that data in the weather_history_daily table.  The script will be run once a day via crontab at 12:05 AM. This data will later be used to create a dashboard that will display weather trends over time for a given city (or cities).  

## Installation
If you don't have **git** installed, be sure to do this first. From a terminal command line, clone this repository by entering:   
  
    git clone <https://github.com/seale61/weather-project-backend.git>  
  
cd into weather-project-backend  
run **npm install**  
  
## weather.sql
This is the database script that will create the neccessary tables and load the cities_us table. The cities_us table contains the id, name, and geolocation for every incorporated city in the United States. A JSON file containing data for nearly every city on earth can be found [here](http://bulk.openweathermap.org/sample/city.list.json.gz) - **note**, this is a very large file. You can run this script from the terminal command line if you MySQL or MariaDB installed (you will be prompted for a password when using the "-p" switch):  

    mysql -u <username> -p < weather.sql

## API Key
In order to access the APIs, you will need to create a free account and get an API key from [OpenWeatherMap.org](https://home.openweathermap.org). Once you have created an account and acquired an API key, subscribe to the "**Current Weather Data**" API, and optionally, "**One Call**" API. The "One Call" API will be used in a future tutorial, so if you wish to continue after this round, you might want to go ahead and subscribe to it now. These APIs are free to use, but there are some restrictions involved in how many times they can be accessed in a given time frame from a the same IP address. Please read the documentation.  

## .env
This project will require you to use a .env file to securely hold your database connection information and your OpenWeatherMap API key. Your .env file should contain the following information.
  
DB_HOST=localhost  
DB_USER=your_database_username  
DB_PASS=your_database_password  
DATABASE=weather  
WEATHERKEY=your_api_key   

## Shell script  (Linux/MacOS only)
In order to for your script to collect curremt weather data every hour, you will need to create a shell script to change into the right directory and actually run your script.  To do this, create a text file called '"weather.sh" and enter the following using the actual path to your weather.js script:  
  
    #!/bin/sh    
    cd /path/to/your/node/script  
    node weather.js  
  
Create another file called weather-daily.sh and enter the following (again, use your own path):  

    #!/bin/sh  
    cd /path/to/your/node/script  
    node weather_daily.js

Save these files and make chem executable using 'chmod +x <filename>'  at the terminal command line.

## Crontab (Linux/MacOS only)
In a terminal window, enter "crontab -e" at the command line. You may be given a choice of editors. I generally recommend nano. When the editor comes up, enter the following line (using your own path to your shell script):  
  
    */60 * * * * /apps/node-scripts/weather/weather.sh >/dev/null 2>&1  
  
Save your crontab entry, and your script will run in the background at the top of every hour.  
  
If you are not running a server version of your OS, you may have to install crontab.  
Windows users will need to use a batch file and Windows scheduler.  

