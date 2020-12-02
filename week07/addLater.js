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

// var thisQuery = "DROP TABLE aadataall;";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

// var thisQuery = " CREATE TABLE aadataall (mtgaddress varchar(100), lat double precision, lon double precision, mtglocation varchar(100), mtgname varchar(50), address_notes varchar(250), meeting_notes varchar(250), zipcode varchar(10), wheelchair varchar(10), day varchar(20), shour varchar(10), tim varchar(10), types varchar(50), special varchar(50));";

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });

function getLatLonByAdd(address,data) {
  return data.filter(
      function(data){ return data.address == address }
  );
}

// async.eachSeries([1,2,3,4,5,6,7,8,9.10], function(i, callback0) {

var i = 10;

    let filecount = ('0' + i).slice(-2);

    var aadata = JSON.parse(fs.readFileSync('../data/meeting/m' + filecount + '_meetings.json'));
    var geostamps = JSON.parse(fs.readFileSync('../data/geostamp/m' + filecount + '_geostamps.json'));
    
    console.log('../data/meeting/m' + filecount + '_meetings.json')

    // AWS RDS POSTGRESQL INSTANCE
    var db_credentials = new Object();
    db_credentials.user = 'doerlbh';
    db_credentials.host = 'data-structures.cuwjvah1c0p0.us-east-2.rds.amazonaws.com';
    db_credentials.database = 'aa';
    db_credentials.password = process.env.AWSRDS_PW;
    db_credentials.port = 5432;

    async.eachSeries(aadata, function(value, callback1) {
        var locitem = getLatLonByAdd(value.address, geostamps);
        const client = new Client(db_credentials);
        client.connect();
        var thisQuery = "INSERT INTO aadataall VALUES (E'" + value.address + "', " + locitem[0].latLong.lat + ", " + locitem[0].latLong.lng + ", E'" + value.building + "', E'" + value.title + "', E'" + value.address_notes + "', E'" + value.meeting_notes + "', E'" + value.zipcode + "', E'" + value.wheelchair + "', E'" + value.day + "', E'" + value.start_time + "', E'" + value.end_time + "', E'" + value.meeting_type + "', E'" + value.special + "');";
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        setTimeout(callback1, 500);
    });

//   setTimeout(callback0, 500);

// });

