'use strict';

var _yfinance = require('yfinance');

var _yfinance2 = _interopRequireDefault(_yfinance);

var _tickertape = require('tickertape');

var _tickertape2 = _interopRequireDefault(_tickertape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (robot) {
  robot.respond(/stock for (.*)/i, function (res) {
    //const companySymbol = TickerTape.getSymbol(res.match[1]);
    //res.send("Company name is " + companySymbol);
    _yfinance2.default.getQuotes(res.match[1], function (err, data) {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });
};