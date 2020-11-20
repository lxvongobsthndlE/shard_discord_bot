const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: prefix
 *  Change the prefix for a server.
 */
module.exports = {
    name: 'prefix',
    description: 'Change the prefix Shard Bot listens to for this server.',
    args: true,
    usage: '<new prefix>',
    aliases: [],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/prefix" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'prefix', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated prefix')
            .setDescription('The new prefix for this server is: **' + args[0] + '**'));
    }
}