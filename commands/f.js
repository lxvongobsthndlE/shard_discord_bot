const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: f
 *  Press F to pay respect.
 *  F Emoji from lxServer: <:press_F:826458287301591041>
 */
module.exports = {
    name: 'f',
    description: 'Press F to pay respect.',
    args: false,
    usage: '[pay respect to]',
    aliases: ['eff'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "f" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        
        if(args && args.length >= 1){
            message.channel.send(`${message.author} has paid their respect for **${args.join(' ')}** <:press_F:826458287301591041>`)
        }else{
            message.channel.send(`${message.author} has paid their respect <:press_F:826458287301591041>`)
        }
        message.delete();

    }
}