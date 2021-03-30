const status = require('./functions/status');
module.exports = (message, queue, playlist, emoji) => {
    message.channel.send(
        `${emoji.success} | Added \`${playlist.title}\` playlist (${playlist.total_items} songs) to queue\n${status(queue)}`
    );
}