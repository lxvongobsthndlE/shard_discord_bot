const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: help
 *  Shows available commands in minecraft section.
 */
module.exports = {
	name: 'help',
	description: 'Shows available commands in minecraft section.',
    aliases: ['hilfe'],
    args: false,
	usage: '',
	execute(message, args, guildConfig) {
        const { minecraftCommands } = message.client;
        console.log(message.author.username + ' called "minecraft/help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var response = new DiscordMessageEmbed()
        .setColor('#0099ff')
        .setTitle('Shard Minecraft Help')
        .setThumbnail(message.client.user.displayAvatarURL())
        .setFooter('Shard by @lxvongobsthndl')
        .setTimestamp();
        minecraftCommands.forEach(command => {
            var aliases = (command.aliases && command.aliases.length > 0) ? '*Aliases*: ' + command.aliases.join(', ') + '\n' : '';
            var usage = (command.usage && command.usage != '') ? ' ' + command.usage : '';
            response.addField(guildConfig.prefix + 'minecraft ' + command.name + usage, aliases + command.description);
        });
		message.channel.send(response);
	},
};