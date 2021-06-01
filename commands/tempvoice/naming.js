const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');

/** Command: naming
 *  Change the naming of tempvoice channels.
 */
module.exports = {
    name: 'naming',
    description: 'Change the naming of tempvoice channels. Arguments:\n'
        + '*<registerChannelID>*: The ID of the tempvoice channel to change the naming of.\n'
        + '*<text>*: The desired naming. (Can use placeholders!)',
    args: true,
    usage: '<registerChannelID> <text>',
    aliases: [],
    i18n: {
        en: {
            success: "Success!\nAdded new naming for tempvoice channels created by: ",
            naming: "\nNaming: "
        },
        de: {
            success: "Erfolg!\nNeue Benennung für TempVoice Channels von: ",
            naming: "\nBenennung: "
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "tempvoice/naming" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let tvManager = message.client.tempVoiceChannels;

        return message.client.helper.checkChannelIdValid(args[0], message.guild.id)
            .then(check => {
                if (check.type === 'voice' && tvManager.isTempVoiceChannel(args[0])) {
                    if (!args[1]) {
                        return message.channel.send(new ArgumentError(message.author, this.name, args, 'Missing argument `text`.').getEmbed());
                    }
                    let text = args.slice(1).join(' ');
                    tvManager.setNaming(args[0], text);
                    return message.channel.send(new DiscordMessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setColor('#5b9d31')
                        .setTimestamp()
                        .setDescription(LANG.success + message.client.helper.makeChannelAt(args[0]) + LANG.naming + text)
                    );
                }
                else {
                    return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[0] + '` is either not a valid voice channel, or is not a tempvoice channel.').getEmbed());
                }
            })
            .catch(err => {
                console.log(err);
                message.channel.send(new ExecutionError(message.author, this.name, args).getEmbed());
            });

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