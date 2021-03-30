const DiscordMessageEmbed = require('discord.js').MessageEmbed;
module.exports = (user, guild, bannedBy, reason, client) => {
    return new DiscordMessageEmbed()
        .setColor('#ff6600')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription((bannedBy) ? client.helper.makeUserAt(user.id) + ' was banned from the server by ' + client.helper.makeUserAt(bannedBy.id) + '.' : client.helper.makeUserAt(user.id) + ' was banned from the server.')
        .addField('Reason', (reason) ? reason : 'No reason provided.')
        .setFooter(guild.memberCount + ' total users on the server.')
        .setTimestamp();
}