const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: temp-voice
 *  Manage tempVoice Channels on the Server.
 */
module.exports = {
    name: 'tempvoice',
    description: 'Manage temporary voice channels on the Server.',
    args: true,
    usage: '<add|remove> <registerChannelID> <childCategoryID> [maxUsersPerChannel]',
    aliases: ['tv'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "config/tempVoice" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let retMessage = new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#5b9d31')
            .setTimestamp();

        if(args[0] == 'add') {
            message.client.tempVoiceChannels.addNewTempVoiceChannel(args[1], args[2], args[3] ? args[3] : 10);
            message.channel.send(retMessage.setDescription('Success!\nAdded new temp voice channel.'));
        }
        else if(args[0] == 'remove') {
            message.client.tempVoiceChannels.removeTempVoiceChannel(args[1]);
            message.channel.send(retMessage.setDescription('Success!\nRemoved temp voice channel.'));
        }
    }
}