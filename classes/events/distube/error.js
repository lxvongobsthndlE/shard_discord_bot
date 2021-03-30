const status = require('./functions/status');
module.exports = (message, err, emoji) => {
    // DisTubeOptions.searchSongs = true
    message.channel.send(
        `${emoji.error} | An error ocurred: ${err}`
    );
}