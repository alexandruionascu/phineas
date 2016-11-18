'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (robot) {

	robot.hear(/(manea)|(rockareala)/i, function (res) {
		_fs2.default.readFile('src/music.json', 'utf8', function (err, data) {
			if (err) throw err;
			var musicList = JSON.parse(data);
			var randomIndex = Math.floor(Math.random() * musicList.length);
			res.send(musicList[randomIndex].url);
		});
	});

	robot.router.post('/test', function (req, res) {
		robot.send({ room: req.params.room }, 'Received HTTP request: ' + req.body.value);
		res.send('OK');
	});
};