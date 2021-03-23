const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: help
 *  Shows available commands in moderation section.
 */
module.exports = {
	name: 'help',
	description: 'Shows available commands in moderation section.',
    aliases: ['hilfe', '?'],
    args: false,
	usage: '',
	execute(message, args, guildConfig) {
        const { moderationCommands } = message.client;
        console.log(message.author.username + ' called "moderation/help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var response = new DiscordMessageEmbed()
        .setColor('#0099ff')
        .setTitle(':triangular_flag_on_post: Shard Moderation Help')
        .setThumbnail(message.client.user.displayAvatarURL())
        .setFooter('Shard by @lxvongobsthndl')
        .setTimestamp();
        moderationCommands.forEach(command => {
            var aliases = (command.aliases && command.aliases.length > 0) ? '*Aliases*: ' + command.aliases.join(', ') + '\n' : '';
            var usage = (command.usage && command.usage != '') ? ' ' + command.usage : '';
            response.addField(guildConfig.prefix + 'config ' + command.name + usage, aliases + command.description);
        });
		message.channel.send(response);
	},
};