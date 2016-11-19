import YahooFinance from 'yfinance';
import TickerTape from 'tickertape';

module.exports = (robot) => {
  robot.respond(/stock for (.*)/i, (res) => {
    //const companySymbol = TickerTape.getSymbol(res.match[1]);
    //res.send("Company name is " + companySymbol);
    YahooFinance.getQuotes(res.match[1], (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });
};
