const member_left = require('./functions/member_left');
const member_kicked = require('./functions/member_kicked');

module.exports = (member, discordClient) => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(member.guild.id);
    const memberLog = member.guild.channels.cache.get(guildConfig.memberLogChannelId);

    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK'
    });
    const kickLog = fetchedLogs.entries.first();

    if (!kickLog) {
        console.log(member.user.tag + ' has left the server: ' + member.guild.name);
        if(memberLog) {
            memberLog.send(member_left(member, discordClient));
        }
        return;
    }

    const { executor, target } = kickLog;
    if (target.id === member.id) { //Member kicked
        console.log(member.user.tag + ' was kicked from server ' + member.guild.name + ' by ' + executor.tag);
        if(memberLog) {
            memberLog.send(member_kicked(member, executor, kickLog.reason, discordClient));
        }
	} else { //Member left
		console.log(member.user.tag + ' has left the server: ' + member.guild.name);
        if(memberLog) {
            memberLog.send(member_left(member, discordClient));
        }
	}
}