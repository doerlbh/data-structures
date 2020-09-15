// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('data/m07.txt');
var $ = cheerio.load(content);

var addresses = $('.detailsBox')                                   // locate detailsBox
                    .map( (i, elem) => $(elem.parentNode).text()   // get parent node
                                            .split("\n")[3].trim() // get 3rd row (with address)
                                            .split(',')[0].trim()  // get only street (no room)
                                            .split('-')[0])        // remove extra info (no floor)
                    .filter( (v, i, a) => a.indexOf(v) === i )     // remove duplicate
                    .get(); 
                    
fs.writeFileSync('data/m07addresses.txt', addresses.unique().join('\n'));