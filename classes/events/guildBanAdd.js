const member_banned = require('./functions/member_banned');

module.exports = async (guild, user, discordClient) => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(guild.id);
    const memberLog = guild.channels.cache.get(guildConfig.memberLogChannelId);

    const fetchedLogs = await guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_BAN_ADD',
	});
	const banLog = fetchedLogs.entries.first();

	if (!banLog) {
        console.log(user.tag + ' was banned from server ' + guild.name + ' but no audit log could be found.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, null, null, discordClient));
        }
        return;
    } 

	const { executor, target } = banLog;
	if (target.id === user.id) {
        console.log(user.tag + ' got hit by the ban hammer on server ' + guild.name + ', wielded by the mighty ' + executor.tag + '.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, executor, banLog.reason, discordClient));
        }
	} else {
		console.log(user.tag + ' got hit by the ban hammer on server ' + guild.name + ', audit log fetch was inconclusive.');
        if(memberLog) {
            memberLog.send(member_banned(user, guild, null, null, discordClient));
        }
	}
}