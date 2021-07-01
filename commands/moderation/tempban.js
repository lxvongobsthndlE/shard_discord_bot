const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const fs = require('fs');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: tempban
 *  Temporarily ban a user. You may `@` the user.
 */
module.exports = {
    name: 'tempban',
    description: 'Temporarily ban a user. You may `@` the user.',
    args: true,
    usage: '<@user|userId> <time> <reason>',
    aliases: ['softban', 'tban'],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            noReasonSupplied: "No reason supplied!",
            missingKickMembersPermission: "I am missing the required permission to do that!\nPlease grant me the `kick members` permission, to use this command.",
            botPermissionToLow: "Failed to kick the user because my highest role is lower than the highest role of the user.",
            userPermissionToLow: "Failed to kick the user because your highest role is lower than the highest role of the user.",
            kickingUserFailed: "An unexpected error occured while kicking the user.",
            canNotKickYourself: "I can't let you do that! You can not kick yourself.",
            canNotKickDeveloper: "I can't let you do that! You can not kick my developer.",
            canNotKickBot: "How dare you! You can not use me to kick myself you PogChamp.",
            canNotKickUserProtected: "This user is magically protected by this server or Discord and can not be kicked.",
            canNotKickBotsThisWay: "I can't kick other bots.",
            errorSavingToFile: "An error occured saving the kick to file. You may have to try again.",
            embedFieldAction: "Action:",
            embedFieldActionName: "Kick",
            embedFieldUser: "User:",
            embedFieldKickedBy: "Kicked by:",
            embedFieldNumOfKicks: "Number of kicks:",
            embedFieldReason: "Reason:",
            embedDescriptionPM: "You are receiving this message, because you just got kicked from following server: "

        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            noReasonSupplied: "Kein Begründung angegeben!",
            missingKickMembersPermission: "Ich habe nicht die nötigen Berechtigungen um das zu tun!\nBitte gebe mir die `Mitglieder kicken` Berechtigung, um diesen Befehl nutzen zu können.",
            botPermissionToLow: "Kann das Mitglied nicht kicken, weil meine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            userPermissionToLow: "Kann das Mitglied nicht kicken, weil deine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            kickingUserFailed: "Ein unerwarteter Fehler ist beim kicken des Mitglieds aufgetreten.",
            canNotKickYourself: "Ich kann dich das nicht tun lassen! Du kannst dich nicht selbst kicken.",
            canNotKickDeveloper: "Ich kann dich das nicht tun lassen! Du kannst meinen Entwickler nicht kicken.",
            canNotKickBot: "Wie kannst du es wagen! Du kannst mich nicht benutzen um mich selbst zu kicken du PogChamp.",
            canNotKickUserProtected: "Dieser Nutzer ist magisch geschützt durch den Server oder Discord und kann nicht gekickt werden.",
            canNotKickBotsThisWay: "Ich kann nicht andere Bots kicken.",
            errorSavingToFile: "Ein Fehler ist beim Speichern des Kicks aufgetreten. Versuche es erneut.",
            embedFieldAction: "Aktion:",
            embedFieldActionName: "Kick",
            embedFieldUser: "User:",
            embedFieldKickedBy: "Gekickt von:",
            embedFieldNumOfKicks: "Anzahl der Kicks:",
            embedFieldReason: "Begründung:",
            embedDescriptionPM: "Du erhältst diese Nachricht, weil du soeben gekickt wurdest auf folgendem Server: "

        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/kick" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let member = null;
        let reason = null;
        let logchannel = null;

        if (!message.guild.member(message.client.user).hasPermission('KICK_MEMBERS')) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.missingKickMembersPermission).getEmbed());
        }

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

        if (!args[1]) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, LANG.noReasonSupplied).getEmbed());
        }
        reason = args.slice(1).join(' ');

        let botRolePosition = await message.guild.member(message.client.user).roles.highest.position;
        let warnedUserRolePosition = member.roles.highest.position;
        let userRolePosition = message.member.roles.highest.position;
        if (botRolePosition <= warnedUserRolePosition) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.botPermissionToLow).getEmbed());
        }
        if (userRolePosition <= warnedUserRolePosition) {
            return message.channel.send(new NoPermissionError(message.author, this.name, args, LANG.userPermissionToLow).getEmbed());
        }

        if (member.id === message.author.id) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotKickYourself).getEmbed());
        }
        if (member.id === message.client.config.ownerId) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotKickDeveloper).getEmbed());
        }
        if (member.id === message.client.user.id) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotKickBot).getEmbed());
        }
        if (member.bot) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotKickBotsThisWay).getEmbed());
        }
        if (!member.kickable) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotKickUserProtected).getEmbed());
        }

        member.kick(reason);

        let warns = JSON.parse(fs.readFileSync('./botData/warnlist.json', 'utf-8'));

        if (!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = message.client.helper.getWarnlist();

        warns[`${member.id}, ${message.guild.id}`].kicks++;

        fs.writeFile('./botData/warnlist.json', JSON.stringify(warns, null, 2), err => {
            if (err) {
                return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.errorSavingToFile).getEmbed());
            }
        });

        let embed = new DiscordMessageEmbed()
            .setColor(0xFFFF00)
            .setTimestamp()
            .setAuthor(member.user.tag, member.user.displayAvatarURL())
            .addField(LANG.embedFieldAction, LANG.embedFieldActionName)
            .addField(LANG.embedFieldUser, `${message.client.helper.makeUserAt(member.id)} (${member.id})`)
            .addField(LANG.embedFieldKickedBy, `${message.client.helper.makeUserAt(message.author.id)} (${message.author.id})`)
            .addField(LANG.embedFieldNumOfKicks, warns[`${member.id}, ${message.guild.id}`].warns)
            .addField(LANG.embedFieldReason, reason)
            .setFooter('Shard by @lxvongobsthndl');

        logchannel = message.guild.channels.cache.get(guildConfig.modLogChannelId);
        if (!logchannel) {
            message.channel.send(embed);
        } else {
            logchannel.send(embed);
            message.channel.send(embed);
        }
        if (member.bot) return;
        embed.setDescription(LANG.embedDescriptionPM + message.guild.name);
        member.send(embed).catch(e => {
            if (e) return;
        });

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
