const ArgumentError = require("../../errors/ArgumentError");
const fs = require('fs');

/** Command: leave [guildID]
 *  Make the bot leave this/a guild.
 */
module.exports = {
  name: 'leave',
  description: 'Make the bot leave this/a guild.',
  secret: true,
  aliases: [],
  usage: '[guildID]',
  execute(message, args, guildConfig) {
    if (message.author.id !== message.client.config.ownerId) return;
    console.log('[DEV] ' + message.author.username + ' called "shard/leave" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

    let guildID = message.guild.id;
    if (args[0]) {
      if (isNaN(parseInt(args[0]))) {
        return message.channel.send(new ArgumentError(message.author, this.name, args, 'The provided argument is not a guildID!').getEmbed());
      }
      guildID = args[0];
    }

    let guild = message.client.guilds.cache.get(guildID);
    if (!guild) {
      return message.channel.send(new ArgumentError(message.author, this.name, args, 'The provided argument is not a guildID!').getEmbed());
    }

    message.channel.send('Are you sure, you want me to leave ' + guild.name + '?\nAnswer `yes` to confirm.\nAnswer `no` or wait 20 seconds to cancel.').then(() => {
      const filter = m => message.author.id === m.author.id;

      message.channel.awaitMessages(filter, { time: 20000, max: 1, errors: ['time'] })
        .then(messages => {
          if (messages.first().content.toLowercase() === 'yes') {
            message.channel.send('Leaving guild ' + guild.name + '...')
            return guild.leave();
          }
          else {
            return message.channel.send('Aborting operation...');
          }
        })
        .catch(() => {
          return message.channel.send('Did not receive confirmation. Aborting.');
        });
    });
  }
}