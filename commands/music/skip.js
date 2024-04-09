const player = require("../../client/player");

module.exports = {
    name: "skip",
    description: "Skip the current song.",
    aliases: ['s', 'التالي', 'تخطي'],
    async execute(client, message, args) {
        try {
          
        if (!message.member.voice.channel) return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })

        if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });


        const queue = player.getQueue(message.guild.id);
              if (!queue || !queue?.playing) return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" })

        queue.skip()
          
        message.reply({ content: `:notes: Skipped **${queue.current.title}**` })
          
        } catch (err) {
            console.log(err)
        }
    },
};
