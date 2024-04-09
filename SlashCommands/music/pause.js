const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    name: "pause",
    description: "Pauses the currently playing track.",
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });

            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

            const queue = player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing)
                return interaction.reply({ content: ":no_entry_sign: **There must be music playing to use that!**", ephemeral: true });

            queue.setPaused(true);

            return interaction.reply({ content: `:notes: Paused **${queue.current.title}**. Type \`/resume\` to unpause!` });
        } catch (err) {
            console.log(err)
        }
    },
};
