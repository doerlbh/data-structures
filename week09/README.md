# Week 09

 

## Topics

Particle.io variable tracking, Process management in AWS Cloud9 (**pm2**)




## Tasks

1. Extract variable from sensor via particle photon API.
2. Setup ecosystem.config.js for **pm2** runtime service
3. Push them onto PostgreSQL databases with process management pm2
4. Check pm2 with "pm2 list", "pm2 start", "pm2 stop"



## Key solutions

setup.js

```javascript
const { Client } = require('pg');

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'doerlbh';
db_credentials.host = 'data-structures.cuwjvah1c0p0.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue double precision, sensorTime timestamp DEFAULT current_timestamp );";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
```

app.js

```javascript
 var request = require('request');
const { Client } = require('pg');

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'temp';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'doerlbh';
db_credentials.host = 'data-structures.cuwjvah1c0p0.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        // Store sensor value(s) in a variable
        var sv = JSON.parse(body).result;
        
        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO sensorData VALUES (" + sv + ", DEFAULT);";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every five minutes
setInterval(getAndWriteData, 60000);
```

check.js

```javascript
const { Client } = require('pg');
const cTable = require('console.table');

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'doerlbh';
db_credentials.host = 'data-structures.cuwjvah1c0p0.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statements for checking your work: 
var thisQuery = "SELECT * FROM sensorData;"; // print all values
var secondQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
var thirdQuery = "SELECT sensorValue, COUNT (*) FROM sensorData GROUP BY sensorValue;"; // print the number of rows for each sensorValue

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(secondQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
});

client.query(thirdQuery, (err, res) => {
    if (err) {throw err}
    else {
    console.table(res.rows);
    }
    client.end();
});
```

   

## Config for pm2

ecosystem.config.js

```javascript
module.exports = {
  apps : [{
    script: 'app.js',
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker'],
        env: {
      "PHOTON_ID": "xxxx",
      "PHOTON_TOKEN": "xxxx",
      "AWSRDS_PW": "xxxx"
}
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

```

## Output

Example check query output:


```javascript
sensorvalue        sensortime                                                    
-----------------  --------------------------------------------------------------
73.4000015258789   Tue Nov 10 2020 21:08:55 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:09:25 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:17:07 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:18:08 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:23:53 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:24:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:25:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:26:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:27:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:28:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:29:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:30:53 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:31:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:32:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:33:52 GMT+0000 (Coordinated Universal Time)
73.58000183105469  Tue Nov 10 2020 21:34:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:35:53 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:36:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:37:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:38:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:39:52 GMT+0000 (Coordinated Universal Time)
73.4000015258789   Tue Nov 10 2020 21:40:52 GMT+0000 (Coordinated Universal Time)

count
-----
22   

sensorvalue        count
-----------------  -----
73.58000183105469  13   
73.4000015258789   9  
```
