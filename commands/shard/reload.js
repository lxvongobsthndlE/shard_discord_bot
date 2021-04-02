const ArgumentError = require("../../errors/ArgumentError");
const ExecutionError = require("../../errors/ExecutionError");

/** Command: reload <command name>
 *  Reloads a specified command, so you won't need to restart the bot if changes were made.
 */
module.exports = {
	name: 'reload',
    description: 'Reloads a command',
    args: true,
    secret: true,
    aliases: [],
    usage: '<command name>',
    execute(message, args, guildConfig) {
        if(message.author.id !== message.client.config.ownerId) return;
        console.log('[DEV] ' + message.author.username + ' called "shard/reload" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(new ArgumentError(message.author, this.name, args, 'The argument provided does not match any known command.').getEmbed());

        delete require.cache[require.resolve('./' + command.name + '.js')];

        try {
            const newCommand = require('./' + command.name + '.js');
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send('Command "' + command.name + '" was reloaded!');
        } catch (error) {
            console.error(error);
            message.channel.send(new ExecutionError(message.author, this.name, args, 'There was an error reloading the command you specified. Check Bot logs.').getEmbed());
        }
    }
};