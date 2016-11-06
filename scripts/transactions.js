var stripe = require('stripe')('sk_test_ar94SyA9caWaloZxvJ3L2SJ1');
var Quiche = require('quiche');
var GoogleUrl = require('google-url');

var googleUrl = new GoogleUrl({ key: 'AIzaSyCt8GC0foQ18Ee3E4ixCL42daLJJnkAnMk' });

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

  function Transaction(amount, description) {
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
                for (var i = 0; i < spendingList.length; i++)
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

    robot.respond(/set (.*) spending for (.*) (.*) days ago/i, function(message) {
      var amount = -1 * parseInt(message.match[1]);
      var daysAgo = message.match[3];
      var spending = new Transaction(amount, message.match[2]);

      message.reply("I just recorded a new spending: " + spending.toString());

      var spendingList = robot.brain.get('transactions');

      if (spendingList == null) {
          var array = [];
          array.push(spending);
          spendingList = new TransactionList(array);
      } else {
          spendingList.addTransaction(amount, message.match[2]);
      }
      var date = new Date();
      date.setDate(date.getDate() - daysAgo);
      spendingList.transactions[spendingList.transactions.length - 1].time = date.getTime();
      robot.brain.set('transactions', spendingList);
    });

    robot.respond(/set (.*) income from (.*) (.*) days ago/i, function(message) {
      var amount = parseInt(message.match[1]);
      var income = new Transaction(amount, message.match[2]);
      var daysAgo = parseInt(message.match[3]);

      message.reply("I just recorded a new income: " + income.toString());

      var transactionList = robot.brain.get('transactions');

      if (transactionList == null) {
          var array = [];
          array.push(income);
          transactionList = new TransactionList(array);
      } else {
          transactionList.addTransaction(amount, message.match[2]);
      }
      var date = new Date();
      date.setDate(date.getDate() - daysAgo);
      transactionList.transactions[transactionList.transactions.length - 1].time = date.getTime();
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
                for (var i = 0; i < incomeList.length; i++)
                    message.reply(incomeList[i].toString());
            }
        }
    });

    //-----------------------STRIPE INCOME-------------
    robot.respond(/list stripe income/i, function(message) {

        var stripeIncome = [];
        stripe.balance.listTransactions(function(err, transactions) {
          for (var i = 0; i < transactions.data.length; i++) {
            var transaction = new Transaction(
            parseInt(transactions.data[i].amount),
              transactions.data[i].description
            );
            transaction.time = transactions.data[i].created;
            stripeIncome.push(transaction);
          }

          for (var i = 0; i < stripeIncome.length; i++)
            message.reply(stripeIncome[i].amount / 100 + '$ for ' + stripeIncome[i].description + ' at ' + stripeIncome[i].time);

        });

        return stripeIncome;
      });

      function getAllIncomes(callback) {
        var incomeList = robot.brain.get('transactions');
        if(!incomeList)
          incomeList = new TransactionList([]);
        incomeList = incomeList.getIncomes();
        var stripeIncome = [];
        for (var i = 0; i < incomeList.length; i++) {
             stripeIncome.push(incomeList[i]);
        }


        //  message.reply("Getting Stripe Income in a second")
          stripe.balance.listTransactions(function(err, transactions) {
            for (var i = 0; i < transactions.data.length; i++) {
                var transaction = new Transaction(
                  parseInt(transactions.data[i].amount) / 100,
                  "Stripe: " + transactions.data[i].description
                );
                transaction.time = transactions.data[i].created;
                stripeIncome.push(transaction);
            }

            callback(stripeIncome);
          });
      }

    robot.respond(/list all income/i, function(message) {
      getAllIncomes(function(stripeIncome) {
        for (var i = 0; i < stripeIncome.length; i++)
          message.reply(stripeIncome[i].amount + '$ for ' + stripeIncome[i].description + ' at ' + stripeIncome[i].time);
      });
    });

    robot.respond(/what is my balance/i, function(message) {
      getAllIncomes(function(income) {
        var balance = 0;
        for(var i = 0; i < income.length; i++)
          balance += income[i].amount;
        var spendings = robot.brain.get('transactions');
          if(!spendings)
            spendings = new TransactionList([]);
          spendings = spendings.getSpendings();
          for(var i = 0; i < spendings.length; i++)
            balance += spendings[i].amount;

          message.reply("Your current balance is " + balance + "$");
      });
    });

    robot.respond(/show weekly chart/i, function(message) {
      getAllIncomes(function(incomes) {
        var incomeData = [];
        var spendingData = [];

        for(var i = 0; i < 7; i++) {
          incomeData[i] = 0;
          spendingData[i] = 0;
        }

        for(var i = 0; i < incomes.length; i++) {
          var dayIndex;
          if (incomes[i].description.includes("Stripe")) {
            dayIndex = Math.floor((Math.abs((Number(incomes[i].time) * 1000) - Number(Date.now())))/(3600 * 24 * 1000));
          }  else {
            dayIndex = Math.floor((Math.abs((Number(incomes[i].time)) - Number(Date.now())))/(3600 * 24 * 1000));
          }

          console.log("index " + dayIndex);
          if(dayIndex < 7)
            incomeData[dayIndex] += incomes[i].amount;
        }



        var spendings = robot.brain.get('transactions');
          if(!spendings)
            spendings = new TransactionList([]);
          spendings = spendings.getSpendings();

          for(var i = 0; i < spendings.length; i++) {
            var dayIndex = Math.floor((Math.abs((Number(spendings[i].time)) - Number(Date.now())))/(3600 * 24 * 1000));
            console.log("Spending day index " + dayIndex);
            if(dayIndex < 7)
              spendingData[dayIndex] += (-1 * spendings[i].amount);
          }

          message.reply(incomeData.length + " - " + spendingData.length);
          var bar = new Quiche('bar');
          bar.setWidth(400);
          bar.setHeight(265);
          bar.setTitle('Transactions from the past 7 days');
          bar.setBarStacked(); // Stacked chart
          bar.setBarWidth(0);
          bar.setBarSpacing(6); // 6 pixles between bars/groups
          bar.setLegendBottom(); // Put legend at bottom
          bar.setTransparentBackground(); // Make background transparent
          bar.addData(incomeData, 'Income', '33B2FF');
          bar.addData(spendingData, 'Spent', 'FF8D33');

          bar.setAutoScaling(); // Auto scale y axis
          var weekLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
          var today = new Date().getDay();
          var labels = [];
          for(var i = 0; i < 7; i++) {
            labels.push(weekLabels[today]);
            today++;
            today %= 7;
          }

          console.log(JSON.stringify(labels));

          bar.addAxisLabels('x', labels);

          var imageUrl = bar.getUrl(false);
          googleUrl.shorten(imageUrl, function( rr, shortUrl) {
            message.reply(shortUrl);
          });
      });

    });

      robot.respond(/show monthly chart/i, function(message) {
        getAllIncomes(function(incomes) {
          var incomeData = [];
          var spendingData = [];

          for(var i = 0; i < 30; i++) {
            incomeData[i] = 0;
            spendingData[i] = 0;
          }

          for(var i = 0; i < incomes.length; i++) {
            var dayIndex;
            if (incomes[i].description.includes("Stripe")) {
              dayIndex = Math.floor((Math.abs((Number(incomes[i].time) * 1000) - Number(Date.now())))/(3600 * 24 * 1000));
            }  else {
              dayIndex = Math.floor((Math.abs((Number(incomes[i].time)) - Number(Date.now())))/(3600 * 24 * 1000));
            }

            console.log("index " + dayIndex);
            if(dayIndex < 30)
              incomeData[dayIndex] += incomes[i].amount;
          }

          var spendings = robot.brain.get('transactions');
            if(!spendings)
              spendings = new TransactionList([]);
            spendings = spendings.getSpendings();

            for(var i = 0; i < spendings.length; i++) {
              var dayIndex = Math.floor((Math.abs((Number(spendings[i].time)) - Number(Date.now())))/(3600 * 24 * 1000));
              console.log("Spending day index " + dayIndex);
              if(dayIndex < 30)
                spendingData[dayIndex] += (-1 * spendings[i].amount);
            }

            var bar = new Quiche('bar');
            bar.setWidth(800);
            bar.setHeight(265);
            bar.setTitle('Transactions from the past 30 days');
            bar.setBarStacked(); // Stacked chart
            bar.setBarWidth(0);
            bar.setBarSpacing(6); // 6 pixles between bars/groups
            bar.setLegendBottom(); // Put legend at bottom
            bar.setTransparentBackground(); // Make background transparent
            bar.addData(incomeData, 'Income', '33B2FF');
            bar.addData(spendingData, 'Spent', 'FF8D33');

            bar.setAutoScaling(); // Auto scale y axis
            var today = new Date().getDate();
            var labels = [];
            for(var i = 0; i < 30; i++) {
              labels.push(today.toString());
              today++;
              today %= 30;
            }

            bar.addAxisLabels('x', labels);

            var imageUrl = bar.getUrl(false);
            googleUrl.shorten(imageUrl, function( rr, shortUrl) {
              message.reply(shortUrl);
            });

        });
    });


  };
