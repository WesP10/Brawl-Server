//Purpose: This file is the server for the BrawlStatsSite.
//It will connect to the database and retrieve the stats for the user.
//It will also display the stats on the website.
const Pool = require('pg');
const express = require('express');
const BrawlStars = require("brawlstars.js");
//Cors is not fun
const cors = require('cors');
require('dotenv').config();
const app = express();

const token = process.env.BRAWLSTARS_TOKEN;
let playerId = '#2JOL2OQQR';
/*Must Provide Own API Key
  Establishing connection with unique authentication token
  Client is then created with connection
*/
var connectionString = process.env.CONNECTIONSTRING;
var pgClient = new Pool.Client(connectionString);
pgClient.connect();
const client = new BrawlStars.Client(token);
app.use(cors());
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
//Retrieves player statistics with id given from global variable
async function getPlayerStats(){
    let player = await client.getPlayer(playerId);
    return player;
}
//Returns player's stats in JSON format
app.get('/stats/:playerId', async(req, res)=>{
    playerId = '#'+req.params.playerId;
    console.log(req.params.playerId);
    await getPlayerStats().then(stats => {
        let brawlAccount = new BrawlAccount(stats.name, stats.tag, stats.icon, stats.trophies, stats.highestTrophies, stats.expLevel, stats.totalVictories, stats.trioVictories, stats.soloVictories, stats.duoVictories, stats.bestRoboRumbleTime, stats.bestTimeAsBigBrawler, stats.club, stats.nameColor);
        res.send(JSON.stringify(brawlAccount));
    });
});
//Returns all players stats in the database without duplicates
app.get('/all', function(req, res){
    var sqlQuery = "SELECT DISTINCT * FROM BrawlAccounts;";
    pgClient.query(sqlQuery, function(err, result){
        if(err) throw err;
        res.send(result.rows);
    });
});
//Adds a players stats and ID to the database
app.get('/stats/add/:playerId', async(req, res) => {
    playerId = '#'+req.params.playerId;
    console.log(req.params.playerId);
    await getPlayerStats().then(stats => {
        let brawlAccount = new BrawlAccount(stats.name, stats.tag, stats.icon, stats.trophies, stats.highestTrophies, stats.expLevel, stats.totalVictories, stats.trioVictories, stats.soloVictories, stats.duoVictories, stats.bestRoboRumbleTime, stats.bestTimeAsBigBrawler, stats.club, stats.nameColor);
        addToDB(brawlAccount);
        res.send(JSON.stringify(brawlAccount));
     });
});
//Adds Brawl Stars Account Object to database
async function addToDB(brawlAccount) {
    await pgClient.query('BEGIN');
    try {
        const checkQuery = "SELECT * FROM BrawlAccounts WHERE name = $1;";
        const checkResult = await pgClient.query(checkQuery, [brawlAccount.name]);
        if (checkResult.rows.length === 0) {
            const insertQuery = `
                INSERT INTO BrawlAccounts (name, tag, icon, trophies, highestTrophies, expLevel, totalVictories, victories, soloVictories, duoVictories, bestRoboRumbleTime, bestTimeAsBigBrawler, club, color) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `;
            const values = [
                brawlAccount.name, 
                brawlAccount.tag, 
                brawlAccount.icon, 
                brawlAccount.trophies, 
                brawlAccount.highestTrophies, 
                brawlAccount.expLevel, 
                brawlAccount.totalVictories, 
                brawlAccount.victories, 
                brawlAccount.soloVictories, 
                brawlAccount.duoVictories, 
                brawlAccount.bestRoboRumbleTime, 
                brawlAccount.bestTimeAsBigBrawler, 
                brawlAccount.club.name, 
                brawlAccount.color
            ];
            await pgClient.query(insertQuery, values);
        }
        await pgClient.query('COMMIT');
    } catch (e) {
        await pgClient.query('ROLLBACK');
        throw e;
    }
}
//Port set to 10000
app.listen(10000, function(){
    console.log('Server is running on port ');
});
