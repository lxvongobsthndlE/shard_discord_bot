const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
const {token} = require('./secret.json');
const config = require('./config.json');
const prefix = config.prefix;


client.once('ready', () => {
    console.log('Client ready!');
});

client.login(token);

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
    }
});

function server_info(guild){
    return `Server name: ${guild.name}\nOwner: ${guild.owner}\nRegion: ${guild.region}\nCurrent Members: ${guild.memberCount}\nCreated: ${guild.createdAt}`;
}

function hack(user) {
    return fetch('https://www.foaas.com/back/' + user.username + '/ShardBOT', {headers: {'Accept': 'text/plain'}}).then(res => res.text());
}