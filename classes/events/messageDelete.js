module.exports = async (message) => {
    console.log(`[MSG-DEL] ${message.author.username}: "${message.content}"`);
    /*
    let guildConfig = message.client.guildManager.getGuildConfigById(message.channel.guild.id);
    if (guildConfig.modLogChannelId !== "" && guildConfig.modLogSendMessageDelete) {
        let channel = message.guild.channels.resolve(guildConfig.modLogChannelId);
        if (channel) {
            console.log('A message from ' + message.author.username + ' was deleted.');
        }
    }
    */
}