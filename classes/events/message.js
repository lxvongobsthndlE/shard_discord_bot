const Discord = require('discord.js');
const ArgumentError = require('../../errors/ArgumentError');
const ExecutionError = require('../../errors/ExecutionError');
const NoPermissionError = require('../../errors/NoPermissionError');
const CommandDoesNotExistError = require('../../errors/CommandDoesNotExistError');

module.exports = async (message, discordClient) => {
    //Allmighty Logger. Don't use this. Seriously, don't.
    //console.log('[' + message.guild.name + '][' + message.channel.name + '] ' + message.author.tag + ': ' + message.content);

    if (message.author.bot) return;

    if (message.channel instanceof Discord.DMChannel) {
        return message.channel.send("Sorry, but I can only respond to commands on servers!")
    }

    //Get guildConfig
    var guildConfig = discordClient.guildManager.getGuildConfigById(message.guild.id);

    //FLG specific stuff
    if (guildConfig.guildId === '743221608113766453') {
        //If message in server-hilfe channel and user does not have role Verified, send info how to verify
        if (message.channel.id === '778316374656417812') {
            if (!message.member.roles.cache.some(role => role.id === '773581026211397682')) {
                return message.reply(new Discord.MessageEmbed()
                    .setDescription('Hey!\nEs scheint als ob du noch nicht verifiziert bist und deshalb noch nicht alle Kanäle sehen kannst.\n\nBitte verifiziere dich im <#743225754770472980> Kanal.\n\nUm verifiziert zu werden, reicht es auf die Nachricht von @Shard mit <:verified:773277557310488586> zu reagieren (sh. angehängter Screenshot)')
                    .setThumbnail(message.guild.iconURL())
                    .setImage('https://raw.githubusercontent.com/lxvongobsthndlE/shard_discord_bot/master/media/verify-screen.png')
                    .setAuthor(message.author.username)
                    .setColor('#ff9933')
                    .setTimestamp());
            }
        }
    }

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
}