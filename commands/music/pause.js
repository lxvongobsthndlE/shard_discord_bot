const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: pause
 *  Pause the currently playing song
 */
module.exports = {
    name: 'pause',
    description: 'Pause the currently playing song.',
    aliases: ['hold'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/pause" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | There is nothing in the queue right now!'));
        }

        if (queue.pause) {
            message.client.distube.resume(message);
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('#33cc33')
                .setDescription(message.client.distubeEmoji.play + ' | Resumed the song for you :)'));
        }

        message.client.distube.pause(message);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.distubeEmoji.pause + ' | Paused the song for you :)'));

    }
}