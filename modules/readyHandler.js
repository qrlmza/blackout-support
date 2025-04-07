// File: readyHandler.js
// Description : Gère l'événement 'ready' du client Discord, qui est déclenché lorsque le bot est prêt.

const Discord = require('discord.js');
const { Activitype } = Discord;

const ReadyHandler = (client) => {
    client.once('ready', () => {
        client.user.setActivity('Ses voisins prendre leur douche',  { type: 'WATCHING' });

        console.log(`🚩 | Connecté en tant que ${client.user.username}`)
    });
};

module.exports = ReadyHandler;