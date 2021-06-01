const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: count
 *  Get the amount of registered tempvoice channels on your server.
 */
module.exports = {
    name: 'count',
    description: 'Get the amount of registered tempvoice channels on your server.',
    args: false,
    usage: '',
    aliases: [],
    i18n: {
        en: {
            description: "This server has a total of {{count}} tempvoice channels."
        },
        de: {
            description: "Dieser Server hat insgesamt {{count}} TempVoice Channels."
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "tempvoice/count" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let tvManager = message.client.tempVoiceChannels;

        let channelCount = tvManager.getTempVoiceChannelCount(message.guild.id);
        return message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#5b9d31')
            .setTimestamp()
            .setDescription(message.client.helper.stringTemplateParser(LANG.description, {count: channelCount}))
        );

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