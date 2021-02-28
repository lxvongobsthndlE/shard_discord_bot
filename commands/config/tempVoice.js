const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ArgumentError = require('../../errors/ArgumentError');

const defaultChannelSize = 10;

/** Command: temp-voice
 *  Manage tempVoice Channels on the Server.
 */
module.exports = {
    name: 'tempvoice',
    description: 'Manage temporary voice channels on the Server.\nOptions include: help, add, remove, naming, placeholders, count',
    args: true,
    usage: '<option>',
    aliases: ['tv'],
    async execute (message, args, guildConfig) {
        console.log(message.author.username + ' called "config/tempVoice" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let helper = message.client.helper;
        let tvManager = message.client.tempVoiceChannels;

        let retMessage = new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#5b9d31')
            .setTimestamp();

        //help
        if (args[0] == 'help') {
            return message.channel.send(
                retMessage.setDescription('Available **tempvoice** commands:')
                    .addField(guildConfig.prefix + 'config tempvoice add <registerChannelID> <childCategoryID> [maxUsersPerChannel]', 
                        'Create a new tempvoice channel with:\n'
                        + '*<registerChannelID>*: The ID of the channel that will create tempvoice channels.\n'
                        + '*<childCategoryID>*: The ID of the category in which all tempvoice channels will be created.\n'
                        + '*[maxUsersPerChannel]*: The maximum amount of users allowed in a tempvoice channel (*default: ' + defaultChannelSize + '*)')
                    .addField(guildConfig.prefix + 'config tempvoice remove <registerChannelID>', 
                        'Remove a tempvoice channel from your server with:\n'
                        + '*<registerChannelID>*: The ID of the tempvoice channel to remove.')
                    .addField(guildConfig.prefix + 'config tempvoice naming <registerChannelID> <text>',
                        'Change the naming of tempvoice channels with:\n'
                        + '*<registerChannelID>*: The ID of the tempvoice channel to change the naming of.\n'
                        + '*<text>*: The desired naming. (Can use placeholders!)')
                    .addField(guildConfig.prefix + 'config tempvoice placeholders',
                        'Shows all available placeholders for *naming* command')
                    .addField(guildConfig.prefix + 'config tempvoice count',
                        'Get the amount of registered tempvoice channels on your server.')
                    .addField(guildConfig.prefix + 'config tempvoice help',
                        'Shows this help message.')
            );
        }
        //add <registerChannelID> <childCategoryID> [maxUsersPerChannel]
        if (args[0] == 'add') {
            let check1 = await helper.checkChannelIdValid(args[1], message.guild.id);
            let check1_1 = await !tvManager.isTempVoiceChannel(args[1]);
            let check2 = await helper.checkChannelIdValid(args[2], message.guild.id);
            if (check1.type == 'voice' && check1_1) {
                if (check2.type == 'category') {
                    let channelSize = defaultChannelSize;
                    if (args[3] && isFinite(args[3]) && args[3] >= 0.5) {
                        channelSize = Math.round(args[3]);
                    }
                    tvManager.addNewTempVoiceChannel(args[1], args[2], channelSize);
                    return message.channel.send(retMessage.setDescription('Success!\nAdded new tempvoice channel with entry: ' + helper.makeChannelAt(args[1])));
                }
                else {
                    return message.channel.send(new ArgumentError(message.author, this.name, args, 'The childCategoryID `' + args[2] + '` is not a valid category.').getEmbed());
                }
            }
            else {
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[1] + '` is either not a valid voice channel, or is already a tempvoice channel.').getEmbed());
            }
            
        }
        //remove <registerChannelID>
        else if (args[0] == 'remove') {
            let check1 = await helper.checkChannelIdValid(args[1], message.guild.id);
            if (check1.type == 'voice' && tvManager.isTempVoiceChannel(args[1])) {
                tvManager.removeTempVoiceChannel(args[1]);
                return message.channel.send(retMessage.setDescription('Success!\nRemoved tempvoice channel with entry: ' + helper.makeChannelAt(args[1])));
            }
            else {
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[1] + '` is either not a valid voice channel, or is not a tempvoice channel.').getEmbed());
            }
        }
        //naming <registerChannelID> <text>
        else if (args[0] == 'naming') {
            let check1 = await helper.checkChannelIdValid(args[1], message.guild.id);
            if (check1.type == 'voice' && tvManager.isTempVoiceChannel(args[1])) {
                if (!args[2]) {
                    return message.channel.send(new ArgumentError(message.author, this.name, args, 'Missing argument `text`.').getEmbed());
                }
                let text = args.slice(2).join(' ');
                tvManager.setNaming(args[1], text);
                return message.channel.send(retMessage.setDescription('Success!\nAdded new naming for tempvoice channel with entry: ' + helper.makeChannelAt(args[1]) + '\nNaming: ' + text));
            }
            else {
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The registerChannelID `' + args[1] + '` is either not a valid voice channel, or is not a tempvoice channel.').getEmbed());
            }
        }
        //placeholders
        else if (args[0] == 'placeholders') {
            return message.channel.send(
                retMessage.setDescription('Available Placeholders for the tempvoice *naming* command:')
                    .addField('%member%', 'The name of the member opening the tempvoice.')
                    .addField('%count%', 'The number (id) the voice channel will get.')
            );
        }
        //count
        else if (args[0] == 'count') {
            let channelCount = await tvManager.getTempVoiceChannelCount(message.guild.id);
            return message.channel.send(retMessage.setDescription('This Server has a total of **' + channelCount + '** tempvoice channels.'));
        }
        else {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'Could not parse option `' + args[0] + '`. \nValid options are: `help`, `add`, `remove`, `naming`, `placeholders`, `count`.').getEmbed());
        }
    }
}
