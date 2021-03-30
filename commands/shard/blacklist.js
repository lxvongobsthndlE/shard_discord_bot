const ArgumentError = require('../../errors/ArgumentError');
const fs = require('fs');
/** Command: blacklist <add|remove> <userID>
 *  Runs a command in the shell on the bots server
 */
module.exports = {
	name: 'blacklist',
    description: 'Add or remove a user from the blacklist. Blacklisted users won\'t be able to add the bot to their servers.',
    args: true,
    secret: true,
    aliases: [],
    usage: '<add|remove> <userID>',
    async execute(message, args, guildConfig) {
        if(message.author.id !== message.client.config.ownerId) return;
        console.log(message.author.username + ' called "shard/blacklist" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let blacklist = JSON.parse(fs.readFileSync('../../botData/blacklist.json', 'utf-8'));
        
        let user = args[1];
        if (!user) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'No userID provided.').getEmbed());
        }

        let userInt = parseInt(user);
        if (isNaN(userInt)) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, '`' + user + '` is not a valid userID.').getEmbed());
        }

        if (args[0].toLowerCase() === 'add') {
                if (user === message.client.config.ownerId) {
                    return message.reply('You can\'t blacklist yourself, Dev. That would be horrible!');
                }
        
                if (!blacklist[user]) {
                    blacklist[user] = {
                        id: user,
                        state: true
                    }
                    message.reply(message.client.helper.makeUserAt(user) + ' is now blacklisted.');
                    fs.writeFile('../../botData/blacklist.json', JSON.stringify(blacklist, null, 2), err => {
                        if (err) {
                            message.reply('Something went wrong saving the blacklist entry. You might have to try again.');
                        }
                    });
        
                    message.client.guilds.cache.each(guild => {
                        if (guild.ownerID === user) {
                            guild.leave();
                            message.channel.send('I left server ' + guild.name + ', because the blacklisted user was its owner.');
                        }
                    });
                    return;
                }
        
                if (blacklist[user].state) {
                    return message.reply('The user ' + message.client.helper.makeUserAt(user) + ' is already blacklisted');
                }
        }
        else if (args[0].toLowerCase() === 'remove') {
            if (!blacklist[user] || !blacklist[user].state) {
                return message.reply('That user is not blacklisted.');
            }

            if (blacklist[user].state) {
                blacklist[user] = {
                    id: user,
                    state: false
                }
                message.reply('The user ' + message.client.helper.makeUserAt(user) + ' has been removed from the blacklist.');
                fs.writeFile('../../botData/blacklist.json', JSON.stringify(blacklist, null, 2), err => {
                    if (err) {
                        message.reply('Something went wrong saving the blacklist entry. You might have to try again.');
                    }
                });
                return;
            }
        }
        else {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'First argument not recognized. Must be either `add` or `remove`.'));
        }
    }
};