var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";


function computePriceForProductFromUrl(url, callback) {
  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
    if (error) {
      console.log("Error: " + error);
      return "";
    }
    if (response.statusCode != 200) {
      console.log("Status code: " + response.statusCode);
      return "";
    }
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    // Parse the document body
    $ = cheerio.load(body);
    var strProductInfos = $('html > body > div#a-page > div#main > ' +
                            'div#searchTemplate > div#rightContainerATF > ' +
                            'div#rightResultsATF > div#resultsCol > ' +
                            'div#centerMinus > div#atfResults > ' +
                            'ul#s-results-list-atf > li#result_0'/* > div.s-item-container > div.a-fixed-left-grid > div.a-fixed-left-grid-inner > div.a-fixed-left-grid-col.a-col-right > div.a-row > div.a-column.a-span7 > div.a-row.a-spacing-none > a.a-link-normal.a-text-normal > span.a-size-base.a-color-price.s-price.a-text-bold*/).text();
    var price = 0;
    for (var i = 0; i < strProductInfos.length; i++) {
      if (strProductInfos[i] == '$') {
        for (var j = i + 1; j < strProductInfos.length &&
                            ((strProductInfos[j] > -1 && strProductInfos[j] < 10) || strProductInfos[j] == ','); j++) {
          if (strProductInfos[j] == ',') {
            continue;
          }
          price = price * 10 + parseInt(strProductInfos[j]);
        }
        break;
      }
    }
    console.log(price);
    callback(price);
  });
};


module.exports = function(robot) {
  robot.respond(/price for (.*)/i, function(message) {
    computePriceForProductFromUrl(START_URL + message.match[1],
      function(price) {
        console.log(price + " mere");
        message.reply(price.toString());
    });
  });
};
