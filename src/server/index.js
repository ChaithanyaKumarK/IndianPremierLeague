import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import ipl from './iplfunc.js'

const deliveriesJsonPath = "../data/deliveries.json";
const matchesJsonPath = "../data/matches.json";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const deliveriesJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, deliveriesJsonPath)));
const matchesJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, matchesJsonPath)));

let matchesPerYear = ipl.getNoOfMatchesPerYear();
let matchesWonPerTeam = ipl.getTeamWinsPerYear();
let extraRunPerTeam2016 = ipl.getExtraRunPerTeam2016();
let economicalBowlers2015 = ipl.getEconomicalBowlers2015();

function writeToFile(outputFilePath, outputJson) {
    const outputPath = "../public/output";
    fs.writeFileSync(path.resolve(__dirname, outputPath, `${outputFilePath}.json`), JSON.stringify(outputJson), "utf-8", (err) => {
        if (err) { console.log(err); }
    });
}

writeToFile("matchesPerYear", matchesPerYear);
writeToFile("matchesWonPerTeam", matchesWonPerTeam);
writeToFile("extraRunPerTeam2016", extraRunPerTeam2016);
writeToFile("economicalBowlers2015", economicalBowlers2015);
