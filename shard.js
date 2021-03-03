#!/usr/bin/env node
const Discord = require('discord.js');
const fs = require('fs');
const secret = require('./secret.json');
const config = require('./configuration/config.json');
const presence = require('./botData/presence.json');
const ReactionRolesManager = require('discord-reaction-role');
const { GiveawaysManager } = require('discord-giveaways');
const ShardGuildManager = require('./classes/shardGuildManager');
const ShardTwitch = require('./classes/shardTwitch');
const ShardTempVoice = require('./classes/shardTempVoice');
const ArgumentError = require('./errors/ArgumentError');
const ExecutionError = require('./errors/ExecutionError');
const NoPermissionError = require('./errors/NoPermissionError');
const CommandDoesNotExistError = require('./errors/CommandDoesNotExistError');
const Helper = require('./classes/Helper');
const ShardMinecraft = require('./classes/shardMinecraft');
const ShardChannelpurge = require('./classes/shardChannelpurge');

//SETUP CLIENT --------------------------------------------------------------------------------------------
//INIT discord.js
const discordClient = new Discord.Client();

//PLAYGROUND
//----------

//INIT Helper
discordClient.helper = new Helper(discordClient);
//INIT Twitch Manager
discordClient.twitchManager = new ShardTwitch();
//INIT Guild Configuration Manager
discordClient.guildManager = new ShardGuildManager();
//INIT reactionRoleManager
discordClient.roleManager = new ReactionRolesManager(discordClient, {
    storage: './botData/reaction-roles.json'
});
//INIT giveawaysManager
discordClient.giveawaysManager = new GiveawaysManager(discordClient, {
    storage: './botData/giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        //exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: '#FF9900',
        embedColorEnd: '#808080',
        reaction: '🎮'
    }
});
//INIT tempChannelsManager
discordClient.tempVoiceChannels = new ShardTempVoice(discordClient);
//INIT Minecraft manager
discordClient.minecraftManager = new ShardMinecraft();
//INIT purged channels 
discordClient.purgeManager = new ShardChannelpurge();


//Load all commands
discordClient.commands = new Discord.Collection();
discordClient.configCommands = new Discord.Collection();
discordClient.minecraftCommands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const configCommandFiles = fs.readdirSync('./commands/config').filter(file => file.endsWith('.js'));
const minecraftCommandFiles = fs.readdirSync('./commands/minecraft').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require('./commands/' + file);
    discordClient.commands.set(command.name, command);
}
for (const file of configCommandFiles) {
    const command = require('./commands/config/' + file);
    discordClient.configCommands.set(command.name, command);
}
for (const file of minecraftCommandFiles) {
    const command = require('./commands/minecraft/' + file);
    discordClient.minecraftCommands.set(command.name, command);
}

//SETUP GLOBAL ARGS ---------------------------------------------------------------------------------------
const defaultPrefix = config.prefix;

//BOT LOGIC -----------------------------------------------------------------------------------------------
//Start client and set bot presense data
discordClient.once('ready', async () => {
    console.log('Shard-Client ready!');
    discordClient.user.setPresence({ activity: { name: presence.activity, type: presence.activityType }, status: presence.status });
});

//Login client
discordClient.login(secret.discordToken);

//EVENT on unhandled Rejection Error
process.on('unhandledRejection', (error, p) => {
    discordClient.users.fetch('313742410180198431').then((user) => {
        user.send('```' + error.stack + '```').catch(error => console.error(error));
    });
});

//EVENT on removal/leaving of a member
discordClient.on('guildMemberRemove', async member => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(member.guild.id);
    const memberLog = member.guild.channels.cache.get(guildConfig.memberLogChannelId);

    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK'
    });
    const kickLog = fetchedLogs.entries.first();

    if (!kickLog) {
        console.log(member.user.tag + ' has left the server: ' + member.guild.name);
        if(memberLog) {
            memberLog.send(member_left(member));
        }
        return;
    }

    const { executor, target } = kickLog;
    if (target.id === member.id) { //Member kicked
        console.log(member.user.tag + ' was kicked from server ' + member.guild.name + ' by ' + executor.tag);
        if(memberLog) {
            memberLog.send(member_kicked(member, executor, kickLog.reason));
        }
	} else { //Member left
		console.log(member.user.tag + ' was kicked from server ' + member.guild.name + '. Audit Log was inconclusive.');
        if(memberLog) {
            memberLog.send(member_kicked(member, null, null));
        }
	}
});

//EVENT on ban of a member
discordClient.on('guildBanAdd', async (guild, user) => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(guild.id);
    const memberLog = guild.channels.cache.get(guildConfig.memberLogChannelId);

    const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	const banLog = fetchedLogs.entries.first();

	if (!banLog) {
        console.log(user.tag + ' was banned from server ' + guild.name + ' but no audit log could be found.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, null, null));
        }
        return;
    } 

	const { executor, target } = banLog;
	if (target.id === user.id) {
        console.log(user.tag + ' got hit by the ban hammer on server ' + guild.name + ', wielded by the mighty ' + executor.tag + '.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, executor, banLog.reason));
        }
	} else {
		console.log(user.tag + ' got hit by the ban hammer on server ' + guild.name + ', audit log fetch was inconclusive.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, null, null));
        }
	}
});

