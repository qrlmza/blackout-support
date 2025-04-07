// File: ping.js
// Description : Commande ping pour vérifier la latence du bot Discord.

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Observer la latence de l\'application'),
    async execute(interaction) {
        const sentMessage = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const ping = sentMessage.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`\`🛰️\` La latence de l'application est de **\`${ping}\`** ms.`);
        console.log(`⚡ | L'utilisateur ${interaction.user.username} à utilisé la commande /${interaction.commandName}`)
    },
};