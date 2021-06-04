const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const ms = require('ms');
const moment = require('moment');
const ArgumentError = require('../errors/ArgumentError');

/** Command: giveaway
 *  Manage a giveaway. Use option "help" to learn more.
 */
module.exports = {
    name: 'giveaway',
    description: 'Manage a giveaway. Use option "help" to learn more.',
    args: true,
    usage: '<option> [parameters]',
    aliases: ['ga'],
    adminOnly: true,
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "giveaway" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var option = args.shift().toLowerCase();

        switch(option) {
            case "help":
                message.channel.send(new DiscordMessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(':triangular_flag_on_post: Giveaway Help')
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setDescription('**Duration syntax:**\nThe bot will only accept durations suffixed with the first letter of the time unit.\nExample: Want to enter 1 day? -> **1d** or **24h**\nAvailable time units: s, m, h, d, w, y')
                    .addField(guildConfig.prefix + 'giveaway **start** <duration> <winnerCount> <prize>', 'Start a new giveaway.\n<duration>: the time the giveaway should last\n<winnerCount>: the amount of winners\n<prize> the description of the prize')
                    .addField(guildConfig.prefix + 'giveaway **edit** <messageID> <durationChange> <newWinnerCount> <newPrize>', 'Edit an existing giveaway.\n<messageID>: The ID of the giveaway message\n<durationChange>: time to add or substract\n<newWinnerCount>: the new amount of winners\n<newPrize> the new description of the prize')
                    .addField(guildConfig.prefix + 'giveaway **delete** <messageID>', 'Delete an existing giveaway.\n<messageID>: The ID of the giveaway message')
                    .addField(guildConfig.prefix + 'giveaway **reroll** <messageID>', 'Reroll the winners of a giveaway.\n<messageID>: The ID of the giveaway message')
                    .addField(guildConfig.prefix + 'giveaway **list-all**', 'List all active giveaways on this server.')
                    .setFooter('Shard by @lxvongobsthndl')
                    .setTimestamp());
                break;
            case "start":
                //!ga start <duration> <winnerCount> <prize>
                if(!durationValid(args[0])){
                    message.channel.send(new ArgumentError(message.author, this.name + ' start', args, 'Invalid duration syntax detected! Use "' + guildConfig.prefix + 'giveaway help" to learn about correct syntax!').getEmbed());
                }
                else {
                    message.client.giveawaysManager.start(message.channel, {
                        time: ms(args[0]),
                        prize: args.slice(2).join(' '),
                        winnerCount: parseInt(args[1]),
                        hostedBy: message.author,
                        messages: (guildConfig.language) ? messages.get(guildConfig.language) : messages.get('en')
                    }).then((gaData) => {
                        console.log('New Giveaway started by ' + message.author + ': [\n\ttime: ' + args[0] + '\n\twinners: ' + args[1] + '\n\tprize: ' + args.slice(2).join(' ') + '\n]');
                    });
                }
                break;
            case "edit":
                //!ga edit <msgID> <addTime> <winnerCount> <prize>
                if(!durationValid(args[1])){
                    message.channel.send(new ArgumentError(message.author, this.name + ' start', args, 'Invalid duration syntax detected! Use "' + guildConfig.prefix + 'giveaway help" to learn about correct syntax!').getEmbed());
                }
                let msgID = args[0];
                message.client.giveawaysManager.edit(msgID, {
                    newWinnerCount: parseInt(args[2]),
                    newPrize: args.slice(3).join(' '),
                    addTime: ms(args[1])
                }).then(() => {
                    message.channel.send("Success! Giveaway will update in a few seconds.");
                }).catch((err) => {
                    console.log(err);
                    message.channel.send("No giveaway found for " + msgID + ", please check and try again.");
                });
                break;
            case "delete":
                //!ga delete <msgID>
                let messageId = args[0];
                message.client.giveawaysManager.delete(messageId).then(() => {
                    message.channel.send("Success! Giveaway deleted!");
                }).catch((err) => {
                    message.channel.send("No giveaway found for " + messageId + ", please check and try again");
                });
                break;
            case "list-all":
                //!ga list-all
                let onServer = message.client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
                var responseEmbed = new DiscordMessageEmbed()
                    .setColor('#FF9900')
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription('This server has the following active giveaways:')
                    .setFooter('Shard by @lxvongobsthndl')
                    .setTimestamp();
                onServer.forEach(ga => {
                    if(!ga.ended){
                        responseEmbed.addField(ga.prize, 'Winners: ' + ga.winnerCount + '\nEnds ' + moment(ga.endAt).fromNow() + '\nHosted by: ' + ga.hostedBy + '\nmsgID: ' + ga.messageID);
                    }
                });
                message.channel.send(responseEmbed);
                break;
            case "reroll":
                //!ga reroll <msgID>
                let messageID = args[0];
                message.client.giveawaysManager.reroll(messageID, {
                    messages: (guildConfig.language) ? rerollMsg.get(guildConfig.language) : rerollMsg.get('en')
                }).catch((err) => {
                    message.channel.send("No giveaway found for " + messageID + ", please check and try again.");
                });
                break;
        }
        
    }
}

function durationValid(duration) {
    return (duration.includes('s') ||   //seconds
            duration.includes('m') ||   //minutes
            duration.includes('h') ||   //hours
            duration.includes('d') ||   //days
            duration.includes('w') ||   //weeks
            duration.includes('y'))     //years
            && !duration.includes(' '); //no whitespaces!
}

const rerollMsg = new Map();
rerollMsg.set('en', {
    congrat: ":tada: New winner(s) : {winners}! Congratulations!",
    error: "No valid participations, no winners can be chosen!"
});
rerollMsg.set('de', {
    congrat: ":tada: Neue(r) Gewinner: {winners}! Glückwunsch!",
    error: "Es gibt keine gültigen Teilnahmen, somit kann kein Gewinner gezogen werden!"
});

const messages = new Map();
messages.set('en', {
    giveaway: "@everyone\n\n🎉🎉 **GIVEAWAY** 🎉🎉",
    giveawayEnded: "@everyone\n\n🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
    timeRemaining: "Time remaining: **{duration}**!",
    inviteToParticipate: "React with 🎉 to participate!",
    winMessage: "Congratulations, {winners}! You won **{prize}**!\nContact the giveaway host to receive your prize.",
    embedFooter: "Giveaways",
    noWinner: "Giveaway cancelled, no valid participations.",
    hostedBy: "Hosted by: {user}",
    winners: "winner(s)",
    endedAt: "Ended at",
    units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
    }
});
messages.set('de', {
    giveaway: "@everyone\n\n🎉🎉 **VERLOSUNG** 🎉🎉",
    giveawayEnded: "@everyone\n\n🎉🎉 **VERLOSUNG BEENDET** 🎉🎉",
    timeRemaining: "Verbleibende Zeit: **{duration}**!",
    inviteToParticipate: "Reagiert mit 🎉, um an der Verlosung teilzunehmen!",
    winMessage: "Glückwunsch, {winners}! Dein/Euer Gewinn: **{prize}**!\nKontaktiere den Veranstalter der Verlosung um deinen Preis zu erhalten.",
    embedFooter: "Verlosungen",
    noWinner: "Verlosung abgebrochen. Keine gültigen Teilnahmen.",
    hostedBy: "Veranstaltet von: {user}",
    winners: "Gewinner",
    endedAt: "Beendet am",
    units: {
        seconds: "Sekunden",
        minutes: "Minuten",
        hours: "Stunden",
        days: "Tage",
        pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
    }
});