const DiscordMessageEmbed = require('discord.js').MessageEmbed;

module.exports = class NoSuchLanguageError {
    command;
    args;
    errorDescription;
    author;
    constructor(author, command, args, errorDescription = 'The language code provided is not supported yet or does not exist.') {
        this.author = author;
        this.command = command;
        this.args = args;
        this.errorDescription = errorDescription;
    }

    getEmbed() {
        var embed = new DiscordMessageEmbed()
            .setColor('#cc0000')
            .setTitle('No Such Language Error')
            .setDescription(this.errorDescription)
            .addField('Command', this.command, true)
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setTimestamp();
        if(this.args.length && this.args != null) embed.addField('Arguments', this.args.toString(), true);
        return embed;
    }
}