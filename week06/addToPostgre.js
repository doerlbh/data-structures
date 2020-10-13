// npm install pg

const { Client } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
var async = require('async');  

dotenv.config({path: '../.env'});

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
var thisQuery = " CREATE TABLE aadata (mtgday varchar(25), mtgtime varchar(25), mtghour int, mtglocation varchar(75), mtgaddress varchar(75), mtgregion varchar(75), mtgtypes varchar(150));";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});


var aadata = JSON.parse(fs.readFileSync('m07_data.json'));

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
    var thisQuery = "INSERT INTO aadata VALUES (E'" + value.mtgday + "', " + value.mtgtime + ", " + value.mtghour + ", " + value.mtglocation + ", " + value.mtgaddress + ", " + value.mtgregion + ", " + value.mtgtypes + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 