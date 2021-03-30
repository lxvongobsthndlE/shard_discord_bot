const status = require('./functions/status');
module.exports = (message, queue, playlist, song, emoji) => {
    message.channel.send(
        `${emoji.play} | Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    );
}