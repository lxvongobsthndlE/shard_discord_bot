const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const emo = require('../configuration/emoji.js');

/** Command: huge-letters
 *  returns args in emoji letters
 */
module.exports = {
    name: 'huge-letters',
    description: 'Converts given text into "emoji" letters.',
    args: true,
    usage: '<text>',
    aliases: ['big-letters', 'emol'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "huge-letters" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var result = '';
        args.forEach(w => {
            w.split('').forEach(l => {
                e = emo[l.toLowerCase()]
                if (e) result += e + ' ';
            });
            result += '\n';
        });

        message.channel.send(new DiscordMessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(result));
        (message.deletable) ? message.delete().catch(console.error) : {};
    }
}