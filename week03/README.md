# Week 03

 

## Topics

dotenv.config, gitignore, JSON processing, API request and parsing, async.eachSeries().



## Tasks

1. Using Node.js, read the and store text files in a JSON file with JSON.stringify()
2. Set up API keys in privately hosted .env files, excluded from GitHub and public access
3. Use JSON.parse() to extract addresses stored in the saved JSON file, and make API requests to the [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/) for each address
4. Apply async.eachSeries() and setTimeOut() to avoid abusing API
5. Parse API responses to extract the relevant geostamps for each address

Things to note:  
* API rate limits
* Asyncronous JavaScript (but don't overuse `setTimeout`)  
* Keeping API key(s) off of GitHub (use an [environment variable](https://www.npmjs.com/package/dotenv) instead)  
* Keeping only the data we need from the API response, not all the data  



## Key solution

```javascript
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
}
```


## Example code

```javascript
// npm install request async dotenv

"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];

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
        console.log(tamuGeo['FeatureMatchingResultType'], apiRequest);
        meetingsData.push(tamuGeo);
    });

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/first.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
```

 

## Documentation

* [Texas A&M Geoservices Geocoding APIs](http://geoservices.tamu.edu/Services/Geocode/WebService/)  
* [Node `querystring` module](https://nodejs.org/api/querystring.html)
* [npm `async` module](http://caolan.github.io/async/)  
* [npm `dotenv` module](https://www.npmjs.com/package/dotenv)



## Sample API response

```javascript
{
  "version" : "4.01",
  "TransactionId" : "d119d15f-5221-446e-9d6d-fa779a5be9c3",
  "Version" : "4.01",
  "QueryStatusCodeValue" : "200",
  "FeatureMatchingResultType" : "Success",
  "FeatureMatchingResultCount" : "7",
  "TimeTaken" : "0.203184",
  "ExceptionOccured" : "False",
  "Exception" : "",
  "InputAddress": {
    "StreetAddress" : "45 CHRISTOPHER ST New York NY ",
    "City" : "New York",
    "State" : "NY",
    "Zip" : ""
  },
  "OutputGeocodes": [
    {
      "OutputGeocode": {
        "Latitude" : "40.7338458",
        "Longitude" : "-74.0018119",
        "NAACCRGISCoordinateQualityCode" : "00",
        "NAACCRGISCoordinateQualityType" : "AddressPoint",
        "MatchScore" : "97.3372781065089",
        "MatchType" : "Relaxed",
        "FeatureMatchingResultType" : "Success",
        "FeatureMatchingResultCount" : "1",
        "FeatureMatchingGeographyType" : "Parcel",
        "RegionSize" : "0",
        "RegionSizeUnits" : "Meters",
        "MatchedLocationType" : "LOCATION_TYPE_STREET_ADDRESS",
        "ExceptionOccured" : "False",
        "Exception" : "",
        "ErrorMessage" : ""
      }
    }
  ]
}
```

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)




