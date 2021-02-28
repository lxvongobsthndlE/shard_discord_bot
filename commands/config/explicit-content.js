const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: welcome-channel
 *  Change or set the welcome channel for this server.
 */
module.exports = {
    name: 'explicit-content',
    description: 'Change the explict-content setting for this server.',
    args: true,
    usage: '<yes|true|ja|no|false|nein>',
    aliases: ['explicit', 'ec'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/explicit-content" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        explictContent = args[0].toLowerCase();
        if (explictContent === 'yes' || explictContent === 'true' || explictContent === 'ja') {
            explictContent = true;
            message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'explictFilter', false);
        }
        else {
            explictContent = false;
            message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'explictFilter', true);
        }
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated explicit content settings')
            .setDescription('Explicit content is ' + (explictContent ? '**enabled**' : '**disabled**') + ' for this server.'));
    }
}