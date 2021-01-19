const DiscordMessageEmbed = require('discord.js').MessageEmbed;

module.exports = class ExecutionError {
    constructor(author, command, args, errorDescription = 'The entered command was recognized, but failed in execution. Check if all your inputs were valid. If this error persists please contact @lxvongobsthndl.') {
        this.author = author;
        this.command = command;
        this.args = args;
        this.errorDescription = errorDescription;
    }

    getEmbed() {
        var embed = new DiscordMessageEmbed()
            .setColor('#cc0000')
            .setTitle('Execution Error')
            .setDescription(this.errorDescription)
            .addField('Command', this.command, true)
            .setAuthor(this.author.tag, this.author.displayAvatarURL())
            .setTimestamp();
        if(this.args.length && this.args != null) embed.addField('Arguments', this.args.toString(), true);
        return embed;
    }
}