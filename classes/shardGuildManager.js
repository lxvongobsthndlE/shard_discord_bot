const fs = require('fs');

module.exports = class ShardGuildManager {
    constructor(guildDataPath = __dirname + '/../guildData') {
        this.guildConfigs = [];
        this.guildDataPath = guildDataPath;
        var files = fs.readdirSync(guildDataPath).filter(file => file.endsWith('.json'));
        files.forEach(file => {
            if(file !== 'default.json') {
                var guildConfig = fs.readFileSync(guildDataPath + '/' + file);
                guildConfig = JSON.parse(guildConfig);
                this.guildConfigs.push(guildConfig);
            }
        });
    }

    getGuildConfigById(guildId) {
        var guildIndex = -1;
        for(var i = 0; i < this.guildConfigs.length; i++) {
            if(this.guildConfigs[i].guildId === guildId) {
                guildIndex = i;
            }
        } 
        return (guildIndex >= 0) ? this.guildConfigs[guildIndex] : this.newGuildConfig(guildId);
    }

    async updateGuildConfigById(guildId, key, value) {
        var filePath = this.guildDataPath + '/' + guildId + '.json';
        for(var i = 0; i < this.guildConfigs.length; i++) {
            if(this.guildConfigs[i].guildId === guildId) {
                this.guildConfigs[i][key] = value;
                if(fs.access(filePath, err => err ? true : false)) return; //Should throw error
                await fs.writeFile(filePath, JSON.stringify(this.guildConfigs[i], null, 2), (err) => {
                    if(err) throw err;
                    console.log('Updated "' + key + '" with value "' + value + '" for guildId ' + guildId);
                });
                return;
            }
        }
    }

    newGuildConfig(guildId) {
        var filePath = this.guildDataPath + '/' + guildId + '.json';
        var defaultConfig = fs.readFileSync(this.guildDataPath + '/default.json');
        defaultConfig = JSON.parse(defaultConfig);
        defaultConfig.guildId = guildId;
        this.guildConfigs.push(defaultConfig);
        fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }
}