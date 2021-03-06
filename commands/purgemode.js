const NoPermissionError = require("../errors/NoPermissionError");
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: purgemode
 *  enable purge mode in a channel, which deletes all messages in this
 *  channel until purgemode is deactivated.
 */
module.exports = {
    name: 'purgemode',
    description: 'Enable/disable purge mode in a channel, which deletes all new messages in this channel until purgemode is deactivated.',
    args: false,
    usage: '',
    aliases: ['purge', 'channelmute'],
    i18n: {
        en: {
            embedDescriptionPurgeON: "This channel has been set in purge mode!\nAll new messages will be deleted.",
            embedDescriptionPurgeOFF: "Purge mode disabled."
        },
        de: {
            embedDescriptionPurgeON: "Dieser Kanal ist im Purge-Modus.\nAlle neuen Nachrichten werden gelöscht.",
            embedDescriptionPurgeOFF: "Purge-Modus deaktiviert."
        }
    },
    adminOnly: true,
    async execute(message, args, guildConfig) {
        if (!message.client.helper.isAdmin(message.author.id, guildConfig.ADMIN_IDS)) {
            return message.channel.send(new NoPermissionError(message.author, this.name, args).getEmbed());
        }

        console.log(message.author.username + ' called "purgemode" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let embed = new DiscordMessageEmbed().setTimestamp();
        embed = message.client.purgeManager.toggle(message.channel.id) ?
            embed.setColor('#ff0000').setDescription(LANG.embedDescriptionPurgeON) :
            embed.setColor('#00ff00').setDescription(LANG.embedDescriptionPurgeOFF);
        return message.channel.send(embed);
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