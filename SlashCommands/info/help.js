const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../config.json');


module.exports = {
    name: "help",
    description: 'Feeling lost?',
    async execute(client, interaction) {
        const globPromise = promisify(glob);
        const commandFiles = await globPromise(`${process.cwd()}/SlashCommands/music/**/*.js`);
        
        let embed = new EmbedBuilder()

            .setColor('2f3136')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))

        commandFiles.map((value) => {
            const file = require(value);
            const splitted = value.split("/");
            const directory = splitted[splitted.length - 2];

            if (file.name) {
                const properties = { directory, ...file };
                embed.addFields({ name: `/${properties.name}`, value: `${properties.description}`, inline: false })
            }
        });

        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('1127514909589110854')
                    .setLabel('Invite Bot')
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))

        interaction.reply({ embeds: [embed], components: [row], content: `:notes: **Commands: [ ${client.commands.size} ]**`, ephemeral: true })
    },
};