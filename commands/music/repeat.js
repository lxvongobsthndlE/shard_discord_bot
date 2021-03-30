const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: repeat
 *  Change Repeat mode. Modes: `off`, `song`, `queue`.
 */
module.exports = {
    name: 'repeat',
    description: 'Change Repeat mode. Modes: `off`, `song`, `queue`.',
    args: true,
    usage: '<mode>',
    aliases: ['loop', 'rp'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/repeat" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.config.emoji.error + ' | There is nothing playing right now!'));
        }

        let mode = (args[0] == 'off') ? 0 : (args[0] == 'song') ? 1 : (args[0] == 'queue') ? 2 : null;
        mode = message.client.distube.setRepeatMode(message, mode);
        mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off";
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.config.emoji.repeat + ' | Set repeat mode to `' + mode + '`'));
    }
}