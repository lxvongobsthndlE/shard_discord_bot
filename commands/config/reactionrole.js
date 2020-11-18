const emojiList = require('../../configuration/data-ordered-emoji.js');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const NoSuchRoleError = require('../../errors/NoSuchRoleError');

/** Command: reactionrole
 *  Create a reactionCollector, that gives a specified role to the users reacting.
 */
module.exports = {
    name: 'reactionrole',
    description: 'Create a reaction-collector, that gives a specified role to the users reacting.',
    args: true,
    usage: '<role id> <reaction emoji>',
    aliases: ['rr'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/reactionrole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var role = message.guild.roles.cache.get(args[0]);
        var reaction = (args[1]) ? args[1] : emojiList[getRndInteger(0, emojiList.length)];
        if (role) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor('Request a role')
                .setColor('#33cc33')
                .setTitle(role.name)
                .setDescription('To get the **' + role.name + '** role react with ' + reaction))
                .then(msg => {
                    if (reaction.startsWith('<')) {
                        reaction = reaction.split(':')[reaction.split(':').length - 1].substring(0, reaction.split(':')[reaction.split(':').length - 1].length - 1);
                    }
                    message.client.roleManager.create({
                        messageID: msg.id,
                        channel: message.channel,
                        reaction: reaction,
                        role: role
                    });
                });
        } else {
            return message.channel.send(new NoSuchRoleError(message.author, this.name, args, 'The role id provided could not be resolved to a role on this server.').getEmbed());
        }
    }
}