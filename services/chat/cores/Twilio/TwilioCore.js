const express = require('express');
const Twilio = require('twilio');
const { isEmpty } = require('lodash');
const ChatService = require('../../../models/ChatService');
const User = require('../../../models/User');
const Channel = require('../../../models/Channel');
const User = require('../../../models/User');
const { match } = require('matchacho');
const logger = require('../../../util/logger');

module.exports = class TwilioCore extends ChatService {

    constructor(opts, ...args) {

        this.options = opts;
        this.client = new Twilio(opts.accountSid, opts.authToken, {logLevel: 'debug'});
    }

    _init = () => {

        // Can always send sMS without needing a server if you don't care about replies
        if ( this.options.canReceiveSMS || this.options.canSpeak ) {
            this.setupHTTPServer();
        }

        if ( this.options.canReceiveSMS || this.options.canSpeak ) {
            this.registerEndpoint('/sms', this.getSMSEndpointHandler(), 'post');
        }

        if (this.options.canSpeak) {
            this.registerEndpoint('/twiml', this.getAudioFilePlayEndpointHandler());
            this.registerEndpoint('/incoming', this.getAudioFilePlayEndpointHandler(), 'post');
        }
    }

    login = this._init;

    setupHTTPServer = () => {
        this.httpServer = express();
        this.options.port = this.options.port || 3000;
        this.httpServer.listen(this.options.port, () => {
            logger.debug(`Server is listening on port ${port}`);
            //TwilioCore.updateWebhooks();
        });

        return this.httpServer;
    }

    registerEndpoint = (url, reqHandler, verb = 'get') => this.httpServer?.[verb]?.(url, reqHandler);

    getAudioFilePlayEndpointHandler = (audioFileURL = 'https://www.example.com/audio-file.mp3') => {
        return (req, res) => {
            const twiml = new Twilio.twiml.VoiceResponse();
            twiml.play(audioFileURL);
            res.type('text/xml');
            res.send(twiml.toString());
        }
    }

    logout = () => {}

    _checkP = (arg) => match(arg)
        .when(Channel,   arg)
        .when(User,      new Channel({phoneUsers: [arg]}))
        .when(Array,     new Channel({phoneUsers: arg}))
        .when(isEmpty,   new Error(''))
        .default(Channel({phoneUsers: [arguments]}));

    join = (channelOrUserArrayOrUsers) => {

        // https://www.twilio.com/docs/conversations/group-texting

        const channel = _checkP(channelOrUserArrayOrUsers);
        return channel;
    }

    leave = (channelOrUserArrayOrUsers) => {
        const channel = _checkP(channelOrUserArrayOrUsers);
        return channel;
    }

    listChannels = () => {} // multi-party SMS you've started or received
    
    sendMsg = (channelOrUserArrayOrUsers, msg) => {
        const channel = _checkP(channelOrUserArrayOrUsers);
    };

    sendPrivMsg = (wrappedToUser, msgText) =>
        this.client.messages.create({
            body: msgText,
            from: this.options.phoneNumber,
            to: wrappedToUser.phoneNumber 
        }).then( (msgRes) => {
            logger.log(`Sent private message successfully: ${msgRes.body}`);
            return this.e(ChatEvent.events.PRIV_MSG_EVENT, msgRes);
        } ).catch( logger.error );

    sendAll = (chatEvent) => {}

    getSMSEndpointHandler = () => {
        return (req, res) => {

            const incomingMessage = req.body.Body;
            logger.debug(`[ received message: ${incomingMessage} ]`);
          
            const twiml = new Twilio.twiml.MessagingResponse();
            twiml.message('Your message has been received.');

            res.type('text/xml');
            res.send(twiml.toString());

            //TODO: register privMsg handler and dispatch synthetic
        };
    }

    send = (msgObj) => {}

    startVoiceCall = (toUserOrNumber, fromUserOrNumber, apiUrl, cb) =>
        this.client.calls.create({
            to: toUserOrNumber,
            from: fromUserOrNumber,
            url: `${apiUrl}:${this.options.port}`
        })
        .then(logger.log)
        .catch(logger.error);

    e = this.e.bind(this, TwilioCore.eventFactory);

    setMetaData = setMetaData.bind(this);

    getMetaData = getMetaData.bind(this);

    static channelFactory = (nativeAPIChannel) => {}    // returns our wrapped Channel instance
    
    static userFactory = (originClient, phoneNumber) => {

        // TODO: handle string case

        return new User({
            phoneNumber: '+' + phoneNumber,
            id: '+' + phoneNumber,
            username: '+' + phoneNumber,
            client: originClient,
            rawClient: originClient.client,
        });
    }

    static eventFactory = (originClient, eName, evtObj = {}, args) => {

        const msgEventFactory = (msg) => {
            return {
                author: TwilioCore.userFactory(originClient, evtObj.from), // TODO: is this sometimes 'to'?
                content: msg.body,
                channel: {},
                rawMsg: msg
            }
        }

        Object.assign( evtObj,
            match( eName,
                ChatEvent.events.MSG_EVENT,         msgEventFactory,
                ChatEvent.events.PRIV_MSG_EVENT,    msgEventFactory,
                msgEventFactory                     // default
            )
        );

        if (evtObj.timestamp)
            evtObj.time = new Date(evtObj.timestamp);

        return new ChatEvent(eName, evtObj, originClient, originClient.client);
    }

    static updateWebhooks = (twClient, phoneSID, smsUrl, voiceUrl) =>
        twClient.incomingPhoneNumbers(phoneSID)
            .update({voiceUrl, smsUrl})         // sms_fallback_url, voice_fallback_url
            .then((res) => logger.debug(`[ ${res.phoneNumber} webhook URL updated ]`))
            .catch(logger.error);
}

const exampleOpts = {
    canSpeak: true,
    canReceiveSMS: true
}