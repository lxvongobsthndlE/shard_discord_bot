const fetch = require('node-fetch');
const DiscordMessageAttachment = require('discord.js').MessageAttachment;

/** Command: meme
 *  Uses https://github.com/D3vd/Meme_Api for receiving memes from reddit.
 * 
 */
module.exports = {
    name: 'meme',
    description: 'Get a random meme from Reddit. Only usable if the server has a meme channel!',
    args: false,
    usage: '',
    aliases: ['witzbild'],
    async execute(message, args, guildConfig) {
        if (message.channel.id !== guildConfig.memeChannelId) return;
        console.log(message.author.username + ' called "meme" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        const randomMeme = await fetch('https://meme-api.herokuapp.com/gimme').then(res => res.json());
        message.channel.send(randomMeme.title + '\nPosted by u/' + randomMeme.author + ' in r/' + randomMeme.subreddit, new DiscordMessageAttachment(randomMeme.url));
    }
}