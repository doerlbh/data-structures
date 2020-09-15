# Week 02

 

## Topics

AWS Cloud9, Node.js, cheerio, basic javascript



## Tasks

1. Using Node.js, read the and store text files in a variable.

2. Query: "why are we reading this from a saved text file instead of making another http request?"

3. Use cheerio to parse HTML to extract the relevant data for each meeting -- meeting address as rows.
 


## Key solution

```javascript
var addresses = $('.detailsBox')                                   // locate detailsBox
                    .map( (i, elem) => $(elem.parentNode).text()   // get parent node
                                            .split("\n")[3].trim() // get 3rd row (with address)
                                            .split(',')[0].trim()  // get only street (no room)
                                            .split('-')[0])        // remove extra info (no floor)
                    .filter( (v, i, a) => a.indexOf(v) === i )     // remove duplicate
                    .get(); 
```


## Example code

```javascript
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/thesis.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of thesis students
$('h3').each(function(i, elem) {
    console.log($(elem).text());
});

// write the project titles to a text file
var thesisTitles = ''; // this variable will hold the lines of text

$('.project .title').each(function(i, elem) {
    thesisTitles += ($(elem).text()).trim() + '\n';
});

fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
```

 

## Documentation

* [Node cheerio module](https://www.npmjs.com/package/cheerio)
* [Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)  
* [JavaScript data types and data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)




