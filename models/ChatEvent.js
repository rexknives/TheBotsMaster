const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');

module.exports = class ChatEvent extends Event {

    constructor(...args) {

        this.metadata = null;

        super(...args);
    }

    reply = () => {}

    getRawClient = () => {}

    getClientCore = () => {}

    getRawEvent = () => {}

    getEventType = () => {}

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    /************************************************************** */

    static onceFilter = (eventEmitter, eventName, filterFunc, cb) => {

        const promiseExec = (resolve, reject) => {

            const processEvent = (...args) => {

                if (filterFunc(...args)) {

                    eventEmitter.removeListener(eventName, processEvent);
                    resolve(...args);
                }
            };

            return eventEmitter.on(eventName, processEvent);
        };

        return typeof cb === 'function' ? promiseExec(cb) : new Promise(promiseExec);
    }
}

ChatEvent.events = {
    ALL_EVENT: 'all',
    LOGIN_EVENT: 'login',
    LIST_CHANNELS: 'listChannels',
    MSG_EVENT: 'msg',
    PRIV_MSG_EVENT: 'privMsg',
    JOIN_EVENT: 'join',
    LEAVE_EVENT: 'leave',
    REC_VOICECALL_EVENT: 'voiceCallRec'
}