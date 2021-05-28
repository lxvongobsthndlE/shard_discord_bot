const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');

/** Command: admin <add|remove> <userID>
 *  Add or remove a mod from this server.
 */
module.exports = {
    name: 'admin',
    description: 'Add or remove an admin from this server',
    args: true,
    usage: '<add|remove> <userID>',
    aliases: [],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/admin" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let embed = new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setTimestamp()
            .setTitle('Updated admins')
            .setDescription('No description.');

        if (args[0] == 'add') {
            return message.client.helper.checkUserIdValid(args[1]).then(result => {
                if (!result) {
                    return new ArgumentError(message.author, this.name, args, 'The userID `' + args[1] + '` is not a valid userID.').getEmbed();
                }
                message.client.guildManager.addGuildConfigListElementById(guildConfig.guildId, 'ADMIN_IDS', args[1]);
                embed.setDescription('Added new admin **' + result.username + '** to this server');
                return message.channel.send(embed);
            })
        }
        if (args[0] == 'remove') {
            message.client.guildManager.removeGuildConfigListElementById(guildConfig.guildId, 'ADMIN_IDS', args[1]);
            embed.setDescription('Removed admin with id **' + args[1] + '** from this server');
            return message.channel.send(embed);
        }
        else {
            return new ArgumentError(message.author, this.name, args, 'The option `' + args[0] + '` is not a valid option. Valid otions are: `add` and `remove`').getEmbed();
        }
    }
}