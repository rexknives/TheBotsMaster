const express = require('express');
const twilio = require('twilio');
const ChatService = require('../../../models/ChatService');
const logger = require('../../../utilities/logger');

module.exports = class TelephonyCore extends ChatService {

    constructor(opts, ...args) {

        this.options = opts;
        this.client = new twilio(opts.accountSid, opts.authToken, {logLevel: 'debug'});
    }

    login = () => {
        if (this.options.isVoice) {
            this.setupVoiceHTTPServer();
        }
    }

    setupVoiceHTTPServer = () => {
        this.httpServer = express();
        this.options.port = this.options.port || 3000;
        this.registerEndpoint('/twiml', this.getAudioFilePlayEndpoint());
        this.registerEndpoint('/incoming', this.getAudioFilePlayEndpoint(), 'post');
        this.httpServer.listen(this.options.port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }

    registerEndpoint = (endpointURL, requestHandler, verb = 'get') => {
        this.httpServer?.[verb]?.(endpointURL, requestHandler);
    }

    getAudioFilePlayEndpoint = (audioFileURL = 'https://www.example.com/audio-file.mp3') => {
        return (req, res) => {
            const twiml = new twilio.twiml.VoiceResponse();
            twiml.play(audioFileURL);
            res.type('text/xml');
            res.send(twiml.toString());
        }
    }

    logout = () => {}

    join = (channelOrName) => {}

    leave = (channelOrName) => {}

    listChannels = () => {}
    
    sendMsg = (channelOrName, msg) => {};

    sendPrivMsg = (toUserOrNumber, toUserOrNumber, privMsg, ) => {
        return this.client.messages.create({
            body: privMsg,
            from: toUserOrNumber,
            to: toUserOrNumber
        })
        .then(logger.log)
        .catch(logger.error);
    }

    setupSMShandler = () => {
        this.registerEndpoint('/sms', (req, res) => {
            const twiml = new twilio.twiml.MessagingResponse();
          
            // Process the incoming message
            const incomingMessage = req.body.Body;
            logger.debug('Received message:', incomingMessage);
          
            // Respond with a confirmation message
            twiml.message('Your message has been received.');
          
            res.type('text/xml');
            res.send(twiml.toString());
        }, 'post');
    }

    send = (msgObj) => {}

    startVoiceCall = (toUserOrNumber, fromUserOrNumber, apiUrl, cb) => {
        return this.client.calls.create({
            to: userOrNumber,
            from: fromUserOrNumber,
            url: `${apiUrl}:${this.options.port}`
        })
        .then(logger.log)
        .catch(logger.error);
    }

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