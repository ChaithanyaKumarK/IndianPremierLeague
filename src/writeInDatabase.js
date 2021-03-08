import path from 'path'
import mysql from 'mysql'
import fs from 'fs'
import { fileURLToPath } from 'url'

let citiesData;
let venuesData;
let seasonsData;
let teamsData;
let playersData;
let dismissalKindsData;
let empiresData;

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputDeliveries = "./data/deliveries.json";
const inputMatches = "./data/matches.json";
let matches = JSON.parse(fs.readFileSync(path.join(__dirname, inputMatches), 'utf-8'));
let deliveries = JSON.parse(fs.readFileSync(path.join(__dirname, inputDeliveries), 'utf-8'));


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chaithanya@123',
    database: 'IPL_Schema'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting');
        return;
    }
    console.log('created connection');
});


const queryCreateVenueTable = 'CREATE TABLE IF NOT EXISTS venues(venue_id int primary key auto_increment, venue_name varchar(255));';
const queryCreateCityTable = 'CREATE TABLE IF NOT EXISTS cities(city_id int primary key auto_increment,city_name varchar(255));';
const queryCreateSeasonTable = 'CREATE TABLE IF NOT EXISTS seasons(season_id int primary key auto_increment, season varchar(255));';
const queryCreateTeamTable = 'CREATE TABLE IF NOT EXISTS teams(team_id int primary key auto_increment, team_name varchar(255));';
const queryCreatePlayerTable = 'CREATE TABLE IF NOT EXISTS players(player_id int primary key auto_increment, player_name varchar(255));';
const queryCreateDismissalKindTable = 'CREATE TABLE IF NOT EXISTS dismissalKinds(dismissalKind_id int primary key auto_increment, dismissalKind varchar(255));';
const queryCreateEmpireTable = 'CREATE TABLE IF NOT EXISTS empires(empire_id int primary key auto_increment, empire_name varchar(255));';
const queryCreateMatchesTable = `CREATE TABLE IF NOT EXISTS matches (
    match_id INT PRIMARY KEY,
    season_id INT,
    city_id INT,
    match_date DATE,
    team1_id INT,
    team2_id INT,
    toss_winner_id INT,
    toss_decision VARCHAR(100),
    result VARCHAR(100),
    dl_applied INT,
    winner_id INT,
    win_by_runs INT,
    win_by_wickets INT,
    player_of_match_id INT,
    venue_id INT,
    empire1_id INT,
    empire2_id INT,
    empire3_id INT,
    FOREIGN KEY (season_id)
        REFERENCES seasons (season_id),
    FOREIGN KEY (city_id)
        REFERENCES cities (city_id),
    FOREIGN KEY (team1_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (team2_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (toss_winner_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (winner_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (player_of_match_id)
        REFERENCES players (player_id),
    FOREIGN KEY (venue_id)
        REFERENCES venues (venue_id),
    FOREIGN KEY (empire1_id)
        REFERENCES empires (empire_id),
    FOREIGN KEY (empire2_id)
        REFERENCES empires (empire_id),
    FOREIGN KEY (empire3_id)
        REFERENCES empires (empire_id)
)`;

const queryCreateDeliveriesTable = `CREATE TABLE IF NOT EXISTS deliveries (
    deliveries_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT,
    inning INT,
    batting_team_id INT,
    bowling_team_id INT,
    over INT,
    ball INT,
    batsman_id INT,
    non_striker_id INT,
    bowler_id INT,
    is_super_over INT,
    wide_runs INT,
    bye_runs INT,
    legbye_runs INT,
    noball_runs INT,
    penalty_runs INT,
    batsman_runs INT,
    extra_runs INT,
    total_runs INT,
    player_dismissed_id INT,
    dismissal_kind_id INT,
    fielder_id INT,
    FOREIGN KEY (match_id)
        REFERENCES matches (match_id),
    FOREIGN KEY (batting_team_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (bowling_team_id)
        REFERENCES teams (team_id),
    FOREIGN KEY (batsman_id)
        REFERENCES players (player_id),
    FOREIGN KEY (non_striker_id)
        REFERENCES players (player_id),
    FOREIGN KEY (bowler_id)
        REFERENCES players (player_id),
    FOREIGN KEY (player_dismissed_id)
        REFERENCES players (player_id),
    FOREIGN KEY (dismissal_kind_id)
        REFERENCES dismissalKinds(dismissalKind_id),
    FOREIGN KEY (fielder_id)
        REFERENCES players (player_id)
)`;


