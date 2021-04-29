const ReactionRolesManager = require('discord-reaction-role');

module.exports = class ShardReactionRoleManager {
    constructor(discordClient){
        this.client = discordClient;
        this.manager = new ReactionRolesManager(this.client, {
            storage: './botData/reaction-roles.json'
        });
        this.initListeners();
    }

    initListeners() {
        if (!this.manager.ready) {
            setTimeout(() => this.initListeners(), 1000);
        }
        else {
            this.manager.on('reactionRoleAdded', (reactionRole, member, role, reaction) => {
                console.log(`[ReactionRoles] ${member.user.username}#${member.user.discriminator} got the role : ${role.name}`);
            });
            this.manager.on("reactionRoleRemoved", (reactionRole, member, role, reaction) => {
                console.log(`[ReactionRoles] ${member.user.username}#${member.user.discriminator} lost the role : ${role.name}`);
            });
        }
    }

    
    create(messageId, channel, reaction, role) {
        this.manager.create({
            messageID: messageId,
            channel: channel,
            reaction: reaction,
            role: role
      });
    }

    delete(messageId, reaction) {
        this.manager.delete({
            messageID: messageId,
            reaction: reaction
          });
    }

    isReactionCollector(messageId) {
        return this.manager.reactionRole.some(rr => rr.messageID === messageId);
    }

    /*
    isReactionCollector(messageId, reaction) {
        return this.manager.reactionRole.some(rr => rr.messageID === messageId && rr.reaction === reaction);
    }
    */

    get(messageId) {
        return this.manager.reactionRole.find(rr => rr.messageID === messageId);
    }

    getAll() {
        return this.manager.reactionRole;
    }

    getAllForGuild(guildId) {
        return this.manager.reactionRole.filter(rr => rr.guildID === guildId);
    }

}