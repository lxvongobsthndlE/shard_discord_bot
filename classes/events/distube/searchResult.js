const status = require('./functions/status');
module.exports = (message, result, emoji) => {
    // DisTubeOptions.searchSongs = true
    let i = 0
    message.channel.send(
        `**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
    );
}