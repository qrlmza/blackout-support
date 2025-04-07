// File: support.js
// Description : Commande pour contacter le support Blackout sur Discord.

const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Contacter le support Blackout')
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Type de support solicité")
                .setRequired(true)
                .addChoices(
                    { name: "Support technique", value: "technique" },
                    { name: "Signalement bug / joueur", value: "report" },
                    { name: "Autre", value: "autre" }
                )
        ),
    async execute(interaction) {
        try {
            const type = interaction.options.getString("type");
            const supportCategoryId = '1332071859965001812';

            let typeName;
            if (type === "report") {
                typeName = "signalement";
            } else {
                typeName = "ticket";
            }

            const supportChannel = await interaction.guild.channels.create({
                name: `${typeName}-${interaction.user.username}`,
                type: 0, // 0 correspond à GUILD_TEXT
                parent: supportCategoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AddReactions,
                            PermissionFlagsBits.AttachFiles
                        ],
                    },
                    {
                        id: '1329039926486106117', // ID du rôle staff
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.ManageChannels
                        ],
                    },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle("Support Blackout")
                .setDescription(`Bonjour ${interaction.user.username},\n\nMerci de nous avoir contacté. Un membre de l'équipe de support vous répondra dès que possible.\n\nType de support : ${type}`)
                .setColor(process.env.COLOR_SUCCESS)
                .setTimestamp()
                .setFooter({ text: `Ticket créé par ${interaction.user.username}` });
            
            const closeButton = new ButtonBuilder()
                .setCustomId('close')
                .setLabel('Fermer le ticket')
                .setStyle(ButtonStyle.Danger);
            
            const row = new ActionRowBuilder()
                .addComponents(closeButton);

            await interaction.reply({ 
                content: `Votre ticket a été créé : ${supportChannel}`, 
                flags: 64 
            });
            await supportChannel.send(`<@${interaction.user.id}> - Veuillez patienter pendant que nous examinons votre demande.`);
            await supportChannel.send({ embeds: [embed], components: [row] });

            console.log(`⚡ | L'utilisateur ${interaction.user.username} a utilisé la commande /${interaction.commandName}`);
        } catch (error) {
            console.error('❌ Erreur lors de la création du ticket:', error);
            await interaction.reply({
                content: '❌ Une erreur est survenue lors de la création du ticket.',
                flags: 64
            });
        }
    },
};