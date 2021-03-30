const status = require('./functions/status');
module.exports = (message, queue, song, emoji) => {
    message.channel.send(
        `${emoji.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    );  
}
