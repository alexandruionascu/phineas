import Request from 'request';

const APP_ID = '5ba9f575-5e9a-44dc-a1b1-cb7747f6071a';
const APP_SECRET = 'f1c110e261b746f8bb2c719f059c4327';
const BASE_URL = 'https://api.projectoxford.ai/luis/v2.0/apps/';

class LuisAdapter {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  query(queryString, callback) {
    let queryUrl = `${BASE_URL}${this.appId}`;
    queryUrl += `?subscription-key=${this.appSecret}&q=${queryString}`;

    Request(queryUrl, (err, res, body) => {
      if (err) {
        throw err;
      }
      if (res.statusCode === 200) {
        callback(body);
      }
    });
  }
}

module.exports = (robot) => {
  robot.hear(/(.*)/i, (res) => {
    const luisAdapter = new LuisAdapter(APP_ID, APP_SECRET);
    luisAdapter.query(res.match[1], (data) => {
      const jsonData = JSON.parse(data);

      // populate args
      const args = [];
      for (let i = 0; i < jsonData.entities.length; i += 1) {
        args[i] = jsonData.entities[i].entity;
      }

      /*res.send(jsonData.topScoringIntent.intent);
      switch (jsonData.topScoringIntent.intent) {
        case 'Convert':
          res.send(args);
          break;
        case 'GetStock':
          res.send(args);
          break;
        default:
          res.send('unknown command');
          break;
      }
      */
    });
  });
};
