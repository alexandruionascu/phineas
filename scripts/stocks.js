'use strict';

var _yfinance = require('yfinance');

var _yfinance2 = _interopRequireDefault(_yfinance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (robot) {
  robot.respond(/stock for (.*)/i, function (res) {
    _yfinance2.default.getQuotes(res.match[1], function (err, data) {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });

  robot.respond(/history for (.*)/i, function (res) {
    _yfinance2.default.getHistorical(res.match[1], '2016-01-01', '2016-08-05', function (err, data) {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });

  robot.listen(function (message) {
    console.log(JSON.stringify(message).text);
    return Math.random() > 0.5;
  }, function (response) {
    response.reply('OMG THEY CALLED ME');
  });

  robot.listen(function (message) {
    console.log(JSON.stringify(message.text));
    return Math.random() < 0.2;
  }, function (response) {
    response.reply('OMG THEY CALLED ME IM SO RAREEE');
  });
};