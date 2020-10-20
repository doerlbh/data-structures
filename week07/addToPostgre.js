// npm install pg
const {
    Client
} = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
var async = require('async');

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

// NOTE: Run the following queries one at a time!

var thisQuery = "DROP TABLE aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
 
var thisQuery = "DROP TABLE aameetings;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

var thisQuery = " CREATE TABLE aameetings (address varchar(100), building varchar(100), title varchar(50), address_notes varchar(250), meeting_notes varchar(250), zipcode varchar(10), wheelchair varchar(10), day varchar(20), start_time varchar(10), end_time varchar(10), meeting_type varchar(50), special varchar(50));";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

for (let i = 1; i < 11; i++) {

    // var i = 10;

    let filecount = ('0' + i).slice(-2);

    var aadata = JSON.parse(fs.readFileSync('../data/meeting/m' + filecount + '_meetings.json'));
    var geostamps = JSON.parse(fs.readFileSync('../data/geostamp/m' + filecount + '_geostamps.json'));

    // AWS RDS POSTGRESQL INSTANCE
    var db_credentials = new Object();
    db_credentials.user = 'doerlbh';
    db_credentials.host = 'data-structures.cuwjvah1c0p0.us-east-2.rds.amazonaws.com';
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

    async.eachSeries(aadata, function(value, callback) {
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO aameetings VALUES (E'" + value.address + "', E'" + value.building + "', E'" + value.title + "', E'" + value.address_notes + "', E'" + value.meeting_notes + "', E'" + value.zipcode + "', E'" + value.wheelchair + "', E'" + value.day + "', E'" + value.start_time + "', E'" + value.end_time + "', E'" + value.meeting_type + "', E'" + value.special + "');";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        setTimeout(callback, 500);
    });

    async.eachSeries(geostamps, function(value, callback) {
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        setTimeout(callback, 500);
    });
    
}

