module.exports = class Helper {
    constructor(client){
        this.client = client;
    }

    getRandomInteger(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    isAdmin(userId, adminIds) {
        return adminIds.includes(userId);
    }

    makeUserAt(userID) {
        return '<@' + userID + '>';
    }

    makeChannelAt(channelID) {
        return '<#' + channelID + '>';
    }

    makeRoleAt(roleID) {
        return '<@&' + roleID + '>';
    }

    //If guildID is provided it will check if user exists AND is in said guild, else just if user exists
    checkUserIdValid(userId, guildId=null) {
        return this.client.users.fetch(userId)
            .then(user => {
                if (!guildId) {
                    return user;
                }
                return this.client.guilds.fetch(guildId)
                    .then(guild => {
                        return guild.members.fetch(userId)
                            .then(member => {return member})
                            .catch(() => {return false});
                    })
                    .catch(() => {return false});
                
            })
            .catch(() => {return false});
    }

    //If guildID is provided it will check if channel exists AND is in said guild, else just if channel exists
    async checkChannelIdValid(channelId, guildId=null) {
        //check channel.type on successfull return to diff between: text, voice, category, news, store
        let guildChannelTypes = ['text', 'voice', 'category', 'news', 'store'];
        return this.client.channels.fetch(channelId)
            .then(channel => {
                if (!guildId) {
                    return channel;
                }
                if (guildChannelTypes.includes(channel.type) && channel.guild.id == guildId) {
                    return channel;
                }
                else return false;
            })
            .catch(() => {return false});
    }

    checkRoleIdValid(roleId, guildId) {
        return this.client.guilds.fetch(guildId)
            .then(guild => {
                return guild.roles.fetch(roleId)
                    .then(role => {return role.guild.id === guildId})
                    .catch(() => {return false})
            })
            .catch(() => {return false});
    }
}