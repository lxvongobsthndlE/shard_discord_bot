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
        this.initTwitchLiveListenerForChannel('FunLovingGames');
    }

    isTwitchStreamLive(channelName) {
        return (this.isTracked(channelName)) ? this.getTrackedChannelDataByName(channelName).live : twitchClient.helix.users.getUserByName(channelName)
            .then((user) => {
                if (!user) {
                    return false;
                }
                return user.getStream().then((stream) => { return stream != null });
            });

    }

    getTwitchChannel(channelName) {
        return twitchClient.helix.users.getUserByName(channelName)
            .then((u) => {
                return twitchClient.kraken.channels.getChannel(u)
                    .then((ch) => {
                        return ch;
                    });
            });
    }

    initTwitchLiveListenerForChannel(channelName) {
        this.getTwitchChannel(channelName).then((channel) => {
            let listenerIndex = this.channelListeners.length;
            this.channelListeners.push(setInterval(async () => {
                this.channelStati[listenerIndex] = { channel: channel, live: await this.isTwitchStreamLive(channelName), listenerIndex: listenerIndex };
            },
                10000));
        });
        
    }

    isTracked(channelName) {
        for (var i = 0; i < this.channelStati.length; i++) {
            if (this.channelStati[i].channel.name === channelName) {
                return true;
            }
        }
        return false;
    }

    getTrackedChannelDataByName(channelName) {
        for (var i = 0; i < this.channelStati.length; i++) {
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
        if (channelData !== null) {
            clearInterval(this.channelListeners[channelData.listenerIndex]);
            ///WARN: Removing listener from list will shift indices and make listenerIndex value of remaining channelListeners incorrect
        }
    }

    stopTrackingByIndex(index) {
        clearInterval(this.channelListeners[index]);
    }

    startTrackingByName(channelName) {
        this.initTwitchLiveListenerForChannel(channelName);
    }
}