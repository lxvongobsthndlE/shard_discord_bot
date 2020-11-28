const fetch = require('node-fetch');
const DiscordMessageAttachment = require('discord.js').MessageAttachment;
const Helper = require('../classes/Helper');
const ArgumentError = require('../errors/ArgumentError');

/** Command: meme
 *  Uses https://github.com/D3vd/Meme_Api for receiving memes from reddit.
 * 
 */
module.exports = {
    name: 'meme',
    description: 'Get a random meme from Reddit. Only usable if the server has a meme channel!',
    args: false,
    usage: '[subreddit]',
    aliases: ['witzbild'],
    async execute(message, args, guildConfig) {
        if (message.channel.id !== guildConfig.memeChannelId) return;
        console.log(message.author.username + ' called "meme" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const helper = new Helper();
        var randomMeme;
        if(args[0]) {
            do{
                randomMeme = await fetch('https://meme-api.herokuapp.com/gimme/' + args[0]).then(res => res.json());
            }while(randomMeme.nsfw);
            if(randomMeme.code == 404) {
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The subreddit provided has no posts or doesn\'t exist.').getEmbed());
            }
        }
        else {
            var randomsub = subreddits[helper.getRandomInteger(0, subreddits.length - 1)];
            do{
                randomMeme = await fetch('https://meme-api.herokuapp.com/gimme/' + randomsub).then(res => res.json());
            }while(randomMeme.nsfw); 
        }
        return message.channel.send(randomMeme.title + '\nPosted by u/' + randomMeme.author + ' in r/' + randomMeme.subreddit, new DiscordMessageAttachment(randomMeme.url));
    }
}

const subreddits = ['memes', 'dankmemes', 'me_irl', 'wholesomememes', 'historymemes', 'funny', 'ich_iel'];