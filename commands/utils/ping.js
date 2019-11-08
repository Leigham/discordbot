module.exports = {
	name: 'ping',
	description: 'Ping!',
	async execute(message, args, client) {
		let resp = await message.reply('Pinging....');
		let ping = resp.createdTimestamp - message.createdTimestamp;
		resp.edit(`🏓 \n Bot Latency \`${ping}ms\`  \n API Latency \`${client.ws.ping}ms\``);
	}
}
