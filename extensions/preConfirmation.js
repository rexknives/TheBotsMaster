const CallStateMap = require('../services/state/CallStateMap');
const { Events } = require('discord.js');
const logger = require('../util/logger');
const _ = require('lodash');

//TODO: pull core/client from approvalUser so that it's service agnostic
//TODO: allow choice of regular or privMsg
const genConfInst = (dc, approvalUser /* OrChannel */) => {

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
            .then( chan => { chan.send(inMsg) } )                   //TODO: should be next instead of channel send
            .then( msg => logger.log(`message successfully: ${msg}`) )
            .finally( () => dc.removeListener(Events.MessageCreate, partialMsgProc) )
            .catch( logger.error );

        next(outMsg, 'some other dispatched work or state here?');

        //TODO: allow pull core/client from approvalUser so that it's service agnostic
        /* Service agnostic...

            const eventType = isChannel ? ChatEvent.events.MSG_EVENT : ChatEvent.events.PRIV_MSG_EVENT;

            if (apprUserOrChan instanceof User) {
                const apprChan =  apprUserOrChan.privChannel;
                const apprUser = apprUserOrChan;
            } else {
                const apprChan =  apprUserOrChan;
                const apprUser = apprUserOtherParam;
            }
        
            const msgEvents = [ChatEvent.events.MSG_EVENT, ChatEvent.events.PRIV_MSG_EVENT];
            let apprMsgHandlerFunc;

            const apprCompare = (msg, s, r) => {
                if (msg.author.id !== apprUser.id) return;
                if (msg?.content?.startsWith?.('1')) s();
                if (msg?.content?.startsWith?.('2')) r();
            }

            apprChan.sendMsg(approvalText)
                .then( () => new Promise((rs, rj) => {
                    apprMsgHandlerFunc = _.partial(apprCompare, _, rs, rj);
                    dcs.on(msgEvents, apprMsgHandlerFunc)) )
                .then( () => { next(inMsg) } )
                .finally( () => { dcs.off(msgEvents, apprMsgHandlerFunc); } );

        */ 
    }
}

module.exports = { genConfInst, promiseTest };