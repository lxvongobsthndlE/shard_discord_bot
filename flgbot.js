const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./secret.json');
const config = require('./config.json');
const prefix = config.prefix;


client.once('ready', () => {
    console.log('Client ready!');
});

client.login(token);

client.on('message', message => {
    //Ignore not prefixed and bot messages
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    //Syntax: !<command> <args[0]> <args[1]> ...
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'server-info':
            console.log(message.author.username + ' called "server-info" command with args: ' + args);
            message.channel.send(server_info(message.guild));
            break;
    }
});

function server_info(guild){
    return `Server name: ${guild.name}\nOwner: ${guild.owner}\nRegion: ${guild.region}\nCurrent Members: ${guild.memberCount}\nCreated: ${guild.createdAt}`;
}