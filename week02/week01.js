// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');


for (let i = 1; i < 11; i++) {
    
    let filecount = ('0' + i).slice(-2);

    request('https://parsons.nyc/aa/m'+filecount+'.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ubuntu/environment/data-structures/week01/data/m'+filecount+'.txt', body);
    } else {
        console.log("Request failed!")
    }
    });
    
}
