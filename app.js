var express   = require('express');     // call express
var app       = express();              // define our app using express
var read      = require('node-read'); 
port          = process.env.PORT || 8000;     // set our port
var router    = express.Router();             // get an instance of the express Router
var redis     = require("redis");
var scraper   = require('./scraper.js');
var request   = require('request');
var cheerio = require('cheerio');

client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});


router.get('/', function(req, res) {
  client.get("*", function (error, awesomeCount) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(awesomeCount);
  });
});

router.get('/k', function(req, res) {
  client.keys("*", function(error, keyss) {
    res.json({ keys : keyss });
  });
});


var CronJob = require('cron').CronJob;

router.get('/run_job', function(req, res){
  res.json({ message: "starting the job every 3 day.."});
  new CronJob('0 0 */3 * *', function(){
     scraper.scrape();
  }, null, true, "America/Los_Angeles");  
});

app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);
