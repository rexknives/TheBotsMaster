const CallStateMap = require('../services/state/CallStateMap');
const { Events } = require('discord.js');
const logger = require('../utilities/logger');
const _ = require('lodash');

const genConfInst = (dc, approvalUser) => {

    return (inMsg, outMsg, next) => {

        const approvalText = 'Hello \n' +
            'The Bot would like approval to send the following message:' +
            `\n ${inMsg.content} \n reply with: \n 1) yes \n 2) no`;

        approvalUser.createDM()
            .then( usrDMC => usrDMC.send(approvalText) )
            .then( msg => logger.log(`Sent message successfully: ${msg}`) )
            .then( () => new Promise((rs, rj) => dc.on(Events.MessageCreate, _.partial((msg, s, r) => {
                if (msg.author.id !== approvalUser.id) return;
                msg?.content?.startsWith?.('1') ? s() : r();
            }, _, rs, rj))) )
            .then(() => dc.channels.fetch(inMsg.channel_id) )
            .then( chan => { chan.send(inMsg) } )
            .then( msg => logger.log(`message successfully: ${msg}`) )
            .catch( logger.error );

        next(outMsg, 'some other dispatched work or state here?');
    }
}

module.exports = { genConfInst, promiseTest };