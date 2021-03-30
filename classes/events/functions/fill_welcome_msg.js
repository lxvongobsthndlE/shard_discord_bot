module.exports = (gMember, welcomeMsg) => {
    return welcomeMsg
        .setTimestamp()
        .setFooter(gMember.guild.memberCount + ' total users on the server.', gMember.guild.iconURL())
        .setAuthor(gMember.user.tag, gMember.user.displayAvatarURL());
}