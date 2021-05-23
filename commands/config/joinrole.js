const ArgumentError = require('../../errors/ArgumentError');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: joinrole
 *  Give a role automatically on join.
 */
module.exports = {
    name: 'joinrole',
    description: 'Give a role automatically on join.',
    args: true,
    usage: '<role id>',
    aliases: [],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/joinrole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (!message.guild.roles.cache.has(args[0])) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'The provided role id does not match a role on this server!'))
        }
        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'joinRole', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated join role')
            .setDescription('The new join role for this server is: ' + message.guild.roles.cache.get(args[0]).name));
    }
}