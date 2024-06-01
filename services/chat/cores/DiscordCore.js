/*

    - [x] login
    - [x] event registration
        - [x] feed w. every event type
    - [ ] msg decorators (for chat service-specific styling features)

*/

import ChatService from '../../models/ChatService';
import logger from '../../../utilities/logger';
import { BaseChannel, Events, SlashCommandBuilder, GatewayIntentBits } from "discord.js";

module.exports = class DiscordCore extends ChatService {

    constructor(opts) {

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
            .finally( () => {} )
            .catch( logger.error );
    }

    sendPrivMsg = (userToDM, text) => {
        return userToDM.createDM()
            .then( usrDMC => usrDMC.send(text) )
            .then( evt => logger.log(`Sent message successfully: ${evt}`) )
            .finally( () => {} )
            .catch( logger.error );
    }

    getWaterhoseFeed = (eventProcessor, events = Object.values(Events)) => {
        for (ev in events)
            this.client.on(ev, eventProcessor);
    }


    /******************************************************************* */

    static convertBotCmdToDiscordCmd = (botCmd) => {
        return new SlashCommandBuilder()
            .setName(botCmd.name)
            .setDescription(botCmd.description);
            //.addStringOption(option => 
            //    option.setName('input')
            //        .setDescription('The input to echo back'))
            //        .setRequired(true)
			//        .addChoices(
            //            { name: 'Funny', value: 'gif_funny' },
            //            { name: 'Meme', value: 'gif_meme' },
            //            { name: 'Movie', value: 'gif_movie' },
			//         )
            //),
	        //.addChannelOption(option => option.setName('channel').setDescription('The channel to echo into'));
            //.addBooleanOption(option => option.setName('ephemeral').setDescription('Whether or not the echo should be ephemeral'));

            /*
            addAttachmentOption
            addBooleanOption
            addChannelOption
            addIntegerOption
            addMentionableOption
            addNumberOption
            addRoleOption
            addStringOption
            addSubcommand
            addSubcommandGroup
            addUserOption

            setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		    setDMPermission(false),
            setNSFW
            */
    }
}