const Helper = require('../classes/Helper');
const emojiList = require('../configuration/data-ordered-emoji.js');

/** Command: react
 *  Reacts with a random emoji to message.
 */
module.exports = {
    name: 'react',
    description: 'Reacts with a random emoji to your command.',
    args: false,
    usage: '',
    aliases: [],
    execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "react" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        var helper = new Helper();
        message.react(emojiList[helper.getRandomInteger(0, emojiList.length)]);
    }
}