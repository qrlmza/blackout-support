const { Events } = require('discord.js');
// Description : Fichier principal pour le bot Discord, initialise le client et charge les gestionnaires.
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        // Ignorer si ce n'est pas un bouton
        if (!interaction.isButton()) return;

        try {
            if (interaction.customId === 'close') {
                // Vérifier les permissions
                const isStaff = interaction.member.roles.cache.has('1329039926486106117');
                const isTicketCreator = interaction.channel.name.includes(interaction.user.username);
                
                if (!isStaff && !isTicketCreator) {
                    return await interaction.reply({
                        content: '❌ Vous n\'avez pas la permission de fermer ce ticket.',
                        flags: 64
                    });
                }

                await interaction.deferReply({ ephemeral: true });
                
                await interaction.editReply({
                    content: '🔄 Fermeture du ticket dans 5 secondes...',
                    flags: 64
                });

                // Attendre 5 secondes
                setTimeout(async () => {
                    try {
                        await interaction.channel.delete();
                        console.log(`🎫 Ticket fermé par ${interaction.user.tag}`);
                    } catch (error) {
                        console.error('❌ Erreur lors de la suppression du canal:', error);
                        if (interaction.channel) {
                            await interaction.channel.send('❌ Une erreur est survenue lors de la fermeture du ticket.');
                        }
                    }
                }, 5000);
            }
        } catch (error) {
            console.error('❌ Erreur lors du traitement du bouton:', error);
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: '❌ Une erreur est survenue.',
                        flags: 64
                    });
                } else {
                    await interaction.editReply({
                        content: '❌ Une erreur est survenue.',
                        flags: 64
                    });
                }
            } catch (e) {
                console.error('❌ Erreur lors de la réponse à l\'erreur:', e);
            }
        }
    },
};