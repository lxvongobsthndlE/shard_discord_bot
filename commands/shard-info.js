const ArgumentError = require("../errors/ArgumentError");
const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const fetch = require('node-fetch');
const version = require('../configuration/bot-version.json');

/** Command: shard-info <option>
 *  Shows information about the bot
 */
module.exports = {
	name: 'shard-info',
    description: 'Shows information about the bot',
    args: true,
    secret: true,
    aliases: [],
    explict: false,
    usage: '<option>',
    execute(message, args, guildConfig) {
        if(message.author.id !== "313742410180198431") return;
        const option = args[0].toLowerCase();
        console.log(message.author.username + ' called "shard-info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        let desc = new DiscordMessageEmbed()
                    .setColor('#0099ff')
                    .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
                    .setTimestamp();
        switch(option) {
            case 'guilds':
                desc.setDescription('This bot is currently on the following Servers:');
                message.client.guilds.cache.each(guild => {
                    if(guild.available) 
                        desc.addField(guild.name,
                            'Members: ' + guild.memberCount);
                });
                return message.channel.send(desc);
            case "version":
                //read version file from github to compare running version with most recent version TODO
                desc.setDescription('The bot is currently running version ' + version.version + '\nThe most recent version available is: {gitVersion}');
                return message.channel.send(desc);
            default:
                return message.channel.send(new ArgumentError(message.author, this.name, args, 'The argument provided does not match any known option.').getEmbed());
        }

        

    }
};