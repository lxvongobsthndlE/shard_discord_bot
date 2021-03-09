const fetch = require('node-fetch');
const DiscordMessageAttachment = require('discord.js').MessageAttachment;

/** Command: cat
 *  Uses https://aws.random.cat/meow for receiving random cat pictures.
 * 
 */
module.exports = {
    name: 'cat',
    description: 'Get a random picture of a cat!',
    args: false,
    usage: '',
    aliases: ['katze', 'miau', 'meow'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "cat" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        const randomCat = await fetch('https://aws.random.cat/meow').then(res => res.json());
        message.channel.send(new DiscordMessageAttachment(randomCat.file));
    }
}