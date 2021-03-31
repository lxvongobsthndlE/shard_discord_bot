const requireEvent = (event) => require('../events/' + event);
const requireDistubeEvent = (event) => require('../events/distube/' + event);

module.exports = client => {
    //Discord
    client.on('ready', () => requireEvent('ready')(client));
    client.on('guildDelete', requireEvent('guildDelete'));
    client.on('guildCreate', requireEvent('guildCreate'));
    client.on('guildMemberRemove', member => requireEvent('guildMemberRemove')(member, client));
    client.on('guildBanAdd', (guild, user) => requireEvent('guildBanAdd')(guild, user, client));
    client.on('guildMemberAdd', member => requireEvent('guildMemberAdd')(member, client));
    client.on('message', message => requireEvent('message')(message, client));

    //Distube
    client.distube.on("playSong",
        (message, queue, song) => requireDistubeEvent('playSong')(message, queue, song, client.config.emoji));
    client.distube.on("addSong",
        (message, queue, song) => requireDistubeEvent('addSong')(message, queue, song, client.config.emoji));
    client.distube.on("playList",
        (message, queue, playlist, song) => requireDistubeEvent('playList')(message, queue, playlist, song, client.config.emoji));
    client.distube.on("addList",
        (message, queue, playlist) => requireDistubeEvent('addList')(message, queue, playlist, client.config.emoji));
    client.distube.on("searchResult", 
        (message, result) => requireDistubeEvent('searchResult')(message, result, client.config.emoji));
    client.distube.on("searchCancel",
        message => requireDistubeEvent('searchCancel')(message, client.config.emoji));
    client.distube.on("error",
        (message, err) => requireDistubeEvent('error')(message, err, client.config.emoji));
};