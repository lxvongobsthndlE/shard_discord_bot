const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: autoplay
 *  Toggle Autoplay.
 */
module.exports = {
    name: 'autoplay',
    description: 'Toggle Autoplay.',
    aliases: ['ap'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/autoplay" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let mode = message.client.distube.toggleAutoplay(message);
        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.config.emoji.arrow + ' | Set autoplay mode to `' + (mode ? 'On' : 'Off') + '`'));
    }
}