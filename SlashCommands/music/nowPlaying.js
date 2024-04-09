const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    name: "now_playing",
    description: "Shows what is song that the bot is currently playing.",
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });
            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

            const queue = player.getQueue(interaction.guild.id);
            if (!queue || !queue?.playing) return interaction.reply({ content: ":x: **bot is not currently playing**", ephemeral: true });

            return interaction.reply({
                embeds: [
                    {
                        title: `${queue.current.title}`,
                        description: `:arrow_forward: ${queue.createProgressBar().split(' ')[2]}\`[${queue.createProgressBar().split(' ')[0]}/${queue.createProgressBar().split(' ')[4]}]\``,
                        color: 0x2f3136
                    }
                ]
            })
        } catch (err) {
            console.log(err)
        }
    },
};
