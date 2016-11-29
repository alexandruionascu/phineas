#PHINEAS


### Installing dependencies
    $ npm install

### Slack launch

    $ HUBOT_SLACK_TOKEN=xoxb-YOUR-TOKEN-HERE ./bin/hubot --adapter slack

Your token is on the `Edit configuration` from <a href="https://fintech-hackaton.slack.com/apps/A0F7YS25R-bots"> here </a>.



Phineas is a chat bot built on the [Hubot][hubot] framework. It was
initially generated by [generator-hubot][generator-hubot], and configured to be
deployed on [Heroku][heroku] to get you up and running as quick as possible.

This README is intended to help get you started. Definitely update and improve
to talk about your own instance, how to use and deploy, what functionality is
available, etc!

[heroku]: http://www.heroku.com
[hubot]: http://hubot.github.com
[generator-hubot]: https://github.com/github/generator-hubot

### Running Phineas Locally

You can test your hubot by running the following, however some plugins will not
behave as expected unless the [environment variables](#configuration) they rely
upon have been set.

You can start Phineas locally by running:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    Phineas>

Then you can interact with Phineas by typing `Phineas help`.

    Phineas > Phineas help
    Phineas animate me <query> - The same thing as `image me`, except adds [snip]
    Phineas help - Displays all of the help commands that Phineas knows about.
    ...
