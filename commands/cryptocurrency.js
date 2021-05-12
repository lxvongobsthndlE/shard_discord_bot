const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const fetch = require('node-fetch');

/** Command: cryptocurrency <>
 *  Show some live info about a specified cryptocurrency.
 */
module.exports = {
    name: 'cryptocurrency',
    description: 'Show some live info about a specified cryptocurrency.',
    args: true,
    usage: '<crypto coin>',
    aliases: ['crypto'],
    i18n: {
        en: {
            dataBy: "Data provided by: ",
            week: "week",
            day: "day",
            hour: "hour",
            price: "Current value"
        },
        de: {
            dataBy: "Daten bereitgestellt von: ",
            week: "Woche",
            day: "Tag",
            hour: "Stunde",
            price: "Aktueller Wert"
        }
    },
    async execute(message, args, guildConfig) {
        console.log(message.author.username + ' called "cryptocurrency" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        let LANG = this.determineLanguage(guildConfig.language);

        let coinID = await this.findCoinId(args[0]);

        if (coinID == null) {
            console.log(args[0] + ' not found.');
            return message.channel.send('Could not find cryptocurrency with the name `' + args[0] + '`!');
        }

        let coinData = await this.getCoinData(coinID); 

        return message.channel.send(new DiscordMessageEmbed()
            .setColor('#F3BA2F')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(coinData[0].name + ' (' + coinData[0].symbol + ')')
            .addField(LANG.price, '1 ' + coinData[0].symbol + ' = ' + coinData[0].price_usd + ' $')
            .addField(LANG.week, coinData[0].percent_change_7d + '%', true)
            .addField(LANG.day, coinData[0].percent_change_24h + '%', true)
            .addField(LANG.hour, coinData[0].percent_change_1h + '%', true)
            .setTimestamp()
            .setFooter(LANG.dataBy + 'coinlore.com')
        );
    },
    determineLanguage(configLanguage) {
        if(this.i18n[configLanguage]) {
            return this.i18n[configLanguage];
        }
        else {
            return this.i18n.en;
        }
    },
    findCoinId(coin) {
        return fetch('https://api.coinlore.net/api/tickers/')
            .then(res => res.json())
            .then(async data => {
                let maxCoins = data.info.coins_num;
                let startIndex = 100;
                let coinFound = data.data.find(ticker =>
                    ticker.symbol.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0 ||
                    ticker.name.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0 ||
                    ticker.nameid.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0
                );
                while (coinFound === undefined) {
                    data = await this.getCoinList(startIndex);
                    coinFound = data.data.find(ticker =>
                        ticker.symbol.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0 ||
                        ticker.name.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0 ||
                        ticker.nameid.localeCompare(coin, undefined, { sensitivity: 'accent' }) == 0
                    );
                    startIndex += 100;
                    if (maxCoins < startIndex) break;
                }
                return coinFound ? coinFound.id : null;
            });
    },
    getCoinList(start) {
        return fetch('https://api.coinlore.net/api/tickers/?start=' + start + '&limit=100')
            .then(res => res.json());
    },
    getCoinData(coinId) {
        return fetch('https://api.coinlore.net/api/ticker/?id=' + coinId)
            .then(data => data.json())
    }
}