const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: help
 *  Shows available commands in shard section.
 */
module.exports = {
	name: 'help',
	description: 'Shows available commands in shard section.',
    aliases: ['hilfe', '?'],
    args: false,
    secret: true,
	usage: '',
	execute(message, args, guildConfig) {
        if(message.author.id !== message.client.config.ownerId) return;
        const { shardCommands } = message.client;
        console.log('[DEV] ' + message.author.username + ' called "shard/help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var response = new DiscordMessageEmbed()
        .setColor('#0099ff')
        .setTitle(':triangular_flag_on_post: Shard Owner Command Help')
        .setThumbnail(message.client.user.displayAvatarURL())
        .setFooter('Shard by @lxvongobsthndl')
        .setTimestamp();
        shardCommands.forEach(command => {
            var aliases = (command.aliases && command.aliases.length > 0) ? '*Aliases*: ' + command.aliases.join(', ') + '\n' : '';
            var usage = (command.usage && command.usage != '') ? ' ' + command.usage : '';
            response.addField(guildConfig.prefix + 'shard ' + command.name + usage, aliases + command.description);
        });
		message.channel.send(response);
	},
};