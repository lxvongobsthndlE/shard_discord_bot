//const ShellError = require("../errors/ShellError");
const { exec } = require('child_process');
/** Command: exec <command>
 *  Runs a command in the shell on the bots server
 */
module.exports = {
	name: 'exec',
    description: 'Runs a command in the shell on the bots server.',
    args: true,
    secret: true,
    aliases: [],
    explict: false,
    usage: '<command>',
    async execute(message, args, guildConfig) {
        if(message.author.id !== message.client.config.ownerId) return;
        console.log('[DEV] ' + message.author.username + ' called "shard/exec" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const command = args.join(' ');
        exec(command, (err, stdout, stderr) => {
            if (err) return message.channel.send(message.client.config.emoji.error + 'err:\n```' + err.message + '```');
            if (stderr) return message.channel.send(message.client.config.emoji.error + 'stderr:\n```' + stderr + '```');
            message.channel.send(message.client.config.emoji.success + 'stdout:\n```' + stdout + '```');
        }); 
    }
};