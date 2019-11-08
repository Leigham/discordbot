const fs = require('fs')

module.exports = {
  setupCommands: function (data, client) {
    // -- Root Commands First.
    for (const file of (fs.readdirSync('./commands').filter(file => file.endsWith('.js')))) {
      const command = require(`../commands/${file}`)
      client.commands.set(command.name, command)
    };
    data.forEach(element => {
      for (const file of (fs.readdirSync(`./commands/${element}`).filter(file => file.endsWith('.js')))) {
        const command = require(`../commands/${element}/${file}`)
        client.commands.set(command.name, command)
      };
    })
  }
}
