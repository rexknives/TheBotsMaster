module.exports = class ChatEvent extends Event {

    constructor(...args) {

        this.metadata = null;

        super(...args);
    }

    setMetaData = (extNamespace, key, value) => {

        if (!extNamespace || !key) return;

        if (!this.metadata) this.metadata = {};

        if (!this.metadata[extNamespace])
            this.metadata[extNamespace] = new Map();

        this.metadata[extNamespace].set(key, value);
    }

    getMetaData = (extNamespace, key) => {

        if (!extNamespace || !key) return;

        return this.metadata?.[extNamespace]?.set?.(key, value);
    }

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

        return cb === 'function' ? promiseExec(cb) : new Promise(promiseExec);
    }
}