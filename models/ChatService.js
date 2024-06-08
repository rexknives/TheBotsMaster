const { EventEmitter } = require('events');
const ChatEvent = require('./ChatEvent');
const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');
const DiscordCore = require('../services/chat/cores/DiscordCore');

module.exports = class ChatService extends EventEmitter {

    constructor(opts) {
        super(opts);
    }

    _initListeners = () => {}

    // For pre-fetching data when wrapping libs that rely heavily on
    // cache in inefficient ways
    _prepopulateData = () => {}

    // Account management

    login = () => {}                                        // public methods interacting w APIs should return promises & dispatch events

    logout = () => {}

    // Channels

    join = (channelOrName) => {}

    leave = (channelOrName) => {}

    listChannels = () => {}

    // Messages
    
    sendMsg = (channelOrName, msg) => {};

    sendPrivMsg = (user, privMsg) => {}

    sendAll = (chatEvent) => {}                             // for dispatching an event to the ALL feed

    // Moderation

    kick = (isPermanent) => {}                              // kick/ban in one step

    // Voice

    startVoiceCall = (userOrNumberOrChannel, cb) => {}

    sendVoiceResp = (userOrNumber, cb) => {}

    receiveVoiceResp = (cb) => {}

    // MetaData management

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    // Event management

    e = (factoryFunc, eName, evtObj, args) => {             // generates a ChatEvent from the appropriate factory & dispatches it
        
        const aChatEvent = factoryFunc(this, eName, evtObj, args);
        this.emit(ChatEvent.events.ALL_EVENT, aChatEvent);  // fine, now that ChatEvent type is set
        this.emit(eName, aChatEvent);
        return aChatEvent;
    }

    oldOn = this.on;
    
    on = (eventType, handlerFunc) => {                      // wrapping `on` and `off` to handle multiple Event types

        const events = eventType instanceof Array ? eventType : [eventType];
        events.forEach((evt) => this.oldOn?.(evt, handlerFunc));
    }

    off = (eventType, handlerFunc) => {

        const events = eventType instanceof Array ? eventType : [eventType];
        events.forEach((evt) => this.removeListener?.(evt, handler));
    }

    once = (...args) => this.once?.(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);

    static listEvents = () => {}

    // Framework factories

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (nativeAPIUser) => {}    // returns our wrapped User instance

    static eventFactory = (nativeAPIEvent) => {}
}

const exampleOpts = {
    user: "someUser",
    pass: "somePass",
    token: "xxxxxxxxxx",
    omniChannel: false,
    serviceSpecific: {
        intents: [

        ]
    }
};