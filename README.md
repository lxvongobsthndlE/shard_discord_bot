# shard_discord_bot

<img src="https://raw.githubusercontent.com/lxvongobsthndlE/shard_discord_bot/master/Crystal_Shard.png" alt="Shard Dicord Bot Logo" width="200"/>

A Discord bot written in Node.js using [discord.js](https://github.com/discordjs/discord.js).

**This bot is still under active development!**

> If you are still interested in adding it to your server use to following link: [Shard Invite](https://discord.com/oauth2/authorize?client_id=759925230017052674&scope=bot&permissions=1577057495 "Invite Shard Bot to your Discord Server")
>> (Since there currently is no way of adding admins to the bot, you'll have to contact me @lxvongobsthndl#0420 on Discord to do it manually for you.)

## TODO's

### Must have

- [ ] Replace all sync operations with async methods! (fs.write/read, fetch, ...?)
- [ ] config option to add and remove bot admins
- [ ] Fix Twitch integration
- [ ] Finish YouTube integration

### Nice to have

- [ ] survey function
- [ ] Add localizations

### DONE

- [x] Add FunLovingGames Minecraft server user verification.
- [x] Add !invite command to get a bot invite link (Thanks @Dezaku for bringing this up)
- [x] rankings system on a per month basis (give special rank) -> moved to shard_activity bot
- [x] Fix memberlog
- [x] bot owner option to change bot status/activity
- [x] Add command manager
- [x] Add dynamic help message generation

## Features

### Common Commands

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!help` | commands, befehle, hilfe | - | List all available commands and their descriptions. |
| `!dog` | hund, wau | - | Get a random picture of a dog! |
| `!hack` | fuckoff | - | Try to hack the bot! It might defend itself though... |
| `!huge-letters` | big-letters, emol | `!huge-letters <text>` | Converts given text into *emoji* letters. |
| `!invite` | - | - | Get a link to invite this bot to your server. |
| `!meme` | witzbild | `!meme [subreddit]` | Get a random meme from Reddit. Optionaly a subreddit from which the meme should be, can be provided. Only usable if the server has a meme channel! |
| `!react` | - | - | Reacts with a random emoji to your command. |
| `!roll` | würfeln | `!roll <sides> [dices]` | Rolls one (or multiple) dice(s) with a provided amount of sides and shows the result. If multiple dices are rolled, a total of all rolls is appended. |
| `!server-info` | sinfo | - | Shows some information about the current server. |
| `!twitch-status` | ts, tstatus | `!twitch-status <channel name>` | Checks if a given Twitch channel is currently streaming. |
| ` ` |  |  |  |

### Minecraft Commands

(These are only active on the Discord server of FunLovingGames, since they are associated with the community Minecraft server.)

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!minecraft` | mc | `!minecraft <option> [parameters]` | Minecraft commands. Use option "help" to learn more. |
| `!minecraft help` | hilfe | - | Shows available commands in minecraft section. |
| `!minecraft status` | - | - | Get the online status and IP of the minecraft server. |

### Admin Commands

#### config

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!config` | - | `!config <option> [parameters]` | Configure the bot. Use option "help" to learn more. |
| `!config help` | hilfe | - | Shows available commands in config section. |
| `!config explict-content` | explict, ec | `!config explict-content <yes|true|ja|no|false|nein>` | Change the explict-content setting for this server. |
| `!config language` | i18n | `!config language <ISO 639-1 language code>` | Change the (prefered) language Shard Bot answers in for this server. |
| `!config memberlog-channel` | memberlog-ch, mlch | `!config memberlog-channel <channel id>` | Change or set the member log channel for this server. |
| `!config meme-channel` | meme-ch, mch | `!config meme-channel <channel id>` | Change or set the meme channel for this server. |
| `!config prefix` | - | `!config prefix <new prefix>` | Change the prefix Shard Bot listens to for this server. |
| `!config reactionrole` | rr | `!config reactionrole <role id> [reaction emoji]` | Create a reaction-collector, that gives a specified role to the users reacting. |
| `!config welcome-channel` | welcome-ch, wch | `!config welcome-channel <channel id>` | Change or set the welcome channel for this server. |
| ` ` |  |  |  |

#### giveaways

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!giveaway` | ga | `!giveaway <option> [parameters]` | Manage a giveaway. Use option "help" to learn more. |
| `!giveaway help` | - | - | Shows available commands in giveaway section. |
| `!giveaway start` | - | `!ga start <duration> <winnerCount> <prize>` | Start a new giveaway with *duration*, *winnerCount* winners and stated *prize* |
| `!giveaway edit` | - | `!ga edit <msgID> <addTime> <winnerCount> <prize>` | Edit a running giveaway with message id *msgID*, time to add or substract *addTime*, new *winnerCount* and new *prize* description |
| `!giveaway delete` | - | `!ga delete <msgID>` | Deletes giveaway with message id *msgID* |
| `!giveaway list-all` | - | - | Lists all currently running giveaways on this server. |

#### other

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!purgemode` | purge, channelmute | - | Enable/disable purge mode in a channel, which deletes all new messages in this channel until purgemode is deactivated. |
| ` ` |  |  |  |


### Bot Admin Commands

| Command | Aliases | Usage | Description |
| ------- | ------- | ----- | ----------- |
| `!reload` | - | `!reload <command name>` | Reloads the command with provided name |
| `!shard-activity` | - | `!shard-activity <type> <activity>` | Change the bots activity. Available types: PLAYING, STREAMING, LISTENING, WATCHING, COMPETING. |
| `!shard-status` | - | `!shard-status <status>` | Change the bots status. Available status: online, idle, dnd, invisible. |
| `!shard-test` | stest | `!shard-test <option>` | Test command for various functions. |
| ` ` |  |  |  |