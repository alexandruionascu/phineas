var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";


var Wishlist = function(name, href, imgSrcUrl, price, desiredPrice) {
  this.name = name;
  this.href = href;
  this.imgSrcUrl = imgSrcUrl;
  this.desiredPrice = desiredPrice;
  this.time = Date.now();

  /**
   *  TODO
   *    make pretty output
   */
  this.toString = function() {
    return this.name + " " + this.href + " " + this.imgSrcUrl +
      " " + this.desiredPrice;
  }
};


var WishlistContainer = function() {
  this.wishlistContainer = [];

  this.count = function() {
    return this.wishlistContainer.length;
  }

  this.pushToWishlist = function(name, href, imgSrcUrl, price, desiredPrice) {
    if (name === "") {
      return;
    }
    this.wishlistContainer.push(new Wishlist(name, href, imgSrcUrl, price,
      desiredPrice));
  }

  this.getElementAtIndex = function(index) {
    if (index < 0 || index >= this.wishlistContainer.length) {
      return "";
    }
    return this.wishlistContainer[index];
  }

  this.popFromWishlistByName = function(name) {
    if (name === "") {
      return;
    }
    for (var i = 0; i < this.wishlistContainer.length; i++) {
      if (this.wishlistContainer[i].name === name) {
        for (var j = i; j < this.wishlistContainer.length; j++) {
          if (i + 1 < this.wishlistContainer.length) {
            this.wishlistContainer[j] = this.wishlistContainer[j + 1];
          }
        }
        this.wishlistContainer.pop();
        break;
      }
    }
  }

  this.popFromWishlistByIndex = function(index) {
    if (index < 0 || index >= this.wishlistContainer.length) {
      return;
    }
    for (var j = index; j < this.wishlistContainer.length; j++) {
      if (j + 1 < this.wishlistContainer.length) {
        this.wishlistContainer[j] = this.wishlistContainer[j + 1];
      }
    }

    this.wishlistContainer.pop();
  }
};

/**
 * TODO
 *       - consider a time parameter, at what interval to launch
 *         the crawling.
 */
 module.exports = function(robot) {
  robot.respond(/start crawling/i, function(message) {
    setInterval(function() {
      var wishlist = robot.brain.get('wishlist');
      var completeUrl;

      for (var i = 0; i < wishlist.count(); i++) {
        if (wishlist.getElementAtIndex(i).name === "") {
          continue;
        }
        completeUrl = START_URL + wishlistgetElementAtIndex(i).name;
        computePriceForProductFromUrl(completeUrl, function(price, imgSrcUrl, productHref) {
          if (wishlist.getElementAtIndex(i).desiredPrice >= price) {

            // expand the output with the discount infos, item name, link, image,
            // new price, etc
            message.reply("hey, discount");
          }
        });
      }
    }, 60000);
  });
};

module.exports = function(robot) {
  robot.respond(/add to wishlist/i, function(message) {
    message.reply("Ok, what do you want to consider?");
    // TODO  Conversation
  });
};


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
