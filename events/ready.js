const { ActivityType } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const { prefix } = require('../config.json');
const { joinVoiceChannel } = require('@discordjs/voice');
const player = require("../client/player");

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log((`Logged in as ${client.user.tag}`).red);
    console.log((`Servers: ${client.guilds.cache.size}`).magenta, (`Users: ${client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString()}`).yellow, (`Commands: ${client.commands.size}`).green);
    client.user.setStatus("idle")
    client.user.setActivity(`${prefix}help | /help`, { type: ActivityType.Listening })
    
    setInterval(async () => {
      client.guilds.cache.forEach(async g => {
        let vch = await db.get(`24_7_${g.id}`)
        if (vch == null) return
        let [gu, ch, tr] = vch
        if (tr == true) {
          let GU = client.guilds.cache.get(gu);
          let CH = client.channels.cache.get(ch);
        const queue = player.createQueue(GU, {
            leaveOnEnd: false,
		        leaveOnStop: false,
            channelEmpty: false,
            spotifyBridge: true,
            initialVolume: 75
          });
    if (!queue.connection) queue.connect(CH).catch(() => {
    if (CH == null) return db.delete(`24_7_${g.id}`)
          })
        }
      })
    }, 1000)
  }
};