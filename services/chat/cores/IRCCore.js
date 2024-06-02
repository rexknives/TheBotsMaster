const irc = require('matrix-org-irc');
const logger = require('../../../utilities/logger');
const ChatService = require('../../../models/ChatService');

module.exports = class IRCCore extends ChatService {

    constructor(...args) {
        super(...args);
        this.options = args;
        this.client = new irc.Client(...this.options);
    }

    login = () => this.client.connect();

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

    sendMsg = (...args) => this.client.say(...args);

    sendPrivMsg = (...args) => this.client.say(...args);

    on = (...args) => this.client?.on(...args);

    once = (...args) => this.client?.once(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this.client, ...args);

    getWaterhoseFeed = (eventProcessor, off = false, events = IRCCore.allEvents()) => {
        events.forEach((evt)=>{
            logger.debug(`adding ${evt} to waterhose event listener.`);
            this.client[off ? 'removeListener' : 'on'](evt, eventProcessor);
        });
    }

    static allEvents = () => [
        'registered', 'notice', 'mode_is', '+mode', '-mode', 'nick', 'motd', 'action', 'ctcp',
        'raw', 'kick', 'names', 'topic', 'channellist', 'channellist_start', 'channellist_item',
        'whois', 'selfMessage', 'kill', 'message', 'pm', 'invite', 'quit', 'join', 'abort',
        'connect', 'error', 'sasl_error', 'sasl_loggedin', 'sasl_loggedout', 'ping', 'pong',
        'netError', 'part', 'isupport'
    ];
}