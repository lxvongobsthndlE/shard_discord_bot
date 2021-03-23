/** Command: bug
 *  Report a bug to the bot developer.
 * 
 */
module.exports = {
    name: 'bug',
    description: 'Report a bug to the bot developer.',
    args: true,
    usage: '<bug>',
    aliases: [],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "bug" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (args[0] === "bug") return message.reply("Please specify the bug. Example:\n`Command dog isn't working. It is returning cat pictures instead of dog pictures!`");
    args = args.join(" ");
    message.reply("Thanks for submitting a bug! :bug:");
    let content = `**${message.author.username}#${message.author.discriminator}** (${message.author.id}) reported:\n~~--------------------------------~~\n${args}\n~~--------------------------------~~\nOn the server: **${message.guild.name}**\nServer ID: **${message.guild.id}**`;
    message.client.channels.cache.get(message.client.config.bugChannelId).send(content);

    
    }
}