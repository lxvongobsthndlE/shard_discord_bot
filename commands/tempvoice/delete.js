const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');

/** Command: delete
 *  Delete a tempvoice channel entry.
 */
module.exports = {
    name: 'delete',
    description: 'Delete a tempvoice channel entry. Arguments:\n'
        + '*<registerChannelID>*: The ID of the tempvoice channel to delete.',
    args: true,
    usage: '<registerChannelID>',
    aliases: ['remove', 'del'],
    i18n: {
        en: {
            success: "Success!\nDeleted tempvoice entry channel: "
        },
        de: {
            success: "Erfolg!\nTempVoice Channel Eingang gelöscht: "
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "tempvoice/delete" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let tvManager = message.client.tempVoiceChannels;

        return message.client.helper.checkChannelIdValid(args[0], message.guild.id)
            .then(check => {
                if (check.type === 'voice' && tvManager.isTempVoiceChannel(args[0])) {
                    tvManager.removeTempVoiceChannel(args[0]);
                    return message.channel.send(new DiscordMessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setColor('#5b9d31')
                        .setTimestamp()
                        .setDescription(LANG.success + message.client.helper.makeChannelAt(args[0]))
                    );
                } else {
                    return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[0] + '` is either not a valid voice channel, or is not a tempvoice channel.').getEmbed());
                }
            })
            .catch(err => {
                console.log(err);
                message.channel.send(new ExecutionError(message.author, this.name, args).getEmbed());
            });
/*
        let check1 = await message.client.helper.checkChannelIdValid(args[0], message.guild.id);
        if (check1.type === 'voice' && tvManager.isTempVoiceChannel(args[0])) {
            tvManager.removeTempVoiceChannel(args[0]);
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('#5b9d31')
                .setTimestamp()
                .setDescription(LANG.success + message.client.helper.makeChannelAt(args[0]))
            );
        } else {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[0] + '` is either not a valid voice channel, or is not a tempvoice channel.').getEmbed());
        }
*/
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