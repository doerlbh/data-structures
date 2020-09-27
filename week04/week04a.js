// npm install request async dotenv

"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

var cheerio = require('cheerio');

var content = fs.readFileSync('data/m07.txt');
var $ = cheerio.load(content);

var addresses = $('h4').slice(2)                                    // locate h4
                    .map( (i,elem) => $(elem.parentNode).text()     // get parent node
                                            .split("\n")[3].trim()  // get 3rd row (with address)
                                            .split(',')[0].trim()   // get only street (no room)
                                            .split('-')[0].trim() ) // remove extra info (no floor)
                    .get();

fs.writeFileSync('m07_addresses.json', JSON.stringify(addresses));

addresses = JSON.parse(fs.readFileSync('m07_addresses.json'));

// TAMU api key
dotenv.config({path: '../.env'});
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        // console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        console.log(tamuGeo['FeatureMatchingResultType'], value);
        var tamuGeoItem = {
            address: value + ", New York, NY",
            latLong: {
                lat: tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude,
                lng: tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude
            }
        };
        meetingsData.push(tamuGeoItem);
    });

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 1000);
}, function() {
    fs.writeFileSync('m07_geostamps.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});