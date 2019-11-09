const fs = require('fs');
const fse = require('fs-extra');

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
	updateServerData: async function(serverid, toUpdate) {
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
						return;
					}
					switch (typeof json[key]) {
					case 'string':
						json[key] = toUpdate[key];
						break;
					case 'object':

						if (Array.isArray(toUpdate[key])) {
							toUpdate[key].forEach((element) => {
								if (!json[key].includes(element)) {
									json[key].push(element);
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
			fse.writeJSONSync(filePath, json, function(res, err) {
				console.log(res);
				console.log(err);
			});
		}
	},
};
