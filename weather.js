require('dotenv').config();
const mysql  = require('mysql');
const http   = require('axios');
const util   = require('util'); 

const dbconn = mysqlConnect(mysql);

/* 
    Promisify allows us to access our data and make it accessible without 
    the need of using a callback function.
*/
const query = util.promisify(dbconn.query).bind(dbconn);

const city_ids = [
    '4180439',  // Atlanta, GA
    '5128581'   // New York, NY
];

loadWeatherData(city_ids);

async function loadWeatherData(city_ids) {

    let weatherApiKey = process.env.WEATHERKEY;

    for(let i = 0; i < city_ids.length; i++) {

        let url = "https://api.openweathermap.org/data/2.5/weather?";
        let q_string = `id=${city_ids[i]}&units=imperial&appid=${weatherApiKey}`;
        
        url = url + q_string;
        let current_results = await http.get(url);
        current_results = current_results.data;

        let current = [
            convertDateTime(current_results.dt, current_results.timezone),
            current_results.weather[0].id,
            Math.round(current_results.main.temp),
            Math.round(current_results.main.humidity),
            convert_pressure(current_results.main.pressure),
            windDirection(current_results.wind.deg),
            Math.round(current_results.wind.speed),
            current_results.name,
        ]

        //await loadDataTable(current);
        console.log(current);
    }

    process.exit(0);
}

async function loadDataTable(data) {

    // We will later make this insert statement a stored procedure call

    let sql = `INSERT INTO weather_history_hourly (
                    date_time, 
                    desc_code, 
                    temperature, 
                    humidity, 
                    pressure, 
                    wind_direction, 
                    wind_speed, 
                    station
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        await query(sql, data);
    } catch(err) {
        console.log(err);
    }

}

function convertDateTime(utc, offset) { 

    if(offset < 0) {
        utc -= Math.abs(offset);
    }
    if(offset > 0) {
        utc += Math.abs(offset);
    }

    var t = new Date(1970, 0, 1); // Current epoch
    t.setSeconds(utc);

    let d = new Date(t);

    /*
        The following "if" statements makes sure that there is a zero padding 
        the numbers if the numbers are less than 10. This is to ensure the date 
        and times are formatted correctly.
    */

    let minutes = d.getMinutes();
    if(minutes == 0) {
        minutes = '00';
    } else if(minutes < 10) {
        minutes = '0' + minutes;
    }

    let day = d.getDate();
    if(day < 10) {
        day = '0' + day;
    } 

    let month = d.getMonth() + 1;
    if(month < 10) {
        month = '0' + month;
    } 

    return  `${d.getFullYear()}-${month}-${day} ${d.getHours()}:${minutes}`;

}

function convert_pressure(mb) {

    // millibars to inches of mercury (hPa)
    let hPa = mb * 0.0295301;

    //round to maximum of two decimals and return
    return Number(Math.round(hPa + 'e' + 2) + 'e-' + 2);
}

function windDirection(degree) {

    if (degree > 337.5) {
        return 'N';
    }
    if (degree > 292.5) {
        return 'NW';
    }
    if(degree > 247.5) {
        return 'W';
    }
    if(degree > 202.5) {
        return 'SW';
    }
    if(degree > 157.5) {
        return 'S';
    }
    if(degree > 122.5) {
        return 'SE';
    }
    if(degree > 67.5) {
        return 'E';
    }
    if(degree > 22.5) {
        return 'NE';
    }
    return 'N';
}

function mysqlConnect(mysql) {
    // Create connection
    const db = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DATABASE  
    });

    // Connect
    db.connect((err) => {
        if (err) {
            process.exit();
        }
        console.log(`MySql Connected ${process.env.DATABASE}`);
    });

    return db;
}