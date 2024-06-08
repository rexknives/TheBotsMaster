
const { Client, Events, GatewayIntentBits, Intents, TextChannel, User } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const DiscordCore = require('./services/chat/cores/DiscordCore.js');
const { core: TwilioCore } = require('./services/chat/cores/Twilio');
const { genConfInst: genPreConfirmation } = require('./extensions/preConfirmation.js');
const ChatEvent = require('./models/ChatEvent.js');
const { DISCORD_BOT_TOKEN, TWILIO } = require('./config.js');

const IRCCore = require('./services/chat/cores/IRCCore.js');


const twClient = new TwilioCore({
  accountSid: TWILIO.live.sid,
  authToken: TWILIO.live.secret,
  phoneNumber: '+13138243211'
});
const dcClient = new DiscordCore({ intents: Object.values(GatewayIntentBits) });
const ircClient = new IRCCore({
  server: 'irc.libera.chat',
  nick: 'SubwayBot',
  debug: true,
  channels: ['#rexTestingStuff']
});

ircClient._initialize();

global.coreClient = dcClient;

//const approvalUser = TwilioCore.userFactory(twClient, '+16465718221');
const approvalChan = IRCCore.channelFactory(ircClient, '#rexTestingStuff');
const approvalUser = IRCCore.userFactory(ircClient, 'rexTestingStuffN');
const midWareInst = genPreConfirmation( null, approvalChan, (m) => m.startsWith('1'), (m) => m.startsWith('2'), (m) => m?.content?.toLowerCase?.().indexOf?.('trap me!') !== -1, approvalUser ); // (inMsg, outMsg, next) =>

dcClient._initialize();

dcClient.on( ChatEvent.events.MSG_EVENT, (msgEvt) => {
  console.log(msgEvt);
  midWareInst(msgEvt, {}, (outMsg) => {
    outMsg.client.sendAll(outMsg);
  });
})

ircClient.on('motd', (...args) => console.log(...args));
ircClient.on('error', (...args) => console.log(...args));
//ircClient.getWaterhoseFeed( (...args) => console.log(...args) );

dcClient.on( ChatEvent.events.LOGIN_EVENT, (evt) => {

    console.log(`Ready! Logged in as ${evt.rawClient?.user?.id}`);
    //evt.client._initListeners();
});

dcClient.login(DISCORD_BOT_TOKEN)
/*    .then((loginEvent) => {
        
        console.log(`Ready! Logged in as ${loginEvent.rawClient?.user?.id}`);
        //loginEvent.client._initListeners();
    });
*/
