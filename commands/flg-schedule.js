const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const shedule = require('../configuration/flg-schedule.json');

/** Command: flg-schedule
 *  Get the current streaming schedule of FunLovingGames
 */
module.exports = {
    name: 'flg-schedule',
    description: 'Get the current streaming schedule of FunLovingGames',
    args: false,
    usage: '',
    aliases: ['zeitplan', 'streams'],
    flg: true,
    execute(message, args, guildConfig) {
        //disable command for all guilds but FunLovingGames
        if (message.guild.id != '743221608113766453') {
            return message.channel.send(new NoPermissionError(message.author, this.name, args, 'This command is not available on this server!').getEmbed());
        }

        console.log(message.author.username + ' called "flg-schedule" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        //Prep Embed
        let retEmbed = new DiscordMessageEmbed()
            .setAuthor(message.client.user.tag, message.client.user.displayAvatarURL())
            .setThumbnail('https://raw.githubusercontent.com/lxvongobsthndlE/shard_discord_bot/master/media/server-icon.png')
            .setColor('#F5A623')
            .setTitle('FunLovingGames\' Stream Zeitplan')
            .setDescription('Direktlinks:\n' 
                + '[Twitch](https://www.twitch.tv/funlovinggames "FunLovingGames auf Twitch")\n'
                + '[YouTube](https://www.youtube.com/channel/UCA68k_cmMLKF9yRQFhEX2hQ "FunLovingGames auf YouTube")')
            .setURL('https://www.twitch.tv/funlovinggames/schedule')
            .setTimestamp();

        shedule.forEach(entry => {
            retEmbed.addField(entry.day, this.determineClockEmoji(entry.startTime) + ' ' + entry.startTime + ' Uhr');
        })

        return message.channel.send(retEmbed);
    },
    determineClockEmoji(stringTime) {
        //Regex HH:MM 24h with optional leading zero: /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
        if (stringTime.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
            let time = stringTime.split(':');
            time[0] = time[0].startsWith('0') ? time[0].substring(1) : time[0];
            time[0] = time[0] % 12;
            time[0] = time[0] == 0 ? '12' : time[0].toString();
            time[1] = time[1] == '30' ? time[1] : '';
            return ':clock' + time[0] + time[1] + ':';
        }
        return ':timer:';
    }
}