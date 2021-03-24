/** Command: suggest
 *  Suggest something regarding the bot to the bot developer.
 * 
 */
 module.exports = {
    name: 'suggest',
    description: 'Suggest something regarding the bot to the bot developer.',
    args: true,
    usage: '<suggestion>',
    aliases: [],
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "suggest" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        if (args[0] === "suggestion") return message.reply("Please enter a suggestion. Example:\n`Add a command that allows users to fly to the moon.`");
    args = args.join(" ");
    message.reply("Thanks for submitting your suggestion!");
    let content = `**${message.author.username}#${message.author.discriminator}** (${message.author.id}) suggested:\n~~--------------------------------~~\n${args}\n~~--------------------------------~~\nOn the server: **${message.guild.name}**\nServer ID: **${message.guild.id}**`;
    message.client.channels.cache.get(message.client.config.suggestionChannelId).send(content);

    
    }
}