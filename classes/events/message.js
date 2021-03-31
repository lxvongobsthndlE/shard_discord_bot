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
}