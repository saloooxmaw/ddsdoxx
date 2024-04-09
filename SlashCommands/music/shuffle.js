const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')


module.exports = {
    name: "shuffle",
    description: "Shuffle the queue.",
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true })

            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

    const queue = player.getQueue(interaction.guild.id);
          
            if (!queue || !queue.playing)
                return interaction.reply({ content: ":no_entry_sign: **There must be music playing to use that!**", ephemeral: true });

        if (!queue.tracks[0]) return interaction.reply({ content: `:no_entry_sign: **No music in the queue after the current one**`, ephemeral: true });
          
            await queue.shuffle();
          
            interaction.reply({ content: ':notes: **Queue has been shuffled!**' });
        } catch (err) {
            console.log(err)
        }
    },
};