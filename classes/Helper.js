module.exports = class Helper {
    constructor(client) {
        this.client = client;
    }

    /**
     * Parse a String expression, replacing all placeholders within it with values from valueObj.
     * 
     * For an expression like "Hello my name is {{name}}" and a valueObj like {name: "Tom"} 
     * the function will return: "Hello my name is Tom"
     * @param {String} expression 
     * @param {Object} valueObj 
     * @returns The expression with inserted values
     */
    stringTemplateParser(expression, valueObj) {
        const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
        let text = expression.replace(templateMatcher, (substring, value, index) => {
            value = valueObj[value];
            return value;
        });
        return text
    }

    getRandomInteger(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    isAdmin(userId, adminIds) {
        return adminIds.includes(userId);
    }

    isBotAdmin(userId) {
        return userId === "313742410180198431";
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
    checkUserIdValid(userId, guildId = null) {
        return this.client.users.fetch(userId)
            .then(user => {
                if (!guildId) {
                    return user;
                }
                return this.client.guilds.fetch(guildId)
                    .then(guild => {
                        return guild.members.fetch(userId)
                            .then(member => { return member })
                            .catch(() => { return false });
                    })
                    .catch(() => { return false });

            })
            .catch(() => { return false });
    }

    //If guildID is provided it will check if channel exists AND is in said guild, else just if channel exists
    checkChannelIdValid(channelId, guildId = null) {
        return this.client.channels.fetch(channelId)
            .then(channel => {
                if (!guildId) {
                    return channel;
                }
                return this.client.guilds.fetch(guildId)
                    .then(guild => {
                        if (!guild) {
                            return false;
                        }
                        return guild.channels.cache.has(channelId) ? channel : false;
                    })
                    .catch((err) => {
                        console.log('ERR client guilds cache get\n' + err)
                        return false
                    });
            })
            .catch((err) => {
                console.log('ERR client channel fetch\n' + err)
                return false
            });
    }

    checkRoleIdValid(roleId, guildId) {
        return this.client.guilds.fetch(guildId)
            .then(guild => {
                return guild.roles.fetch(roleId)
                    .then(role => { return role.guild.id === guildId })
                    .catch(() => { return false })
            })
            .catch(() => { return false });
    }
}