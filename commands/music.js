const ArgumentError = require('../errors/ArgumentError');
const CommandDoesNotExistError = require('../errors/CommandDoesNotExistError');
const ExecutionError = require('../errors/ExecutionError');
const VoiceError = require('../errors/VoiceError');

/** Command: music <option> [params]
 *  Play music! Use option "help" to learn more.
 */
module.exports = {
    name: 'music',
    description: 'Play music! Use option "help" to learn more.',
    args: true,
    usage: '<option> [params]',
    inVoiceChannel: true,
    aliases: ['m', '&'],
    execute(message, args, guildConfig) {
        if(this.inVoiceChannel && !message.member.voice.channel) {
            return message.channel.send(new VoiceError(message.author, this.name, "You have to be connected to a voice channel to use this command!").getEmbed());
        }

        var commandName = args.shift().toLowerCase();

        const command = message.client.musicCommands.get(commandName)
            || message.client.musicCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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