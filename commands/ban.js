// File : ban.js
// Description : Commande pour bannir un utilisateur du serveur Discord avec notification OQTF.

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('[ADMIN] Bannir un utilisateur')
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur à bannir")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("raison")
                .setDescription("Raison du bannissement")
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("utilisateur");
        const reason = interaction.options.getString("raison") || "Aucune raison spécifiée";
        const memberToBan = interaction.guild.members.cache.get(user.id);

        // Vérification si l'utilisateur exécutant la commande a la permission de bannir ou le rôle admin
        const executor = await interaction.guild.members.fetch(interaction.member.id);
        if (!executor.permissions.has('BanMembers') && !executor.roles.cache.has(adminRoleId)) {
            return await interaction.reply({ content: "<:cross:1333886924766838824> Vous n'avez pas la permission de faire cela.", flags: 64 });
        }

        // Vérification si le membre à bannir existe
        if (!memberToBan) {
            return await interaction.reply({ content: "<:cross:1333886924766838824> L'utilisateur n'est pas dans le serveur.", flags: 64 });
        }

        // Vérifier si la personne qui utilise la commande peut bannir cet utilisateur
        if (memberToBan.roles.highest.position >= executor.roles.highest.position) {
            return await interaction.reply({ content: "<:cross:1333886924766838824> Vous ne pouvez pas bannir cet utilisateur.", flags: 64 });
        }

        // Création de l'embed pour le bannissement
        const embed = new EmbedBuilder()
            .setTitle("Bannissement et Notification OQTF")
            .setDescription(`L'utilisateur ${user.tag} a été banni pour la raison : ${reason}`)
            .setColor(process.env.COLOR_ERROR)
            .setTimestamp()
            .setFooter({ text: `Bannissement effectué par ${interaction.member.user.tag}` })
            .addFields({
                name: "Notification d'une Obligation de Quitter le Territoire Français (OQTF)",
                value: `Madame, Monsieur, <@${user.id}>,\n\nConformément à la législation en vigueur relative au séjour des étrangers en France, il a été décidé de vous notifier une Obligation de Quitter le Territoire Français (OQTF), conformément à l'article L. 511-1 du Code de l'entrée et du séjour des étrangers et du droit d'asile.\n\nVous disposez d'un délai de 30 jours à compter de cette notification pour quitter volontairement le territoire français. Passé ce délai, des mesures d'éloignement pourront être prises.`
            });

        // Envoyer l'embed en privé à l'utilisateur avant de le bannir
        try {
            await user.send({ embeds: [embed] });
        } catch (error) {
            if (error.code === 50007) {
                console.warn(`Impossible d'envoyer un DM à ${user.tag}. L'utilisateur a désactivé les messages privés.`);
            } else {
                console.error(`Erreur lors de l'envoi du message privé:`, error);
            }
        }

        // Bannir l'utilisateur
        try {
            await interaction.guild.members.ban(user, { reason: reason });
        } catch (error) {
            console.error(`Erreur lors du bannissement:`, error);
            return await interaction.reply({ content: "<:cross:1333886924766838824> Une erreur est survenue lors du bannissement.", flags: 64 });
        }

        // Confirmation du bannissement
        await interaction.reply({ embeds: [embed] });
        console.log(`⚡ | L'utilisateur ${interaction.user.username} a utilisé la commande /ban\n 🙎 | Utilisateur banni : ${user.username}\n 👮 | Autheur de la sanction : ${interaction.member.user.username}\n 💬 | Raison : ${reason}\n`);
    },
};
