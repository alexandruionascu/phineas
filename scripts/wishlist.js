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
    var strProductInfos = $('li[id="result_0"]').text();

    var imgSrcUrl = $('li[id="result_0"] > div.s-item-container > ' +
                      'div.a-fixed-left-grid > ' +
                      'div.a-fixed-left-grid-inner > ' +
                      'div.a-fixed-left-grid-col.a-col-left > ' +
                      'div.a-row > ' +
                      'div.a-column.a-span12.a-text-center > ' +
                      'a.a-link-normal.a-text-normal > ' +
                      'img.s-access-image.cfMarker').attr('src');

    var productHref = $('li[id="result_0"] > div.s-item-container > ' +
                      'div.a-fixed-left-grid > ' +
                      'div.a-fixed-left-grid-inner > ' +
                      'div.a-fixed-left-grid-col.a-col-left > ' +
                      'div.a-row > ' +
                      'div.a-column.a-span12.a-text-center > ' +
                      'a.a-link-normal.a-text-normal').attr('href');

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
    callback(price, imgSrcUrl, productHref);
  });
};


module.exports = function(robot) {
  robot.respond(/price for (.*)/i, function(message) {
    computePriceForProductFromUrl(START_URL + message.match[1],
      function(price, imgSrc, productHref) {
        if (typeof imgSrc !== "undefined") {
          message.reply(imgSrc);
        }
        if (typeof productHref !== "undefined") {
          message.reply("You could take a look at this one. \n" + productHref);
        }
        if (typeof price !== "undefined") {
          message.reply(price.toString() + "$");
        }
    });
  });
};
