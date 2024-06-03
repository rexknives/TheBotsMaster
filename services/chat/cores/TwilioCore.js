const express = require('express');
const twilio = require('twilio');
const ChatService = require('../../../models/ChatService');
const logger = require('../../../utilities/logger');

module.exports = class TwilioCore extends ChatService {

    constructor(opts, ...args) {

        this.options = opts;
        this.client = new twilio(opts.accountSid, opts.authToken, {logLevel: 'debug'});
    }

    initialize = () => {
        this.setupSMShandler();

        if (this.options.isVoice) {
            this.setupVoiceHTTPServer();
        }
    }

    login = this.initialize;

    setupVoiceHTTPServer = () => {
        this.httpServer = express();
        this.options.port = this.options.port || 3000;
        this.registerEndpoint('/twiml', this.getAudioFilePlayEndpoint());
        this.registerEndpoint('/incoming', this.getAudioFilePlayEndpoint(), 'post');
        this.httpServer.listen(this.options.port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }

    registerEndpoint = (url, reqHandler, verb = 'get') => this.httpServer?.[verb]?.(url, reqHandler);

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

    listChannels = () => {} // multi-party SMS you've started or received
    
    sendMsg = (channelOrName, msg) => {};

    sendPrivMsg = (toUserOrNumber, fromUserOrNumber, privMsg, ) => {
        return this.client.messages.create({
            body: privMsg,
            from: fromUserOrNumber,
            to: toUserOrNumber
        })
        .then(logger.log)
        .catch(logger.error);
    }

    setupSMShandler = () => {
        this.registerEndpoint('/sms', (req, res) => {
            // Process the incoming message
            const incomingMessage = req.body.Body;
            logger.debug(`[ received message: ${incomingMessage} ]`);
          
            // Respond with a confirmation message
            const twiml = new twilio.twiml.MessagingResponse();
            twiml.message('Your message has been received.');
            res.type('text/xml');
            res.send(twiml.toString());

            //TODO: register privMsg handler and dispatch synthetic
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

    on = (...args) => this.client?.on(...args);

    once = (...args) => this.client?.once(...args);

    onceFilter = (...args) => ChatEvent.onceFilter(this, ...args);

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    /*********************************************************** */

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (nativeAPIUser) => {}    // returns our wrapped User instance
}

const exampleOpts = {
    isVoice: true
}