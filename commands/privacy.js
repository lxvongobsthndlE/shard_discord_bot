const DiscordMessageEmbed = require('discord.js').MessageEmbed;

/** Command: privacy
 *  Shows the bots privacy policy
 *
 *  Use this link to create an invite: https://discordapi.com/permissions.html
 *  Client ID: 759925230017052674
 */
module.exports = {
    name: 'privacy',
    description: 'Shows the bots privacy policy.',
    args: false,
    usage: '',
    aliases: ['datenschutz'],
    i18n: {
        en: {
            embedDescription: "By using Shard, you agree to the following privacy policy.",
            informationStoredTitle: "What information is stored?",
            informationStored1: "Your userID is stored if you get a warning, kick or ban and if a moderator or administrator looks you up.\n",
            informationStored2: "Your userID is stored if you are blacklisted by the bot owner.\n",
            informationStored3: "Your userID is stored if you are a moderator or admin of the bot.\n",
            informationStored4: "If you setup a memberlog, modlog, meme or welcome channel, the channelID gets stored.\n",
            informationStored5: "For each server a `guildConfig` is created, storing all guild related settings. These include but are not limited to: serverID, prefix and language.\n",
            whyWeStoreInformationTitle: "Why we store the information and how we use it.",
            whyWeStoreInformation1: "For warnings, kicks, bans and lookups, this information is stored to allow server admins and mods to better manage their community.\n",
            whyWeStoreInformation2: "For blacklist, this information is stored to prevent certain users from inviting the bot to their servers.\n",
            whyWeStoreInformation3: "For moderators and admins, this information is stored so the bot knows a user can use privileged commands.\n",
            whyWeStoreInformation4: "For all channelIDs, this information is stored to send messages/perform actions in said channels.\n",
            whyWeStoreInformation5: "For `guildConfig`, this information is stored to enable per server configuration of prefix, language and more.\n",
            whoGetsThisDataTitle: "Who gets this data?",
            whoGetsThisData1: "The stored data is not accessible to anyone but Shards administrator.\n",
            thirdPartySharingTitle: "Third Party Data Sharing.",
            thirdPartySharing1: "No data is shared with any third parties.\n",
            questionsConcernsTitle: "Questions and Concerns.",
            questionsConcerns1: "If you have questions and/or concerns about the data stored, please contact us at shard@lxvongobsthndl.dev\n",
            removeDataTitle: "How to Remove your data.",
            removeData1: "If you would like us to remove your data, please contact us at shard@lxvongobsthndl.dev\n",
            noteTitle: "Note:",
            note1: "We reserve the right to change this without notifying our users.\n",
            note2: "This policy was last updated June 15th, 2021.\n"
        },
        de: {
            embedDescription: "Durch die Verwendung von Shard, stimmst du folgenden Datenschutzrichtlinien zu.",
            informationStoredTitle: "Welche Daten werden gespeichert?",
            informationStored1: "Your userID is stored if you get a warning, kick or ban and if a moderator or administrator looks you up.\n",
            informationStored2: "Your userID is stored if you are blacklisted by the bot owner.\n",
            informationStored3: "Your userID is stored if you are a moderator or admin of the bot.\n",
            informationStored4: "If you setup a memberlog, modlog, meme or welcome channel, the channelID gets stored.\n",
            informationStored5: "For each server a `guildConfig` is created, storing all guild related settings. These include but are not limited to: serverID, prefix and language.\n",
            whyWeStoreInformationTitle: "Why we store the information and how we use it.",
            whyWeStoreInformation1: "For warnings, kicks, bans and lookups, this information is stored to allow server admins and mods to better manage their community.\n",
            whyWeStoreInformation2: "For blacklist, this information is stored to prevent certain users from inviting the bot to their servers.\n",
            whyWeStoreInformation3: "For moderators and admins, this information is stored so the bot knows a user can use privileged commands.\n",
            whyWeStoreInformation4: "For all channelIDs, this information is stored to send messages/perform actions in said channels.\n",
            whyWeStoreInformation5: "For `guildConfig`, this information is stored to enable per server configuration of prefix, language and more.\n",
            whoGetsThisDataTitle: "Who gets this data?",
            whoGetsThisData1: "The stored data is not accessible to anyone but Shards administrator.\n",
            thirdPartySharingTitle: "Third Party Data Sharing.",
            thirdPartySharing1: "No data is shared with any third parties.\n",
            questionsConcernsTitle: "Questions and Concerns.",
            questionsConcerns1: "If you have questions and/or concerns about the data stored, please contact us at shard@lxvongobsthndl.dev\n",
            removeDataTitle: "How to Remove your data.",
            removeData1: "If you would like us to remove your data, please contact us at shard@lxvongobsthndl.dev\n",
            noteTitle: "Note:",
            note1: "We reserve the right to change this without notifying our users.\n",
            note2: "This policy was last updated June 15th, 2021.\n"
        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "privacy" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        let LANG = this.determineLanguage(guildConfig.language);

        return message.channel.send(new DiscordMessageEmbed()
            .setColor('#a03774')
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setDescription(LANG.embedDescription)
            .setFooter('Shard by @lxvongobsthndl')
            .setTimestamp()
            .addField(LANG.informationStoredTitle,
                LANG.informationStored1 +
                LANG.informationStored2 +
                LANG.informationStored3 +
                LANG.informationStored4 +
                LANG.informationStored5
            )
            .addField(LANG.whyWeStoreInformationTitle,
                LANG.whyWeStoreInformation1 +
                LANG.whyWeStoreInformation2 +
                LANG.whyWeStoreInformation3 +
                LANG.whyWeStoreInformation4 +
                LANG.whyWeStoreInformation5
            )
            .addField(LANG.whoGetsThisDataTitle, LANG.whoGetsThisData1)
            .addField(LANG.thirdPartySharingTitle, LANG.thirdPartySharing1)
            .addField(LANG.questionsConcernsTitle, LANG.questionsConcerns1)
            .addField(LANG.removeDataTitle, LANG.removeData1)
            .addField(LANG.noteTitle,
                LANG.note1 +
                LANG.note2
            )
        );
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