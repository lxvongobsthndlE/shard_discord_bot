#!/usr/bin/env node
const Discord = require('discord.js');
//const Twitch = require('twitch');
//const TwitchAuth = require('twitch-auth');
const fetch = require('node-fetch');
const secret = require('./secret.json');
const config = require('./config.json');
const foaas = require('./foaas.json');
const emo = require('./emoji.js');
const emojiList = require('./data-ordered-emoji.js');

const prefix = config.prefix;
const discordClient = new Discord.Client();
//const twitchAuthProvider = new TwitchAuth.StaticAuthProvider(secret.twitchClientID, secret.twitchToken);
//const twitchClient = new Twitch.ApiClient({authProvider: twitchAuthProvider});

discordClient.once('ready', () => {
    console.log('Client ready!');
});

discordClient.login(secret.discordToken);

discordClient.on('guildMemberRemove', member => {
    console.log(member.tag + ' has left the server: ' + member.guild.name);
});

discordClient.on('guildMemberAdd', member => {
    console.log(member.tag + ' joined the server: ' + member.guild.name);
    var channel;
    var welcomeMsg;
    if(member.guild.id === "723198194414125126") { //LX Server
        guildConfig = require('./guildData/723198194414125126.json');
        channel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
        welcomeMsg = new Discord.MessageEmbed(guildConfig.welcomeMessage);
    }
    else if(member.guild.id === "743221608113766453") { //FLG Server
        guildConfig = require('./guildData/743221608113766453.json');
        channel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
        welcomeMsg = new Discord.MessageEmbed(guildConfig.welcomeMessage);
    }
    // Send the message to a designated channel on a server:
    if (channel) {
        console.log(member.displayName + ' joined ' + member.guild.name + '.');
        channel.send(fill_welcome_msg(member, welcomeMsg));
    }
});

discordClient.on('message', async message => {
    //FLG: 743221608113766453
    //LX:  723198194414125126 
    //console.log(message.guild.id + ' ' + message.guild.name);

    var prefix = '!';
    var admin_ids;

    if(message.guild.id === 723198194414125126) { //LX Server
        guildConfig = require('./guildData/723198194414125126.json');
        prefix = guildConfig.prefix;
        admin_ids = guildConfig.ADMIN_IDS;
    }
    else if(message.guild.id === 743221608113766453) { //FLG Server
        guildConfig = require('./guildData/743221608113766453.json');
        prefix = guildConfig.prefix;
        admin_ids = guildConfig.ADMIN_IDS;
    }

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
            message.channel.send(roll(message.author, args));
            break;
        case 'huge-letters':
            console.log(message.author.username + ' called "huge-letters" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            (args.length > 0) ? message.channel.send(huge_letters(message.author, args)) : message.channel.send(args_err(message.author));
            (message.deletable) ? message.delete().catch(console.error) : {};
            break;
        case 'react':
            console.log(message.author.username + ' called "react" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.react(emojiList[getRndInteger(0, emojiList.length)]);
            break;
        case 'help':
            console.log(message.author.username + ' called "help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(show_help(message.author));
            break;
    }

});

function show_help(user) {
    var localprefix = config.prefix;
    return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Shard help')
    .setThumbnail(discordClient.user.displayAvatarURL())
    .addFields(
        //{ name: '\u200B', value: '\u200B' },
        { name: localprefix + 'help', value: 'Show this message.', inline: false},
        { name: localprefix + 'server-info', value: 'Shows information about the server.', inline: false},
        { name: localprefix + 'hack', value: 'Try to hack the bot.', inline: false},
        { name: localprefix + 'react', value: 'Answers with a random reaction.', inline: false},
        { name: localprefix + 'roll <sides of dice> [<number of dices>]', value: 'Rolls a (or multiple) dice(s) and shows the result. If multiple dices are rolled, a total of all rolls is appended', inline: false},
        { name: localprefix + 'huge-letters <text>', value: 'Converts given text into "emoji" letters', inline: false}
    )
    .setFooter('Shard by @lxvongobsthndl#7893')
    .setTimestamp();
}

function server_info(guild){
    return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(guild.name, guild.iconURL())
    .addField('Owner', guild.owner, false)
    .addField('Region', guild.region, true)
    .addField('Members', guild.memberCount, true)
    .addField('Created at', guild.createdAt, false)
    .setFooter('Shard by @lxvongobsthndl#7893')
    .setTimestamp();
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
    if(!(args.length > 0 && !isNaN(args[0]) && args[0] > 1)) {
        return args_err(user);
    }
    var total = 0;
    var first_dice = getRndInteger(1, args[0]);
    total += first_dice;
    var embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(user.tag, user.displayAvatarURL())
    .addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + first_dice, true)
    .setTimestamp();
    for(i = 1; i < args[1]; i++) {
        var dice = getRndInteger(1, args[0]);
        total += dice;
        embed.addField(':game_die: Rolled ' + args[0] + ' sided dice:', 'Result: ' + dice, true);
    }
    if(embed.fields.length > 1) {
        embed.addField(':game_die: Total of ' + args[1] + ' rolls:', 'Result: ' + total, false);
    }
    return embed;
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

function fill_welcome_msg(member, welcomeMsg) {
    return welcomeMsg
    .setTimestamp()
    .setFooter(member.user.tag + ' | ' + member.guild.memberCount + ' total users on the server.', member.user.displayAvatarURL())
}

//---------------------------------------
// ERRORS

function args_err(user) {
    return new Discord.MessageEmbed()
    .setColor('#cc0000')
    .setTitle('Invalid arguments Error')
    .setDescription('The arguments you provided could not be processed.')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setTimestamp();
}

//---------------------------------------
// MISC

function getRndInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}