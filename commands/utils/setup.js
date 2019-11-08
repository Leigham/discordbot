const fse = require('fs-extra');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'setup',
	description: 'sets up the server environment',
	async execute(message, args) {
		const setupSteps = ['adminrole'];

		if (args.length === 0) {
			// -- check if the setup has already been started.
			fse.pathExists(`./data/${message.guild.id}/config.json`, async (err, exists) => {
				if (err) return console.error;

				if (exists) {
					await message.reply('It seems like the setup has already been started on this server, please type `!setup continue` to continue the setup!')
						.then(msg => setTimeout(() => msg.delete(), 5000))
						.catch(console.error);
					return;
				}

				const tmp = await message.reply('Please wait while I get things ready');
				const tmpConfig = {
					id: message.guild.id,
					name: message.guild.name,
					adminroles: [],
					serverroles: [],
					blacklist_users: [],
					blacklist_roles: [],
				};

				fse.outputJSON(`./data/${message.guild.id}/config.json`, tmpConfig, async function(err) {
					if (err) {
						return console.log(err);
					}
					console.log('File saved successfully!');
				});

				const embed = new MessageEmbed()
					.setColor(0xff00ff)
					.addField('Server Name', message.guild.name)
					.addField('Server ID', message.guild.id)
					.addField('Member Count', message.guild.members.size)
					.addField('Admin Role', 'admin')
					.setTimestamp();

				tmp.delete();
				await message.channel.send(embed);
			});
		}
		else if (!setupSteps.includes(args[0])) {
			message.channel.send('That options is not in the setup parameters!')
				.then(msg => setTimeout(() => msg.delete(), 5000))
				.catch(console.error);
			return;
		}
		message.delete();
	},
};
