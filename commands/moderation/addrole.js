const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const NoSuchRoleError = require('../../errors/NoSuchRoleError');
const NoPermissionError = require('../../errors/NoPermissionError');

/** Command: addrole
 *  Give a role to a user. You may `@` the user but **do not** `@` the role!\nUse the roleId or name instead.
 */
module.exports = {
    name: 'addrole',
    description: 'Give a role to a user. You may `@` the user but **do not** `@` the role!\nUse the roleId or name instead.',
    args: true,
    usage: '<@user|userId> <rolename|roleId>',
    aliases: ['promote'],
    modOnly: true,
    i18n: {
        en: {
            noUserSupplied: "First argument was not a `@`user or userId!",
            missingManageRolesPermission: "I am missing the required permission to do that!\nPlease grant me the `manage roles` permission, to use this command.",
            notValidRole: "Second argument is not a valid role on this server!",
            botPermissionToLow: "Failed to add the role to the user because my highest role is lower than the specified role.",
            userPermissionToLow: "Failed to add the role to the user because your role is lower than the specified role.",
            addingRoleFailed: "An unexpected error occured while adding the role.",
            rolesUpdatedFor: "Updated roles for ",
            newRoleAdded: "The following role was added: ",
            
        },
        de: {
            noUserSupplied: "Erstes Argument war kein `@`user oder userId!",
            missingManageRolesPermission: "Ich habe nicht die nötigen Berechtigungen um das zu tun!\nBitte gebe mir die `Rollen verwalten` Berechtigung, um diesen Befehl nutzen zu können.",
            notValidRole: "Zweites Argument ist keine gültige Rolle auf diesem Server!",
            botPermissionToLow: "Kann die Rolle nicht hinzufügen, weil meine höchste Rolle niedriger ist als die gewünschte Rolle.",
            userPermissionToLow: "Kann die Rolle nicht hinzufügen, weil deine höchste Rolle niedriger ist als die gewünschte Rolle.",
            addingRoleFailed: "Ein unerwarteter Fehler ist beim hinzufügen der Rolle aufgetreten.",
            rolesUpdatedFor: "Rollen wurden aktualisiert für: ",
            newRoleAdded: "Folgende Rolle wurde hinzugefügt: ",

        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "moderation/addrole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

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

        return member.roles.add(role.id)
            .then(message.channel.send(
                new DiscordMessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor('#33cc33')
                    .setTimestamp()
                    .setTitle(LANG.rolesUpdatedFor + member.user.username)
                    .setDescription(LANG.newRoleAdded + message.client.helper.makeRoleAt(role.id))))
            .catch(err => message.channel.send(
                new ExecutionError(message.author, this.name, args, LANG.addingRoleFailed + '\n```' + err + '```').getEmbed()));

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
