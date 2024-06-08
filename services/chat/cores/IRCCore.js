const { match } = require('matchacho');
const irc = require('matrix-org-irc');
const logger = require('../../../util/logger');
const ChatService = require('../../../models/ChatService');
const ChatEvent = require('../../../models/ChatEvent');
const Channel = require('../../../models/Channel');
const User = require('../../../models/User');

module.exports = class IRCCore extends ChatService {

    constructor(opts, ...args) {
        super(opts, ...args);
        this.options = opts;
        this.client = new irc.Client(opts.server, opts.nick, opts);

        this.client.on = this.client.addListener;
        this.client.off = this.client.removeListener;
    }

    _initialize = () => {
    
        this.client.on('message', (from, to, msg) => this.e(ChatEvent.events.MSG_EVENT, {from, to, msg}));
        this.client.on('pm', (from, msg) => this.e(ChatEvent.events.PRIV_MSG_EVENT, {from, msg}));
        this.client.on('join', (channel, user) => this.e(ChatEvent.events.PRIV_MSG_EVENT, {channel, user}));
        this.client.on('leave', (channel, user, why) => this.e(ChatEvent.events.PRIV_MSG_EVENT, {channel, user, why}));
        this.client.on('error', (error) => this.e(ChatEvent.events.ERROR, {error}));
    }

    login = () => {
        this.client.connect();
        this._initialize();
    }

    logout = () => {

        this.client.disconnect();

        this.client.eventNames().forEach((evt) => {
            this.client.removeAllListeners(evt);
        });

        this.client.destroy();
        return this.client;
    }

    join = (channelName, cb) => this.client.join(channelName, cb);

    leave = (channelName, cb) => this.client.part(channelName, cb);

    listChannels = (...args) => this.client.list(...args);

    sendMsg = (channel, msg) => {
        this.client.say(channel.name, msg);
        return new Promise((s) => s(msg));
    }

    sendPrivMsg = (ircUser, msg) => {
        this.client.say(ircUser.username, msg);
        return new Promise((s) => s(msg));
    }

    sendAll = () => {}

    e = this.e.bind(this, IRCCore.eventFactory);

    getWaterhoseFeed = (eventProcessor, off = false, events = IRCCore.ALL_EVENTS) => {
        events.forEach((evt)=>{
            logger.debug(`adding ${evt} to waterhose event listener.`);
            this.client[off ? 'removeListener' : 'on'](evt, eventProcessor);
        });
    }

    static channelFactory = (client, name) => new Channel(null, {name, id: name, client});
    
    static userFactory = (client, username) => new User({
        client,
        rawClient: client.client,
        id: username,
        username
    });

    static eventFactory = (client, type, evtObj, args) => {

        if (evtObj.timestamp)
            evtObj.time = new Date(evtObj.timestamp);

        const newObj = {};

        Object.assign( newObj,
            match( type,
                ChatEvent.events.MSG_EVENT,         {content: evtObj.msg, author: IRCCore.userFactory(client, evtObj.from)},
                ChatEvent.events.PRIV_MSG_EVENT,    {content: evtObj.msg, author: IRCCore.userFactory(client, evtObj.from)},
                () => {}                     // default
            )
        );

        return new ChatEvent(type, newObj, client);
    }

    static SERVICE_TYPE = 'irc';

    static ALL_EVENTS = [
        'registered', 'notice', 'mode_is', '+mode', '-mode', 'nick', 'motd', 'action',
        'ctcp', 'raw', 'kick', 'names', 'topic', 'channellist', 'channellist_start',
        'channellist_item', 'whois', 'selfMessage', 'kill', 'message', 'pm', 'invite',
        'quit', 'join', 'abort', 'connect', 'error', 'sasl_error', 'sasl_loggedin',
        'sasl_loggedout', 'ping', 'pong', 'netError', 'part', 'isupport'
    ];
}