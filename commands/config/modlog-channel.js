const NoSuchChannelError = require('../../errors/NoSuchChannelError');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: modlog-channel
 *  Change or set the mod log channel for this server.
 */
module.exports = {
    name: 'modlog-channel',
    description: 'Change or set the mod log channel for this server.',
    args: true,
    usage: '<channel id>',
    aliases: ['modlog'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/modlog-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (!message.guild.channels.cache.has(args[0])) {
            return message.channel.send(new NoSuchChannelError(message.author, this.name, args, 'The provided channel id does not match a channel on this server!'))
        }
        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'modLogChannelId', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated mod log channel')
            .setDescription('The new mod log channel for this server is: ' + message.client.helper.makeChannelAt(args[0])));
    }
}