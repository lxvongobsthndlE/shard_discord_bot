const DiscordMessageEmbed = require('discord.js').MessageEmbed;

module.exports = class VoiceError {
    constructor(author, command, errorDescription = 'This usually happens, when you\'re required to be connected to a voice channel when executing a command!') {
        this.author = author;
        this.command = command;
        this.errorDescription = errorDescription;
        this.description = null;
    }

    getEmbed() {
        var embed = new DiscordMessageEmbed()
            .setColor('#cc0000')
            .setTitle('Voice Error')
            .setDescription(this.errorDescription)
            .addField('Command', this.command, true)
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setTimestamp();
        return embed;
    }
}