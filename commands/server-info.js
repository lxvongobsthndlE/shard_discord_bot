const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: server-info
 *  Gives information about the server.
 */
module.exports = {
    name: 'server-info',
    description: 'Shows some information about this server.',
    args: false,
    usage: '',
    aliases: ['sinfo'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "server-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        var guild = message.guild;
        message.channel.send(new DiscordMessageEmbed()
            .setColor('#0099ff')
            .setAuthor(guild.name, guild.iconURL())
            .addField('Owner', guild.owner.displayName, false)
            .addField('Region', guild.region, true)
            .addField('Members', guild.memberCount, true)
            .addField('Explict content', (guildConfig.explictFilter) ? "Disabled" : 'Enabled', true)
            .addField('Created at', guild.createdAt, false)
            .setFooter('Shard by @lxvongobsthndl')
            .setTimestamp());
    }
}