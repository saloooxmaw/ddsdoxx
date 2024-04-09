const player = require("../../client/player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "Shuffle the queue.",
    async execute(client, message) {
        try {
        if (!message.member.voice.channel)

            return message.reply({
                content: ":no_entry_sign: **You must join a voice channel to use that!**"})

        if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

        const queue = player.getQueue(message.guild.id);
          
        if (!queue || !queue?.playing)
            return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" });

         if (!queue.tracks[0]) return message.reply({ content: `:no_entry_sign: **No music in the queue after the current one**`, ephemeral: true });
          
            await queue.shuffle();
        message.reply({ content: ':notes: **Queue has been shuffled!**' });
          
        } catch (err) {
            console.log(err)
        }
    },
};