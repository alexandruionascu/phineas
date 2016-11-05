
module.exports = function(robot) {
  robot.respond(/add (.*)/i, function(res) {
    var str = res.match[1];
    //str.substring(0, str.length - 1);

    var value = parseInt(str);
    robot.brain.set('income', value);

    res.reply('More ' + robot.brain.get('income') + '$ for you.');
  });
}
