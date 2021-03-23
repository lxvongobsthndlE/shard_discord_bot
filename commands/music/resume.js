const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: resume
 *  Resume the currently paused song
 */
module.exports = {
    name: 'resume',
    description: 'Resume the currently paused song.',
    aliases: ['unpause'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/resume" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | There is nothing in the queue right now!'));
        }

        message.client.distube.resume(message);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.distubeEmoji.pause + ' | Resumed the song for you :)'));

    }
}