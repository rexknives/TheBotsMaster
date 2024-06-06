// TODO: msg decorators (for chat service-specific styling features)

const { Client, BaseChannel, Events, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { match } = require('matchacho');
const ChatService = require('../../../models/ChatService');
const ChatEvent = require('../../../models/ChatEvent');
const User = require('../../../models/User');
const Channel = require('../../../models/Channel');
const logger = require('../../../util/logger');

module.exports = class DiscordCore extends ChatService {

    constructor(opts) {

        super(opts);

        this.options = opts;
        this.client = new Client(opts);
        this.currentChannelHandler = null;
        this.currentChannel = null;
    }

    _initListeners = () => {

        this.client.on(Events.MessageCreate, (msg, ...args) => {

            if (!this?.options?.omniChannel) {
                if (!this.currentChannel)
                    return;
                else if (msg.channel.id !== this.currentChannel.id)
                    return;
            }
            
            const type = msg.guild ? ChatEvent.events.MSG_EVENT : ChatEvent.events.PRIV_MSG_EVENT;
            this.e(type, msg, args);
        });

        //TODO: should I simulate joins and leaves with presence data? leaves when user uses diff #channel?
            // GUILD_MEMBER_JOIN: A message sent when a new member joins a server.
            // RECIPIENT_ADD: A message sent when a user is added to a group DM.
            // RECIPIENT_REMOVE: A message sent when a user is removed from a group DM.
    }

    login = (otherToken) => {
        const theToken = otherToken || this.options?.token;

        if (otherToken)
            this.options.token = otherToken;

        return this.client.login(theToken)
            .then((maybeErrText) => {
                if (maybeErrText === theToken) {
                    return this.e( ChatEvent.events.LOGIN_EVENT, {client: this, rawClient: this.client} );
                } else {
                    throw new Error();
                }
            });
    }

    logout = () => this.client.destroy(); //TODO: promisify

    join = (channeldOrIdOrName, cb) => {

        //TODO: should this return a Channel? Should Channel be an EventEmitter?
        //TODO: should Channel messages be "gated" behind a call to join? config this behavior perhaps?

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

        const synEvt = this.e(ChatEvent.events.JOIN_EVENT, {user: {}});

        return new Promise((s,r) => {
            this.client.on(Events.MessageCreate, eventHandlerWrapper);
            s(synEvt);
        });
    }

    leave = () => new Promise((s,r) => {
        this.client.removeListener(Events.MessageCreate, this.currentChannelHandler);
        this.currentChannelHandler = null;
        const synEvt = this.e(ChatEvent.events.LEAVE_EVENT, {user: {}});
        s(synEvt);
    });

    listChannels = () => DiscordCore.listChannels(this);

    sendMsg = (channel, msg) =>
        channel.send(msg)
            .then( (evt) => {
                logger.log(`Sent message successfully: ${evt}`);
                return this.e(ChatEvent.events.MSG_EVENT, evt);
            } )
            .catch( logger.error );

    sendPrivMsg = (wrappedUser, text) => {
        return wrappedUser.rawUser.createDM()
            .then( usrDMC => usrDMC.send(text) )
            .then( (evt) => {
                logger.log(`Sent private message successfully: ${evt}`);
                return this.e(ChatEvent.events.PRIV_MSG_EVENT, evt)
            } )
            .catch( logger.error );
    }

    //TODO: should Synthetic Events and raw Events come from the same EventEmitter?
    //TODO: should "self" generated messages be behind a boolean config?

    e = this.e.bind(this, DiscordCore.eventFactory);

    //on = (...args) => this.client?.on(...args);

    //once = (...args) => this.client?.once(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);   //TODO: change to -this-

    getWaterhoseFeed = (eventProcessor, disableFeed = false, events = DiscordCore.listEvents()) => {
        events.forEach((evt)=>{
            logger.debug(`adding ${evt} to waterhose event listener.`);
            this.client[disableFeed ? 'removeListener' : 'on'](evt, eventProcessor);
        });
    }

    registerCommands = (cmds) => {}

    static listEvents = Object.values(Events);

    static channelFactory = (originClient, discordChannelOrId) => {

        // TODO: handle string case

       return new Channel( discordChannelOrId?.recipients?.map?.((dcUser) => DiscordCore.userFactory(originClient, dcUser)), {
            id: discordChannelOrId.id,
            topic: discordChannelOrId.topic,
            client: originClient,
            rawClient: originClient.client
        });
    }
    
    static userFactory = (originClient, discordUserOrId) => {

        // TODO: handle string case

        return new User({
            id: discordUserOrId.id,
            username: discordUserOrId.username,
            rawUser: discordUserOrId,
            client: originClient,
            rawClient: originClient.client,
        });
    }

    static eventFactory = (originClient, eName, evtObj = {}, args) => {

        const msgEventFactory = (msg) => {
            return {
                author: DiscordCore.userFactory(originClient, {id: msg.author?.id}),
                channel: DiscordCore.channelFactory(originClient, {id: msg?.channel_id}),     //DMs are also "Channels"
                rawUser: msg.author,
                rawMsg: msg,
                content: msg.content
            }
        }

        Object.assign( evtObj,
            match( eName,
                ChatEvent.events.JOIN_EVENT,        () => {user: {}},
                ChatEvent.events.LEAVE_EVENT,       () => {user: {}},
                ChatEvent.events.MSG_EVENT,         msgEventFactory,
                ChatEvent.events.PRIV_MSG_EVENT,    msgEventFactory,
                ChatEvent.events.LIST_CHANNELS,     () => {},
                msgEventFactory                     // default
            )
        );

        if (evtObj.timestamp)
            evtObj.time = new Date(evtObj.timestamp);

        return new ChatEvent(eName, evtObj, originClient, originClient.client);
    };

    static discordCmdFactory = (botMasterCmd) => {
        return new SlashCommandBuilder()
            .setName(botCmd.name)
            .setDescription(botCmd.description);
    }

    static botMasterCmdFactory = (discordBotCmd) => {}

    static listChannels = (clientCore) => {
        const rest = new REST({ version: '9' }).setToken(clientCore.options.token);
        
        // TODO: FIX GUILD ID REFERENCE!
        return rest.get( Routes.guildChannels( [...clientCore.client.guilds.cache.keys()][0]) )
            .then((resChans) => {
                const wrappedChans = resChans.map((dcChan) => DiscordCore.channelFactory(clientCore, dcChan));
                this.e(ChatEvent.events.LIST_CHANNELS, {channels: wrappedChans, client: clientCore, rawClient: clientCore.client});
                return wrappedChans;
            })
            .catch( logger.error );
    }
}