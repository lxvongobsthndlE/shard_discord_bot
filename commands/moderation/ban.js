const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const fs = require('fs');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: ban
 *  Ban a user. You may `@` the user.
 */
module.exports = {
    name: 'ban',
    description: 'Ban a user. You may `@` the user.',
    args: true,
    usage: '<@user|userId> <reason>',
    aliases: [],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            noReasonSupplied: "No reason supplied!",
            missingBanMembersPermission: "I am missing the required permission to do that!\nPlease grant me the `ban members` permission, to use this command.",
            botPermissionToLow: "Failed to ban the user because my highest role is lower than the highest role of the user.",
            userPermissionToLow: "Failed to ban the user because your highest role is lower than the highest role of the user.",
            banningUserFailed: "An unexpected error occured while banning the user.",
            canNotBanYourself: "I can't let you do that! You can not ban yourself.",
            canNotBanDeveloper: "I can't let you do that! You can not ban my developer.",
            canNotBanBot: "How dare you! You can not use me to ban myself you PogChamp.",
            canNotBanUserProtected: "This user is magically protected by this server or Discord and can not be banned.",
            canNotBanBotsThisWay: "I can't ban other bots.",
            errorSavingToFile: "An error occured saving the ban to file. You may have to try again.",
            embedFieldAction: "Action:",
            embedFieldActionName: "Ban",
            embedFieldUser: "User:",
            embedFieldBannedBy: "Banned by:",
            embedFieldNumOfBans: "Number of bans:",
            embedFieldReason: "Reason:",
            embedDescriptionPM: "You are receiving this message, because you just got banned from following server: "

        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            noReasonSupplied: "Kein Begründung angegeben!",
            missingBanMembersPermission: "Ich habe nicht die nötigen Berechtigungen um das zu tun!\nBitte gebe mir die `Mitglieder bannen` Berechtigung, um diesen Befehl nutzen zu können.",
            botPermissionToLow: "Kann das Mitglied nicht bannen, weil meine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            userPermissionToLow: "Kann das Mitglied nicht bannen, weil deine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            banningUserFailed: "Ein unerwarteter Fehler ist beim Bannen des Mitglieds aufgetreten.",
            canNotBanYourself: "Ich kann dich das nicht tun lassen! Du kannst dich nicht selbst bannen.",
            canNotBanDeveloper: "Ich kann dich das nicht tun lassen! Du kannst meinen Entwickler nicht bannen.",
            canNotBanBot: "Wie kannst du es wagen! Du kannst mich nicht benutzen um mich selbst zu bannen du PogChamp.",
            canNotBanUserProtected: "Dieser Nutzer ist magisch geschützt durch den Server oder Discord und kann nicht gebannt werden.",
            canNotBanBotsThisWay: "Ich kann nicht andere Bots bannen.",
            errorSavingToFile: "Ein Fehler ist beim Speichern des Bans aufgetreten. Versuche es erneut.",
            embedFieldAction: "Aktion:",
            embedFieldActionName: "Ban",
            embedFieldUser: "User:",
            embedFieldBannedBy: "Gebannt von:",
            embedFieldNumOfBans: "Anzahl der Bans:",
            embedFieldReason: "Begründung:",
            embedDescriptionPM: "Du erhältst diese Nachricht, weil du soeben gebannt wurdest auf folgendem Server: "

        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/ban" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let member = null;
        let reason = null;
        let logchannel = null;

        if (!message.guild.member(message.client.user).hasPermission('BAN_MEMBERS')) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.missingBanMembersPermission).getEmbed());
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
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotBanYourself).getEmbed());
        }
        if (member.id === message.client.config.ownerId) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotBanDeveloper).getEmbed());
        }
        if (member.id === message.client.user.id) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotBanBot).getEmbed());
        }
        if (member.bot) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotBanBotsThisWay).getEmbed());
        }
        if (!member.bannable) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotBanUserProtected).getEmbed());
        }

        member.ban({reason: reason});

        let warns = JSON.parse(fs.readFileSync('./botData/warnlist.json', 'utf-8'));

        if (!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = message.client.helper.getWarnlist();

        warns[`${member.id}, ${message.guild.id}`].bans++;

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
            .addField(LANG.embedFieldBannedBy, `${message.client.helper.makeUserAt(message.author.id)} (${message.author.id})`)
            .addField(LANG.embedFieldNumOfBans, warns[`${member.id}, ${message.guild.id}`].warns)
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
