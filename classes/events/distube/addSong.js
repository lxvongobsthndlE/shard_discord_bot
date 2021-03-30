const status = require('./functions/status');
module.exports = (message, queue, song, emoji) => {
    message.channel.send(
        `${emoji.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    );
}
