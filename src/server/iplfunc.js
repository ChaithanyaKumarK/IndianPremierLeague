
import mysql from 'mysql'
import dotenv from 'dotenv';
dotenv.config();


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


connection.connect(function (err) {
    if (err) {
        console.error('error connecting');
        return;
    }
});
function promiseRunQuery(query) {
    return new Promise((response, reject) => {

        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            else {
                response(results);
            }
        });
    })

}

//Number of matches played per year for all the years in IPL.

async function getNoOfMatchesPerYear() {

    const noOfMatchesPerYear = await promiseRunQuery('Select count(matches.match_id) as matchCount,seasons.season from matches inner join seasons on matches.season_id=seasons.season_id group by seasons.season ;')
        .then(data => data.reduce((data, eachData) => {
            data[eachData.season] = eachData.matchCount;
            return data;
        }, {}))

    return noOfMatchesPerYear;

}



//Number of matches won per team per year in IPL

async function getTeamWinsPerYear() {

    const teamWinsPerYear = await promiseRunQuery(`Select count(mix.team_name) as noOfWins,mix.team_name as winner,seasons.season from (select * from matches inner join teams on matches.winner_id=teams.team_id)as mix inner join seasons on mix.season_id=seasons.season_id group by seasons.season,mix.team_name ; `)
        .then(data =>
            data.reduce((matches, current) => {
                if (matches.hasOwnProperty(current.season)) {
                    matches[current.season][current.winner] = current.noOfWins;
                } else {
                    matches[current.season] = {};
                    matches[current.season][current.winner] = current.noOfWins;
                }
                return matches;
            }, {}));

    return teamWinsPerYear;

}



///Extra runs conceded per team in the year 2016

async function getExtraRunPerTeam2016() {

    const extraRunPerTeam2016 = await promiseRunQuery(`SELECT SUM(allData.extra_runs) as extra_runs,teams.team_name FROM (SELECT matches.season_id,deliveries.extra_runs,deliveries.bowling_team_id FROM matches right join deliveries on matches.match_id=deliveries.match_id) AS allData left join teams on teams.team_id=allData.bowling_team_id where allData.season_id=(SELECT season_id from seasons where season=2016) group by teams.team_name ;`).then(data =>
        data.reduce((data, eachData) => {
            data[eachData.team_name] = eachData.extra_runs;
            return data;
        }, {}));
    return extraRunPerTeam2016;
}



///Top 10 economical bowlers in the year 2015

async function getEconomicalBowlers2015() {

    const bowlersEconomy = await promiseRunQuery('SELECT (SUM(allData.total_runs)/(COUNT(players.player_name)/6)) as ball_economy,players.player_name FROM (SELECT deliveries.bowler_id,deliveries.total_runs FROM matches right join deliveries on matches.match_id=deliveries.match_id where season_id=(SELECT season_id FROM seasons where season=2015)) AS allData left join players on players.player_id=allData.bowler_id group by players.player_name order by ball_economy asc limit 10;').then(data =>
        data.reduce((data, eachData) => {
            data[eachData.player_name] = eachData.ball_economy;
            return data;
        }, {}));
    connection.end();
    return bowlersEconomy;
}



export default {
    getNoOfMatchesPerYear,
    getTeamWinsPerYear,
    getExtraRunPerTeam2016,
    getEconomicalBowlers2015
}

