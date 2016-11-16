'use strict';

module.exports = function (robot) {

	robot.hear(/manea/i, function (res) {
		res.send('bagam o manea');
	});

	robot.router.post('/test', function (req, res) {
		robot.send({ room: req.params.room }, 'Received HTTP request: ' + req.body.value);
		res.send('OK');
	});
};