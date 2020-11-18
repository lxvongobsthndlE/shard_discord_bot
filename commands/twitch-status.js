const ShardTwitch = require('../shardTwitch');

const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: twitch-status
 *  Checks if a given Twitch channel is currently streaming.
 */
module.exports = {
    name: 'twitch-status',
    description: 'Checks if a given Twitch channel is currently streaming.',
    args: true,
    usage: '<channel name>',
    aliases: ['ts', 'tstatus'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "twitch-status" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const twitchClient = new ShardTwitch();

        var streamStatus = (await twitchClient.isTwitchStreamLive(args[0])) ? ':video_game: LIVE!' : ':x: OFFLINE';

        message.channel.send(new DiscordMessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField(args[0] + ' is currently', streamStatus)
            .setTimestamp());
    }
}