'use strict';

module.exports = (robot) => {

	robot.hear(/manea/i, res => {
		res.send('bagam o manea');
	});

	robot.router.post('/test', (req, res) => {
		robot.send({ room: req.params.room }, `Received HTTP request: ${req.body.value}`);
		res.send('OK');
	});

};
