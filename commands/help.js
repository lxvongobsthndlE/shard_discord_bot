const Helper = require('../classes/Helper');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: help
 *  Shows all to the user available commands with their respective usage, description and aliases.
 */
module.exports = {
	name: 'help',
	description: 'List all available commands and their descriptions.',
    aliases: ['commands', 'befehle', 'hilfe'],
    args: false,
	usage: '',
	execute(message, args, guildConfig) {
        const { commands } = message.client;
        const helper = new Helper();
        const userIsAdmin = helper.isAdmin(message.author.id, guildConfig.ADMIN_IDS);
        console.log(message.author.username + ' called "help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var response = new DiscordMessageEmbed()
        .setColor('#0099ff')
        .setTitle('Shard Help')
        .setThumbnail(message.client.user.displayAvatarURL())
        .setFooter('Shard by @lxvongobsthndl')
        .setTimestamp();
        commands.forEach(command => {
            if (!(guildConfig.explictFilter && command.explict) && ((userIsAdmin && command.adminOnly) || !command.adminOnly) && !command.secret) {
                var aliases = (command.aliases && command.aliases.length > 0) ? '*Aliases*: ' + command.aliases.join(', ') + '\n' : '';
                var usage = (command.usage && command.usage != '') ? ' ' + command.usage : '';
                var admin = command.adminOnly ? ':triangular_flag_on_post: ' : '';
                response.addField(admin + guildConfig.prefix + command.name + usage, aliases + command.description);
            }
        });
		message.channel.send(response);
	},
};