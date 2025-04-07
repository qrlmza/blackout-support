// File: index.js
// Description : Fichier principal pour le bot Discord, initialise le client et charge les gestionnaires.

const Discord = require('discord.js');
const readyHandler = require('./modules/readyHandler.js');
const commandHandler = require('./modules/commandHandler.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Discord.Collection();

// Charger les handlers
readyHandler(client);
commandHandler(client);

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);
