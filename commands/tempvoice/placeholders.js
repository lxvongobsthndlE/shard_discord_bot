const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: placeholders
 *  Shows all available placeholders for *naming* command.
 */
module.exports = {
    name: 'placeholders',
    description: 'Shows all available placeholders for *naming* command.',
    args: false,
    usage: '',
    aliases: ['ph'],
    i18n: {
        en: {
            description: "Available placeholders for the tempvoice *naming* command:",
            ph_member: "The name of the member opening the tempvoice.",
            ph_count: "The number (ID) the voice channel will get."
        },
        de: {
            description: "Verfügbare Platzhalter für den tempvoice *naming* Befehl:",
            ph_member: "Der Name des Mitglieds, das den TempVoice Channel eröffnet.",
            ph_count: "Die Nummer (ID), die der Voice Channel erhalten wird."
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "tempvoice/placeholders" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);

        return message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#5b9d31')
            .setTimestamp()
            .setDescription(LANG.description)
            .addField('%member%', LANG.ph_member)
            .addField('%count%', LANG.ph_count)
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