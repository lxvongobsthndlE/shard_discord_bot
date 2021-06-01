const ArgumentError = require('../errors/ArgumentError');
const CommandDoesNotExistError = require('../errors/CommandDoesNotExistError');
const ExecutionError = require('../errors/ExecutionError');
const NoPermissionError = require('../errors/NoPermissionError');

/** Command: tempvoice <option> [<params>]
 *  Manage temporary voice channels on the server. Use option "help" to learn more.
 */
module.exports = {
    name: 'tempvoice',
    description: 'Manage temporary voice channels on the server. Use option "help" to learn more.',
    args: true,
    usage: '<option> [params]',
    aliases: ['tv'],
    adminOnly: true,
    execute(message, args, guildConfig) {
        if (!message.client.helper.isAdmin(message.author.id, guildConfig.ADMIN_IDS)) {
            return message.channel.send(new NoPermissionError(message.author, this.name, args).getEmbed());
        }

        var commandName = args.shift().toLowerCase();

        const command = message.client.tempvoiceCommands.get(commandName)
            || message.client.tempvoiceCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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