const { QueryType } = require("discord-player");
const player = require("../../client/player");
const db = require('quick.db');

module.exports = {
    name: "247",
    description: "Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it.",
    async execute(client, interaction, args) {
      
        let vo = interaction.member.voice.channel
        if (!vo) return interaction.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**", ephemeral: true })
      
        if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) return interaction.reply({ content: `:no_entry_sign: You must be listening in <#${interaction.guild.members.me?.voice?.channelId}> to use that!`, ephemeral: true });
        let voice = vo.id
        let GU = client.guilds.cache.get(interaction.guild.id);
        let CH = client.channels.cache.get(voice);  
    const queue = await player.createQueue(GU, {
            leaveOnEnd: false,
		    eaveOnStop: false,
            channelEmpty: true,
            spotifyBridge: true,
            initialVolume: 75,
                    metadata: {
                channel: interaction.channel,
                voice: interaction.member.voice.channel
                }
          });
      
        try {
            if (!queue.connection) queue.connect(CH);
        } catch {
            queue.destroy();
            return console.log({ content: "**Couldn't join your voice channel!**", ephemeral: true })
        }
      
        if (!db.get(`24_7_${interaction.guild.id}`)) {
            await db.set(`24_7_${interaction.guild.id}`, [interaction.guild.id, voice, true])
            interaction.reply({ content: `:white_check_mark: **Successful enabled the 24/7!**` })
        } else {
            await db.delete(`24_7_${interaction.guild.id}`)
            interaction.reply(`:white_check_mark: **Successful disabled the 24/7!**`)
        }
    },
};
