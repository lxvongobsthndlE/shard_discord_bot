const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ExecutionError = require('../../errors/ExecutionError');

/** Command: mods
 *  List all mods on the server.
 */
module.exports = {
    name: 'mods',
    description: 'List all mods on the server.',
    args: false,
    usage: '',
    aliases: ['moderators'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/mods" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        if (!guildConfig.mods || guildConfig.mods.isEmpty) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, 'This server has no moderators.').getEmbed());
        }

        let embed = new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Moderators');

        guildConfig.mods.forEach(modId => {
            embed.addField('(' + modId + ')', message.client.helper.makeUserAt(modId));
        });

        return message.channel.send(embed);
    }
}