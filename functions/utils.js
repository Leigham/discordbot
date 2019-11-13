const fs = require('fs');
const fse = require('fs-extra');
const { MessageEmbed } = require('discord.js');

function containsObject(obj, list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == obj.id) {
			return true;
		}
	}

	return false;
}

module.exports = {

	setupCommands: function(data, client) {
		// -- Root Commands First.
		for (const file of (fs.readdirSync('./commands').filter(f => f.endsWith('.js')))) {
			const command = require(`../commands/${file}`);
			client.commands.set(command.name, command);
		}
		data.forEach(element => {
			for (const file of (fs.readdirSync(`./commands/${element}`).filter(f => f.endsWith('.js')))) {
				const command = require(`../commands/${element}/${file}`);
				client.commands.set(command.name, command);
			}
		});
	},

	// -- Pass through the server id, and an array of index's to update.
	updateServerData: async function(serverid, toUpdate, message) {
		console.log(`ServerID : ${serverid}, Data To Update : ${toUpdate}`);
		// check if the file exists
		const filePath = `data/${serverid}/config.json`;
		const pathExists = await (fse.existsSync(filePath));
		if (pathExists) {

			const json = await fse.readJSON(filePath);
			for (const key in toUpdate) {
				if (!json[key]) {
					json[key] = toUpdate[key];
				}
				else {

					if (typeof json[key] !== typeof toUpdate[key]) {
						console.log(`Mismatch of data types (${typeof json[key]}/${typeof toUpdate[key]})`);
						return false;
					}
					switch (typeof json[key]) {
					case 'string':
						json[key] = toUpdate[key];
						break;
					case 'object':

						if (Array.isArray(toUpdate[key])) {
							toUpdate[key].forEach((element) => {
								if (!json[key].includes(element) && !containsObject(element, json[key])) {
									json[key].push(element);
								}
								else {
									console.log('test');
									return false;
								}
							});
						}
						else {
							console.log('temp');
						}

						break;
					case 'number':
						json[key] = toUpdate[key];
						break;
					default:
						console.log(`Missing Type Entry ${typeof json[key]}`);
						break;
					}
				}
			}
			console.log('test');
			fse.writeJSONSync(filePath, json, function(err) {
				if (err) {
					console.error(err);
					return false;
				}
			});
			return true;
		}
		else {
			message.channel.send('There was an error');
		}
	},
	fetchServerEmbed : async function(guild) {
		const json = await fse.readJSONSync(`./data/${guild.id}/config.json`, { throws : false });

		if (!json) return json;
		const embed = new MessageEmbed()
			.setColor(0xff00ff);


		for (const key in json) {
			let str = json[key].toString();
			if (str === '') {
				str = 'None';
			}
			embed.addField(key, str, true);
		}
		embed.setFooter('React with 🗄 to delete the message');
		return embed;
	},
};
