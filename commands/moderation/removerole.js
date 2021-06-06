const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const NoSuchRoleError = require('../../errors/NoSuchRoleError');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: removerole
 *  Remove a role from a user. You may `@` the user but **do not** `@` the role!\nUse the roleId or name instead.
 */
module.exports = {
    name: 'removerole',
    description: 'Remove a role from a user. You may `@` the user but **do not** `@` the role!\nUse the roleId or name instead.',
    args: true,
    usage: '<@user|userId> <rolename|roleId>',
    aliases: ['demote'],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            missingManageRolesPermission: "I am missing the required permission to do that!\nPlease grant me the `manage roles` permission, to use this command.",
            notValidRole: "Second argument is not a valid role on this server!",
            botPermissionToLow: "Failed to remove the role from the user because my highest role is lower than the specified role.",
            userPermissionToLow: "Failed to remove the role from the user because your role is lower than the specified role.",
            removingRoleFailed: "An unexpected error occured while removing the role.",
            rolesUpdatedFor: "Updated roles for ",
            removedRole: "The following role was removed: ",
            
        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            missingManageRolesPermission: "Ich habe nicht die nötigen Berechtigungen um das zu tun!\nBitte gebe mir die `Rollen verwalten` Berechtigung, um diesen Befehl nutzen zu können.",
            notValidRole: "Zweites Argument ist keine gültige Rolle auf diesem Server!",
            botPermissionToLow: "Kann die Rolle nicht entfernen, weil meine höchste Rolle niedriger ist als die gewünschte Rolle.",
            userPermissionToLow: "Kann die Rolle nicht entfernen, weil deine höchste Rolle niedriger ist als die gewünschte Rolle.",
            removingRoleFailed: "Ein unerwarteter Fehler ist beim entfernen der Rolle aufgetreten.",
            rolesUpdatedFor: "Rollen wurden aktualisiert für: ",
            removedRole: "Folgende Rolle wurde entfernt: ",

        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/removerole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let member = null;
        let role = null;

        if (!message.guild.member(message.client.user).hasPermission('MANAGE_ROLES')) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.missingManageRolesPermission).getEmbed());
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

        if (message.client.helper.checkRoleIdValid(args[1], message.guild.id)) {
            role = await message.guild.roles.fetch(args[1]);
        }
        else {
            role = await message.guild.roles.cache.find(val => val.name === args[1]);
        }
        if (!role) {
            return message.channel.send(new NoSuchRoleError(message.author, this.name, args, LANG.notValidRole).getEmbed());
        }

        let botRolePosition = await message.guild.member(message.client.user).roles.highest.position;
        let rolePosition = role.position;
        let userRolePosition = message.member.roles.highest.position;
        if (botRolePosition <= rolePosition) {
            return message.channel.send(new ExecutionError(message.author, this.name, args, LANG.botPermissionToLow).getEmbed());
        }
        if (userRolePosition <= rolePosition) {
            return message.channel.send(new NoPermissionError(message.author, this.name, args, LANG.userPermissionToLow).getEmbed());
        }

        return member.roles.remove(role.id)
            .then(message.channel.send(
                new DiscordMessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor('#33cc33')
                    .setTimestamp()
                    .setTitle(LANG.rolesUpdatedFor + member.user.username)
                    .setDescription(LANG.removedRole + message.client.helper.makeRoleAt(role.id))))
            .catch(err => message.channel.send(
                new ExecutionError(message.author, this.name, args, LANG.removingRoleFailed + '\n```' + err + '```').getEmbed()));

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
