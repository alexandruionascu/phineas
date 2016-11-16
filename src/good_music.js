'use strict';
import FileSystem from 'fs';

module.exports = (robot) => {

	robot.hear(/manea/i, res => {
		FileSystem.readFile('src/music.json', 'utf8', function (err, data) {
		  	if (err)
			 		throw err;
			 	let musicList = JSON.parse(data);
				let randomIndex = Math.floor(Math.random() * musicList.length);
				res.send(musicList[randomIndex].url);
			});

	});

	robot.router.post('/test', (req, res) => {
		robot.send({ room: req.params.room }, `Received HTTP request: ${req.body.value}`);
		res.send('OK');
	});

};
