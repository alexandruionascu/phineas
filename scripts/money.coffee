# Description:
#   Spune am bani de ma enerveaza
#
# Commands:
#   hubot am bani - LE_AM DAT LA DUJMANI BOALA DE NU SE MAI TRATEAZA
#   hubot am bani - AM BANI DE MA ENERVEAZA
#
# URLS:
#   /hubot/help
#
# Configuration:
#   HUBOT_HELP_REPLY_IN_PRIVATE
#
# Notes:
#   These commands are grabbed from comment blocks at the top of each file.

module.exports = (robot) ->
  robot.hear /am bani/i, (res) ->
    res.send "am bani de ma enerveaza :D :) ;)"
