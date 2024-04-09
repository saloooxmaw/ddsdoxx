const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    name: "repeat",
    description: "Toggles the repeat mode.",
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });

            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

            const queue = player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing)
                return interaction.reply({ content: ":no_entry_sign: **There must be music playing to use that!**", ephemeral: true });

            if (queue.repeatMode == 0) {
                queue.setRepeatMode(1);
                interaction.reply({ content: ":notes: Repeat Mode: **ON**" });
            } else {
                queue.setRepeatMode(0);
                interaction.reply({ content: ":notes: Repeat Mode: **OFF**" });
            }
        } catch (err) {
            console.log(err)
        }
    },
};
