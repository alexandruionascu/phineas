import Request from 'sync-request';
import * as stocks from './stocks';

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
  robot.hear(/(.*)/i, res => {
    console.log("i'm here");
    const luisAdapter = new LuisAdapter(APP_ID, APP_SECRET);
    const jsonData = luisAdapter.query(res.match[1]);

    const args = [];
    for (let i = 0; i < jsonData.entities.length; i += 1) {
      args[i] = jsonData.entities[i].entity;
    }

    switch (jsonData.topScoringIntent.intent) {
      case 'Convert': {
        luisResponse = jsonData;
        return true;
      }
      case 'GetStock': {
        const stockManager = new stocks.StockManager();
        stockManager.getStockPrice(args[0], (data) => {
          luisResponse = data[0];
          res.send(luisResponse.Bid);
          return true;
        });
        break;
      }
      default:
        return false;
    }
  });
};
