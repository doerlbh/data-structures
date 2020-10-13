var diaryEntries = [];

class DiaryEntry {
  constructor(tp, dt, entry, state,priority) {
    this.tp = {};
    this.tp.S = tp;
    this.dt = {}; 
    this.dt.N = new Date(dt).valueOf().toString();
    this.entry = {};
    this.entry.S = entry;
    this.st = {};
    this.st.S = state;
    this.pr = {};
    this.pr.N = priority;
  }
}

diaryEntries.push(new DiaryEntry('personal', 'September 1, 2017 07:00:00', "I started my study at Columbia.","happy","1"));
diaryEntries.push(new DiaryEntry('work', 'June 1, 2013 08:00:00', "I started my first internship.","happy","1"));
diaryEntries.push(new DiaryEntry('work', 'September 23, 2020 12:10:00', "I learned a new programming language.","okay","0"));
diaryEntries.push(new DiaryEntry('cats', 'June 23, 2018 18:00:00', "I adopted Neptune.","happy","1"));
diaryEntries.push(new DiaryEntry('cats', 'October 7, 2020 12:10:00', "Jupiter stepped onto my favorite plants.","sad","0"));
diaryEntries.push(new DiaryEntry('cats', 'October 6, 2020 22:15:00', "Jupiter got fatter.","happy","0"));
diaryEntries.push(new DiaryEntry('personal', 'November 25, 2020 12:10:00', "I got an internship offer.","happy","0"));

console.log(diaryEntries);

var AWS = require('aws-sdk'); // npm install aws-sdk
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";

var async = require('async'); 
var dynamodb = new AWS.DynamoDB();

async.eachSeries(diaryEntries, function(value, callback) {
    
    var params = {};
    params.Item = value; 
    params.TableName = "bhprocessblog";
    
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    
    setTimeout(callback, 1000);
}, function() {
    console.log('Done!');
});