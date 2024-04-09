const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')
const ms = require("ms");
const db = require('quick.db')

module.exports = {
    name: "search",
    description: "Searches for results to play.",
    options: [{
        name: "term",
        description: "Song to search for",
        type: 3,
        required: true
    }],

    /**
     *
     * @param {Client} client
     * @param {Message<boolean> | null} message
     * @param {string[] | null} args
     */

    async execute(client, interaction, args) {
        try {
            let memberVoiceChannel = interaction.member.voice?.channel;

            const songName = interaction.options.getString("term");

            if (!memberVoiceChannel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });

            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });

            if (!songName)
                return interaction.reply({
                    content: ":no_entry_sign: **Please include a query.**", ephemeral: true
                }).catch((err) => {
                    console.log(`i couldn't reply to the message: ` + err.message)
                });
            interaction.reply({
                content: `:watch: Searching ... (\`${songName}\`)`
            }).then(async (m) => {
                try {

                    let res = await player.search(songName, {
                        requestedBy: interaction.member,
                        searchEngine: QueryType.AUTO
                    });

  const queue = await player.createQueue(interaction.guild, {
            leaveOnEnd: false,
		        leaveOnStop: false,
            channelEmpty: false,
            spotifyBridge: true,
            initialVolume: 75,
                    metadata: {
                channel: interaction.channel,
                voice: interaction.member.voice.channel
                }
          });

                    setTimeout(async () => {
                        await interaction.editReply({
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
                            interaction.id
                        ).then(async (d) => {
                            await d.react("1️⃣");
                            await d.react("2️⃣");
                            await d.react("3️⃣");
                            await d.react("4️⃣");
                            await d.react("5️⃣");
                            await d.react("❌");
                            interaction.channel.messages.cache.get(d.id)
                                .createReactionCollector({
                                    filter: (args_0, args_1) => args_1.id == interaction.user.id,
                                    max: 1,
                                    time: 1000 * 60 * 60 * 24,
                                }).on("collect", async (reaction, user) => {
                                    console.log(reaction.emoji.name)
                                    if (reaction.emoji.name == "❌") {
                                        await interaction.channel.messages.cache.get(d?.id)?.delete();
                                    } else {
                                        await playMusic(
                                            await trunEmojiToNum(reaction.emoji.name),
                                            player,
                                            d,
                                            res,
                                            queue,
                                            interaction
                                        );
                                    }
                                });


                            interaction.channel
                                .createMessageCollector({
                                    filter: (args_0) =>
                                        [1, 2, 3, 4, 5].includes(Number(args_0.content)) &&
                                        args_0.author.id == interaction.author.id,
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

async function playMusic(index, player, m, res, queue, interaction) {
    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
        queue.destroy();
        return await interaction.reply({ content: "**Couldn't join your voice channel!**", ephemeral: true }).catch((err) => {
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
            requestedBy: interaction.author,
            searchEngine: QueryType.AUTO,
        });
        if (!searchResult.tracks.length) return;
        searchResult.playlist
            ? queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play() || queue.setVolume(100);
    })
}