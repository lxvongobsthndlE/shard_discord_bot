const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');

const DEFAULT_CHANNEL_SIZE = 10;

/** Command: create
 *  Create a voice channel, that creates tempvoice channels for users that enter.
 */
module.exports = {
    name: 'create',
    description: 'Create a voice channel, that creates tempvoice channels for users that enter. Arguments:\n'
        + '*<registerChannelID>*: The ID of the channel that will create tempvoice channels.\n'
        + '*<childCategoryID>*: The ID of the category in which all tempvoice channels will be created.\n'
        + '*[maxUsersPerChannel]*: The maximum amount of users allowed in a tempvoice channel.',
    args: true,
    usage: '<registerChannelID> <childCategoryID> [maxUsersPerChannel]',
    aliases: ['new'],
    i18n: {
        en: {
            success: "Success!\nAdded new tempvoice entry channel: "
        },
        de: {
            success: "Erfolg!\nTempVoice Channel Eingang hinzugefügt: "
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "tempvoice/create" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let tvManager = message.client.tempVoiceChannels;

        return message.client.helper.checkChannelIdValid(args[0], message.guild.id)
            .then(channel => {
                if (!channel || channel.type !== 'voice' || tvManager.isTempVoiceChannel(args[0])) {
                    return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[0] + '` is either not a valid voice channel, or is already a tempvoice channel.').getEmbed());
                }
                return message.client.helper.checkChannelIdValid(args[1], message.guild.id)
                    .then(cat => {
                    if (!cat || cat.type !== 'category') {
                        return message.channel.send(new ArgumentError(message.author, this.name, args, 'The childCategoryID `' + args[1] + '` is not a valid category.').getEmbed());
                    }
                    let channelSize = DEFAULT_CHANNEL_SIZE;
                    if (args[2] && isFinite(args[2]) && args[2] >= 1) {
                        channelSize = Math.round(args[2]);
                    }
                    tvManager.addNewTempVoiceChannel(args[0], args[1], channelSize, message.guild.id);
                    return message.channel.send(new DiscordMessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setColor('#5b9d31')
                        .setTimestamp()
                        .setDescription(LANG.success + message.client.helper.makeChannelAt(args[0]))
                    );
                });
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