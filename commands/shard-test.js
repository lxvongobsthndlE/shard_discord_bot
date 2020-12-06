const DiscordMessageEmbed = require('discord.js').MessageEmbed;
const Helper = require('../classes/Helper');

/** Command: shard-test
 *  Command for testing various stuffs.
 */
module.exports = {
    name: 'shard-test',
    description: 'Test command.',
    args: false,
    usage: '',
    aliases: ['stest'],
    secret: true,
    execute(message, args, guildConfig) {
        if(message.author.id !== "313742410180198431") return;
        console.log('[DEV] ' + message.author.username + ' called "shard-test" command' + ((args.length > 0) ? ' with args: ' + args : '.'));
        const helper = new Helper();

        if (args[0] == 'flgrules') {
            flg_rules(message.guild).forEach(rule => {
                message.channel.send(rule);
            });
            return;
        }
        if (args[0] == 'at') {
            console.log(message.author);
            message.channel.send(new DiscordMessageEmbed()
                .setAuthor(message.author.tag)
                .setDescription('User: ' + helper.makeUserAt(message.author))
            );
            return;
        }

        message.channel.send("Du Ollum!");
    }
}

function shard_test(msg, args) {
    //!config reactionrole <roleID> [<reaction>]
    var guildRoles = msg.guild.roles.cache;
    //guildRoles.forEach(r => console.log(r.name));
    //console.log("-------------");
    var userRoles = msg.guild.members.cache.get(msg.author.id).roles.cache;
    userRoles.forEach(r => console.log(r.name));
    console.log("-------------");
    var xboxRole = guildRoles.get("770563429995380746");
    var roleManager = new Discord.GuildMemberRoleManager(msg.guild.members.cache.get(msg.author.id));
    roleManager.add(xboxRole);
    return "check console.";
}

function add_role(msg, args) {
    var roleManager = new Discord.GuildMemberRoleManager(msg.guild.members.cache.get(msg.author.id));
    var guildRoles = msg.guild.roles.cache;
    var config = shardGuildManager.getGuildConfigById(msg.guild.id);
    // TODO: GET GETTABLE ROLES FROM CONFIG
    //       GET FULL ROLE FROM GUILDROLES
    //       CHECK ARGS WITH GETTABLE ROLES
    //       ADD ROLE TO USER roleManager.add(role)
}

