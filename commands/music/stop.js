const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: stop
 *  Stop the currently playing music and make the bot disconnect.
 */
module.exports = {
    name: 'stop',
    description: 'Stop the currently playing music and make the bot disconnect.',
    aliases: ['s', 'disconnect', 'leave'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/stop" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.config.emoji.error + ' | There is nothing in the queue right now!'));
        }

        message.client.distube.stop(message)

        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.config.emoji.stop + ' | Stopped playing music.'));

    }
}