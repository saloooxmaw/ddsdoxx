const player = require("../../client/player");

module.exports = {
    name: "nowplaying",
    description: "Shows what is song that the bot is currently playing.",
    aliases: ['الان', 'np'],
    async execute(client, message, args) {
        try {
          
            if (!message.member.voice.channel) return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" });
          
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });
          
            const queue = player.getQueue(message.guild.id);
          
            if (!queue || !queue?.playing) return message.reply({ content: ":x: **bot is not currently playing**" })

            return message.reply({
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
