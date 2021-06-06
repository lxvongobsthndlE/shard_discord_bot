const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const fs = require('fs');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: warn
 *  Warn a user. You may `@` the user.
 */
module.exports = {
    name: 'warn',
    description: 'Warn a user. You may `@` the user.',
    args: true,
    usage: '<@user|userId> <reason>',
    aliases: [],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            noReasonSupplied: "No reason supplied!",
            missingKickMembersPermission: "I am missing the required permission to do that!\nPlease grant me the `kick members` permission, to use this command.",
            botPermissionToLow: "Failed to warn the user because my highest role is lower than the highest role of the user.",
            userPermissionToLow: "Failed to warn the user because your highest role is lower than the highest role of the user.",
            warningUserFailed: "An unexpected error occured while warning the user.",
            canNotWarnYourself: "I can't let you do that! You can not warn yourself.",
            canNotWarnDeveloper: "I can't let you do that! You can not warn my developer.",
            errorSavingToFile: "An error occured saving the warning to file. You may have to try again.",
            embedFieldAction: "Action:",
            embedFieldActionName: "Warning",
            embedFieldUser: "User:",
            embedFieldWarnedBy: "Warned by:",
            embedFieldNumOfWarnings: "Number of warnings:",
            embedFieldReason: "Reason:",
            embedDescriptionPM: "You are receiving this message, because you just got a warning on following server: "

        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            noReasonSupplied: "Kein Begründung angegeben!",
            missingKickMembersPermission: "Ich habe nicht die nötigen Berechtigungen um das zu tun!\nBitte gebe mir die `Mitglieder kicken` Berechtigung, um diesen Befehl nutzen zu können.",
            botPermissionToLow: "Kann das Mitglied nicht warnen, weil meine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            userPermissionToLow: "Kann das Mitglied nicht warnen, weil deine höchste Rolle niedriger ist als die höchste Rolle des Mitglieds.",
            warningUserFailed: "Ein unerwarteter Fehler ist beim warnen des Mitglieds aufgetreten.",
            canNotWarnYourself: "Ich kann dich das nicht tun lassen! Du kannst dich nicht selbst warnen.",
            canNotWarnDeveloper: "Ich kann dich das nicht tun lassen! Du kannst meinen Entwickler nicht warnen.",
            errorSavingToFile: "Ein Fehler ist beim Speichern der Warnung aufgetreten. Versuche es erneut.",
            embedFieldAction: "Aktion:",
            embedFieldActionName: "Warnung",
            embedFieldUser: "User:",
            embedFieldWarnedBy: "Gewarnt von:",
            embedFieldNumOfWarnings: "Anzahl von Warnungen:",
            embedFieldReason: "Begründung:",
            embedDescriptionPM: "Du erhältst diese Nachricht, weil du soeben gewarnt wurdest auf folgendem Server: "

        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/warn" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

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
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotWarnYourself).getEmbed());
        }
        if (member.id === message.client.config.ownerId) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.canNotWarnDeveloper).getEmbed());
        }

        let warns = JSON.parse(fs.readFileSync('./botData/warnlist.json', 'utf-8'));

        if (!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = message.client.helper.getWarnlist();

        warns[`${member.id}, ${message.guild.id}`].warns++;

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
            .addField(LANG.embedFieldWarnedBy, `${message.client.helper.makeUserAt(message.author.id)} (${message.author.id})`)
            .addField(LANG.embedFieldNumOfWarnings, warns[`${member.id}, ${message.guild.id}`].warns)
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

/*
        if(warns[`${user.id}, ${message.guild.id}`].warns == 2){
            let muteRole = message.guild.roles.find('name', 'Muted')
        
            let mutetime = "60s";
            message.guild.members.get(user.id).addRole(muteRole.id);
            message.reply(`${user.tag} has been temporarily muted`);
        
            setTimeout(function(){
              message.guild.members.get(user.id).removeRole(muteRole.id)
            }, ms(mutetime))
          }
        
          if(warns[`${user.id}, ${message.guild.id}`].warns == 3){
            message.guild.member(user).kick(reason);
            message.reply('That Dumb Boi have been kicked :facepalm:')
          }
        
          if(warns[`${user.id}, ${message.guild.id}`].warns == 5){
            message.guild.member(user).ban(reason);
            message.reply('You won\' have to worry about that shit-head any longer, I have Banned them!');
          }

*/

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
