//Purpose: This file is the server for the BrawlStatsSite.
//It will connect to the database and retrieve the stats for the user.
//It will also display the stats on the website.
var mysql = require('mysql2');
const express = require('express');
const BrawlStars = require("brawlstars.js");
const app = express();
const port = 3306;

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

var con = mysql.createConnection({
    host: "dpg-cnsbnm5jm4es73b01mq0-a",
    user: "clarksinstance_user",
    password: "UuGad04IBrWrGOHnIVtmPlNbeqyA7urd",
    database: "clarksinstance"
    // password: "Codingiscool"
    //insecureAuth: true
    //tableName: "stats" - ID, name, kd, rank, level, gamesPlayed
});
con.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});
async function getPlayerStats(){
    let player = await client.getPlayer(playerId);
    return player;
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/stats/:playerId', async(req, res)=>{
    playerId = '#'+req.params.playerId;
    console.log(req.params.playerId);
    await getPlayerStats().then(stats => {
        let brawlAccount = new BrawlAccount(stats.name, stats.tag, stats.icon, stats.trophies, stats.highestTrophies, stats.expLevel, stats.totalVictories, stats.trioVictories, stats.soloVictories, stats.duoVictories, stats.bestRoboRumbleTime, stats.bestTimeAsBigBrawler, stats.club, stats.nameColor);
        res.send(JSON.stringify(brawlAccount));
    });
});
app.get('/stats/all', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    var sqlQuery = "SELECT * FROM stats";
    con.query(sqlQuery, function(err, result){
        if(err) throw err;
        console.log(result);
        res.send(JSON.stringify(result));
    });
});

app.listen(port, function(){
    console.log('Server is running on port '+port);
});
