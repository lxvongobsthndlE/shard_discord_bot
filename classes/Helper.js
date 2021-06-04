const checkEmoji = require('contains-emoji');
const { User, Channel } = require('discord.js');

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
     * @returns {String} The expression with inserted values.
     */
    stringTemplateParser(expression, valueObj) {
        const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
        return expression.replace(templateMatcher, (substring, value, index) => {
            value = valueObj[value];
            return value;
        })
    }

    /**
     * Checks if a given String contains any unicode emojis.
     * @param {String} string The String to check for emojis
     * @returns {Boolean} true, if string contains emoji. Else false.
     */
    containsEmoji(string) {
        return checkEmoji(string);
    }

    /**
     * Returns a random number between minimum and maximum.
     * @param {Number} minimum Lower threshold (inclusive)
     * @param {Number} maximum Upper threshold (inclusive)
     * @returns {Number} random number between minimum and maximum.
     */
    getRandomInteger(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    /**
     * Determines if a userID is in a list of admin userIDs.
     * @param {String} userId The ID of the user
     * @param {[String]} adminIds List of userIDs with administrative permissions
     * @returns {Boolean} true, if userId is in adminIds. Else false.
     */
    isAdmin(userId, adminIds) {
        return adminIds.includes(userId);
    }
    
    /**
     * Determines if a userID is in a list of moderator userIDs.
     * @param {String} userId The ID of the user
     * @param {[String]} moderatorIds List of userIDs with moderator permissions
     * @returns {Boolean} true, if userId is in moderatorIds. Else false.
     */
    isModerator(userId, moderatorIds) {
        return moderatorIds.includes(userId);
    }

    /** 
     * Checks if a user is the admin of this bot.
     * @param {String} userId The userID to check
     * @returns {Boolean} true, if userID is bot admin.
     * 
     * @deprecated Use the config option config.ownerId instead.
     */
    isBotAdmin(userId) {
        return userId === "313742410180198431";
    }

    /**
     * Creates a Discord \@ for a given userID.
     * @param {String} userID The userID to create Discord \@ for
     * @returns {String} Discord \@ for userID.
     */
    makeUserAt(userID) {
        return '<@' + userID + '>';
    }

    /**
     * Creates a Discord # for given channelID.
     * @param {String} channelID The channelID to create Discord # for
     * @returns {String} Discord # for channelID.
     */
    makeChannelAt(channelID) {
        return '<#' + channelID + '>';
    }

    /**
     * Creates a Discord \@ for a given roleID.
     * @param {String} roleID The roleID to create Discord \@ for
     * @returns {String} Discord \@ for roleID.
     */
    makeRoleAt(roleID) {
        return '<@&' + roleID + '>';
    }

    /**
     * Checks if a user exists.
     * If guildId is provided, it will check if the user exists AND is in said guild.
     * @param {String} userId The userId to check
     * @param {String} guildId The guildId to look for the user
     * @returns {User | Boolean} The user if he exists. Else false.
     */
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

    /**
     * Checks if a channel exists
     * If guildId is provided, it will check if the channel exists AND is in said guild.
     * @param {String} channelId The channelID to check
     * @param {String} guildId The guildID to look for the channel
     * @returns {Channel | Boolean} The channel if it exists. Else false.
     */
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

    /**
     * Checks if a RoleID is valid.
     * If guildId is provided, it will check if the role is valid AND is in said guild.
     * @param {String} roleId The roleID to check for
     * @param {String} guildId The guildID to look for the role
     * @returns {Boolean} True, if roleId is valid. Else false.
     */
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