const fetch = require('node-fetch');
const DiscordMessageAttachment = require('discord.js').MessageAttachment;

/** Command: dog
 *  Uses https://dog.ceo/dog-api/ for receiving random dog pictures.
 * 
 */
module.exports = {
    name: 'dog',
    description: 'Get a random picture of a dog!',
    args: false,
    usage: '',
    aliases: ['hund', 'wau'],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "dog" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        const randomDog = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
        message.channel.send(new DiscordMessageAttachment(randomDog.message));
    }
}