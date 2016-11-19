import FileSystem from 'fs';

const LUIS_URL = 'https://api.projectoxford.ai/luis/v2.0/apps/54e9b18d-25a2-4800-be59-00255000fc7a?subscription-key=f1c110e261b746f8bb2c719f059c4327&q='

module.exports = (robot) => {

    robot.hear(/(.*)/i, res => {
      let q = res.match[1];

      res.http(LUIS_URL+q).get()((err, msg, body) => {
          let data = JSON.parse(body);

          res.send(data.topScoringIntent.intent);

          for (let i = 0; i < data.entities.length; i++){
            res.send(data.entities[i].entity);
          }
      });

  });
};
