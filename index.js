const { DISCORD_BOT_TOKEN } = require('./config.js');
const { Client, Events, GatewayIntentBits, Intents } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { register } = require('module');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildVoiceStates
] });

const parseJSFiles = (fPath) => 
  fs.readdirSync(fPath)
    .filter(f => f.endsWith('.js'))
    .map(f => require(path.join(fPath, f)));

const regEvents = (events) => {
    for (ev of events)
        client[ev.once ? 'once' : 'on'](ev.name, (...args) => ev.execute(...args));
}

const regCommands = async(cmds, global) => {

    for (cmd of cmds)
        client.on(Events.InteractionCreate, (...args) => cmd.execute(...args));

    const rest = new REST().setToken(DISCORD_BOT_TOKEN);
    
    try {

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes[global ? 'applicationCommands' : 'applicationGuildCommands'](clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

    } catch (error) {

        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}

regEvents( parseJSFiles(path.join(__dirname, 'events')) );
regCommands( parseJSFiles(path.join(__dirname, 'commands')) );
client.login(DISCORD_BOT_TOKEN);


