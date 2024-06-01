const { EventEmitter } = require('events');
const ChatEvent = require('./ChatEvent');
const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');

module.exports = class ChatService extends EventEmitter {

    constructor(opts) {

    }

    login = () => {

    }

    logout = () => {

    }

    join = (channel) => {

    }

    leave = () => {

    }

    listChannels = () => {

    }
    
    sendMsg = (channel, msg) => {};

    sendPrivMsg = (user, privMsg) => {

    }

    send = (msgObj) => {

    }

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);

    //TODO: caches
    //TODO:   - users
    //TODO:   - channels
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