function flg_rules(guild) {
    return [
    new DiscordMessageEmbed()
    .setColor('#0099ff')
    .setAuthor(guild.name, guild.iconURL())
    .setTitle('Regeln')
    .setDescription('**Bitte lies dir die folgenden Regeln vollständig durch!**\nSie dienen jedem hier auf dem Server und helfen eine gesunde Gemeinschaft zu erhalten.'),
    new DiscordMessageEmbed()
    .setColor('#ff4c4c')
    .setTitle('§1 - Allgemein')
    .addField('§1.1 Nicknames und Beschreibungen', 'Nicknames und Beschreibungen dürfen keine beleidigenden oder anderen verbotenen Namen oder Namensteile enthalten, zudem dürfen keine Namen kopiert werden, sich als jemand anderes ausgegeben werden oder andere Leute damit gestört werden.')
    .addField('§1.2 Avatare', 'Avatare dürfen keine pornographische, sexistische, rassistische oder verbotene Symbole oder Abbildungen beinhalten.')
    .addField('§1.3 Datenschutz', 'Private Daten wie Telefonnr., Adressen, Passwörter, private Bilder, etc. dürfen nicht öffentlich ausgetauscht werden, zudem dürfen Daten ohne Erlaubnis des Besitzers nicht weitergegeben werden – auch nicht privat.')
    .addField('§1.4 Werbung', 'Fremdwerbung jeglicher Art ist strengstens untersagt. Auch als Privatnachricht an User.'),
    new DiscordMessageEmbed()
    .setColor('#7d3f98')
    .setTitle('§2 - Chat')
    .addField('§2.1', 'Beleidigungen, provokante Diskussionen, Aggressivität und jegliche Art von Spam sind zu unterlassen.')
    .addField('§2.2', 'bewusste Falschaussagen / Trolling ist untersagt.')
    .addField('§2.3', 'Pornografisches Material, Rassismus, Sexismus und Antisemitismus in jeglicher Form wird nicht geduldet.')
    .addField('§2.4', 'Aussagen/Verbreitung von Material zu Gewalt und den in §2.3 genannten Punkten wird mit einem permanenten Ban geahnded.')
    .addField('§2.5', 'Anstiften zu Regelbrüchen ist verboten.')
    .addField('§2.6', 'Caps Lock sparsam einsetzen.')
    .addField('§2.7', 'Angelegenheiten mit dem Mod-/ Adminteam werden bitte per Privatchat besprochen.'),
    new DiscordMessageEmbed()
    .setColor('#511378')
    .setTitle('§3 - Sprachchat')
    .addField('§3.1', 'Unter **keinen** Umständen darf die Stimme (+ LIVE-Übertragungen) anderer User ohne deren Einverständnis aufgenommen werden.')
    .addField('§3.2', 'Wer in einem Stream dabei ist (#stream Sprachkanal), gibt sein Einverständnis zu §3.1 durch den Beitritt in den Kanal ab.')
    .addField('§3.3', 'Respektiert andere Meinungen auch wenn sie nicht eurer eigenen entsprechen.')
    .addField('§3.4', 'Absichtliche oder unabsichtliche Störgeräusche sind möglichst zu vermeiden.'),
    new DiscordMessageEmbed()
    .setColor('#fbb034')
    .setTitle('§4 - Zusatz: Verlosungen/Giveaways')
    .addField('§4.1', 'Es gibt keinen Anspruch auf eine Barauszahlung eines Gewinns.')
    .addField('§4.2', 'Der Gewinner muss sich innerhalb von 24 Stunden nach Ende der Verlosung beim Ausrichter der Verlosung melden um seinen Gewinn einzufordern, ansonsten wird ein neuer Gewinner ausgelost.')
    .addField('§4.3', 'Anspruch auf einen Gewinn hat nur, wer zum Zeitpunkt der Auslosung Mitglied auf dem Server ist und **nicht** gebannt ist.')
    .addField('§4.4', 'Die Gewinnchancen mit unfairen Mitteln zu heben, ist verboten und wird entsprechend geahnded.')
    .addField('§4.5', 'Aus Fairness-Gründen und weil wir wollen, dass jeder in den Genuss eines Gewinns kommen kann, behalten wir uns vor eine Auslosung zu wiederholen, sollte eine Person gelost worden sein, die bereits eine der letzten 3 Verlosungen gewonnen hat.'),
    new DiscordMessageEmbed()
    .setColor('#be0027')
    .setTitle('§5 - Konsequenzen bei Regelbrüchen')
    .addField('§5.1', 'Unwissenheit schützt vor Strafe nicht!')
    .addField('§5.2', 'Wir behalten uns vor bei größeren und in kürzester Zeit häufigen Vergehen, jeden sofort vom Discord zu verweisen.')
    .addField('§5.3', 'Wir sind nicht gewillt, Mitglieder zu dulden, die sich bewusst in den Grauzonen unseres Regelwerks bewegen.')
    .addField('§5.4', 'Jeder Regelbruch wird in der Regel mit einer Verwarnung geahndet.')
    .addField('§5.5', 'Sammelt man mehrere Verwarnungen, kann eine weitere Konsequenz der Ausschluss vom Server sein.')
    .addField('§5.6', 'Wird eine Aktion der Moderatoren als nicht in Ordnung erachtet, wird das der Administration via Privatnachricht mitgeteilt und nicht öffentlich diskutiert oder angeheizt.')
    .setFooter('Shard by @lxvongobsthndl')
    .setTimestamp()
    ]
}