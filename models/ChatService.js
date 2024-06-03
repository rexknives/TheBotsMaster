const { EventEmitter } = require('events');
const ChatEvent = require('./ChatEvent');
const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');

module.exports = class ChatService extends EventEmitter {

    constructor(opts) {
        super(opts);
    }

    // Account management

    login = () => {}

    logout = () => {}

    // Channels

    join = (channelOrName) => {}

    leave = (channelOrName) => {}

    listChannels = () => {}

    // Messages
    
    sendMsg = (channelOrName, msg) => {};

    sendPrivMsg = (user, privMsg) => {}

    send = (msgObj) => {}

    // Voice

    startVoiceCall = (userOrNumber, cb) => {}

    sendVoiceResp = (userOrNumber, cb) => {}

    receiveVoiceResp = (cb) => {}

    // MetaData management

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    // Event management

    on = (...args) => this.client?.on(...args);

    once = (...args) => this.client?.once(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);

    // Framework Factories

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (nativeAPIUser) => {}    // returns our wrapped User instance
}

const exampleOpts = {
    user: "someUser",
    pass: "somePass",
    token: "xxxxxxxxxx",
    services: {
        "discord": {
            intents: [

            ]
        },
        "irc": {
            //...
        }
    }
};