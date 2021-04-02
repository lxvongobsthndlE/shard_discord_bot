//const ShellError = require("../errors/ShellError");
const os = require('os');
const ms = require('ms');
const packageInfo = require('../../package.json');
const DiscordMessageEmbed = require('discord.js').MessageEmbed;
/** Command: info
 *  Get some info about the bot and its environment.
 */
module.exports = {
    name: 'info',
    description: 'Get some info about the bot and its environment.',
    secret: true,
    aliases: [],
    usage: '',
    async execute(message, args, guildConfig) {
        if (message.author.id !== message.client.config.ownerId) return;
        console.log('[DEV] ' + message.author.username + ' called "shard/info" command' + ((args.length > 0) ? ' with args: ' + args : '.'));

        message.channel.send('Loading data...')
            .then(async msg => {
                msg.delete();
                let infoMsgEmbed = new DiscordMessageEmbed()
                    .setTitle('Shard Bot Info')
                    .setColor('#a03774')
                    .setTimestamp()
                    .setFooter('Shard by @lxvongobsthndl')
                    .setDescription(
                        `**Creator**: ${message.client.helper.makeUserAt(message.client.config.ownerId)}
                        **Bot Version**: ${packageInfo.version}
                        **Latency**: ${msg.createdTimestamp - message.createdTimestamp}ms (API: ${Math.round(message.client.ws.ping)}ms)
                        **Uptime**: ${ms(ms(process.uptime() + 's'), {long: true})}
                        **Servers**: ${message.client.guilds.cache.size}
                        **Users**: ${message.client.users.cache.size}
                        **Playing music** on ${message.client.voice.connections.size} servers\n
                        **Memory**: ${this.bytesToSize(os.freemem())} (${Math.round((os.freemem() / os.totalmem()) * 100)}%)
                        **Load Avg.**: ${os.loadavg()[0]}, ${os.loadavg()[1]}, ${os.loadavg()[2]} (1m,5m,15m)
                        **Cores**: ${os.cpus().length}
                        **Platform**: ${os.type()} (${os.release()} \`${os.platform()}\`)
                        **Uptime**: ${ms(ms(os.uptime() + 's'), {long: true})}\n
                        **Library**: discord.js ${packageInfo.dependencies['discord.js']}`
                    );
                message.channel.send(infoMsgEmbed);
            })


        /*
        exec(command, (err, stdout, stderr) => {
            if (err) return message.channel.send(message.client.config.emoji.error + 'err:\n```' + err.message + '```');
            if (stderr) return message.channel.send(message.client.config.emoji.error + 'stderr:\n```' + stderr + '```');
            message.channel.send(message.client.config.emoji.success + 'stdout:\n```' + stdout + '```');
        }); 
        */
    },
    bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
};