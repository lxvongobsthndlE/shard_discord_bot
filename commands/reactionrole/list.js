const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: list
 *  List all reaction-collectors on this server.
 */
module.exports = {
    name: 'list',
    description: 'List all reaction-collectors on this server.',
    aliases: ['all'],
    i18n: {
        en: {
            desc: "Reaction-collectors on this server"
        },
        de: {
            desc: "Reaction-Collectors auf diesem Server"
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "reactionrole/list" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        let rrList = message.client.reactionRoleManager.getAllForGuild(message.guild.id);
        let embed = new DiscordMessageEmbed()
            .setColor('#ffffff')
            .setTitle('Shard ReactionRoles')
            .setDescription(LANG.desc)
            .setFooter('Shard by @lxvongobsthndl')
            .setTimestamp();

        if (rrList.length === 0) {
            embed.addField('This server has no reaction-collectors', `To learn how to add some use \`${guildConfig.prefix}rr help\``);
        }
        else {
            rrList.forEach(rr => {
                embed.addField(message.guild.roles.cache.get(rr.roleID).name,
                    `MsgID: ${rr.messageID}, Channel: ${message.client.helper.makeChannelAt(rr.channelID)}`);
            });
        }

        return message.channel.send(embed);
    },
    determineLanguage(configLanguage) {
        if(this.i18n[configLanguage]) {
            return this.i18n[configLanguage];
        }
        else {
            return this.i18n.en;
        }
    }
}