const independentTablesDataFormate = [{ 'venues(venue_name)': [] }, { 'cities(city_name)': [] }, { 'seasons(season)': [] }, { 'teams(team_name)': [] }, { 'players(player_name)': [] }, { 'dismissalKinds(dismissalKind)': [] }, { 'empires(empire_name)': [] }];


function createTables() {
    runQuery(queryCreateVenueTable);
    runQuery(queryCreateSeasonTable);
    runQuery(queryCreateCityTable);
    runQuery(queryCreateTeamTable);
    runQuery(queryCreatePlayerTable);
    runQuery(queryCreateDismissalKindTable);
    runQuery(queryCreateEmpireTable);
    runQuery(queryCreateMatchesTable);
    runQuery(queryCreateDeliveriesTable);
}

async function runQuery(query) {
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        else {
            console.log(results);
        }
    });
}

//inserting independent tables
function getDataForIndependentTables(matches, deliveries) {
    const dataFromMatches = matches.reduce((data, eachData) => {
        function compareData(index, data) {
            if (!index.includes(data)) {
                index.push(data);
            }
        }
        compareData(data[0]['venues(venue_name)'], eachData.venue);
        compareData(data[1]['cities(city_name)'], eachData.city);
        compareData(data[2]['seasons(season)'], +eachData.season);
        compareData(data[3]['teams(team_name)'], eachData.team1);
        compareData(data[3]['teams(team_name)'], eachData.team2);
        compareData(data[4]['players(player_name)'], eachData.player_of_match);
        compareData(data[6]['empires(empire_name)'], eachData.umpire1);
        compareData(data[6]['empires(empire_name)'], eachData.umpire2);
        compareData(data[6]['empires(empire_name)'], eachData.umpire3);

        return data;
    }
        , independentTablesDataFormate);

    const allIndependentTableData = deliveries.reduce((data, eachData) => {
        function compareData(index, data) {
            if (!index.includes(data)) {
                index.push(data);
            }
        }
        compareData(data[5]['dismissalKinds(dismissalKind)'], eachData.dismissal_kind);
        compareData(data[4]['players(player_name)'], eachData.batsman);
        compareData(data[4]['players(player_name)'], eachData.non_striker);
        compareData(data[4]['players(player_name)'], eachData.bowler);
        compareData(data[4]['players(player_name)'], eachData.fielder);
        return data;
    }
        , dataFromMatches);

    return allIndependentTableData;
}

function insertIndependentTable(tableData) {
    tableData.forEach(eachValue => {
        let formattedData = Object.values(eachValue)[0].map(eachValue => [eachValue]);
        console.log(formattedData);

        connection.query(`INSERT INTO ${Object.keys(eachValue)[0]} VALUES ?`, [formattedData], (error, results, fields) => {
            if (error) throw error;
            else {
                console.log(results);
            }
        })
    })
}


