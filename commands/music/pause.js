const player = require("../../client/player");
const { prefix } = require('../../config.json');

module.exports = {
    name: "pause",
    description: "Pauses the currently playing track.",
    async execute(client, message, args) {
        try {
            if (!message.member.voice.channel)
                return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

            const queue = player.getQueue(message.guild.id);
            if (!queue || !queue?.playing) return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" })
          
            queue.setPaused(true);
          
          return message.reply({ content: `:notes: Paused **${queue.current.title}**. Type \`${prefix}resume\` to unpause!` })
        } catch (err) {
            console.log(err)
        }
    },
};
