const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: status
 *  Get the online status and IP of the minecraft server.
 */
module.exports = {
    name: 'status',
    description: 'Get the online status and IP of the minecraft server.',
    args: false,
    usage: '',
    aliases: [],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "minecraft/status" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        message.channel.send(new DiscordMessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#5b9d31')
            .setTimestamp()
            .setTitle('Minecraft Server Status')
            .setThumbnail('https://raw.githubusercontent.com/lxvongobsthndlE/shard_discord_bot/master/media/server-icon.png')
            .addField('Status', (message.client.minecraftManager.isMinecraftServerOnline) ? 'Online :green_circle:' : 'Offline :red_circle:')
            .addField('Server-IP', 'funlovinggames.my.pebble.host'));
    }
}