const status = require('./functions/status');
module.exports = (message, emoji) => {
    // DisTubeOptions.searchSongs = true
    message.channel.send(
        `${emoji.error} | Searching canceled`
    );
}