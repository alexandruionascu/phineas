import YahooFinance from 'yfinance';

module.exports = (robot) => {
  robot.respond(/stock for (.*)/i, (res) => {
    YahooFinance.getQuotes(res.match[1], (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });

  robot.respond(/history for (.*)/i, (res) => {
    YahooFinance.getHistorical(res.match[1], '2016-01-01', '2016-08-05', (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  });

  robot.listen((message) => {
    console.log(JSON.stringify(message).text);
    return Math.random() > 0.5;
  }, (response) => {
    response.reply('OMG THEY CALLED ME');
  });

  robot.listen((message) => {
    console.log(JSON.stringify(message.text));
    return Math.random() < 0.2;
  }, (response) => {
    response.reply('OMG THEY CALLED ME IM SO RAREEE');
  });
};
