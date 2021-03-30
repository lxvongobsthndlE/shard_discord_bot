const DiscordMessageEmbed = require('discord.js').MessageEmbed;
module.exports = (gMember, kickedBy, reason, client) => {
    return new DiscordMessageEmbed()
        .setColor('#ffff00')
        .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
        .setDescription((kickedBy) ? client.helper.makeUserAt(gMember.user.id) + ' was kicked from the server by ' + client.helper.makeUserAt(kickedBy.id) + '.' : client.helper.makeUserAt(gMember.user.id) + ' was kicked from the server.')
        .addField('Reason', (reason) ? reason : 'No reason provided.')
        .setFooter(gMember.guild.memberCount + ' total users on the server.')
        .setTimestamp();
}