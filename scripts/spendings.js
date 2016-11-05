module.exports = function(robot) {

  function Spending(amount, description) {
    this.amount = amount;
    this.description = description;
    this.time = Date.now();

    this.toString = function() {
      return this.description + ' - ' + this.amount + ' $ at time ' + this.time.toString();
    }
  }

  function SpendingList(spendings) {
    this.spendings = spendings,
    this.count = function() {
      return this.spendings.length;
    }

    this.addSpending = function(spending) {
      this.spendings.push(spending);
    }

    this.addSpending = function(amount, description) {
      this.spendings.push(new Spending(amount, description));
    }
  }

  robot.respond(/spend (.*) on (.*)/i, function(message) {
    message.reply(message.match[1]);
    message.reply(message.match[2]);

    var spending = new Spending(message.match[1], message.match[2]);
    message.reply("I just recorder a new spending: " + spending.toString());

    var spendingList = robot.brain.get('spendings');

    if (!spendingList) {
      spendingList = new SpendingList([spending]);
    } else {
      spendingList.addSpending(spending);
    }

    robot.brain.set('spendings', spendingList);
  });

  robot.respond(/list spendings/i, function(message) {
    var spendingList = robot.brain.get('spendings');

    if (!spendingList) {
      message.reply("Oh, you didn't spend anything! Amazing!");
    } else {
      for(var i = 0; i < spendingList.spendings.length; i++)
        message.reply(spendingList.spendings[i].toString());
    }
  });
}
