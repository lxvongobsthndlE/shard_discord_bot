const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: invite
 *  Get a link to invite this bot to your server
 * 
 *  Use this link to create an invite: https://discordapi.com/permissions.html
 *  Client ID: 759925230017052674
 */
module.exports = {
    name: 'invite',
    description: 'Get a link to invite this bot to your server.',
    args: false,
    usage: '',
    aliases: [],
    i18n: {
        en: {
            embedDescription: "To invite this bot to your own server, use the following link: "
        },
        de: {
            embedDescription: "Um diesen Bot auf euren eigenen Server einzuladen, nutzt den folgenden Link: "
        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "invite" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let botInvite = '[Shard Invite](https://discord.com/oauth2/authorize?client_id=759925230017052674&scope=bot&permissions=1577057495 "Invite Shard Bot to your Discord Server")';
        return message.channel.send(new DiscordMessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(LANG.embedDescription + botInvite)
            .setTimestamp());
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