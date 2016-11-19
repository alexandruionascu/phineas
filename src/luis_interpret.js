import Request from 'request';

const APP_ID = '54e9b18d-25a2-4800-be59-00255000fc7a';
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
      //  debug
      res.send(jsonData.topScoringIntent.intent);
      for (let i = 0; i < jsonData.entities.length; i += 1) {
        res.send(jsonData.entities[i].entity);
      }

      switch (jsonData.topScoringIntent.intent) {
        case 'Convert':
          break;
        case 'GetStock':
          break;
        default:

      }
    });
  });
};
