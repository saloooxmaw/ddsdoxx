const { Message, Client } = require("discord.js");
const player = require("../../client/player");
const { prefix } = require('../../config.json');
const ms = require("ms");

module.exports = {
    name: "seek",
    description: "Seeks to a certain point in the current track.",
    aliases: ['تقديم'],

    /**
     *
     * @param {Client} client
     * @param {Message<boolean> | null} message
     * @param {string[] | null} args
     */
    async execute(client, message, args) {

        try {

            let memberVoiceChannel = message.member.voice.channel;

            if (!memberVoiceChannel)
                return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

            const queue = player.getQueue(message.guild.id);
            if (!queue || !queue.playing)
                return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" })

            let position = args.join(" ");
            if (!position) return message.reply({
                content: `:rolling_eyes: - Example **\`${prefix}seek 1\`**`
            })

            if (position >= queue.current.durationMS) return message.reply({ content:`:rolling_eyes: **The indicated time is higher than the total time of the current song** \`[${queue.createProgressBar().split(' ')[0]}/${queue.createProgressBar().split(' ')[4]}]\`` });

            await queue.seek(position * 1000 * 60);
            message.reply({ content: `:notes: **Seeked to ${position}minute** ` })

        } catch (err) {
            console.log(err)
        }
    },
};
