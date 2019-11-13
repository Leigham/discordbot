// const { MessageEmbed } = require('discord.js');
const fse = require('fs-extra');

module.exports = {
	name: 'checkperms',
	description: 'Checks the perms of a user, or role',
	adminfunction : true,
	async execute(message, args, client) {


		const mentions = message.mentions;
		console.log(mentions.roles.size);
		console.log(mentions.users.size);

		if (mentions.users.size === 0 && mentions.roles.size === 0) return message.channel.send('You must mention roles / users to check permissions!');

		// Get Role Perms
		console.log(client.commands);

		// Server Config

		try {
			const config = await fse.readJSONSync(`./data/servers/${message.guild.id}/config.json`);
			const rolePerms = config.roleperms;
			const userPerms = config.userperms;


			console.log(`Roleperms : ${rolePerms} || UserPerms : ${userPerms}`);

			// -- Loop all server command, and see if the user / roles are whitelisted.
		}
		catch(err) {
			console.error(err);
		}


	},
};
