import FileSystem from 'fs';

module.exports = (robot) => {
  robot.hear(/(manea)|(rockareala)/i, (res) => {
    FileSystem.readFile('src/music.json', 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      const musicList = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * musicList.length);
      res.send(musicList[randomIndex].url);
    });
  });

  robot.router.post('/test', (req, res) => {
    robot.send({ room: req.params.room }, `Received HTTP request: ${req.body.value}`);
    res.send('OK');
  });
};
