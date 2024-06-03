const irc = require('matrix-org-irc');
const logger = require('../../../util/logger');
const ChatService = require('../../../models/ChatService');

module.exports = class IRCCore extends ChatService {

    constructor(opts, ...args) {
        super(...args);
        this.options = opts;
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

    getWaterhoseFeed = (eventProcessor, off = false, events = IRCCore.listEvents()) => {
        events.forEach((evt)=>{
            logger.debug(`adding ${evt} to waterhose event listener.`);
            this.client[off ? 'removeListener' : 'on'](evt, eventProcessor);
        });
    }

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (nativeAPIUser) => {}    // returns our wrapped User instance

    static listEvents = () => [
        'registered', 'notice', 'mode_is', '+mode', '-mode', 'nick', 'motd', 'action',
        'ctcp', 'raw', 'kick', 'names', 'topic', 'channellist', 'channellist_start',
        'channellist_item', 'whois', 'selfMessage', 'kill', 'message', 'pm', 'invite',
        'quit', 'join', 'abort', 'connect', 'error', 'sasl_error', 'sasl_loggedin',
        'sasl_loggedout', 'ping', 'pong', 'netError', 'part', 'isupport'
    ];
}