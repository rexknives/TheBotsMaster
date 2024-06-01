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
}