//EVENT on joining of a member
discordClient.on('guildMemberAdd', member => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(member.guild.id);
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
    //console.log('[' + message.guild.name + '][' + message.channel.name + '] ' + message.author.tag + ': ' + message.content);

    if (message.author.bot) return;

    if (message.channel instanceof Discord.DMChannel) {
        if (discordClient.minecraftManager.isVerified(message.author.id)){
            message.channel.send("Du bist bereits verifiziert.").catch(err => {
                console.error(err);
            });
            return;
        }
        if (discordClient.minecraftManager.verify(message.author, message.content)) {
            message.channel.send("Erfolgreich verifiziert!").catch(err => {
                console.error(err);
            });
        }
        else {
            message.channel.send("Ups, da ist etwas schiefgelaufen...\nVersuche es später nochmal.").catch(err => {
                console.error(err);
            });
        }
        return;
    }

    //Get guildConfig
    var guildConfig = discordClient.guildManager.getGuildConfigById(message.guild.id);

    //Delete message if posted in a channel that's currently in purge mode.
    if (discordClient.purgeManager.isInPurgeMode(message.channel.id)) {
        message.delete({ reason: 'Channel is in purge mode.'}).catch(err => console.log('[WARN] Failed deleting message in purged channel.'));
        if (!discordClient.helper.isAdmin(message.author.id, guildConfig.ADMIN_IDS)) {
            return;
        }
    }

    //Ignore not prefixed and bot messages
    if (!message.content.startsWith(guildConfig.prefix)) return;
    
    //Syntax: <prefix><command> <args[0]> <args[1]> ...
    const args = message.content.slice(guildConfig.prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    //Get command from collection.
    const command = discordClient.commands.get(commandName) 
                    || discordClient.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //Check if command exists.
    if(!command) {
        return message.channel.send(new CommandDoesNotExistError(message.author, commandName, args).getEmbed());
    }

    //Check if user is allowed to run command
    if (command.adminOnly && !discordClient.helper.isAdmin(message.author.id, guildConfig.ADMIN_IDS)) {
        return message.channel.send(new NoPermissionError(message.author, this.name, args).getEmbed());
    }

    //Check if command requires arguments and throw error if yes and none provided.
    if(command.args && !args.length) {
        var argsError = new ArgumentError(message.author, command.name, args, 'This command requires arguments, but none were provided!');
        if(command.usage) argsError.setUsage(guildConfig.prefix + command.name + ' ' + command.usage);
        return message.channel.send(argsError.getEmbed());
    }

    //Try executing the command.
    try {
        command.execute(message, args, guildConfig);
    } catch (error) {
        console.error(error);
        return message.channel.send(new ExecutionError(message.author, command.name, args).getEmbed());
    }
});

//Completes welcome message, appending the footer
function fill_welcome_msg(gMember, welcomeMsg) {
    return welcomeMsg
    .setTimestamp()
    .setFooter(gMember.guild.memberCount + ' total users on the server.', gMember.guild.iconURL())
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL());
}

//JOIN, LEAVE, KICK, BAN
function member_joined(gMember) {
    let customStatus = gMember.user.presence.activities.find(el => el.type == 'CUSTOM_STATUS');
    return new Discord.MessageEmbed()
    .setColor('#99ff99')
    .setThumbnail(gMember.user.displayAvatarURL())
    .setAuthor(gMember.user.tag + ' joined the server')
    .setDescription('**User Tag**: ' + discordClient.helper.makeUserAt(gMember.user.id) + '\n' +
        '**User ID**: ' + gMember.user.id + '\n' +
        '**Account created**: ' + gMember.user.createdAt + '\n' + 
        customStatus ? '**Prescence atm**: ' + customStatus.details : '') //try also customStatus.name, .state, .
    .setFooter(gMember.guild.memberCount + ' total users on the server.')
    .setTimestamp();
} 

function member_left(gMember) {
    return new Discord.MessageEmbed()
    .setColor('#800000')
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
    .setDescription(discordClient.helper.makeUserAt(gMember.user.id) + ' left the server.')
    .setFooter(gMember.guild.memberCount + ' total users on the server.')
    .setTimestamp();
}

function member_kicked(gMember, kickedBy, reason) {
    return new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
    .setDescription((kickedBy) ? discordClient.helper.makeUserAt(gMember.user.id) + ' was kicked from the server by ' + discordClient.helper.makeUserAt(kickedBy.id) + '.' : discordClient.helper.makeUserAt(gMember.user.id) + ' was kicked from the server.')
    .addField('Reason', (reason) ? reason : 'No reason provided.')
    .setFooter(gMember.guild.memberCount + ' total users on the server.')
    .setTimestamp();
}

function member_banned(user, guild, bannedBy, reason) {
    return new Discord.MessageEmbed()
    .setColor('#ff6600')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setDescription((bannedBy) ? discordClient.helper.makeUserAt(user.id) + ' was banned from the server by ' + discordClient.helper.makeUserAt(bannedBy.id) + '.' : discordClient.helper.makeUserAt(user.id) + ' was banned from the server.')
    .addField('Reason', (reason) ? reason : 'No reason provided.')
    .setFooter(guild.memberCount + ' total users on the server.')
    .setTimestamp();
}
