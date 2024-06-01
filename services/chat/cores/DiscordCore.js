
    /*

        - [x] login
        - [ ] event registration
            - [x] feed w. every event type
        - [ ] msg decorators (for chat service-specific styling features)

    */

import ChatService from '../../models/ChatService';
import { Events, SlashCommandBuilder, GatewayIntentBits } from "discord.js";

module.exports = class DiscordCore extends ChatService {

    constructor(opts) {

        this.options = opts;
        this.client = new Client(opts);
    }

    //TODO: multiple mapped instances

    login = (betterToken) => this.client.login(betterToken || this.options?.token || '');

    logout = () => {

    }

    join = () => {

    }

    leave = () => {

    }

    listChannels = () => {

    }
    
    privateMsg = () => {

    }

    selfMetaData = () => {

    }

    getWaterhoseFeed = (eventProcessor, events = Object.values(Events)) => {
        for (ev in events)
            this.client.on(ev, eventProcessor);
    }


    /******************************************************************* */

    static waitForEvent = (client, event, onlyOnce) => {
        //TODO: self-cleaning listeners even if more than once
        return new Promise((resolve, reject) => {
            client.once(Events.Error, (err) => reject(err));
            client[onlyOnce ? 'once' : 'on'](event, (...args) => {
                resolve(args);
            });
        });
    }

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