import FileSystem from 'fs';

module.exports = (robot) => {
  robot.hear(/(latest news)|(financial news)|(news)/i, (res) => {
    FileSystem.readFile('src/news.json', 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      const newsList = JSON.parse(data);
      for (let i = 0; i < newsList.length; i += 1) {
        res.send(newsList[i].title);
        res.send(newsList[i].description + ' - ' + newsList[i].time);
      }
    });
  });
};
