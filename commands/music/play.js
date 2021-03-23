const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const VoiceError = require('../../errors/VoiceError');

/** Command: play
 *  Play music in a channel
 */
module.exports = {
    name: 'play',
    description: 'Play music in a channel.',
    args: true,
    usage: '<search query>',
    aliases: ['p'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/play" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let searchquery = args.join(' ');
        if (!searchquery) {
            return message.channel.send(new VoiceError(message.author, this.name, "No song url or query to search provided.").getEmbed());
        }

        try {
            message.client.distube.play(message, searchquery)
        } catch (e) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('#33cc33')
                .setDescription(message.client.distubeEmoji.error + '| Error: `' + e + '`'));
        }

    }
}