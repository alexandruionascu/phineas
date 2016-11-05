
var Quiche = require('quiche');
var transactionList = require('./transactions');

module.exports = function(robot) {
    robot.respond(/show chart/i, function(message) {
      var bar = new Quiche('bar');
      bar.setWidth(400);
      bar.setHeight(265);
      bar.setTitle('Some title or something');
      bar.setBarStacked(); // Stacked chart
      bar.setBarWidth(0);
      bar.setBarSpacing(6); // 6 pixles between bars/groups
      bar.setLegendBottom(); // Put legend at bottom
      bar.setTransparentBackground(); // Make background transparent
      console.log(new transactionList.TransactionList(['ceva']));
      bar.addData([19, 19, 21, 14, 19, 11, 10, 18, 19, 30], 'Spending', 'FF0000');
      bar.addData([4, 3, 2, 3, 0, 0, 3, 4, 2, 2], 'Income', '0000FF');
      bar.addData([10, 8, 2, 1, 18, 9, 20, 21, 19, 11], 'bin', '008000');
      bar.addData([2, 1, 1, 1, 1, 7, 3, 6, 2, 7], 'bash', '00FF00');
      bar.addData([1, 0, 0, 1, 2, 1, 0, 0, 0, 0], 'blah', '307000');

      bar.setAutoScaling(); // Auto scale y axis
      bar.addAxisLabels('x', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

      var imageUrl = bar.getUrl(true); // First param controls http vs. https
      message.reply(imageUrl);
    });
}
