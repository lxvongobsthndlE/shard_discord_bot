const DiscordMessageEmbed = require('discord.js').MessageEmbed;

module.exports = class NoPermissionError {
    constructor(author, command, args, errorDescription = 'You do not have permission to use this command. If you think this is a mistake, contact a server admin.') {
        this.author = author;
        this.command = command;
        this.args = args;
        this.errorDescription = errorDescription;
    }

    getEmbed() {
        var embed = new DiscordMessageEmbed()
            .setColor('#cc0000')
            .setTitle('No Permission Error')
            .setDescription(this.errorDescription)
            .addField('Command', this.command, true)
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setTimestamp();
        if(this.args.length && this.args != null) embed.addField('Arguments', this.args.toString(), true);
        return embed;
    }
}