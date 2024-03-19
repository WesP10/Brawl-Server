//Purpose: This file is the server for the BrawlStatsSite.
//It will connect to the database and retrieve the stats for the user.
//It will also display the stats on the website.
const Pool = require('pg').Pool;
const cors = require('cors');
const express = require('express');
const BrawlStars = require("brawlstars.js");
const app = express();

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY1ZjU3OGQ0LTNmOGEtNDQxMS05YTYxLTZlZmY2ZTg1ODQyYyIsImlhdCI6MTcxMDc5OTM0MCwic3ViIjoiZGV2ZWxvcGVyL2JhMWU1OTY2LTBkMmEtZGExMy1iM2JiLWI3NjY5Nzk4Mzg4YyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiNDQuMjI2LjE0NS4yMTMiLCI1NC4xODcuMjAwLjI1NSIsIjM0LjIxMy4yMTQuNTUiLCIzNS4xNjQuOTUuMTU2IiwiNDQuMjMwLjk1LjE4MyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.YMrq7oW1Xx2DMUS1Iy4K4iJVcekojr710FN7BE-Rw1xo6qLRp19aF4Y7ezMJRpIf-w94eDrKyZ53wJOsyuQYzg';
let playerId = '#2JOL2OQQR';
const client = new BrawlStars.Client(token);

class BrawlAccount {
    constructor(name, tag, icon, trophies, highestTrophies, expLevel, totalVictories, victories, soloVictories, duoVictories, bestRoboRumbleTime, bestTimeAsBigBrawler, club, color){
        this.name = name;
        this.tag = tag;
        this.icon = icon;
        this.trophies = trophies;
        this.highestTrophies = highestTrophies;
        this.expLevel = expLevel;
        this.totalVictories = totalVictories;
        this.victories = victories;
        this.soloVictories = soloVictories;
        this.duoVictories = duoVictories;
        this.bestRoboRumbleTime = bestRoboRumbleTime;
        this.bestTimeAsBigBrawler = bestTimeAsBigBrawler;
        this.club = club;
        this.color = color;
    }
}

const pool = new Pool({
    host: "dpg-cnsbnm5jm4es73b01mq0-a",
    user: "clarksinstance_user",
    password: "UuGad04IBrWrGOHnIVtmPlNbeqyA7urd",
    database: "clarksinstance",
    port: '5432'
    // password: "Codingiscool"
    //insecureAuth: true
    //tableName: "stats" - ID, name, kd, rank, level, gamesPlayed
});
var sqlQuery = "DROP TABLE IF EXISTS BrawlAccounts; CREATE TABLE BrawlAccounts (id SERIAL PRIMARY KEY, name VARCHAR(255), tag VARCHAR(10), icon VARCHAR(255), trophies INT, highestTrophies INT, expLevel INT, totalVictories INT, victories INT, soloVictories INT, duoVictories INT, bestRoboRumbleTime INT, bestTimeAsBigBrawler INT, club VARCHAR(255), color VARCHAR(50));";
pool.query(sqlQuery, (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Successfully executed query');
    }
    pool.end();
});
async function getPlayerStats(){
    let player = await client.getPlayer(playerId);
    return player;
}
app.use(cors());

app.get('/stats/:playerId', async(req, res)=>{
    playerId = '#'+req.params.playerId;
    console.log(req.params.playerId);
    await getPlayerStats().then(stats => {
        let brawlAccount = new BrawlAccount(stats.name, stats.tag, stats.icon, stats.trophies, stats.highestTrophies, stats.expLevel, stats.totalVictories, stats.trioVictories, stats.soloVictories, stats.duoVictories, stats.bestRoboRumbleTime, stats.bestTimeAsBigBrawler, stats.club, stats.nameColor);
        res.send(JSON.stringify(brawlAccount));
    });
});
app.get('/stats/all', function(req, res){
    var sqlQuery = "SELECT * FROM stats";
    pool.query(sqlQuery, function(err, result){
        if(err) throw err;
        console.log(result);
        res.send(JSON.stringify(result));
    });
});
app.get('/add/:playerId', async(req, res)=>{
    playerId = '#'+req.params.playerId;
    await getPlayerStats().then(stats => {
        let brawlAccount = new BrawlAccount(stats.name, stats.tag, stats.icon, stats.trophies, stats.highestTrophies, stats.expLevel, stats.totalVictories, stats.trioVictories, stats.soloVictories, stats.duoVictories, stats.bestRoboRumbleTime, stats.bestTimeAsBigBrawler, stats.club, stats.nameColor);
        var sqlQuery = "INSERT INTO BrawlAccounts (name, tag, icon, trophies, highestTrophies, expLevel, totalVictories, victories, soloVictories, duoVictories, bestRoboRumbleTime, bestTimeAsBigBrawler, club, color) VALUES ('"+brawlAccount.name+"', '"+brawlAccount.tag+"', '"+brawlAccount.icon+"', "+brawlAccount.trophies+", "+brawlAccount.highestTrophies+", "+brawlAccount.expLevel+", "+brawlAccount.totalVictories+", "+brawlAccount.victories+", "+brawlAccount.soloVictories+", "+brawlAccount.duoVictories+", "+brawlAccount.bestRoboRumbleTime+", "+brawlAccount.bestTimeAsBigBrawler+", '"+brawlAccount.club.name+"', '"+brawlAccount.color+"')";
        pool.query(sqlQuery, function(err, result){
            if(err) throw err;
            console.log(result);
            res.send(JSON.stringify(brawlAccount));
        });
    });
});
//Port set to 10000
app.listen(10000, function(){
    console.log('Server is running on port ');
});
