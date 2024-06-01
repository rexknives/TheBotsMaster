const { setMetaData, getMetaData } = require('../services/state/metaDataMaps');

module.exports = class ChatEvent extends Event {

    constructor(...args) {

        this.metadata = null;

        super(...args);
    }

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

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

        return typeof cb === 'function' ? promiseExec(cb.bind(null, undefined)) : new Promise(promiseExec);
    }
}