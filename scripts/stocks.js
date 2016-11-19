'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _yfinance = require('yfinance');

var _yfinance2 = _interopRequireDefault(_yfinance);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _natural = require('natural');

var _natural2 = _interopRequireDefault(_natural);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COMPANIES_FILE = 'src/companies.json';
var TEXT_ENCODING = 'utf8';

var StockManager = function () {
  function StockManager() {
    _classCallCheck(this, StockManager);

    var data = _fs2.default.readFileSync(COMPANIES_FILE, TEXT_ENCODING);
    this._companies = JSON.parse(data);
  }

  _createClass(StockManager, [{
    key: 'getCompany',
    value: function getCompany(companyName) {
      var maxDistance = 0;
      var bestCompany = void 0;
      this.companies.forEach(function (company) {
        var distance = _natural2.default.JaroWinklerDistance(company.Name, companyName);
        if (maxDistance < distance) {
          maxDistance = distance;
          bestCompany = company;
        }
      });

      return bestCompany;
    }
  }, {
    key: 'companies',
    get: function get() {
      return this._companies;
    },
    set: function set(values) {
      this._companies = values;
    }
  }]);

  return StockManager;
}();

module.exports = function (robot) {
  robot.respond(/stock for (.*)/i, function (res) {
    var stockManager = new StockManager();
    console.log(stockManager.getCompany(res.match[1]));

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
};