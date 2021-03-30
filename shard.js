#!/usr/bin/env node
const Discord = require('discord.js');
const DisTube = require("distube");
const fs = require('fs');
const dateFormat = require('date-fns/format');
const secret = require('./secret.json');
const config = require('./configuration/config.json');
const ReactionRolesManager = require('discord-reaction-role');
const { GiveawaysManager } = require('discord-giveaways');
const ShardGuildManager = require('./classes/shardGuildManager');
const ShardTwitch = require('./classes/shardTwitch');
const ShardTempVoice = require('./classes/shardTempVoice');
const Helper = require('./classes/Helper');
const ShardMinecraft = require('./classes/shardMinecraft');
const ShardChannelpurge = require('./classes/shardChannelpurge');

//SETUP CLIENT --------------------------------------------------------------------------------------------
//INIT discord.js
const discordClient = new Discord.Client();
discordClient.config = config;
//INIT DisTube
discordClient.distube = new DisTube(discordClient, { 
                                                        searchSongs: true, 
                                                        emitNewSongOnly: true, 
                                                        leaveOnFinish: true 
                                                    });
                      
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
        reaction: '🎉'
    }
});
//INIT tempChannelsManager
discordClient.tempVoiceChannels = new ShardTempVoice(discordClient);
//INIT Minecraft manager
discordClient.minecraftManager = new ShardMinecraft();
//INIT purged channels 
discordClient.purgeManager = new ShardChannelpurge();

//LOAD all commands
loadAllCommands();

//INIT EventLoader
require('./classes/util/ClientEventLoader')(discordClient);

//SETUP GLOBAL ARGS ---------------------------------------------------------------------------------------
const defaultPrefix = config.prefix;

//BOT LOGIC -----------------------------------------------------------------------------------------------

//Login client
discordClient.login(secret.discordToken);

//EVENT on unhandled Rejection Error
process.on('unhandledRejection', (error, p) => {
    console.error(error.stack);
    discordClient.users.fetch(discordClient.config.ownerId).then((user) => {
        user.send(dateFormat(new Date(), "dd. MMMM yyyy, HH:mm:ss") + '\n```' + error.stack + '```').catch(error => console.error(error));
    });
});

//Creates a Collection of all commands in a folder at specified path
function createCommandCollection(commandFolderPath) {
    let commandCollection = new Discord.Collection();
    let commandFiles = fs.readdirSync(commandFolderPath).filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
        let command = require(commandFolderPath + '/' + file);
        commandCollection.set(command.name, command);
    }
    return commandCollection;
}

//loads all commands into discordClient
function loadAllCommands() {
    discordClient.commands = createCommandCollection('./commands');
    discordClient.configCommands = createCommandCollection('./commands/config');
    discordClient.minecraftCommands = createCommandCollection('./commands/minecraft');
    discordClient.musicCommands =createCommandCollection('./commands/music');
    discordClient.moderationCommands = createCommandCollection('./commands/moderation');
    discordClient.shardCommands = createCommandCollection('./commands/shard');
}