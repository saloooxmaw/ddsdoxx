const player = require("../../client/player");

module.exports = {
    name: "queue",
    description: "Display the queue of the current tracks in the playlist.",
    aliases: ['انتظار'],
    async execute(client, message, args) {
        try {
          
            if (!message.member.voice.channel) return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })

            if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

            const queue = player.getQueue(message.guild.id);
            if (!queue || !queue?.playing) return message.reply({ content: ":no_entry_sign: **There must be music playing to use that!**" })

            const currentTrack = queue.current;
            const tracks = queue.tracks.slice(0, 10).map((m, i) => {
                return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag
                    }`;
            });

            return message.reply({
                embeds: [
                    {
                        title: "Song Queue",
                        description: `${tracks.join("\n")}${queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1
                                ? `${queue.tracks.length - tracks.length
                                } more track`
                                : `${queue.tracks.length - tracks.length
                                } more tracks`
                            }`
                            : ""
                            }`,
                        color: 0x2f3136,
                        fields: [
                            {
                                name: "Now Playing",
                                value: `:notes: | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            console.log(err)
        }
    },
};
