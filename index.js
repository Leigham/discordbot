const Discord = require('discord.js')
const client = new Discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'USER', 'GUILD_MEMBER']
})
const config = require('./auth.json')
const { setupCommands } = require('./functions/utils.js')
client.commands = new Discord.Collection()
const prefix = config.prefix
const fs = require('fs')

client.on('ready', () => {
  console.log(client.commands)
  setupCommands(['utils', 'music'], client)
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const guildID = message.guild.id
  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  fs.readFile(`./data/${guildID}/config.json`, (err, data) => {
    if (err && command !== 'setup') {
      message.delete()
      message.channel.send('Your server does not seem to have been setup, please run `!setup` to complete the setup')
        .then(msg => setTimeout(() => msg.delete(), 5000))
        .catch(console.error)
      return
    };

    if (!client.commands.has(command)) return

    try {
      client.commands.get(command).execute(message, args, client)
    } catch (error) {
      console.error(error)
      message.reply('there was an error trying to execute that command!')
    }
  })
})

client.login(config.discord_token).catch(error => console.error(error.code))
