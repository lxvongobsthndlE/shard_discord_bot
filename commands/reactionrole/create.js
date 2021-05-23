const emojiList = require('../../configuration/data-ordered-emoji.js');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const NoSuchRoleError = require('../../errors/NoSuchRoleError');
const ArgumentError = require('../../errors/ArgumentError');

/** Command: create
 *  Create a reactionCollector, that gives a specified role to the users reacting.
 */
module.exports = {
    name: 'create',
    description: 'Create a reaction-collector, that gives a specified role to the users reacting.',
    args: true,
    usage: '<role id> [reaction emoji]',
    aliases: ['new'],
    i18n: {
        en: {
            embedAuthor: "Request a role",
            embedDescription: "To get the **{{roleName}}** role react with {{reaction}}"
        },
        de: {
            embedAuthor: "Bekomme eine Rolle",
            embedDescription: "Um die Rolle **{{roleName}}** zu erhalten, reagiere auf diese Nachricht mit {{reaction}}"
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "reactionrole/create" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        var role = message.guild.roles.cache.get(args[0]);
        if (role) {
            var reaction = (args[1]) ? args[1] : emojiList[message.client.helper.getRandomInteger(0, emojiList.length)];
            return message.channel
                .send(new DiscordMessageEmbed()
                    .setAuthor(LANG.embedAuthor)
                    .setColor('#33cc33')
                    .setTitle(role.name)
                    .setDescription(message.client.helper.stringTemplateParser(LANG.embedDescription, {roleName: role.name, reaction: reaction}))
                )
                .then(msg => {
                    if (!message.client.helper.containsEmoji(reaction)) {
                        let splitReaction = reaction.slice(1,reaction.length - 1).split(':');
                        reaction = splitReaction.pop();
                        if (message.client.emojis.cache.get(reaction) === undefined) {
                            return msg.delete().then(() => {
                                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The provided reaction is either not an emoji, or not known to the bot.').getEmbed());
                            });
                        }
                    }
                    message.client.reactionRoleManager.create(msg.id, msg.channel, reaction, role);
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