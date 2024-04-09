const { QueryType } = require("discord-player");
const player = require("../../client/player");

module.exports = {
    name: "play",
    description: "Add a song to queue and plays it.",
    aliases: ['p', 'ش', 'شغل'],
    async execute(client, message, args) {
      
      try {
        
  if (!message.member.voice.channel) return message.reply({ content: ":no_entry_sign: **You must join a voice channel to use that!**" })
    
        if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) return message.reply({ content: `:no_entry_sign: You must be listening in <#${message.guild.members.me?.voice?.channelId}> to use that!` });

    const songTitle = args.slice(0).join(' ')
          
    const queue = await player.createQueue(message.guild, {
            leaveOnEnd: false,
		        leaveOnStop: false,
            channelEmpty: true,
            spotifyBridge: true,
            initialVolume: 75,
                    metadata: {
                channel: message.channel,
                voice: message.member.voice.channel
                }
          });
          
            try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
            } catch {
                queue.destroy();
      return await message.reply({ content: ":rolling_eyes: **Couldn't join your voice channel!**" })
            }
          
            if (!songTitle)
    return message.reply({ content: `:no_entry_sign: **You should type song name or url.**` })

      message.reply({ content: `:watch: Searching ... (\`${songTitle}\`)` }).then(async m => {
          
    const searchResult = await player.search(songTitle, {
                    requestedBy: message.author,
                   searchEngine: QueryType.AUTO
                });

    if (!searchResult.tracks.length) return m.edit({ content: `:mag: **Not found.**` })
            
m.edit({ content: `:notes: **${searchResult.tracks[0].title}** Added to **Queue** (${searchResult.tracks[0].duration})!` })
          
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);

          if (!queue.playing) await queue.play();
            })
          } catch (err) {
        console.log(err)
       }
    },
};
