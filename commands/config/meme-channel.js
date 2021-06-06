const NoSuchChannelError = require('../../errors/NoSuchChannelError');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: meme-channel
 *  Change or set the meme channel for this server.
 */
module.exports = {
    name: 'meme-channel',
    description: 'Change or set the meme channel for this server.',
    args: true,
    usage: '<channel id>',
    aliases: ['memech'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/meme-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (!message.guild.channels.cache.has(args[0])) {
            return message.channel.send(new NoSuchChannelError(message.author, this.name, args, 'The provided channel id does not match a channel on this server!'))
        }
        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'memeChannelId', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated meme channel')
            .setDescription('The new meme channel for this server is: ' + message.client.helper.makeChannelAt(args[0])));
    }
}