const ArgumentError = require("../errors/ArgumentError");
const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: shard-info <option>
 *  Shows information about the bot
 */
module.exports = {
	name: 'shard-info',
    description: 'Reloads a command',
    args: true,
    secret: true,
    aliases: [],
    explict: false,
    usage: '<option>',
    execute(message, args, guildConfig) {
        if(message.author.id !== "313742410180198431") return;
        const option = args[0].toLowerCase();
        console.log(message.author.username + ' called "shard-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        switch(option) {
            case 'guilds':
                var desc = new DiscordMessageEmbed()
                    .setColor('#0099ff')
                    .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
                    .setDescription('This bot is currently on the following Servers:')
                    .setTimestamp();
                message.client.guilds.cache.each(guild => {
                    if(guild.available) 
                        desc.addField(guild.name,
                            'Members: ' + guild.memberCount + 
                            '\nCreated: ' + guild.createdAt);
                });
                return message.channel.send(desc);
            default:
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The argument provided does not match any known option.').getEmbed());
        }

        

    }
};