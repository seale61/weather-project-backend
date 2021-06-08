require('dotenv').config();
const mysql  = require('mysql');
const util   = require('util'); 

const dbconn = mysqlConnect(mysql);

/*  
    Promisify allows us to make our results accessible without 
    the need of using a callback function.
*/

const query = util.promisify(dbconn.query).bind(dbconn);

/*
    If you wish to process a particular date you can enter it with the command in YYYY-MM-DD format
    example:  node weather_daily.js 2021-06-01

*/

let date = process.argv[2];
console.log(date);

// Default load type will be daily, so test for undefined.
if (typeof date === "undefined") {
    date = null;
} 

processWeatherHistory(date);


async function processWeatherHistory(date) {
    
    if(!date) {
        date = getYesterday();
    }

    var stations  = await getStations();

    for(let i = 0; i < stations.length; i++) {
        let results = await getData(date, stations[i].station);
        highsAndLows(date, stations[i].station, results)
    }

    process.exit(0);

}

async function highsAndLows(date, station, data) {

    var temperature = [];
    var humidity = [];
    var pressure = [];

    for(let i = 0; i < data.length; i++) {
        temperature[i]  = data[i].temperature;
        humidity[i]     = data[i].humidity;
        pressure[i]     = data[i].pressure;
    }

    let highLow = [
        station,
        date,
        Math.max(...temperature),
        Math.min(...temperature),
        Math.max(...humidity),
        Math.min(...humidity),
        Math.max(...pressure),
        Math.min(...pressure)
    ]

    await storeData(highLow);    

}

async function storeData(data) {

    let sql = `INSERT INTO weather_history_daily (
                    station, 
                    date_time, 
                    high_temp, 
                    low_temp, 
                    humidity_max,
                    humidity_min,
                    pressure_max,
                    pressure_min
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        let results = await query(sql, data);
        console.log(results);
        return;
    } catch(error) {
        console.log(error);
    }

}

function getYesterday() {

    let d = new Date()
    d.setDate(d.getDate() - 1);

    let month = d.getMonth() + 1;
    let day  = d.getDate();

    if(month < 10) {
        month = '0' + month;
    }

    if(day < 10) {
        day = '0' + day;
    }

    return `${d.getFullYear()}-${month}-${day}`;

}

async function getStations() {

    let sql = 'SELECT DISTINCT(station) FROM weather_history_hourly';

    try {
        let results = await query(sql);
        return results;
    } catch(error) {
        console.log(error);
    }

}

async function getData(yesterday, station) { 

    let data = [yesterday, station];

    let sql = 'SELECT * FROM weather_history_hourly WHERE SUBSTRING(date_time, 1, 10) = ? AND station = ?';
    
    try {
        let results = await query(sql, data);
        return results;
    } catch(error) {
        console.log(error);
    }
 
}

function mysqlConnect(mysql) {

    // Create connection
    const db = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DATABASE  
    });

    db.connect((err) => {
        if (err) {
            console.log(err);
            process.exit();
        }

        console.log('Mysql has been connected');

    });

    return db;
}