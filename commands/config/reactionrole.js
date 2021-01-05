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
    i18n: {
        en: {
            embedAuthor: "Request a role",
            embedDescription: "To get the **%s** role react with %s"
        },
        de: {
            embedAuthor: "Bekomme eine Rolle",
            embedDescription: "Um die Rolle **%s** zu erhalten, reagiere auf diese Nachricht mit %s"
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/reactionrole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        var role = message.guild.roles.cache.get(args[0]);
        var reaction = (args[1]) ? args[1] : emojiList[getRndInteger(0, emojiList.length)];
        if (role) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(LANG.embedAuthor)
                .setColor('#33cc33')
                .setTitle(role.name)
                .setDescription(LANG.embedDescription)
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
    },
    determineLanguage(configLanguage) {
        if(this.i18n[configLanguage]) {
            return this.i18n[configLanguage];
        }
        else {
            return this.i18n.en;
        }
    }
}