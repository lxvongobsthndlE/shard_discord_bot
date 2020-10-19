#!/usr/bin/env node
const Discord = require('discord.js');
const fetch = require('node-fetch');
const secret = require('./secret.json');
const config = require('./configuration/config.json');
const foaas = require('./configuration/foaas.json');
const emo = require('./configuration/emoji.js');
const emojiList = require('./configuration/data-ordered-emoji.js');
const shardHelp = require('./configuration/shard-help.json');
const twitchTrackedChannels = require('./configuration/twitchTrackedChannels.json');
const ShardTwitch = require('./shardTwitch');
const ShardGuildManager = require('./shardGuildManager');

//INIT discord.js
const discordClient = new Discord.Client();

//INIT shardTwitch.js
const twitchClient = new ShardTwitch();

//INIT shardGuildManager.js
const shardGuildManager = new ShardGuildManager();

//INIT globals
const defaultPrefix = config.prefix;


//Start client and set bot's status
discordClient.once('ready', async () => {
    console.log('Client ready!');
    discordClient.user.setActivity('Under development...');
    for(var i = 0; i < twitchTrackedChannels.length; i++) {
        twitchClient.startTrackingByName(twitchTrackedChannels[i]);
    }
});

//Login client
discordClient.login(secret.discordToken);

//EVENT on removal/leaving of a member
discordClient.on('guildMemberRemove', member => {
    const guildConfig = shardGuildManager.getGuildConfigById(member.guild.id);
    const memberLog = member.guild.channels.cache.get(guildConfig.memberLogChannelId);

    console.log(member.displayName + ' has left the server: ' + member.guild.name);
    if(memberLog) {
        memberLog.send(member_left(member));
    }
});

//EVENT on joining of a member
discordClient.on('guildMemberAdd', member => {
    const guildConfig = shardGuildManager.getGuildConfigById(member.guild.id);
    const welcomeChannel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
    const memberLog = member.guild.channels.cache.get(guildConfig.memberLogChannelId);
    guildConfig.welcomeMessage = fill_welcome_msg(member, new Discord.MessageEmbed(guildConfig.welcomeMessage));

    // Send the message to a designated channel on a server:
    console.log(member.displayName + ' joined ' + member.guild.name + '.');
    if(welcomeChannel) {
        welcomeChannel.send(guildConfig.welcomeMessage);
    }
    if(memberLog) {
        memberLog.send(member_joined(member));
    }
});

//EVENT on any message on any server
discordClient.on('message', async message => {
    //Allmighty Logger. Don't use this. Seriously, don't.
    //console.log('[' + message.guild.name + '] ' + message.author.tag + ': ' + message.content);

    var guildConfig = shardGuildManager.getGuildConfigById(message.guild.id);

    //Ignore not prefixed and bot messages
    if (!message.content.startsWith(guildConfig.prefix) || message.author.bot) return;
    
    //Syntax: <prefix><command> <args[0]> <args[1]> ...
    const args = message.content.slice(guildConfig.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case 'shard-test':
            if(message.author.id !== "313742410180198431") break;
            console.log('[DEV] ' + message.author.username + ' called "shard-test" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(shard_test(message, args));
            break;
        case 'help':
            console.log(message.author.username + ' called "help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(show_help(guildConfig.prefix, message.author));
            break;
        case 'config':
            console.log(message.author.username + ' called "config" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            if(!is_Admin(message.author.id, guildConfig.ADMIN_IDS)) break;; //Should throw error or open config help!
            if(args.length < 1) {
                args[0] = 'help';
            }
            switch(args.shift().toLowerCase()) {
                case 'help':
                    console.log(message.author.username + ' called "config/help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    message.channel.send(show_config_help());
                    break;
                case 'prefix':
                    console.log(message.author.username + ' called "config/prefix" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'prefix', args[0]);
                    message.channel.send(new Discord.MessageEmbed()
                                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                                    .setColor('#33cc33')
                                                    .setTimestamp()
                                                    .setTitle('Updated prefix')
                                                    .setDescription('The new prefix for this server is: **' + args[0] + '**'));
                    break;
                case 'welcome-channel':
                    console.log(message.author.username + ' called "config/welcome-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    if(!message.guild.channels.cache.has(args[0])) break; //Should throw error or open config help!
                    shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'welcomeChannelId', args[0]);
                    message.channel.send(new Discord.MessageEmbed()
                                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                                    .setColor('#33cc33')
                                                    .setTimestamp()
                                                    .setTitle('Updated welcome channel')
                                                    .setDescription('The new welcome channel for this server is: #' + message.guild.channels.cache.get(args[0]).name));
                    break;
                case 'memberlog-channel':
                    console.log(message.author.username + ' called "config/memberlog-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    if(!message.guild.channels.cache.has(args[0])) break; //Should throw error or open config help!
                    shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'memberLogChannelId', args[0]);
                    message.channel.send(new Discord.MessageEmbed()
                                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                                    .setColor('#33cc33')
                                                    .setTimestamp()
                                                    .setTitle('Updated member log channel')
                                                    .setDescription('The new member log channel for this server is: #' + message.guild.channels.cache.get(args[0]).name));
                    break;
                case 'explict-content':
                    console.log(message.author.username + ' called "config/explict-content" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    explictContent = args[0].toLowerCase();
                    if(explictContent === 'yes' || explictContent === 'true' || explictContent === 'ja') {
                        explictContent = true;
                        shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'explictFilter', false);
                    }
                    else {
                        shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'explictFilter', true);
                    }
                    message.channel.send(new Discord.MessageEmbed()
                                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                                    .setColor('#33cc33')
                                                    .setTimestamp()
                                                    .setTitle('Updated explict content settings')
                                                    .setDescription('Explict content is ' + (explictContent ? '**enabled**' : '**disabled**') + ' for this server.'));
                    break;
            }
            break;
        case 'server-info':
            console.log(message.author.username + ' called "server-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(server_info(message.guild));
            break;
        case 'hack':
            if(guildConfig.explictFilter) break; //Should throw error or exclude from help!
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

function show_config_help() {
    //TODO
    return 'Test response';
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
    .addField((args.length > 0) ? args[0] + ' is currently' : 'No channel provided', (args.length > 0) ? (await twitchClient.isTwitchStreamLive(args[0])) ? ':video_game: LIVE!' : ':x: OFFLINE' : 'Use Shard\'s help command to learn about command syntax')
    .setTimestamp();
}

function fill_welcome_msg(gMember, welcomeMsg) {
    return welcomeMsg
    .setTimestamp()
    .setFooter(gMember.guild.memberCount + ' total users on the server.', gMember.guild.iconURL())
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL());
}

function member_joined(gMember) {
    return new Discord.MessageEmbed()
    .setColor('#99ff99')
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
    .setDescription(gMember.user.username + ' joined the server.')
    .setFooter(gMember.guild.memberCount + ' total users on the server.')
    .setTimestamp();
} 

function member_left(gMember) {
    return new Discord.MessageEmbed()
    .setColor('#800000')
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
    .setDescription(gMember.user.username + ' left the server.')
    .setFooter(gMember.guild.memberCount + ' total users on the server.')
    .setTimestamp();
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
    for(var i = 0; i < adminIds.length; i++) {
        if(userId === adminIds[i]) return true;
    }
    return false;
}

//TEST

function shard_test(msg, args) {
    return (twitchClient.isTracked(args[0])) ? 'yes' : 'no';
}