const Twitch = require('twitch');
const TwitchAuth = require('twitch-auth');
const secret = require('./secret.json');

//INIT twitch.js
const twitchAuthProvider = new TwitchAuth.ClientCredentialsAuthProvider(secret.twitchClientId, secret.twitchClientSecret);
const twitchClient = new Twitch.ApiClient({ authProvider: twitchAuthProvider });

module.exports = class ShardTwitch {
    channelListeners;
    channelStati;
    constructor() {
        this.channelListeners = [];
        this.channelStati = [];
    }

    async isTwitchStreamLive(channelName) {
        const user = await twitchClient.helix.users.getUserByName(channelName);
        if (!user) {
            return false;
        }
        return await user.getStream() !== null;
    }

    async getTwitchChannel(channelName) {
        const user = await twitchClient.helix.users.getUserByName(channelName);
        const channel = await twitchClient.kraken.channels.getChannel(user);
        return channel;
    }

    initTwitchLiveListenerForChannel(channelName) {
        var listenerIndex = this.channelListeners.length;
        this.channelListeners.push(setInterval(async () => {
            this.channelStati[listenerIndex] = {channel: await this.getTwitchChannel(channelName), live: await this.isTwitchStreamLive(channelName), listenerIndex: listenerIndex};
        }, 
        10000));  
    }

    isTracked(channelName) {
        for(var i = 0; i < this.channelStati.length; i++) {
            if (this.channelStati[i].channel.name === channelName) {
                return true;
            }
        }
        return false;
    }

    getTrackedChannelDataByName(channelName) {
        for(var i = 0; i < this.channelStati.length; i++) {
            if (this.channelStati[i].channel.name === channelName) {
                return this.channelStati[i];
            }
        }
        return null;
    }

    getTrackedChannelDataByIndex(index) {
        return this.channelStati[index];
    }

    getAllTrackedChannelData() {
        return this.channelStati;
    }

    stopTrackingByName(channelName) {
        var channelData = this.getTrackedChannelDataByName(channelName);
        if(channelData !== null) {
            clearInterval(this.channelListeners[channelData.listenerIndex]);
        }
    }

    stopTrackingByIndex(index) {
        clearInterval(this.channelListeners[index]);
    }

    startTrackingByName(channelName) {
        this.initTwitchLiveListenerForChannel(channelName);
    }
}