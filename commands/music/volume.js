const player = require("../../client/player");

module.exports = {
    name: "volume",
    description: "Changes/Shows the current volume.",
    aliases: ['vol'],
    async execute(client, message, args) {
        try {
          
        if (!message.member.voice.channel) return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })

        if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

        const volumePercentage = args[0]
        const queue = player.getQueue(message.guild.id);
            if (!queue || !queue?.playing) return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" })

        if (!volumePercentage)
            return message.reply({ content: `:loud_sound: **Volume: \`${queue.volume}\`**` });

        if (volumePercentage < 0 || volumePercentage > 150 || isNaN(volumePercentage))
            return message.reply({ content: ":no_entry_sign: **Volume must be a valid integer between 0 and 150!**" })


        message.reply({ content: `:loud_sound: **Volume changed from \`${queue.volume}\` to \`${volumePercentage}\`**` })
        queue.setVolume(volumePercentage);
        } catch (err) {
            console.log(err)
        }
    },
};
