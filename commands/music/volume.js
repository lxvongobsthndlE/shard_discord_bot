const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: volume
 *  Change the volume of the currently playing song
 */
module.exports = {
    name: 'volume',
    description: 'Change the volume of the currently playing song.',
    args: true,
    usage: '<volume>',
    aliases: ['vol', 'v'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/volume" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | There is nothing in the queue right now!'));
        }

        let volume = parseInt(args[0]);

        if (isNaN(volume)) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.distubeEmoji.error + ' | Please enter a valid number!'));
        }

        message.client.distube.setVolume(message, volume);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.distubeEmoji.success + ' | Volume set to `' + volume + '`'));

    }
}