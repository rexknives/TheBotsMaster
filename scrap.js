const { DISCORD_BOT_TOKEN } = require('./config.js');
const { Client, Events, GatewayIntentBits, Intents, TextChannel } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const DiscordCore = require('./services/chat/cores/DiscordCore.js');
const IRCCore = require('./services/chat/cores/IRCCore.js');


const ChatEvent = require('./models/ChatEvent.js');
/*
const client = new IRCCore('irc.libera.chat', 'SubwayBot', {
    debug: true,
    channels: ['#rexTestingStuff']
});
*/
const dcClient = new DiscordCore({ intents: Object.values(GatewayIntentBits) });
global.coreClient = dcClient;

/*
client.on('motd', (...args) => console.log(...args));

client.on('error', (...args) => console.log(...args));

dcClient.getWaterhoseFeed( (...args) => console.log(...args) );
*/



dcClient.on( ChatEvent.events.LOGIN_EVENT, (evt) => {

    console.log(`Ready! Logged in as ${evt.rawClient?.user?.id}`);

    evt.client._initListeners();

    evt.client.listChannels()
        .then(console.log);
/*
    cl.channels.fetch('1230593583963312148')
    .then(chan => { 
        //console.log(chan);
        //global.coreClient.sendMsg(chan, "testing DiscordCore.js method sendMsg")
    });

    cl.users.fetch('721912593383686144')
    .then(user => { 
        //console.log(user);
        global.coreClient.sendPrivMsg(user, "testing DiscordCore.js method sendPrivMsg")
    });
*/
    //global.coreClient.join('1230593583963312148', (evt) => console.log(evt));
});


global.coreClient.login(DISCORD_BOT_TOKEN)
    .then((loginEvent) => {
        
        console.log(`Ready! Logged in as ${loginEvent.rawClient?.user?.id}`);

        //loginEvent.client._initListeners();

        loginEvent.client.listChannels()
            .then(console.log)
            .catch(console.error);
    });

/*
const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    const response = await rest.get(
      Routes.guildChannels('1125441170168881182')
    );

    console.log('Channels:', JSON.stringify(response));
  } catch (error) {
    console.error('Error fetching channels:', error);
  }
})();
*/