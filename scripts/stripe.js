var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');
//var transactions = require("./transactions.js")

function TransactionWithTime(amount, description, created) {
  this.amount = amount;
  this.description = description;
  this.created = created;
}


function StripeTransactions() {
  //this.stripeTransactions = [];
  this.history = [];

  this.getStripeTransactions = function() {
    stripe.balance.listTransactions(function(err, transactions) {
      for (var i = 0; i < transactions.data.length; i++) {
        this.history.push(new TransactionWithTime(
          parseInt(transactions.data[i].amount),
          transactions.data[i].description,
          transactions.data[i].created)
        );
      }
    });

    return this.history;
  }
};

module.exports = function(robot) {
    robot.hear(/show history/i, function(message) {

      var x = new StripeTransactions();
      history = x.getStripeTransactions();

      for (var i = 0; i < history.length; i++) {
        console.log(history[i].amount);
      }

      message.reply("Your transactions are loading...")
      stripe.balance.listTransactions(function(err, transactions) {
        var history = [];
        for(var i = 0; i < transactions.data.length; i++) {
          history.push(transactions.data[i].description + " " + transactions.data[i].amount + "$");
        }
        for(var billIndex in history)
          message.reply(history[billIndex]);

        message.reply(JSON.stringify(transactions));
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

/*

module.exports = (robot) ->
  robot.hear /stripe charge/i, (res) ->
    res.send "charged"

  robot.hear /stripe balance/i, (res) ->
    stripe.balance.listTransactions { limit: 3 }, (transactions) ->
      console.log transactions
*/
