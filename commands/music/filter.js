const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: filter
 *  Change the filter on the playing song
 */
module.exports = {
    name: 'filter',
    description: 'Change the filter on the currently playing song.',
    args: true,
    usage: '<filter>',
    aliases: ['filters'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/filter" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | There is nothing in the queue right now!'));
        }

        if (args[0] == 'off' && queue.filter) {
            message.client.distube.setFilter(message, queue.filter);
        } else if (Object.keys(message.client.distube.filters).includes(args[0])) {
            message.client.distube.setFilter(message, args[0]);
        } else if (args[0]) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | Not a valid filter!'));
        }

        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.distubeEmoji.arrow + ' | Current Queue Filter: `' + queue.filter || 'Off' + '`'));

    }
}