// TODO: msg decorators (for chat service-specific styling features)

const ChatService = require('../../../models/ChatService');
const ChatEvent = require('../../../models/ChatEvent');
const logger = require('../../../utilities/logger');
const { Client, BaseChannel, Events, SlashCommandBuilder } = require('discord.js');

module.exports = class DiscordCore extends ChatService {

    constructor(opts) {

        super(opts);

        this.options = opts;
        this.client = new Client(opts);
        this.currentChannelHandler = null;
    }

    login = (otherToken) => this.client.login(otherToken || this.options?.token || '');

    logout = () => this.client.destroy();

    join = (channeldOrIdOrName, cb) => {

        //TODO: should this return a Channel? Should Channel be an EventEmitter?

        let eventHandlerWrapper;

        if (channeldOrIdOrName instanceof BaseChannel) {

            eventHandlerWrapper = (msg, ...args) => {
                if (msg.channel.name === channeldOrIdOrName.name)
                    cb(msg, ...args);
            };

        } else if (typeof channeldOrIdOrName === 'number' || !isNaN(Number(channeldOrIdOrName))) {

            eventHandlerWrapper = (msg, ...args) => {
                if (msg.channel.id === channeldOrIdOrName)
                    cb(msg, ...args);
            };

        } else if (typeof channeldOrIdOrName === 'string' && channeldOrIdOrName.length) {

            const namedChannel = this.client.channels.find((chan) => chan.name === channeldOrIdOrName && chan.type === 'text');

            if (namedChannel) {
                eventHandlerWrapper = (msg, ...args) => {
                    if (msg.channel.name === namedChannel.name)
                        cb(msg, ...args);
                };
            } else {
                throw new Error();
            }
        }

        this.currentChannelHandler = eventHandlerWrapper;

        return new Promise((s,r) => s(this.client.on(Events.MessageCreate, eventHandlerWrapper)));
    }

    leave = () => new Promise((s,r) => s(this.client.removeListener(Events.MessageCreate, this.currentChannelHandler)));

    listChannels = () => this.client.channels.fetch().catch( logger.error );
    
    sendMsg = (channel, dm) => {
        return channel.send(dm)
            .then( evt => logger.log(`Sent message successfully: ${evt}`) )
            .catch( logger.error );
    }

    sendPrivMsg = (userToDM, text) => {
        return userToDM.createDM()
            .then( usrDMC => usrDMC.send(text) )
            .then( evt => logger.log(`Sent message successfully: ${evt}`) )
            .catch( logger.error );
    }

    on = (...args) => this.client?.on(...args);

    once = (...args) => this.client?.once(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this.client, ...args);   //TODO: change to -this-

    getWaterhoseFeed = (eventProcessor, disableFeed = false, events = Object.values(Events)) => {
        events.forEach((evt)=>{
            logger.debug(`adding ${evt} to waterhose event listener.`);
            this.client[disableFeed ? 'removeListener' : 'on'](evt, eventProcessor);
        });
    }

    /******************************************************************* */

    static convertBotCmdToDiscordCmd = (botCmd) => {
        return new SlashCommandBuilder()
            .setName(botCmd.name)
            .setDescription(botCmd.description);
    }
}