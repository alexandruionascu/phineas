import Request from 'sync-request';
import StockManager from './stocks';
const APP_ID = '5ba9f575-5e9a-44dc-a1b1-cb7747f6071a';
const APP_SECRET = 'f1c110e261b746f8bb2c719f059c4327';
const BASE_URL = 'https://api.projectoxford.ai/luis/v2.0/apps/';

class LuisAdapter {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  query(queryString) {
    let queryUrl = `${BASE_URL}${this.appId}`;
    queryUrl += `?subscription-key=${this.appSecret}&q=${queryString}`;

    const data = Request('GET', queryUrl);
    return (JSON.parse(data.getBody('utf8')));
  }
}

module.exports = (robot) => {

  let luisResponse = null;
  robot.listen((message) => {
    const luisAdapter = new LuisAdapter(APP_ID, APP_SECRET);
    const jsonData = luisAdapter.query(message);
    switch (jsonData.topScoringIntent.intent) {
      case 'Convert':
        luisResponse = jsonData;
        return true;
      case 'GetStock':
        luisResponse = jsonData;
        return true;
      default:
        return false;
    }
  }, (res) => {
    switch (luisResponse.topScoringIntent.intent) {
      case 'Convert':
        break;
      case 'GetStock':
        const stockManager = new StockManager();
          res.send(stockManager.getChart(luisResponse.entities[0].entity));
        stockManager.getStockPrice(luisResponse.entities[0].entity, (price) => {
          res.send(`The stock price is ${price[0].Bid}$`);
        });
        break;
    }
  });
};
