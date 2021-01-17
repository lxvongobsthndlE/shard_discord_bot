const express = require('express');
const fs = require('fs');
const port = 25566;

const app = express();

module.exports = class ShardMinecraft {
    verificationRequests;
    verifiedUsers;
    isMinecraftServerOnline;
    mcServerOnlineListener;
    constructor() {
        
        this.verificationRequests = [];
        this.verifiedUsers = [];
        this.isMinecraftServerOnline = false;
        this.mcServerOnlineListener = null;

        fs.readFile('./botData/minecraftVerifications.json', (err, data) => {
            if (err) {
                console.log('[ERR] Failed reading minecraft verified users file!')
            }
            this.verifiedUsers = JSON.parse(data);
        });

        this.initListeners();
        app.listen(port, () => {
            console.log('[HTTP] Started webserver on port ' + port + '.');
        });
        
    }

    isVerified(userid) {
        for (let i = 0; i < this.verifiedUsers.length; i++) {
            let vu = this.verifiedUsers[i];
            if (vu.discordID == userid) {
                return true;
            }
        }
        return false;
    }

    isVerifiedMC(mcName) {
        for (let i = 0; i < this.verifiedUsers.length; i++) {
            let vu = this.verifiedUsers[i];
            if (vu.minecraftName == mcName) {
                return true;
            }
        }
        return false;
    }

    //http://cravatar.eu/helmavatar/<nickname|uuid>.png
    async verify(discordUser, mcUsername) {
        if (this.isVerified(discordUser.id)) return false;
        for (let i = 0; i < this.verificationRequests.length; i++) {
            let vr = this.verificationRequests[i];
            if (vr.minecraftName == mcUsername) {
                vr.verified = true;
                vr.discordName = discordUser.username;
                vr.discordID = discordUser.id;
                this.verifiedUsers.push(vr);
                await fs.writeFile('./botData/minecraftVerifications.json',
                    JSON.stringify(this.verifiedUsers, null, 2),
                    {flag: 'w'},
                    (err) => {
                        if (err) {
                            console.log('[HTTP][ERR] Failed writing minecraft verified users to file!')
                        }
                        console.log('[HTTP] Linked discord user ' + vr.discordName + ' with minecraft user ' + vr.minecraftName);
                        return true;
                });
            }
        }
        return false;
    }

    initListeners() {
        app.get('/', (req, res) => {
            res.send('Whatever you are trying to do, you\'re wrong at this address!');
            console.log('[HTTP][WARN] Request on / received! Potential spammer.');
        });
        app.get('/verify/:user', (req, res) => {
            let user = req.params.user;
            res.send('OK');
            if (this.isVerifiedMC(user)) return;
            console.log('[HTTP] User trying to verify: ' + user);
            let verif = { minecraftName: user, discordID: "", verified: false }

            this.verificationRequests.push(verif);
            setTimeout(() => {
                for (let i = 0; i < this.verificationRequests.length; i++) {
                    if (this.verificationRequests[i].minecraftName == user) {
                            //Timeout -> delete from list
                            this.verificationRequests.splice(i, 1);
                    }
                }
            }, 20000)

        });
        app.get('/onlinePing', (req, res) => {
            res.send('OK');
            this.isMinecraftServerOnline = true;
            clearTimeout(this.mcServerOnlineListener);
            this.mcServerOnlineListener = setTimeout(() => {
                this.isMinecraftServerOnline = false;
            }, 15000);
        });
    }



}