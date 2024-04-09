const { QueryType } = require("discord-player");
const player = require("../../client/player");
const { EmbedBuilder, CommandInteraction } = require('discord.js')

module.exports = {
    name: "queue",
    description: "Display the queue of the current tracks in the playlist.",
    async execute(client, interaction) {
        try {
            if (!interaction.member.voice.channel) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true });
          
            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });
          
            const queue = player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing)
                return interaction.reply({ content: ":no_entry_sign: **There must be music playing to use that!**", ephemeral: true });

            const currentTrack = queue.current;
            const tracks = queue.tracks.slice(0, 10).map((m, i) => {
                return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag
                    }`;
            });

            return interaction.reply({
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
