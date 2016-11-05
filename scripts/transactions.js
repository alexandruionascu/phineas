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
    for(var i = 0; i < this.transactions.length; i++) {
      if(this.transactions[i].amount < 0)
        returnValue.push(this.transactions[i]);
    }

    return returnValue;
  }

  this.getIncomes = function() {
    var returnValue = [];
    for(var i = 0; i < this.transactions.length; i++) {
      if(this.transactions[i].amount > 0)
        returnValue.push(this.transactions[i]);
    }

    return returnValue;
  }
};
exports.transactionList = transactionList;

module.exports = function Transaction(amount, description) {
  this.amount = amount;
  this.description = description;
  this.time = Date.now();

  this.toString = function() {
    return this.description + ' ' + this.amount + '  $ at time ' + this.time;
  }
};


module.exports = function(robot) {
  //------------------------- SPENDINGS --------------------------
  robot.respond(/spend (.*) on (.*)/i, function(message) {
    var amount = -1 * parseInt(message.match[1]);
    var spending = new Transaction(amount, message.match[2]);

    message.reply("I just recorder a new spending: " + spending.toString());

    var spendingList = robot.brain.get('transactions');

    if (spendingList == null) {
      var array = [];
      array.push(spending);
      spendingList = new TransactionList(array);
    } else {
      spendingList.addTransaction(amount, message.match[2]);
    }

    robot.brain.set('transactions', spendingList);
    message.reply(message.match[1]);
    message.reply(message.match[2]);
  });

  robot.respond(/list spendings/i, function(message) {
    var spendingList = robot.brain.get('transactions');

    if (!spendingList) {
      message.reply("Oh, you didn't spend anything! Amazing!");
    } else {
      spendingList = spendingList.getSpendings();
      if (spendingList.length == 0) {
        message.reply("Oh, you didn't spend anything! Amazing!")
      } else {
        for(var i = 0; i < spendingList.length; i++)
          message.reply(spendingList[i].toString());
      }
    }
  });

  //----------------------------- INCOME --------------------------
  robot.respond(/add (.*) from (.*)/i, function(message) {
    var amount = parseInt(message.match[1]);
    var income = new Transaction(amount, message.match[2]);

    message.reply("I just recorded a new income: " + income.toString());

    var transactionList = robot.brain.get('transactions');

    if (transactionList == null) {
      var array = [];
      array.push(income);
      transactionList = new TransactionList(array);
    } else {
      transactionList.addTransaction(amount, message.match[2]);
    }
    robot.brain.set('transactions', transactionList);
  });

  robot.respond(/list incomes/i, function(message) {
    var incomeList = robot.brain.get('transactions');

    if (!incomeList) {
      message.reply("Oh, you didn't received anything! Too bad :sad: ");
    } else {
      incomeList = incomeList.getIncomes();
      if (incomeList.length == 0) {
        message.reply("Oh, you didn't received anything! Too bad :sad: ")
      } else {
        for(var i = 0; i < incomeList.length; i++)
          message.reply(incomeList[i].toString());
      }
    }
  });
}
