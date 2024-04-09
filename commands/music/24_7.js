const { QueryType } = require("discord-player");
const player = require("../../client/player");
const db = require('quick.db');

module.exports = {
    name: "24/7",
    description: "Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it.",
    aliases: ["247", "24_7", "24-7"],
    async execute(client, message, args) {
        try {
            let vo = message.member.voice.channel
            if (!vo) return message.reply({
                content: ":no_entry_sign: **You must join a voice channel to use that!**"
            })
            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });
            let voice = vo.id
            let GU = client.guilds.cache.get(message.guild.id);
            let CH = client.channels.cache.get(voice);
    const queue = await player.createQueue(GU, {
            leaveOnEnd: false,
		        leaveOnStop: false,
            channelEmpty: false,
            spotifyBridge: true,
            initialVolume: 75,
              metadata: {
                channel: message.channel,
                voice: message.member.voice.channel
                }
          });
            try {
                if (!queue.connection) queue.connect(CH);
            } catch {
                queue.destroy();
                return console.log({ content: "**Couldn't join your voice channel!**" })
            }
            if (!db.get(`24_7_${message.guild.id}`)) {
                await db.set(`24_7_${message.guild.id}`, [message.guild.id, voice, true])
                message.reply({ content: `:white_check_mark: **Successful enabled the 24/7!**` })
            } else {
                await db.delete(`24_7_${message.guild.id}`)
                message.reply(`:white_check_mark: **Successful disabled the 24/7!**`)
            }
        } catch (err) {
            console.log(err)
        }
    },
};
