var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');
var Quiche = require('quiche');
var GoogleUrl = require('google-url');
var moment = require('moment');

import { DateTimeHelper } from './datetime';

var googleUrl = new GoogleUrl({ key: 'AIzaSyCt8GC0foQ18Ee3E4ixCL42daLJJnkAnMk' });


function TransactionWithTime(amount, description, created) {
  this.amount = amount;
  this.description = description;
  this.created = created;
}

var TransactionList = function(transactions) {
  this.transactions = transactions;
  this.count = function() {
    return this.transactions.length;
  }

  this.addTransaction = function(amount, description) {
    this.transactions.push(new Transaction(amount, description));
  }

  this.getSpendings = function() {
    var returnValue = [];
    for (var i = 0; i < this.transactions.length; i++) {
        if (this.transactions[i].amount < 0)
            returnValue.push(this.transactions[i]);
    }

    return returnValue;
  }

  this.getIncomes = function() {
    var returnValue = [];
    for (var i = 0; i < this.transactions.length; i++) {
        if (this.transactions[i].amount > 0)
            returnValue.push(this.transactions[i]);
    }

    return returnValue;
  }
};


var incomesSameType = [];
var incomesBetweenDates = [];


module.exports = function(robot) {

  /**
   * Show incomes of a specific type.
   * Example of type - charge, refund, adjustment, application_fee,
   *                   application_fee_refund, transfer,
   *                   or transfer_failure.
   */
  robot.hear(/show income from (.*)/i, function(message) {
    var itemType = message.match[1];
    stripe.balance.listTransactions(function(err, transactions) {
      for (var i = 0; i < transactions.data.length; i++) {
        if (transactions.data[i].type == itemType) {
          incomesSameType.push(transactions.data[i]);
        }
      }
    });
  });


  /**
   * TODO
   *      change hubot message
   */
  robot.hear(/show income from bla (.*)/i, function(message) {
    var locationName = message.match[1];
    stripe.balance.listTransactions(function(err, transactions) {
      //message.reply("test");
    });
  });


  robot.hear(/show income between (.*) and (.*)/i, function(message) {
    var xDate = message.match[1];
    var yDate = message.match[2];
    var xUnixTimeStamp = DateTimeHelper.getUnixTimeStampFromDate(xDate);
    var yUnixTimeStamp = DateTimeHelper.getUnixTimeStampFromDate(yDate);

    //console.log(xUnixTimeStamp + " " + yUnixTimeStamp);

    stripe.balance.listTransactions(function(err, transactions) {
      for (var i = 0; i < transactions.data.length; i++) {
        if (transactions.data[i].created >= xUnixTimeStamp &&
            transactions.data[i].created <= yUnixTimeStamp) {

          /**
           * TODO
           *      send transactions.data[i].created to the graphics class,
           *      that will be used in every task about graphics - pie chart,
           *      bar chart, etc.
           */
           incomesBetweenDates.push(transactions.data[i]);
        }
      }
      console.log(DateTimeHelper.getDateFromUnixTimeStamp(1466760008));
    });
  });


  robot.hear(/most active action/i, function(message) {
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
      message.reply("Actions of " + itemType + " appeared for " + maxValue + " times.");
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

      //payload={"text": "A very important thing has occurred! <https://hooks.slack.com/services/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|Click here> for details!"};
      /*
      message.reply(
        payload
      );
      */
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
