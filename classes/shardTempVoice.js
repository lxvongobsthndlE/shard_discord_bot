const fs = require('fs');
const TempChannels = require("discord-temp-channels");

//placeholders
const phMember = '%member%';
const phCount = '%count%'

module.exports = class ShardTempVoice {
    constructor(discordClient){
        this.tempVoiceChannels = [];
        this.client = discordClient;
        this.tempChannel = new TempChannels(this.client);

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
            this.addNewTempVoiceChannel(el.registerChannelID, el.childCategoryID, el.childMaxUsers, true, el.naming);
        });
    }

    async addNewTempVoiceChannel(registerChannelID, childCategoryID, maxUsersPerChannel, init = false, naming = null) {
        this.tempChannel.registerChannel(registerChannelID, {
            childCategory: childCategoryID,
            childAutoDelete: true,
            childMaxUsers: maxUsersPerChannel,
            childFormat: (member, count) => {
                if (!naming){
                    return `#${count} | ${member.user.username}'s lounge`;
                }
                naming = naming.replace(phMember, member.user.username);
                naming = naming.replace(phCount, count);
                return naming;
            }
        });

        if(!init){
            this.tempVoiceChannels.push({
                registerChannelID: registerChannelID,
                childCategoryID: childCategoryID,
                childMaxUsers: maxUsersPerChannel,
                naming: naming
            })
            this.saveTempVoices();
        }
    }
    
    async removeTempVoiceChannel(registerChannelID) {
        this.tempVoiceChannels = this.tempVoiceChannels.filter(el => {
            return el.registerChannelID !== registerChannelID;
        });
        this.saveTempVoices();
        this.tempChannel.unregisterChannel(registerChannelID);
    }

    async isTempVoiceChannel(registerChannelID) {
        return this.tempVoiceChannels.find(el => el.registerChannelID == registerChannelID);
    }
    
    async setNaming(registerChannelID, naming) {
        this.tempChannel.channels.find(ch => ch.channelID == registerChannelID).options.childFormat = (member, count) => {
            naming = naming.replace(phMember, member.user.username);
            naming = naming.replace(phCount, count);
            return naming;
        };
        this.tempVoiceChannels.find(ch => ch.registerChannelID == registerChannelID).naming = naming;
        this.saveTempVoices();
    }

    async getTempVoiceChannelCount(guildID=null) {
        if (!guildID) {
            return this.tempChannel.channels.length;
        }
        let guildTempChannels = await this.tempChannel.channels.filter(async el => {
            let channelValid = await this.client.helper.checkChannelIdValid(el.channelID, guildID);
            return !channelValid ? false : channelValid.type == 'voice';
        });
        return guildTempChannels.length;
    }

}