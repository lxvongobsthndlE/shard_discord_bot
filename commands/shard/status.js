const ArgumentError = require("../../errors/ArgumentError");
const fs = require('fs');

/** Command: status <status>
 *  Changes the status of the bot. Available status: online, idle, dnd, invisible.
 */
module.exports = {
	name: 'status',
    description: 'Changes the status of the bot. Available status: online, idle, dnd, invisible.',
    args: true,
    secret: true,
    aliases: [],
    usage: '<status>',
    execute(message, args, guildConfig) {
        if(message.author.id !== message.client.config.ownerId) return;
        console.log('[DEV] ' + message.author.username + ' called "shard/status" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        const stati = ['online', 'idle', 'dnd', 'invisible'];

        var status = args[0].toLowerCase();
        if(!stati.includes(status)) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'Provided argument is not a valid status!').getEmbed());
        }

        var presenceData = fs.readFileSync('./botData/presence.json');
        presenceData = JSON.parse(presenceData);
        presenceData.status = status;
        fs.writeFileSync('./botData/presence.json', JSON.stringify(presenceData, null, 2));
        return message.client.user.setStatus(status);        
    }
};