//inserting dependent tables
async function dataFormateAndFillDependentTable() {
    citiesData = await promiseRunQuery('Select * from cities').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.city_name] = currentValue.city_id;
        return objectOfValues;
    }, {}));
    venuesData = await promiseRunQuery('Select * from venues').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.venue_name] = currentValue.venue_id;
        return objectOfValues;
    }, {}));
    seasonsData = await promiseRunQuery('Select * from seasons').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.season] = currentValue.season_id;
        return objectOfValues;
    }, {}));
    teamsData = await promiseRunQuery('Select * from teams').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.team_name] = currentValue.team_id;
        return objectOfValues;
    }, {}));
    playersData = await promiseRunQuery('Select * from players').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.player_name] = currentValue.player_id;
        return objectOfValues;
    }, {}));

    dismissalKindsData = await promiseRunQuery('Select * from dismissalKinds').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.dismissalKind] = currentValue.dismissalKind_id;
        return objectOfValues;
    }, {}));

    empiresData = await promiseRunQuery('Select * from empires').then(data => data.reduce((objectOfValues, currentValue) => {
        objectOfValues[currentValue.empire_name] = currentValue.empire_id;
        return objectOfValues;
    }, {}));
    // await citiesData;/////make it asycronus
    matchesDataFormatter(matches);
    deliveriesDataFormatter(deliveries);
}
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
function matchesDataFormatter(matches) {
    const dataFromMatches = matches.reduce((data, eachData) => {
        let oneRow = Object.keys(eachData).reduce((data, key) => {
            if (key === "season") {
                data.push(seasonsData[eachData[key]]);
            } else if (key === "city") {
                data.push(citiesData[eachData[key]]);
            } else if (key === "team1" || key === "team2" || key === "toss_winner" || key === "winner") {
                data.push(teamsData[eachData[key]]);
            } else if (key === "player_of_match") {
                data.push(playersData[eachData[key]]);
            } else if (key === "venue") {
                data.push(venuesData[eachData[key]]);
            } else if (key === "umpire1" || key === "umpire2" || key === "umpire3") {
                data.push(empiresData[eachData[key]]);
            } else if (key === "dl_applied" || key === "win_by_runs" || key === "win_by_wickets" || key === "id") {
                data.push(+ eachData[key]);
            } else {
                data.push(eachData[key]);
            }

            return data;
        }, []);

        data.push(oneRow);

        return data;
    }
        , []);
    fillMatchesTable(dataFromMatches);
}
function deliveriesDataFormatter(deliveries) {
    const dataFromDeliveries = deliveries.reduce((data, eachData) => {
        let oneRow = Object.keys(eachData).reduce((data, key) => {
            if (key === "match_id" || key === "inning" || key === "over" || key === "ball" || key === "is_super_over" || key === "wide_runs" || key === "bye_runs" || key === "legbye_runs" || key === "noball_runs" || key === "penalty_runs" || key === "batsman_runs" || key === "extra_runs" || key === "total_runs") {
                data.push(+ eachData[key]);
            } else if (key === "batting_team" || key === "bowling_team") {
                data.push(teamsData[eachData[key]]);
            } else if (key === "player_dismissed" || key === "batsman" || key === "non_striker" || key === "bowler" || key === "fielder") {
                data.push(playersData[eachData[key]]);
            } else if (key === "dismissal_kind") {
                data.push(dismissalKindsData[eachData[key]]);
            } else {
                data.push(eachData[key]);
            }

            return data;
        }, []);

        data.push(oneRow);

        return data;
    }
        , []);
    fillDeliveriesTable(dataFromDeliveries);
};

function fillDeliveriesTable(data) {
    const query = `INSERT INTO deliveries(
        match_id,
        inning,
        batting_team_id,
        bowling_team_id,
        over,
        ball,
        batsman_id,
        non_striker_id,
        bowler_id,
        is_super_over,
        wide_runs,
        bye_runs,
        legbye_runs,
        noball_runs,
        penalty_runs,
        batsman_runs,
        extra_runs,
        total_runs,
        player_dismissed_id,
        dismissal_kind_id,
        fielder_id) values ?`;
    connection.query(query, [data], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log(results);
        }
    });
};
function fillMatchesTable(data) {
    const query = `INSERT INTO matches(
        match_id,
        season_id,
        city_id,
        match_date,
        team1_id,
        team2_id,
        toss_winner_id,
        toss_decision,
        result,
        dl_applied,
        winner_id,
        win_by_runs,
        win_by_wickets,
        player_of_match_id,
        venue_id,
        empire1_id,
        empire2_id,
        empire3_id) values ?`;
    connection.query(query, [data], function (error, results, fields) {
        if (error) throw error;
        else {
            console.log(results);
        }
    });
};










createTables();
insertIndependentTable(getDataForIndependentTables(matches, deliveries));
dataFormateAndFillDependentTable();