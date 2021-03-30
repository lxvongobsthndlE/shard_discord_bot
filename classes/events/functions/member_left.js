const DiscordMessageEmbed = require('discord.js').MessageEmbed;
module.exports = (gMember, client) => {
    return new DiscordMessageEmbed()
        .setColor('#800000')
        .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL())
        .setDescription(client.helper.makeUserAt(gMember.user.id) + ' left the server.')
        .setFooter(gMember.guild.memberCount + ' total users on the server.')
        .setTimestamp();
}