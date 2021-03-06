import path from 'path'
import mysql from 'mysql'
import fs from 'fs'
import { fileURLToPath } from 'url'


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
    match_id INT PRIMARY KEY AUTO_INCREMENT,
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


createTables();