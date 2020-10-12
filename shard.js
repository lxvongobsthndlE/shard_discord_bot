#!/usr/bin/env node
const Discord = require('discord.js');
const Twitch = require('twitch');
const TwitchAuth = require('twitch-auth');
const fetch = require('node-fetch');
const secret = require('./secret.json');
const config = require('./configuration/config.json');
const foaas = require('./configuration/foaas.json');
const emo = require('./configuration/emoji.js');
const emojiList = require('./configuration/data-ordered-emoji.js');
const shardHelp = require('./configuration/shard-help.json');

//INIT discord.js
const discordClient = new Discord.Client();

//INIT twitch.js
const twitchClientId = secret.twitchClientId;
const twitchClientSecret = secret.twitchClientSecret;
const twitchAuthProvider = new TwitchAuth.ClientCredentialsAuthProvider(twitchClientId, twitchClientSecret);
const twitchClient = new Twitch.ApiClient({ authProvider: twitchAuthProvider });

//INIT globals
const defaultPrefix = config.prefix;

//Start client and set bot's status
discordClient.once('ready', async () => {
    console.log('Client ready!');
    discordClient.user.setActivity('Under development...');
});

//Login client
discordClient.login(secret.discordToken);

//EVENT on removal/leaving of a member
discordClient.on('guildMemberRemove', member => {
    console.log(member.displayName + ' has left the server: ' + member.guild.name);
});

//EVENT on joining of a member
discordClient.on('guildMemberAdd', member => {
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

//EVENT on any message on any server
discordClient.on('message', async message => {
    //Allmighty Logger. Don't use this. Seriously, don't.
    //console.log('[' + message.guild.name + '] ' + message.author.tag + ': ' + message.content);

    var prefix = defaultPrefix;
    var admin_ids;
    var explictFilter = false;

    if(message.guild.id === "723198194414125126") { //LX Server
        guildConfig = require('./guildData/723198194414125126.json');
        prefix = guildConfig.prefix;
        admin_ids = guildConfig.ADMIN_IDS;
        explictFilter = guildConfig.explictFilter;
    }
    else if(message.guild.id === "743221608113766453") { //FLG Server
        guildConfig = require('./guildData/743221608113766453.json');
        prefix = guildConfig.prefix;
        admin_ids = guildConfig.ADMIN_IDS;
        explictFilter = guildConfig.explictFilter;
    }

    //Ignore not prefixed and bot messages
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    //Syntax: <prefix><command> <args[0]> <args[1]> ...
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'shard-test':
            if(message.author.id !== "313742410180198431") break;
            console.log('[DEV] ' + message.author.username + ' called "shard-test" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            break;
        case 'help':
            console.log(message.author.username + ' called "help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(show_help(prefix, message.author));
            break;
        case 'server-info':
            console.log(message.author.username + ' called "server-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(server_info(message.guild));
            break;
        case 'hack':
            if(explictFilter) break; //Should throw error or exclude from help!
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
        case 'twitch-status':
            console.log(message.author.username + ' called "twitch-status" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(await twitch_status(message.author, args));
            break;
    }

});

function show_help(localprefix, user) {
    var response = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Shard help')
    .setThumbnail(discordClient.user.displayAvatarURL())
    .setFooter('Shard by @lxvongobsthndl#7893')
    .setTimestamp();
    for(i = 0; i < shardHelp.length; i++) {
        response.addField(localprefix + shardHelp[i].command, shardHelp[i].description);
    }
    return response;
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

async function twitch_status(user, args) {
    return new Discord.MessageEmbed()
    .setColor((args.length > 0) ? '#0099ff' : '#cc0000')
    .setAuthor(user.tag, user.displayAvatarURL())
    .addField((args.length > 0) ? args[0] + ' is currently' : 'No channel provided', (args.length > 0) ? (await isTwitchStreamLive(args[0])) ? 'LIVE!' : 'OFFLINE' : 'Use Shard\'s help command to learn about command syntax')
    .setTimestamp();
}

function fill_welcome_msg(member, welcomeMsg) {
    return welcomeMsg
    .setTimestamp()
    .setFooter(member.guild.memberCount + ' total users on the server.', member.guild.iconURL())
    .setAuthor(member.user.tag, member.user.displayAvatarURL());
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

function is_Admin(userId, adminIds) {
    for(id in adminIds) {
        if(userId === id) return true;
    }
    return false;
}

async function isTwitchStreamLive(channelName) {
    const user = await twitchClient.helix.users.getUserByName(channelName);
	if (!user) {
		return false;
	}
	return await twitchClient.helix.streams.getStreamByUserId(user.id) !== null;
}