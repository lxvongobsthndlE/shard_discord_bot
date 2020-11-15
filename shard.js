#!/usr/bin/env node
const Discord = require('discord.js');
const ReactionRoleManager = require("discord-reaction-role");
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

//INIT reactionRoleManager
const roleManager = new ReactionRoleManager(discordClient, {
    storage: "./configuration/reaction-roles.json"
});

//INIT globals
const defaultPrefix = config.prefix;


//Start client and set bot's status
discordClient.once('ready', async () => {
    console.log('Client ready!');
    discordClient.user.setActivity('with the memes!', {type: "PLAYING"});
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
            //message.channel.send(shard_test(message, args));
            flg_rules(message.guild).forEach(rule => {
                message.channel.send(rule);
            });
            break;
        case 'help':
            console.log(message.author.username + ' called "help" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            message.channel.send(show_help(guildConfig.prefix, message.author));
            break;
        case 'meme':
            if(message.channel.id !== guildConfig.memeChannelId) break;
            console.log(message.author.username + ' called "meme" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            const randomMeme = await meme();
            message.channel.send(randomMeme.title + '\nPosted by u/' + randomMeme.author + ' in r/' + randomMeme.subreddit, new Discord.MessageAttachment(randomMeme.url));
            break;
        case 'dog':
            console.log(message.author.username + ' called "dog" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
            const randomDog = await dog();
            message.channel.send(new Discord.MessageAttachment(randomDog.message));
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
                case 'reactionrole':
                    console.log(message.author.username + ' called "config/reactionrole" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    var role = message.guild.roles.cache.get(args[0]);
                    var reaction = (args[1]) ? args[1] : emojiList[getRndInteger(0, emojiList.length)];
                    if(role) {
                        message.channel.send(new Discord.MessageEmbed()
                                                        .setAuthor('Request a role')
                                                        .setColor('#33cc33')
                                                        .setTitle(role.name)
                                                        .setDescription('To get the **' + role.name + '** role react with ' + reaction))
                                        .then(msg => {
                                            if(reaction.startsWith('<')) {
                                                reaction = reaction.split(':')[reaction.split(':').length - 1].substring(0, reaction.split(':')[reaction.split(':').length - 1].length - 1);
                                            }
                                            roleManager.create({
                                                messageID: msg.id,
                                                channel: message.channel,
                                                reaction: reaction,
                                                role: role
                                            });
                                        });
                    } //Should throw error
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
                case 'meme-channel':
                    console.log(message.author.username + ' called "config/meme-channel" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
                    if(args.length < 1) break; //Should throw error or open config help!
                    if(!message.guild.channels.cache.has(args[0])) break; //Should throw error or open config help!
                    shardGuildManager.updateGuildConfigById(guildConfig.guildId, 'memeChannelId', args[0]);
                    message.channel.send(new Discord.MessageEmbed()
                                                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                                                    .setColor('#33cc33')
                                                    .setTimestamp()
                                                    .setTitle('Updated meme channel')
                                                    .setDescription('The new meme channel for this server is: #' + message.guild.channels.cache.get(args[0]).name));
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
                        explictContent = false;
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
    .setFooter('Shard by @lxvongobsthndl')
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
    .setFooter('Shard by @lxvongobsthndl')
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

async function meme() {
    //https://github.com/D3vd/Meme_Api
    const randomMeme = await fetch('https://meme-api.herokuapp.com/gimme').then(res => res.json());
    return randomMeme;
}

async function dog() {
    //https://dog.ceo/dog-api/
    const randomDog = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());
    return randomDog;
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
    //!config reactionrole <roleID> [<reaction>]
    var guildRoles = msg.guild.roles.cache;
    //guildRoles.forEach(r => console.log(r.name));
    //console.log("-------------");
    var userRoles = msg.guild.members.cache.get(msg.author.id).roles.cache;
    userRoles.forEach(r => console.log(r.name));
    console.log("-------------");
    var xboxRole = guildRoles.get("770563429995380746");
    var roleManager = new Discord.GuildMemberRoleManager(msg.guild.members.cache.get(msg.author.id));
    roleManager.add(xboxRole);
    return "check console.";
}


function add_role(msg, args) {
    var roleManager = new Discord.GuildMemberRoleManager(msg.guild.members.cache.get(msg.author.id));
    var guildRoles = msg.guild.roles.cache;
    var config = shardGuildManager.getGuildConfigById(msg.guild.id);
    // TODO: GET GETTABLE ROLES FROM CONFIG
    //       GET FULL ROLE FROM GUILDROLES
    //       CHECK ARGS WITH GETTABLE ROLES
    //       ADD ROLE TO USER roleManager.add(role)
}

function flg_rules(guild) {
    return [
    new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(guild.name, guild.iconURL())
    .setTitle('Regeln')
    .setDescription('**Bitte lies dir die folgenden Regeln vollständig durch!**\nSie dienen jedem hier auf dem Server und helfen eine gesunde Gemeinschaft zu erhalten.'),
    new Discord.MessageEmbed()
    .setColor('#ff4c4c')
    .setTitle('§1 - Allgemein')
    .addField('§1.1 Nicknames und Beschreibungen', 'Nicknames und Beschreibungen dürfen keine beleidigenden oder anderen verbotenen Namen oder Namensteile enthalten, zudem dürfen keine Namen kopiert werden, sich als jemand anderes ausgegeben werden oder andere Leute damit gestört werden.')
    .addField('§1.2 Avatare', 'Avatare dürfen keine pornographische, sexistische, rassistische oder verbotene Symbole oder Abbildungen beinhalten.')
    .addField('§1.3 Datenschutz', 'Private Daten wie Telefonnr., Adressen, Passwörter, private Bilder, etc. dürfen nicht öffentlich ausgetauscht werden, zudem dürfen Daten ohne Erlaubnis des Besitzers nicht weitergegeben werden – auch nicht privat.')
    .addField('§1.4 Werbung', 'Fremdwerbung jeglicher Art ist strengstens untersagt. Auch als Privatnachricht an User.'),
    new Discord.MessageEmbed()
    .setColor('#7d3f98')
    .setTitle('§2 - Chat')
    .addField('§2.1', 'Beleidigungen, provokante Diskussionen, Aggressivität und jegliche Art von Spam sind zu unterlassen.')
    .addField('§2.2', 'bewusste Falschaussagen / Trolling ist untersagt.')
    .addField('§2.3', 'Pornografisches Material, Rassismus, Sexismus und Antisemitismus in jeglicher Form wird nicht geduldet.')
    .addField('§2.4', 'Aussagen/Verbreitung von Material zu Gewalt und den in §2.3 genannten Punkten wird mit einem permanenten Ban geahnded.')
    .addField('§2.5', 'Anstiften zu Regelbrüchen ist verboten.')
    .addField('§2.6', 'Caps Lock sparsam einsetzen.')
    .addField('§2.7', 'Angelegenheiten mit dem Mod-/ Adminteam werden bitte per Privatchat besprochen.'),
    new Discord.MessageEmbed()
    .setColor('#511378')
    .setTitle('§3 - Sprachchat')
    .addField('§3.1', 'Unter **keinen** Umständen darf die Stimme (+ LIVE-Übertragungen) anderer User ohne deren Einverständnis aufgenommen werden.')
    .addField('§3.2', 'Wer in einem Stream dabei ist (#stream Sprachkanal), gibt sein Einverständnis zu §3.1 durch den Beitritt in den Kanal ab.')
    .addField('§3.3', 'Respektiert andere Meinungen auch wenn sie nicht eurer eigenen entsprechen.')
    .addField('§3.4', 'Absichtliche oder unabsichtliche Störgeräusche sind möglichst zu vermeiden.'),
    new Discord.MessageEmbed()
    .setColor('#fbb034')
    .setTitle('§4 - Zusatz: Verlosungen/Giveaways')
    .addField('§4.1', 'Es gibt keinen Anspruch auf eine Barauszahlung eines Gewinns.')
    .addField('§4.2', 'Der Gewinner muss sich innerhalb von 24 Stunden nach Ende der Verlosung beim Ausrichter der Verlosung melden um seinen Gewinn einzufordern, ansonsten wird ein neuer Gewinner ausgelost.')
    .addField('§4.3', 'Anspruch auf einen Gewinn hat nur, wer zum Zeitpunkt der Auslosung Mitglied auf dem Server ist und **nicht** gebannt ist.')
    .addField('§4.4', 'Die Gewinnchancen mit unfairen Mitteln zu heben, ist verboten und wird entsprechend geahnded.')
    .addField('§4.5', 'Aus Fairness-Gründen und weil wir wollen, dass jeder in den Genuss eines Gewinns kommen kann, behalten wir uns vor eine Auslosung zu wiederholen, sollte eine Person gelost worden sein, die bereits eine der letzten 3 Verlosungen gewonnen hat.'),
    new Discord.MessageEmbed()
    .setColor('#be0027')
    .setTitle('§5 - Konsequenzen bei Regelbrüchen')
    .addField('§5.1', 'Unwissenheit schützt vor Strafe nicht!')
    .addField('§5.2', 'Wir behalten uns vor bei größeren und in kürzester Zeit häufigen Vergehen, jeden sofort vom Discord zu verweisen.')
    .addField('§5.3', 'Wir sind nicht gewillt, Mitglieder zu dulden, die sich bewusst in den Grauzonen unseres Regelwerks bewegen.')
    .addField('§5.4', 'Jeder Regelbruch wird in der Regel mit einer Verwarnung geahndet.')
    .addField('§5.5', 'Sammelt man mehrere Verwarnungen, kann eine weitere Konsequenz der Ausschluss vom Server sein.')
    .addField('§5.6', 'Wird eine Aktion der Moderatoren als nicht in Ordnung erachtet, wird das der Administration via Privatnachricht mitgeteilt und nicht öffentlich diskutiert oder angeheizt.')
    .setFooter('Shard by @lxvongobsthndl')
    .setTimestamp()
    ]
}