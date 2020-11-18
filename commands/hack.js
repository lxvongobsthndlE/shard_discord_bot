const fetch = require('node-fetch');
const Helper = require('../classes/Helper');
const foaas = require('../configuration/foaas.json');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: hack
 *  Uses https://foaas.com/ for receiving a random insult.
 * 
 */
module.exports = {
    name: 'hack',
    description: 'Try to hack the bot! It might defend itself though...',
    args: false,
    usage: '',
    explict: true,
    aliases: ['fuckoff'],
    async execute(message, args, guildConfig) {
        if(guildConfig.explictFilter) return;
        console.log(message.author.username + ' called "hack" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const helper = new Helper();
        var rnd = helper.getRandomInteger(0, foaas.length - 1);
        const backOff = await fetch('https://www.foaas.com/' + 
                                    foaas[rnd].endpoint + 
                                    ((foaas[rnd].name) ? '/' + message.author.username : '') + 
                                    ((foaas[rnd].from) ? '/ShardBOT' : ''), 
                                    {headers: {'Accept': 'text/plain'}})
                                    .then(res => res.text());
        message.channel.send(new DiscordMessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(backOff)
            .setTimestamp());
    }
}