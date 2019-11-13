const fse = require('fs-extra');

module.exports = {
	name: 'setup',
	description: 'sets up the server environment',
	async execute(message) {

		const global_config = await fse.readJSONSync('./data/global_conf.json');
		console.log(global_config);
		message.delete();
		// Not used anymore
	},
};
