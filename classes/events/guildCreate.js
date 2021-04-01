const fs = require('fs');
module.exports = async guild => {
  let client = guild.client
  let aTextChannel = guild.channels.cache.find(ch => ch.type === 'text');
  let owner = guild.ownerID;
  console.log('>>> Joined new guild: ' + guild.name);

  if (owner !== client.config.ownerId) {
    let channel = client.channels.cache.get(guild.systemChannelID || aTextChannel.id);
    channel.send('Thanks for inviting me into this server!\nPlease use `' + client.config.prefix + 'info` and `' + client.config.prefix + 'help` for the information you need in order to set up and use the bot.\n\nHave any suggestions or noticed any bugs? Use `' + client.config.prefix + 'suggest` or `' + client.config.prefix + 'bug` to report them to my developer. \nThank you and have fun using the bot!');

    let blacklist = JSON.parse(fs.readFileSync('./botData/blacklist.json', 'utf8'));
    if (!blacklist[guild.ownerID]) return;
    if (blacklist[guild.ownerID].state) {
      console.log('>>> Guild Owner is blacklisted... Leaving again.');
      channel.send('But UNFORTUNATELY, the owner of this server has been blacklisted by my developer, so I\'m going to have to leave! Bye!');
      guild.leave();
    }
  }
}