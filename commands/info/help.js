const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../config.json');

module.exports = {
    name: "help",
    description: 'Feeling lost?',
    async execute(client, message, args) {
        try {
            const globPromise = promisify(glob);
            const commandFiles = await globPromise(`${process.cwd()}/commands/music/**/*.js`);

            let embed = new EmbedBuilder()

                .setColor('2f3136')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))

            commandFiles.map((value) => {
                const file = require(value);
                const splitted = value.split("/");
                const directory = splitted[splitted.length - 2];

                if (file.name) {
                    const properties = { directory, ...file };
                    embed.addFields({ name: `${prefix}${properties.name}`, value: `${properties.description}`, inline: false })
                }
            });

            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Invite Bot')
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))

                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Server Support')
                        .setURL(`https://discord.gg/developer-tools`))

            message.reply({ embeds: [embed], components: [row], content: `:notes: **Commands: [ ${client.commands.size} ]**` })
        } catch (e) {
            console.log(e.stack ? e.stack : e)
            return message.reply(new EmbedBuilder()
                .setColor(`Red`)
                .setTitle(`${client.user.tag}`)
                .setDescription(`\`\`\`${e}\`\`\``)
            )
        }
    },
};