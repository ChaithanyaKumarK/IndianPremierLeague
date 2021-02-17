const fs = require("fs");
const iplFunctions = require("./iplfunc")

const deliveriesJson = require("../data/deliveries.json");
const matchesJson = require("../data/matches.json");
const { log } = require("console");


let matchesPerYear = iplFunctions.noOfMatchesPerYear(matchesJson);
let matchesWonPerTeam = iplFunctions.teamWinsPerYear(matchesJson);
let extraRunPerTeam2016 = iplFunctions.extraRunPerTeam2016(matchesJson, deliveriesJson);
let economicalBowlers2015=iplFunctions.economicalBowlers2015(matchesJson, deliveriesJson);


function writeToFile(outputFilePath, outputJson) {
    fs.writeFileSync(outputFilePath, JSON.stringify(outputJson), "utf-8", (err) => {
        if (err) { console.log(err); }
    });
}



writeToFile("./src/public/output/matchesPerYear.json", matchesPerYear);
writeToFile("./src/public/output/matchesWonPerTeam.json", matchesWonPerTeam);
writeToFile("./src/public/output/extraRunPerTeam2016.json", extraRunPerTeam2016);
writeToFile("./src/public/output/economicalBowlers2015.json", economicalBowlers2015);
