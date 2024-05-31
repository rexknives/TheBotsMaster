const DISCORD_BOT_TOKEN = require('./config.js');
const { Client, Events, GatewayIntentBits, Intents } = require('discord.js');

const { genPreConf, promiseTest } = require('./middleware/preConfirmation');

const path = require('path');
const fs = require('fs');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
	GatewayIntentBits.GuildVoiceStates
] });

client.on(Events.ClientReady, (client) => {
    const myUser = client.users.fetch('721912593383686144')
        .then((myUser) => {
            console.log(myUser);
            const middleWareMeth = promiseTest(client, myUser, {content: 'test content here do you wanna tho', channel_id: '1230593583963312148'});
            //middleWareMeth({content: 'test content here do you wanna tho', channel_id: '1230593583963312148'});
        });
})

client.login(DISCORD_BOT_TOKEN);