const express = require('express');
const twilio = require('twilio');
const logger = require('../../../utilities/logger');

module.exports = class TelephonyCore {

    constructor(opts, ...args) {

        this.options = opts;
    }

    login = () => {
        if (this.options.isVoice) {
            this.setupVoiceHTTPServer();
        }
    }

    setupVoiceHTTPServer = () => {
        this.httpServer = express();
        this.options.port = this.options.port || 3000;
        this.httpServer.get('/twiml', this.twimlEndpoint);

        this.httpServer.listen(this.options.port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }

    twimlEndpoint = (req, res) => {
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.play('https://www.example.com/audio-file.mp3');
        
        res.type('text/xml');
        res.send(twiml.toString());
    }

    logout = () => {}

    join = (channelOrName) => {}

    leave = (channelOrName) => {}

    listChannels = () => {}
    
    sendMsg = (channelOrName, msg) => {};

    sendPrivMsg = (user, privMsg) => {}

    send = (msgObj) => {}

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);

    /*********************************************************** */

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (nativeAPIUser) => {}    // returns our wrapped User instance
}

const exampleOpts = {
    isVoice: true
}