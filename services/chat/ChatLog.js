module.exports = class ChatLog {

    constructor(opts) {

        this.options = opts;
        this.emitter = null;
    }

    ingestEmitter = (theEmitter) => {
        this.emitter = theEmitter;
    }
}


const exampleOpts = {
    windowLength: 1000,
    allEvents: true,
    eventParser: (evt) => evt
};




