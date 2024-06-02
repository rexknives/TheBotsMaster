const DISCORD_BOT_TOKEN = require('./config.js');
const { Client, Events, GatewayIntentBits, Intents, TextChannel } = require('discord.js');
const DiscordCore = require('./services/chat/cores/DiscordCore.js');
const IRCCore = require('./services/chat/cores/IRCCore.js');

//const client = new DiscordCore({ intents: Object.values(GatewayIntentBits) });

const client = new IRCCore('irc.libera.chat', 'SubwayBot', {
    debug: true,
    channels: ['#rexTestingStuff']
});

global.coreClient = client;

client.on('motd', (...args) => console.log(...args));

client.on('error', (...args) => console.log(...args));

client.getWaterhoseFeed( (...args) => console.log(...args) );

/*
coreClient.on(Events.ClientReady, (client) => {
    console.log(`Ready! Logged in as ${client.user.id}`);

    client.channels.fetch('1230593583963312148')
    .then(chan => { 
        //console.log(chan);
        //global.coreClient.sendMsg(chan, "testing DiscordCore.js method sendMsg")
    });

    client.users.fetch('721912593383686144')
    .then(user => { 
        //console.log(user);
        global.coreClient.sendPrivMsg(user, "testing DiscordCore.js method sendPrivMsg")
    });

    //global.coreClient.join('1230593583963312148', (evt) => console.log(evt));
    
});

global.coreClient.login(DISCORD_BOT_TOKEN);
*/


