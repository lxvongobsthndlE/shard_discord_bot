const Helper = require('../classes/Helper');
const ArgumentError = require('../errors/ArgumentError');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: roll <sides> [<dices>]
 *  rolls one (default) or multiple dices with an specified amount of sides.
 */
module.exports = {
    name: 'roll',
    description: 'Rolls one (or multiple) dice(s) and shows the result. If multiple dices are rolled, a total of all rolls is appended.',
    args: true,
    usage: '<sides> [dices]',
    aliases: ['würfeln'],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "roll" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        //Check first (mandatory) argument
        if(isNaN(args[0]) || args[0] < 1) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'Provided first argument is not a number or to small!').getEmbed());
        }

        const helper = new Helper();

        var total = 0;
        var dice = helper.getRandomInteger(1, args[0]);
        total += dice;
        var embed = new DiscordMessageEmbed()
        .setColor('#0099ff')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + dice, true)
        .setTimestamp();

        //Check second (optional) argument
        if (args[1]) {
            if (isNaN(args[1]) || args[1] < 1) {
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'Provided second argument is not a number or to small!').getEmbed());
            }

            for (i = 1; i < args[1]; i++) {
                dice = helper.getRandomInteger(1, args[0]);
                total += dice;
                embed.addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + dice, true);
            }
            if (embed.fields.length > 1) {
                embed.addField(':game_die: Total of ' + args[1] + ' rolls:', 'Result: ' + total, false);
            }
        }

        message.channel.send(embed);
    }
}