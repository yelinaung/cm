var request   = require('request');
var cheerio = require('cheerio');

var redis = require("redis");
client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

module.exports = {
  scrape: function() {
    console.log('Starting the job ..');
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
  }
};
