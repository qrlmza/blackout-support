// File: clear.js
// Description : Commande pour nettoyer un salon textuel de ses messages, réservée aux administrateurs.

const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('[ADMIN] Nettoyer le salon textuel de ses messages')
        .addIntegerOption(option =>
            option
                .setName("nombre")
                .setDescription("Choisissez le nombre de messages à supprimer")
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(99)
        ),
    async execute(interaction) {
        const nbMessages = interaction.options.getInteger("nombre");

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ 
                content: '<:peepotux:1290251108706553876> Tu n\'as pas la permission d\'utiliser cette commande.',
                flags: 64
            });
        }

        try {
            // Différer la réponse et attendre qu'elle soit effectuée
            await interaction.deferReply({ ephemeral: true });
            
            // Récupérer les messages et les supprimer
            const messages = await interaction.channel.messages.fetch({ limit: nbMessages });
            await interaction.channel.bulkDelete(messages, true);
            
            console.log(`✅ | ${messages.size} messages supprimés dans le salon ${interaction.channel.name} par ${interaction.user.username}`);
            
            await interaction.editReply({ 
                content: `<:MrClean:1358733066012594176> ${messages.size} messages supprimés !`
            });
            
        } catch (error) {
            console.error("❎ | Une erreur est survenue lors du nettoyage du salon : ", error);
            
            if (error.code === 50034) {
                await interaction.editReply({ 
                    content: '<:peepotux:1290251108706553876> Je ne peux pas supprimer des messages datant de plus de 14 jours.'
                });
            } else {
                await interaction.editReply({ 
                    content: '<:peepotux:1290251108706553876> Une erreur est survenue lors de la suppression des messages.'
                });
            }
        }

        console.log(`⚡ | L'utilisateur ${interaction.user.username} a utilisé la commande /${interaction.commandName}`);
    },
};