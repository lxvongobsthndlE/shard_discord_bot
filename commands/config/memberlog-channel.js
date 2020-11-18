const NoSuchChannelError = require('../../errors/NoSuchChannelError');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: memberlog-channel
 *  Change or set the member log channel for this server.
 */
module.exports = {
    name: 'memberlog-channel',
    description: 'Change or set the member log channel for this server.',
    args: true,
    usage: '<channel id>',
    aliases: ['memberlog-ch', 'mlch'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/memberlog-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (!message.guild.channels.cache.has(args[0])) {
            return message.channel.send(new NoSuchChannelError(message.author, this.name, args, 'The provided channel id does not match a channel on this server!'))
        }
        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'memberLogChannelId', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated member log channel')
            .setDescription('The new member log channel for this server is: #' + message.guild.channels.cache.get(args[0]).name));
    }
}