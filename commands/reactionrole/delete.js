const ArgumentError = require('../../errors/ArgumentError');

/** Command: delete
 *  Delete an existing reactionCollector.
 */
module.exports = {
    name: 'delete',
    description: 'Delete an existing reaction-collector.',
    args: true,
    usage: '<message id>',
    aliases: ['remove', 'del'],
    i18n: {
        en: {
            done: "Successfully removed reaction-collector.",
            errMsgDelete: "Could not delete the collector-message though!"
        },
        de: {
            done: "Reaction-Collector erfolgreich entfernt.",
            errMsgDelete: "Die mit dem Collector verbunden Nachricht konnte allerdings nicht gelöscht werden!"
        }
    },
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "reactionrole/delete" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);
        if (!message.client.reactionRoleManager.isReactionCollector(args[0])) {
            return message.channel.send(new ArgumentError(message.author, this.name, args, 'The provided messageId is not a reaction-controller.').getEmbed());
        }
        let rr = message.client.reactionRoleManager.get(args[0]);
        message.client.reactionRoleManager.delete(rr.messageID, rr.reaction);
        message.client.channels.cache.get(rr.channelID).messages.fetch(rr.messageID)
            .then(msg => {
                msg.delete()
                    .catch(err => {
                        message.channel.send(LANG.errMsgDelete);
                    });
            });
        return message.channel.send(LANG.done);
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