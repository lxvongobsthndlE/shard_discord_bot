const fs = require('fs');

module.exports = class ShardChannelpurge {
    
    purgedChannels;

    constructor(){
        this.purgedChannels = [];
        this.loadSafedPurges();
    }

    loadSafedPurges() {
        fs.readFile('./botData/purgedChannels.json', (err, data) => {
            if (err) {
                console.log('[ERR] Failed reading purged channels from file!');
            }
            this.purgedChannels = JSON.parse(data);
        });
    }

    savePurges() {
        fs.writeFile('./botData/purgedChannels.json',
            JSON.stringify(this.purgedChannels, null, 2),
            { flag: 'w' },
            (err) => {
                if (err) {
                    console.log('[ERR] Failed writing purged channels to file!')
                }
            });
    }

    /** Toggles purge mode in given channel on or off depending on previous state
     * 
     * @param {*} channelId The ID of the channel the purge mode should be enabled/disabled
     * @returns {*} boolean - true if purge mode has been enabled, false if it has been disabled.
     */
    toggle(channelId) {
        let result = true;
        if(this.purgedChannels.includes(channelId)) {
            this.purgedChannels.splice(this.purgedChannels.indexOf(channelId), 1);
            result = false;
        }
        else {
            this.purgedChannels.push(channelId)
        }
        this.savePurges();
        return result;
    }

    isInPurgeMode(channelId) {
        return this.purgedChannels.includes(channelId);
    }
}