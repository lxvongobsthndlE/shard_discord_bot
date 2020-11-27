const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const NoSuchLanguageError = require('../../errors/NoSuchLanguageError');

/** Command: language
 *  Change the prefered language for a server.
 */
module.exports = {
    name: 'language',
    description: 'Change the (prefered) language Shard Bot answers in for this server.',
    args: true,
    usage: '<ISO 639-1 language code>',
    aliases: ['i18n'],
    availableArgs: ['en', 'de'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/language" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        if(!this.availableArgs.includes(args[0])) {
            return message.channel.send(new NoSuchLanguageError(message.author, this.name, args).getEmbed());
        }

        message.client.guildManager.updateGuildConfigById(guildConfig.guildId, 'language', args[0]);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated language')
            .setDescription('The new prefered language for this server is: **' + args[0] + '**'));
    }
}