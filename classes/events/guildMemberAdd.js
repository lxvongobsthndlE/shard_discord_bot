const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const member_joined = require('./functions/member_joined');
const fill_welcome_msg = require('./functions/fill_welcome_msg');
module.exports = async (member, discordClient) => {
    const guildConfig = discordClient.guildManager.getGuildConfigById(member.guild.id);
    const welcomeChannel = member.guild.channels.cache.get(guildConfig.welcomeChannelId);
    const memberLog = member.guild.channels.cache.get(guildConfig.memberLogChannelId);
    const joinRole = member.guild.roles.cache.get(guildConfig.joinRole);
    guildConfig.welcomeMessage = fill_welcome_msg(member, new DiscordMessageEmbed(guildConfig.welcomeMessage));

    // Send the message to a designated channel on a server:
    console.log(member.displayName + ' joined ' + member.guild.name + '.');
    if (welcomeChannel) {
        welcomeChannel.send(guildConfig.welcomeMessage);
    }
    if (memberLog) {
        memberLog.send(member_joined(member, discordClient));
    }
    if (joinRole) {
        member.roles.add(joinRole, "Join Role");
    }
}