var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');


function TransactionWithTime(amount, description, created) {
  this.amount = amount;
  this.description = description;
  this.created = created;
}


module.exports = function(robot) {

  robot.hear(/show income from (.*)/i, function(message) {
    var customerName = message.match[1];
    stripe.balance.listTransactions(function(err, transactions) {
      message.reply("test");
    });
  });

  /**
   * TODO
   *      change hubot message
   */
  robot.hear(/show income from (.*)/i, function(message) {
    var locationName = message.match[1];
    stripe.balance.listTransactions(function(err, transactions) {
      message.reply("test");
    });
  });

  /**
   * Returns dateStr in Unix timestamp format.
   * @param {string} Any date format.
   *                 For example, 11.08.2012 and 11-08-2012 are both valid.
   * @return {int}   Unix timestamp format, representing number of
   *                 seconds since Jan 01 1970.
   */
  function getUnixTimeStampFromDate(dateStr) {
    return (new Date(dateStr).getTime() / 1000);
  }

  robot.hear(/show income between (.*) and (.*)/i, function(message) {
    var xDate = message.match[1];
    var yDate = message.match[2];
    var xUnixTimeStamp = getUnixTimeStampFromDate(xDate);
    var yUnixTimeStamp = getUnixTimeStampFromDate(yDate);

    console.log(xUnixTimeStamp + " " + yUnixTimeStamp);

    stripe.balance.listTransactions(function(err, transactions) {
      for (var i = 0; i < transactions.data.length; i++) {
        if (transactions.data[i].created >= xUnixTimeStamp &&
            transactions.data[i].created <= yUnixTimeStamp) {
          /**
           * TODO
           *      send transactions.data[i].created to the graphics class
           */
          //console.log(transactions.data[i].created);
        }
      }
    });
  });

  robot.hear(/best selling product/i, function(message) {
    var products = {};
    var maxValue = 0;
    var itemType = "";

    stripe.balance.listTransactions(function(err, transactions) {
      for (var i = 0; i < transactions.data.length; i++) {
        if (!(transactions.data[i].type in products)) {
          products[transactions.data[i].type] = 1;
        } else {
          products[transactions.data[i].type] += 1;
        }
      }
      for (var key in products) {
        if (products[key] > maxValue) {
          maxValue = products[key];
          itemType = key;
        }
      }
      message.reply("type " + itemType + " " + maxValue);
    });
  });

  robot.hear(/show history/i, function(message) {
    message.reply("Your transactions are loading...")
    stripe.balance.listTransactions(function(err, transactions) {
      var history = [];
      for (var i = 0; i < transactions.data.length; i++) {
        history.push(transactions.data[i].description + " " + transactions.data[i].amount + "$");
      }
      for (var billIndex in history) {
        message.reply(history[billIndex]);
      }

      //message.reply(JSON.stringify(transactions));
    });
  });

  robot.respond(/what is my account id/i, function(message) {
    stripe.accounts.retrieve(
      function(err, account) {
        message.reply(account.id);
      });
    });

  robot.hear(/show customers/i, function(message) {
    stripe.customers.list(function(err, customers) {
      message.reply(JSON.stringify(customers));
    });
  });
}
