const Discord = require('discord.js');
const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER'],
});
const config = require('./auth.json');
const { setupCommands } = require('./functions/utils.js');
client.commands = new Discord.Collection();
const prefix = config.prefix;
const fse = require('fs-extra');


client.on('ready', () => {
	fse.readJSON('data/global_conf.json')
		.then(res => {
			client.guilds.forEach(element => {
				const ind = res.banned_servers[element.id];
				if (!ind) {
					console.log('No Banned Servers');
				}
				else {
					element.leave()
						.then(console.log(`Client Left ${element.name}`))
						.catch(console.error);
				}
			});
		}).catch(console.error);

	setupCommands(['utils', 'music'], client);
	console.log(`Logged in as ${client.user.tag}!`);
	client.generateInvite('ADMINISTRATOR').then(console.log).catch(console.error);
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const guildID = message.guild.id;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	fse.readFile(`./data/servers/${guildID}/config.json`, async (err) => {
		if (err && command !== 'setup') {
			message.delete();
			message.channel.send('Your server does not seem to have been setup, please run `!setup` to complete the setup')
				.then(msg => setTimeout(() => msg.delete(), 5000))
				.catch(console.error);
			return;
		}

		if (!client.commands.has(command)) return;

		try {
			await client.commands.get(command).execute(message, args, client);
			message.delete();
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	});
});

client.login(config.discord_token).catch(error => console.error(error.code));
