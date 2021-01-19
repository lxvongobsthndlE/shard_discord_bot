const DiscordMessageEmbed = require('discord.js').MessageEmbed;

module.exports = class ArgumentError {
    constructor(author, command, args, errorDescription = 'The arguments provided with the command could not be processed!') {
        this.author = author;
        this.command = command;
        this.args = args;
        this.errorDescription = errorDescription;
        this.usage = null;
    }

    getEmbed() {
        var embed = new DiscordMessageEmbed()
            .setColor('#cc0000')
            .setTitle('Argument Error')
            .setDescription(this.errorDescription)
            .addField('Command', this.command, true)
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setTimestamp();
        if(this.args.length && this.args != null) embed.addField('Arguments', this.args.toString(), true);
        if(this.usage != null) embed.addField('Usage', this.usage);
        return embed;
    }

    setUsage(usage) {
        this.usage = usage;
        return this;
    }
}