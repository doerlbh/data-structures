// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

var cheerio = require('cheerio');

var content = fs.readFileSync('../data/m07.txt');
var $ = cheerio.load(content);

var mtglocation = $('h4').slice(2).map( (i,elem) => $(elem).text()).get();
var mtgday = $("td[style='border-bottom:1px solid #e3e3e3;width:350px;']")
             .map( (i,elem) => $(elem).text())
            //  .split("\n")[3].trim()  // get 3rd row (with address)
                    //                         .split(',')[0].trim()   // get only street (no room)
                    //                         .split('-')[0].trim() ) // remove extra info (no floor)
                    // .get();

// WORK IN PROGRESS FOR THIS PART: for final visualization exercise.
// console.log(mtgday.length);
// fs.writeFileSync('m07_data.json', JSON.stringify(data));

