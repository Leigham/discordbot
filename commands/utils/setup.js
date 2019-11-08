const fse = require('fs-extra')

module.exports = {
  name: 'setup',
  description: 'sets up the server environment',
  async execute (message, args, client) {
    const setupSteps = ['adminrole']

    if (args.length === 0) {
      // -- check if the setup has already been started.
      fse.pathExists(`./data/${message.guild.id}/config.json`, async (err, exists) => {
        if (err) {
          console.error(err)
        };

        if (exists) {
          await message.reply('It seems like the setup has already been started on this server, please type `!setup continue` to continue the setup!')
            .then(msg => setTimeout(() => msg.delete(), 5000))
            .catch(console.error)
          return
        }

        await message.reply('Please wait while I get things ready')

        const tmpConfig = {
          id: message.guild.id,
          name: message.guild.name,
          adminroles: [],
          serverroles: []
        }

        fse.outputJSON(`./data/${message.guild.id}/config.json`, tmpConfig, async function (err) {
          if (err) {
            return console.log(err)
          }
          console.log('File saved successfully!')
        })
      })
    } else {
      if (!setupSteps.includes(args[0])) {
        message.channel.send('That options is not in the setup parameters!')
          .then(msg => setTimeout(() => msg.delete(), 5000))
          .catch(console.error)
        return
      }
    };
  }
}
