// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    request = require('request'),
    async = require('async'),
        dotenv = require('dotenv');

var cheerio = require('cheerio');

for (let i = 1; i < 11; i++) {

    let filecount = ('0' + i).slice(-2);

    var content = fs.readFileSync('../data/html/m' + filecount + '.txt');
    var $ = cheerio.load(content);

    var addresses = $('h4').slice(2) // extract address name 
        .map((i, elem) => $(elem.parentNode).text()
            .split("\n")[3].trim()
            .split(',')[0].trim()
            .split('-')[0].trim())
        .get();

    fs.writeFileSync('../data/address/m' + filecount + '_addresses.json', JSON.stringify(addresses));

    var meetinginfo = $('td[style="border-bottom:1px solid #e3e3e3;width:350px;"]') // extract full meeting info
        .map((i, elem) => $(elem).text()
            .split("\n")
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .join('\n'))
        .get();

    var addressinfo = $('h4').slice(2) // extract full address info     
        .map((i, elem) => $(elem.parentNode).html()
            .split("\n")
            .map(x => x.trim())
            .filter(x => x.length > 0)
            .join('\n')
            .replace('<br>', ''))
        .get();

    var meetings = [];
    meetinginfo.forEach((meetingset, i) => {
        var submeetings = meetingset.split('\n').map((mtext) => {
            var meeting = {};
            meeting.address = addresses[i];
            meeting.building = addressinfo[i].split('</h4>')[0].split('>')[1].replace('<br>', '').trim();
            meeting.title = (addressinfo[i].split('\n')[1].startsWith('<b>') ? addressinfo[i].split('\n')[1].split('</b>')[0].split('<b>')[1].trim() : '');
            meeting.address_notes = addressinfo[i].split('\n').slice(2, 4).join('').replace(',', ', ').replace('  ', ' ').replace('<br>', '').trim();
            meeting.meeting_notes = (addressinfo[i].includes('detailsBox') ? addressinfo[i].split('"detailsBox">')[1].split('</div')[0].replace('\n', '').replace('<br>', '').trim() : '');
            meeting.zipcode = meeting.address_notes.slice(meeting.address_notes.length - 5);
            meeting.wheelchair = (addressinfo[i].includes('wheelchair') ? true : false);
            meeting.day = mtext.split(' ')[0].trim();
            meeting.start = mtext.split('From')[1].split('to')[0].trim();
            meeting.end = mtext.split('to')[1].trim().split(' ').slice(0, 2).join(' ').trim();
            meeting.type = (mtext.includes('Type') ? mtext.split('Type')[1].trim().split('Special')[0].trim() : '');
            meeting.special = (mtext.includes('Special Interest') ? mtext.split('Special Interest')[1].trim() : '');
            return meeting; 
        });

        submeetings.forEach((meeting) => {
            meetings.push(meeting);
        });
    });

    fs.writeFileSync('../data/meeting/m' + filecount + '_meetings.json', JSON.stringify(meetings));

}