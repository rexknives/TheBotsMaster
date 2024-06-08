const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');

module.exports = class ChatEvent extends Event {

    constructor(type, evtObj, client, ...args) {

        super(type);

        Object.assign(this, evtObj);

        this.chatbotEventType = type;
        this.client = client;
        this.rawClient = client.client;
    }

    reply = () => {}

    getRawClient = () => this.rawClient;

    getClient = () => this.client;

    getRawEvent = () => this.rawEvent;

    getEventType = () => this.type;

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    /************************************************************** */

    static onceFilter = (eventEmitter, eventName, filterFunc, cb) => {

        const promiseExec = (resolve, reject) => {

            const processEvent = (...args) => {

                if (filterFunc(...args)) {

                    eventEmitter?.removeListener?.(eventName, processEvent);
                    resolve(...args);
                }
            };

            return eventEmitter.on(eventName, processEvent);
        };

        return typeof cb === 'function' ? promiseExec(cb) : new Promise(promiseExec);
    }

    static events = {
        ALL_EVENT: 'all',       // for use in logic where Messages will be routed & sent based on properties instead of by ChatEvent name
        LOGIN_EVENT: 'login',
        MSG_EVENT: 'msg',
        PRIV_MSG_EVENT: 'privMsg',
        JOIN_EVENT: 'join',
        LEAVE_EVENT: 'leave',
        LIST_CHANNELS: 'listChannels',
        REC_VOICECALL_EVENT: 'voiceCallRec',
        MSG_RECEIPT_EVENT: 'msgReceipt',
        SERVICE_EVENT: 'serviceEvent',
        ERROR: 'chatbotError'
    }
}