var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');

module.exports = {
  TransactionList: function(robot) {
    robot.hear(/show history/i, function(message) {
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
};

/*

module.exports = (robot) ->
  robot.hear /stripe charge/i, (res) ->
    res.send "charged"

  robot.hear /stripe balance/i, (res) ->
    stripe.balance.listTransactions { limit: 3 }, (transactions) ->
      console.log transactions
*/
