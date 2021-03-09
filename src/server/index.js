import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import ipl from './iplfunc.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


async function runFunctions() {
    let matchesPerYear = await ipl.getNoOfMatchesPerYear();
    let matchesWonPerTeam = await ipl.getTeamWinsPerYear();
    let extraRunPerTeam2016 = await ipl.getExtraRunPerTeam2016();
    let economicalBowlers2015 = await ipl.getEconomicalBowlers2015();
    writeToFile("matchesPerYear", matchesPerYear);
    writeToFile("matchesWonPerTeam", matchesWonPerTeam);
    writeToFile("extraRunPerTeam2016", extraRunPerTeam2016);
    writeToFile("economicalBowlers2015", economicalBowlers2015);
}

runFunctions();

function writeToFile(outputFilePath, outputJson) {
    const outputPath = "../public/output";
    fs.writeFileSync(path.resolve(__dirname, outputPath, `${outputFilePath}.json`), JSON.stringify(outputJson), "utf-8", (err) => {
        if (err) { console.log(err); }
    });
}


