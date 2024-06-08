
const { Events } = require('discord.js');
const logger = require('../util/logger');
const User = require('../models/User.js');
const _ = require('lodash');

const ChatEvent = require('../models/ChatEvent.js');

const genApprovalText = (evt) => 
    `${evt.client.bot.name} would like your permission to take the following action: \n`
        + `sending "${evt.content}" \n`
        + `"1" if yes \n`
        + `"2" if no \n`;

//TODO: pull core/client from approvalUser so that it's service agnostic
//TODO: allow choice of regular or privMsg
const genConfInst = (dc,
    approvalUser,
    yesCmp = (m) => m.startsWith('1'),
    noCmp = (m) => m.startsWith('2'),
    inMsgTrap = (m) => m?.content?.toLowerCase?.().indexOf?.('trap me!') !== -1,
    apprUserOtherParam = {}) => {

    return (inMsg, outMsg, next) => {

        // TODO: convert to service agnostic version, achieve cross-service confirmation

        const discordImpl = (dc, approvalUser) => {

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
                }))
                .then(() => dc.channels.fetch(inMsg.channel_id) )
                .then( chan => { chan.send(inMsg) } )                   //TODO: should be next instead of channel send
                .then( msg => logger.log(`message successfully: ${msg}`) )
                .finally( () => dc.removeListener(Events.MessageCreate, partialMsgProc) )
                .catch( logger.error );

            next(outMsg);
        }

        //discordImpl(dc, approvalUser);
        
        const agnosticImpl = (apprUserOrChan, yesCmp, noCmp, inMsgTrap, apprUserOtherParam ) => {

            if (inMsgTrap && !inMsgTrap(inMsg))
                return next(inMsg);

            let apprChan, apprUser;
            if (apprUserOrChan instanceof User) {
                apprChan =  apprUserOrChan.privChannel;
                apprUser = apprUserOrChan;
            } else {
                apprChan =  apprUserOrChan;
                apprUser = apprUserOtherParam;
            }
        
            const msgEvents = [ ChatEvent.events.MSG_EVENT, ChatEvent.events.PRIV_MSG_EVENT ];
            let apprMsgHandlerFunc;

            const apprCompare = (msg, s, r) => {
                if (msg.author.id !== apprUser.id) return;
                if (yesCmp(msg.content)) s();
                if (noCmp(msg.content)) r();
            }

            apprChan.sendMsg(genApprovalText(inMsg))
                .then( () => new Promise((rs, rj) => {
                    apprMsgHandlerFunc = _.partial(apprCompare, _, rs, rj);
                    apprUser.client.on(msgEvents, apprMsgHandlerFunc)
                }))
                .then( () => { next(inMsg) } )
                .finally( () => apprUser.client.off(msgEvents, apprMsgHandlerFunc) );
        }

        agnosticImpl(approvalUser, yesCmp, noCmp, inMsgTrap, apprUserOtherParam )
    }
}

module.exports = { genConfInst };