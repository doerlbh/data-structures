var express = require('express'),
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');

const indexSource = fs.readFileSync("templates/sensor.txt").toString();
var template = handlebars.compile(indexSource, { strict: true });

const pbSource = fs.readFileSync("templates/pb.txt").toString();
var pbtemplate = handlebars.compile(pbSource, { strict: true });

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = process.env.AWSRDS_UN;
db_credentials.host = process.env.AWSRDS_HT;
db_credentials.database = process.env.AWSRDS_DB;
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// create templates
var hx = fs.readFileSync("templates/hx.txt").toString();

var jx = fs.readFileSync("templates/jx.txt").toString();


app.get('/', function (req, res) {
    res.send('<h3>Code demo site</h3><ul><li><a href="/aa">aa meetings</a></li><li><a href="/temperature">temp sensor</a></li><li><a href="/processblog">process blog</a></li></ul>');
});

// respond to requests for /aa
app.get('/aa', function (req, res) {

    var now = moment.tz(Date.now(), "America/New_York");
    var dayy = now.day().toString();
    var hourr = now.hour().toString();

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var thisQuery = `SELECT lat, lon, json_agg(json_build_object('loc', mtglocation, 'address', mtgaddress, 'time', tim, 'name', mtgname, 'day', day, 'types', types, 'shour', shour)) as meetings
                 FROM aadataall 
                 GROUP BY lat, lon
                 ;`;


    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

app.get('/temperature', function (req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    console.log(req.query.type);
    var resolution = "minute";
    if (["day", "hour", "minute"].includes(req.query.type)) {
        resolution = req.query.type;
    }

    // SQL query 

    if (resolution == "day") {
        var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensortick,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensortick
             ORDER BY sensortick;`;

        client.connect();
        client.query(q, (qerr, qres) => {
            if (qerr) { throw qerr }
            else {
                res.end(template({
                    sensordata: JSON.stringify(qres.rows),
                    // timescale: "Last 30 Days",
                    // linecolor: "#900C3F",
                }));
                client.end();
                console.log('1) responded to request for sensor graph');
            }
        });
    }

    if (resolution == "hour") {
        var q = `SELECT EXTRACT(HOUR FROM sensorTime) as sensortick,
                 AVG(sensorValue::int) as num_obs
                 FROM sensorData
                 GROUP BY sensortick
                 ORDER BY sensortick;`;

        client.connect();
        client.query(q, (qerr, qres) => {
            if (qerr) { throw qerr }
            else {
                res.end(template({
                    sensordata: JSON.stringify(qres.rows),
                    // timescale: "Last 24 Hours",
                    // linecolor: "#556B2F",
                }));
                client.end();
                console.log('1) responded to request for sensor graph');
            }
        });
    }

    if (resolution == "minute") {
        var q = `SELECT EXTRACT(MINUTE FROM sensorTime) as sensortick,
                 AVG(sensorValue::int) as num_obs
                 FROM sensorData
                 GROUP BY sensortick
                 ORDER BY sensortick;`;

        client.connect();
        client.query(q, (qerr, qres) => {
            if (qerr) { throw qerr }
            else {
                res.end(template({
                    sensordata: JSON.stringify(qres.rows),
                    // timescale: "Last 60 minutes",
                    // linecolor: "#6495ED",
                }));
                client.end();
                console.log('1) responded to request for sensor graph');
            }
        });
    }

    // client.connect();
    // client.query(q, (qerr, qres) => {
    //     if (qerr) { throw qerr }
    //     else {
    //         res.end(template({ sensordata1 : JSON.stringify(qres.rows)}));
    //         client.end();
    //         console.log('1) responded to request for sensor graph');
    //     }
    // });

});

app.get('/processblog', function (req, res) {
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-2";

    console.log(req.query.type);
    var topic = "cats";
    if (["cats", "personal", "work"].includes(req.query.type)) {
        topic = req.query.type;
    }

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    // DynamoDB (NoSQL) query
    var params = {
        TableName: "bhprocessblog",
        KeyConditionExpression: "tp = :tp", // the query expression
        ExpressionAttributeValues: { // the query values
            ":tp": { S: topic }
        }
    };

    dynamodb.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw (err);
        }
        else {
            console.log(data.Items)
            res.end(pbtemplate({ pbdata: JSON.stringify(data.Items) }));
            console.log('3) responded to request for process blog data');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Server listening...');
});