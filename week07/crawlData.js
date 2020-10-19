// -address
//     -geolocation
// -day
// -time
// -type
// -wheelchair
// -(special interest)
// -(notes)
// -(location notes? I.e. room number, floor number)
// -(building name)
// -(title)


// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

var cheerio = require('cheerio');


var i = 7;
var filecount = ('0' + i).slice(-2);

var content = fs.readFileSync('../data/html/m'+filecount+'.txt');
var $ = cheerio.load(content);

var addresses = $('h4').slice(2)                                    // locate h4
                    .map( (i,elem) => $(elem.parentNode).text()     // get parent node
                                            .split("\n")[3].trim()  // get 3rd row (with address)
                                            .split(',')[0].trim()   // get only street (no room)
                                            .split('-')[0].trim() ) // remove extra info (no floor)
                    .get();

fs.writeFileSync('../data/address/m'+filecount+'_addresses.json', JSON.stringify(addresses));

var meetinginfo = $('td[style="border-bottom:1px solid #e3e3e3;width:350px;"]') // extract all meeting info
                    .map( (i,elem) => $(elem).text() 
                                        .split("\n")
                                        .map( x => x.trim() )
                                        .filter( x => x.length > 0 )
                                        .join('\n') )
                    .get();

var addressinfo = $('h4').slice(2)                                   
                    .map( (i,elem) => $(elem.parentNode).html()    
                                            .split("\n")
                                            .map( x => x.trim() )
                                            .filter( x => x.length > 0 )
                                            .join('\n')) 
                    .get();

var meetings = [];
meetinginfo.forEach( (i,x) => {
    var submeetings = {
        
    };
    submeetings.forEach( (j,meeting) => {
        meetings.push(meeting);
    });
}); 
                    
console.log(addressinfo[47]);


// WORK IN PROGRESS FOR THIS PART: for final visualization exercise.
// console.log(mtgday.length);
// fs.writeFileSync('m07_data.json', JSON.stringify(data));
