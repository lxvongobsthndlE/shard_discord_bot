const requireEvent = (event) => require('../events/' + event);
module.exports = client => {
    client.on('ready', () => requireEvent('ready')(client));
    //client.on('message', requireEvent('message'));
    client.on('guildCreate', requireEvent('guildCreate'))
};