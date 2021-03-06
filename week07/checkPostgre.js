// npm install pg

const { Client } = require('pg');
const dotenv = require('dotenv');
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

// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aalocations;";
var thisQuery = "SELECT * FROM aameetings;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});