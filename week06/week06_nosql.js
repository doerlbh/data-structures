// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "bhprocessblog",
    KeyConditionExpression: "#tp = :topicName and #dt between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#tp" : "tp",
        "#dt" : "dt"
        // "#st" : "state"
    },
    ExpressionAttributeValues: { // the query values
        ":topicName": {S: "cats"},
        ":minDate": {N: new Date("August 1, 2017").valueOf().toString()},
        ":maxDate": {N: new Date("December 11, 2020").valueOf().toString()}
        // ":stateName": {S: "happy"}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});