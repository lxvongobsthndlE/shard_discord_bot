const presence = require('../../botData/presence.json');
module.exports = discordClient => {
    //Set presence
    discordClient.user.setPresence(
        { 
            activity: { 
                name: discordClient.helper.stringTemplateParser(presence.activity, {serverCount: discordClient.guilds.cache.size}),
                type: presence.activityType 
            }, 
            status: presence.status 
        });
    setInterval(() => {
        discordClient.user.setPresence(
            { activity: { 
                name: discordClient.helper.stringTemplateParser(presence.activity, {serverCount: discordClient.guilds.cache.size}), 
                type: presence.activityType 
            }, 
            status: presence.status 
        });
    }, 60000);
    
    //READY
    console.log('Shard-Client ready!\nServing ' + discordClient.guilds.cache.size + ' servers.');
}