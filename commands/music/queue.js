const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: queue
 *  Show queued songs
 */
module.exports = {
    name: 'queue',
    description: 'Show queued songs.',
    aliases: ['q'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "music/queue" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let queue = message.client.distube.getQueue(message);
        if (!queue) {
            return message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor('red')
                .setDescription(message.client.config.emoji.error + ' | There is nothing playing right now!'));
        }

        let embed = new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#33cc33')
            .setDescription(message.client.config.emoji.queue + ' | **Server Queue**');

        queue.songs.forEach((song, i) => {
            if (i == 0) {
                embed.setDescription(embed.description + '\n\n' + message.client.config.emoji.play + ' Playing: `' + song.name + '` - `' + song.formattedDuration + '`\nNext Up:');
            }
            else {
                embed.setDescription(embed.description + '\n' +  message.client.config.emoji.queue + i + '. `' + song.name + '` - `' + song.formattedDuration + '`')
            }
        });
        message.channel.send(embed);



    }
}