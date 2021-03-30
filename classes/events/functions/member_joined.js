const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const dateFormat = require('date-fns/format');
const dateFormatDistance = require('date-fns/formatDistance');
module.exports = (gMember, client) => {
    let customStatus = gMember.user.presence.activities.find(el => el.type == 'CUSTOM_STATUS');
    return new DiscordMessageEmbed()
        .setColor('#99ff99')
        .setThumbnail(gMember.user.displayAvatarURL())
        .setAuthor(gMember.user.tag + ' joined the server')
        .setDescription('**User Tag**: ' + client.helper.makeUserAt(gMember.user.id) + '\n' +
            '**User ID**: ' + gMember.user.id + '\n' +
            '**Account created**: ' + dateFormat(gMember.user.createdAt, "dd. MMMM yyyy, HH:mm:ss (O)") + ' (*' + dateFormatDistance(gMember.user.createdAt, new Date(), { addSuffix: true }) + '*)' +
            ((!customStatus) ? '' : '\n**Current presence**: ' + customStatus.state))
        .setFooter(gMember.guild.memberCount + ' total users on the server.')
        .setTimestamp();
}