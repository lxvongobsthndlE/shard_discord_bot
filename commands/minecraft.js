const ArgumentError = require('../errors/ArgumentError');
const CommandDoesNotExistError = require('../errors/CommandDoesNotExistError');
const ExecutionError = require('../errors/ExecutionError');
const NoPermissionError = require('../errors/NoPermissionError');

/** Command: minecraft <option> [<params>]
 *  The minecraft functionality of the bot for FLG Server.
 */
module.exports = {
    name: 'minecraft',
    description: 'Minecraft commands. Use option "help" to learn more.',
    args: true,
    usage: '<option> [params]',
    aliases: ['mc'],
    flg: true,
    execute(message, args, guildConfig) {
        //disable command for all guilds but FunLovingGames
        if (message.guild.id != '743221608113766453') {
            return message.channel.send(new NoPermissionError(message.author, this.name, args, 'This command is not available on this server!').getEmbed());
        }

        var commandName = args.shift().toLowerCase();

        const command = message.client.minecraftCommands.get(commandName)
            || message.client.minecraftCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //Check if command exists.
        if (!command) {
            return message.channel.send(new CommandDoesNotExistError(message.author, this.name + '/' + commandName, args).getEmbed());
        }

        //Check if command requires arguments and throw error if yes and none provided.
        if (command.args && !args.length) {
            var argsError = new ArgumentError(message.author, this.name + '/' + command.name, args, 'This command requires arguments, but none were provided!');
            if (command.usage) argsError.setUsage(guildConfig.prefix + this.name + ' ' + command.name + ' ' + command.usage);
            return message.channel.send(argsError.getEmbed());
        }

        //Try executing the command.
        try {
            command.execute(message, args, guildConfig);
        } catch (error) {
            console.error(error);
            return message.channel.send(new ExecutionError(message.author, this.name + '/' + command.name, args).getEmbed());
        }

    }
}