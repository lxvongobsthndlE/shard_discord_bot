const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const fs = require('fs');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: warnlist
 *  Show the amount of warnings a user has received. You may `@` the user.
 */
module.exports = {
    name: 'warnlevel',
    description: 'Show the amount of warnings a user has received. You may `@` the user.',
    args: true,
    usage: '<@user|userId>',
    aliases: ['warnings'],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            embedFieldAction: "Action:",
            embedFieldActionName: "Warning check",
            embedFieldUser: "User:",
            embedFieldNumOfWarnings: "Number of warnings:",
        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            embedFieldAction: "Aktion:",
            embedFieldActionName: "Warnung Abfrage",
            embedFieldUser: "User:",
            embedFieldNumOfWarnings: "Anzahl von Warnungen:",
        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "warnlist" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let member = null;

        if (message.mentions.users.size === 0) {
            if (message.client.helper.checkUserIdValid(args[0], message.guild.id)) {
                member = await message.guild.member(args[0]);
            }
            else {
                return message.channel.send(new ArgumentError(message.author, this.name, args, LANG.noUserSupplied).getEmbed());
            }
        }
        else {
            member = await message.guild.member(message.mentions.members.first());
        }
        if (!member) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, LANG.noUserSupplied).getEmbed());
        }


        let warns = JSON.parse(fs.readFileSync('./botData/warnlist.json', 'utf-8'));

        if (!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = {
            warns: 0
        }

        let embed = new DiscordMessageEmbed()
            .setColor(0xFFFF00)
            .setTimestamp()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField(LANG.embedFieldAction, LANG.embedFieldActionName)
            .addField(LANG.embedFieldUser, `${message.client.helper.makeUserAt(member.id)} (${member.id})`)
            .addField(LANG.embedFieldNumOfWarnings, warns[`${member.id}, ${message.guild.id}`].warns)
            .setFooter('Shard by @lxvongobsthndl');

        return message.channel.send(embed);

    },
    determineLanguage(configLanguage) {
        if (this.i18n[configLanguage]) {
            return this.i18n[configLanguage];
        }
        else {
            return this.i18n.en;
        }
    }
}
