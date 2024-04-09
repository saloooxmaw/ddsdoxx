const { Message, Client } = require("discord.js");
const player = require("../../client/player");
const { QueryType } = require("discord-player")
const ms = require("ms");
const db = require('quick.db')

module.exports = {
    name: "search",
    description: "Searches for results to play.",
    aliases: ['se', 'بحث'],

    /**
     *
     * @param {Client} client
     * @param {Message<boolean> | null} message
     * @param {string[] | null} args
     */

    async execute(client, message, args) {
        try {

            let memberVoiceChannel = message.member.voice?.channel;
            let songName = args.join(" ");
            if (!memberVoiceChannel) return message.reply({
                    content: ":no_entry_sign: **You must join a voice channel to use that!**"})

                if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

            if (!songName)
                return message.reply({
                    content: ":no_entry_sign: **Please include a query.**"})

            message.reply({
                content: `:watch: Searching ... (\`${songName}\`)`
            }).then(async (m) => {
                try {
                    let res = await player.search(songName, {
                        requestedBy: message.member,
                        searchEngine: QueryType.AUTO
                    });

    const queue = await player.createQueue(message.guild, {
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

                    setTimeout(async () => {
                        await m.edit({
                            embeds: [
                                {
                                    description: res.tracks
                                        .map(
                                            (track, index) =>
                                                `${trunNumToEmoji(index)}\`${track.duration}\` | **${track.title}**`
                                        )
                                        .slice(0, 5)
                                        .join("\n"),
                                    color: 0x2f3136
                                },
                            ],
                        },
                            m.id
                        ).then(async (d) => {
                            await d.react("1️⃣");
                            await d.react("2️⃣");
                            await d.react("3️⃣");
                            await d.react("4️⃣");
                            await d.react("5️⃣");
                            await d.react("❌");
                            message.channel.messages.cache
                                .get(d.id)
                                .createReactionCollector({
                                    filter: (args_0, args_1) => args_1.id == message.author.id,
                                    max: 1,
                                    time: 1000 * 60 * 60 * 24,
                                }).on("collect", async (reaction, user) => {
                                    console.log(reaction.emoji.name)
                                    if (reaction.emoji.name == "❌") {
                                        await message.channel.messages.cache.get(d?.id)?.delete();
                                    } else {
                                        await playMusic(
                                            await trunEmojiToNum(reaction.emoji.name),
                                            player,
                                            d,
                                            res,
                                            queue,
                                            message
                                        );
                                    }
                                });

                            message.channel
                                .createMessageCollector({
                                    filter: (args_0) =>
                                        [1, 2, 3, 4, 5].includes(Number(args_0.content)) &&
                                        args_0.author.id == message.author.id,
                                    max: 1,
                                    time: 1000 * 60 * 60 * 24,
                                }).on("collect", async (msgg) => {
                                    await playMusic(
                                        Number(msgg.content),
                                        player,
                                        d,
                                        res,
                                        queue,
                                        message
                                    );
                                });
                        });
                    }, 1800)
                } catch (err) {
                    m.edit({
                        embeds: [
                            {
                                color: "RED",
                                description: `**there was an error while searching**: \`\`\`\n${err.message}\`\`\``,
                            },
                        ],
                    },
                        m.id
                    );
                }
            });

            const s = (time) => {
                if (time == 1) {
                    return "01";
                } else if (time == 2) {
                    return "02";
                } else if (time == 3) {
                    return "03";
                } else if (time == 4) {
                    return "04";
                } else if (time == 5) {
                    return "05";
                } else if (time == 6) {
                    return "06";
                } else if (time == 7) {
                    return "07";
                } else if (time == 8) {
                    return "08";
                } else if (time == 9) {
                    return "09";
                } else if (time == 0) {
                    return "00";
                } else return time;
            };

            const trunNumToEmoji = (index) => {
                if (index == 0) return "1️⃣";
                else if (index == 1) return "2️⃣";
                else if (index == 2) return "3️⃣";
                else if (index == 3) return "4️⃣";
                else if (index == 4) return "5️⃣";
                else return "6️⃣";
            };

            const trunEmojiToNum = (index) => {
                if (index == "1️⃣") return 0;
                else if (index == "2️⃣") return 1;
                else if (index == "3️⃣") return 2;
                else if (index == "4️⃣") return 3;
                else if (index == "5️⃣") return 4;
                else return 5;
            };
        } catch (err) {
            console.log(err)
        }
    },
};

/**
 *
 * @param {number} index
 * @param {Player} player
 * @param {Message} m
 */

async function playMusic(index, player, m, res, queue, message) {
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
        queue.destroy();
        return await message.reply({ content: "**Couldn't join your voice channel!**" }).catch((err) => {
            console.log(`i couldn't reply to the message: ` + err.message)
        })
    }
    m.reactions.removeAll();
    m.edit({
        content: `:notes: **${res.tracks[index].title
            }** Added to **ProQueue** (\`${res.tracks[index]}\`)!`,
        embeds: [],
    }
    ).then(async m => {
        const searchResult = await player.search(res.tracks[index], {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO,
        });
        if (!searchResult.tracks.length) return;
        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play();
    })
}