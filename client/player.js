const { Player } = require("discord-player");
const client = require("../index.js");
const { Utils } = require("devtools-ts");
const utilites = new Utils();


const player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25,
		requestOptions: {
			headers: {
				cookie: "YOUR_YOUTUBE_COOKIE"
			}
		}
	},
});

player.on("error", (queue, error) => {
	utilites.logger(`${queue.guild.name} An Error has occurred ${error}`, "error");
});

player.on('connectionError', (queue, error) => {
	utilites.logger(`Error emitted from the connection ${error.message}`);
});

player.on("botDisconnect", (queue) => {
	utilites.logger(`${queue.guild.name} Disconnected from Channel`);
});

player.on("connectionCreate", (queue, connection) => {
	utilites.logger(
		`${queue.guild.name}: Bot has successfully connected to Voice Channel!`
	);
});

player.on("connectionError", (queue, error) => {
	utilites.logger(
		`${queue.guild.name}: There has been a connection error, ${error.message}`
	);
});

player.on("queueEnd", (queue) => {
	utilites.logger(`${queue.guild.name}: Queue has finished playing!`);
});

player.on("trackAdd", (queue, track) => {
	utilites.logger(`${queue.guild.name}: ${track.title} has been added!`);
});

player.on("trackEnd", (queue, track) => {
	utilites.logger(
		`${queue.guild.name}: ${track.title} has finished playing!`
	);
});

player.on("tracksAdd", (queue, tracks) => {
	utilites.logger(
		`${queue.guild.name}: A playlist with ${tracks.length} songs has beed added!`
	);
});

player.on("trackStart", (queue, track) => {
	utilites.logger(`${queue.guild.name}: ${track.title} has started playing`);
});


module.exports = player;
