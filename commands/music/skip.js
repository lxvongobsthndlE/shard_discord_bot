const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: skip
 *  Skip the currently playing song
 */
module.exports = {
    name: 'skip',
    description: 'Skip the currently playing song.',
    aliases: [],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/skip" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | There is nothing in the queue right now!'));
        }

        try {
            message.client.distube.skip(message);
            message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('#33cc33')
                .setDescription(message.client.distubeEmoji.success + ' | Skipped! Now playing:\n`' + queue.songs[0].name + '`'));
        } catch (e) {
            message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | ' + e));
        }

    }
}