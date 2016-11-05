var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');

module.exports = function(robot) {
    robot.respond(/stripe charge/i, function(message) {
      message.reply("Your transactions are loading...")
      stripe.balance.listTransactions({ limit: 3 }, function(err, transactions) {
        message.reply(JSON.stringify(transactions));
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
