#!/usr/bin/env node
const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
const {token} = require('./secret.json');
const config = require('./config.json');
const foaas = require('./foaas.json');
const emo = require('./emoji.js');
const prefix = config.prefix;


client.once('ready', () => {
    console.log('Client ready!');
});

client.login(token);

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    if (!channel) return;

    channel.send(`Welcome to the server, ${member}`);
  });

client.on('message', async message => {
    //Ignore not prefixed and bot messages
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    //Syntax: !<command> <args[0]> <args[1]> ...
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'server-info':
            console.log(message.author.username + ' called "server-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(server_info(message.guild));
            break;
        case 'hack':
            console.log(message.author.username + ' called "hack" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            const backOff = await hack(message.author);
            message.channel.send(backOff);
            break;
        case 'roll':
            console.log(message.author.username + ' called "roll" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            (args.length > 0 && args[0] > 0) ? message.channel.send(roll(message.author, args)) : message.channel.send(args_err(message.author));
            break;
        case 'huge-letters':
            console.log(message.author.username + ' called "huge-letters" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            (args.length > 0) ? message.channel.send(huge_letters(message.author, args)) : message.channel.send(args_err(message.author));
            (message.deletable) ? message.delete().catch(console.error) : {};
            break;
    }
});

function server_info(guild){
    return `Server name: ${guild.name}\nOwner: ${guild.owner}\nRegion: ${guild.region}\nCurrent Members: ${guild.memberCount}\nCreated: ${guild.createdAt}`;
}

async function hack(user) {
    var rnd = getRndInteger(0, foaas.length - 1);
    const backOff = await fetch('https://www.foaas.com/' + foaas[rnd].endpoint + ((foaas[rnd].name) ? '/' + user.username : '') + ((foaas[rnd].from) ? '/ShardBOT' : ''), {headers: {'Accept': 'text/plain'}}).then(res => res.text());
    return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription(backOff)
        .setTimestamp();
}

function roll(user, args) {
    var embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(user.tag, user.displayAvatarURL())
    .addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + getRndInteger(1, args[0]), true)
    .setTimestamp();
    for(i = 1; i < args[1]; i++) {
        embed.addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + getRndInteger(1, args[0]), true);
    }
    return embed;
}


function args_err(user) {
    return new Discord.MessageEmbed()
    .setColor('#cc0000')
    .setTitle('Invalid arguments Error')
    .setDescription('The arguments you provided could not be processed.')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setTimestamp();
}

function huge_letters(user, args) {
    var result = '';
    args.forEach(w => {
        w.split('').forEach(l => {
            e = emo[l.toLowerCase()]
            if(e) result += e + ' ';
        });
        result += '\n';
    });
    return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setTimestamp()
    .setDescription(result);
}

//---------------------------------------
// MISC

function getRndInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

