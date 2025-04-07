// File: commandHandler.js
// Description : Gère l'enregistrement et l'exécution des commandes du bot Discord.

const Discord = require('discord.js');
const { REST, Routes } = Discord;
const path = require('path');
const fs = require('fs');

const commandHandler = async (client) => {
    const commands = [];

    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log(`🔌 | Démarrage de l'enregistrement des commandes de l'application...`);

        await rest.put(Routes.applicationCommands(process.env.APP_ID), {
            body: commands,
        });

        console.log(`🔌 | Commandes d'application enregistrées !`);
    } catch (error) {
        console.error(error);
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Il y a eu une erreur lors de l\'exécution de cette commande !', flags: 64 });
        }
    });
};

module.exports = commandHandler;