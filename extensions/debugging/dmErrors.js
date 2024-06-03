const CallStateMap = require('../services/state/CallStateMap');
const { Events, TextInputStyle } = require('discord.js');
const logger = require('../util/logger');
const _ = require('lodash');

module.exports = ( debuggingUserId ) => {

    const { discordClient, botConfig } = arguments[arguments.length-1];

    const oldLoggerFunc = botConfig.logger.error;

    discordClient.users.fetch(debuggingUserId)
        .then((dbgUsr) => {
            botConfig.logger.error = (err) => {
                oldLoggerFunc(err);
                dbgUsr.createDM()
                    .then(usrDMC => usrDMC.send(err.toString()))
                    .then(msg => oldLoggerFunc(`Successfully sent error to debugging user: ${dbgUsr.name} [${debuggingUserId}]`))
                    .catch(oldLoggerFunc);
            };

            for (errType in [Events.Error, Events.ShardError]) 
                discordClient.on(errType, botConfig.logger.error);
        });

}