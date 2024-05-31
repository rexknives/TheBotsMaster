const CallStateMap = require('../services/state/CallStateMap');
const { Events } = require('discord.js');
const logger = require('../utilities/logger');
const _ = require('lodash');

/*
    First piece of Middleware to really test and flesh out the
    idea. This one will:
    - [x] receive an outgoing message
    - [x] generate an async representation of the work for storage
    - [x] generate and send a confirmation button interaction in it's place
    - [x] setup an interaction listener for button press
    - [x] retrieve stored work
    - [x] run, parse, or otherwise process it

*/

const genConfInst = (dc, approvalUser) => {
/*
    const theFunc = (inMsg, outMsg, next) => {

        // Using func; the DM -> Channel Msg flow is too disparate to use msg ids
        CallStateMap.inst.set( theFunc, () => {

            discordClient.channels
                .fetch(inMsg.channel_id)
                .then((chan) => chan.send(inMsg))
                .then(message => logger.log(` message successfully: ${message.content}`))
                .catch(logger.error);
        } );

        discordClient.on(Events.MessageCreate, (msg) => {

            if (msg.author.id === approvalUser.id) {
                if(msg.startsWith('1')) {
                    CallStateMap.inst.get(theFunc)?.();
                } else if(msg.startsWith('2')) {
                    CallStateMap.inst.delete(theFunc);
                }
            }
        });

        const dmChannel = approvalUser
            .createDM()
            .then((userDmChannel) => userDmChannel.send('The Bot would like approval to send the following message: /n ' + inMsg.content + ' /n reply with: /n 1) yes /n 2) no'))
            .then(message => logger.log(`Sent message successfully: ${message.content}`))
            .catch(logger.error);
    };

    return theFunc;
}
*/
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