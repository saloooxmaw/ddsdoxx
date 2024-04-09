const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')
const ms = require("ms");
const db = require('quick.db')

module.exports = {
    name: "seek",
    description: "Seeks to a certain point in the current track.",
    options: [{
        name: "position",
        description: "The position you want to seek to.",
        type: 3,
        required: true
    }],
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });

            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

            const queue = player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({ content: ":no_entry_sign: **There must be music playing to use that!**", ephemeral: true })

            const positionTrack = interaction.options.getString("position");
            if (!positionTrack) return interaction.reply({ content: `:rolling_eyes: - Example **\`/seek 1m\`**`, ephemeral: true })

            if (positionTrack >= queue.current.durationMS) return interaction.reply({ content:`:rolling_eyes: **The indicated time is higher than the total time of the current song** \`[${queue.createProgressBar().split(' ')[0]}/${queue.createProgressBar().split(' ')[4]}]\``, ephemeral: true });

            await queue.seek(positionTrack * 1000 * 60);
          
            interaction.reply({ content: `:notes: **Seeked to ${positionTrack}minute** ` })

        } catch (err) {
            console.log(err)
        }
    },
};