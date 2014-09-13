var express   = require('express');     // call express
var app       = express();              // define our app using express
var read      = require('node-read'); 
port          = process.env.PORT || 8000;     // set our port
var router    = express.Router();             // get an instance of the express Router
var redis     = require("redis");
var scraper   = require('./scraper');
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
  // new CronJob('0 0 */3 * *', function(){
  new CronJob('*/5 * * * * *', function(){
    console.log("running ... ")
    request({
      uri: "http://www.commitstrip.com/en",
    }, function(error, response, body) {
      var $ = cheerio.load(body);
      var result = {
        'title' : $('.entry-title > a').text(),
        'link' : $('.entry-content > p > img').attr('src') 
      }

      console.log(JSON.stringify(result));
      
      var post_id = $('#content > article').attr('id');
      console.log(post_id);

      client.set(post_id, JSON.stringify(result), redis.print);
    });
    // scraper.scrap;
  }, null, true, "America/Los_Angeles");  
});

app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);
