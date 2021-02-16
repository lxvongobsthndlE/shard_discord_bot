const fs = require('fs');
const TempChannels = require("discord-temp-channels");

module.exports = class ShardTempVoice {
    constructor(discordClient){
        this.tempVoiceChannels = [];
        this.tempChannel = new TempChannels(discordClient);

        this.loadTempVoices();
    }

    loadTempVoices() {
        fs.readFile('./botData/tempVoiceChannels.json', (err, data) => {
            if (err) {
                console.log('[ERR] Failed reading temp voice channels from file!');
            }
            else{
                this.tempVoiceChannels = JSON.parse(data);
                this.initChannels();
            }  
        });
    }

    saveTempVoices() {
        fs.writeFile('./botData/tempVoiceChannels.json',
            JSON.stringify(this.tempVoiceChannels, null, 2),
            { flag: 'w' },
            (err) => {
                if (err) {
                    console.log('[ERR] Failed writing temp voice channels to file!')
                }
            });
    }

    initChannels() {
        this.tempVoiceChannels.forEach(el => {
            this.addNewTempVoiceChannel(el.registerChannelID, el.childCategoryID, el.childMaxUsers, true);
        });
    }

    addNewTempVoiceChannel(registerChannelID, childCategoryID, maxUsersPerChannel, init = false) {
        this.tempChannel.registerChannel(registerChannelID, {
            childCategory: childCategoryID,
            childAutoDelete: true,
            childMaxUsers: maxUsersPerChannel,
            childFormat: (member, count) => `#${count} | ${member.user.username}'s lounge`
        });

        if(!init){
            this.tempVoiceChannels.push({
                registerChannelID: registerChannelID,
                childCategoryID: childCategoryID,
                childMaxUsers: maxUsersPerChannel
            })
            this.saveTempVoices();
        }
    }
    
    removeTempVoiceChannel(registerChannelID) {
        this.tempVoiceChannels = this.tempVoiceChannels.filter(el => {
            return el.registerChannelID !== registerChannelID;
        });
        this.saveTempVoices();
        this.tempChannel.unregisterChannel(registerChannelID);
    }
    

}