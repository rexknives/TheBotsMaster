const CallStateMap = require('../services/state/CallStateMap');
const { Events } = require('discord.js');
const logger = require('../util/logger');
const _ = require('lodash');

const genConfInst = (dc, approvalUser) => {

    return (inMsg, outMsg, next) => {

        // TODO: convert to service agnostic version, achieve cross-service confirmation

        const approvalText = 'Hello \n' +
            'The Bot would like approval to send the following message:' +
            `\n ${inMsg.content} \n reply with: \n 1) yes \n 2) no`;

        const msgProc = (msg, resolve, reject) => {
            if (msg.author.id !== approvalUser.id) return;
            msg?.content?.startsWith?.('1') ? resolve() : reject();
        };
        
        let partialMsgProc;

        approvalUser.createDM()
            .then( usrDMC => usrDMC.send(approvalText) )
            .then( msg => logger.log(`Sent message successfully: ${msg}`) )
            .then( () => new Promise((rs, rj) => {
                partialMsgProc = _.partial(msgProc, _, rs, rj);
                dc.on(Events.MessageCreate, partialMsgProc);
            } ))
            .then(() => dc.channels.fetch(inMsg.channel_id) )
            .then( chan => { chan.send(inMsg) } )
            .then( msg => logger.log(`message successfully: ${msg}`) )
            .finally( () => dc.removeListener(Events.MessageCreate, partialMsgProc) )
            .catch( logger.error );

        next(outMsg, 'some other dispatched work or state here?');

        /* Service agnostic...

            approvalUser.sendPrivMsg(approvalText) )
                .then( () => new Promise((rs, rj) => dcs.on(ChatEvents.ChannelMessage, _.partial((msg, s, r) => {
                    if (msg.author.id !== approvalUser.id) return;
                    msg?.content?.startsWith?.('1') ? s() : r();
                }, _, rs, rj))) )
                .then( () => { chan.send(inMsg) } )
                .finally( () => { dcsre.removeListener(ChatEvents.ChannelMessage, ...) } );

        */ 
    }
}

module.exports = { genConfInst, promiseTest };