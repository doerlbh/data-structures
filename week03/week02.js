// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/m07.txt');
var $ = cheerio.load(content);

var addresses = $('h4').slice(2)                                    // locate h4
                    .map( (i,elem) => $(elem.parentNode).text()     // get parent node
                                            .split("\n")[3].trim()  // get 3rd row (with address)
                                            .split(',')[0].trim()   // get only street (no room)
                                            .split('-')[0].trim() ) // remove extra info (no floor)
                    .get();

fs.writeFileSync('m07_addresses.txt', addresses.join('\n'));

