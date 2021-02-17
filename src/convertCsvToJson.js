const CSVtoJSON = require("csvtojson");
const fs = require("fs");



const inputDeliveries = "./src/data/deliveries.csv";
const outputDeliveries = "./src/data/deliveries.json";
const inputMatches = "./src/data/matches.csv";
const outputMatches = "./src/data/matches.json";

function csvToJsonWriter(inputCsvPath, outputJsonPath) {
    CSVtoJSON()
        .fromFile(inputCsvPath)
        .then((json) => {
            fs.writeFileSync(outputJsonPath, JSON.stringify(json), "utf-8", (err) => {
                if (err) { console.log(err); }
            })
        })
}

csvToJsonWriter(inputDeliveries, outputDeliveries);
csvToJsonWriter(inputMatches, outputMatches);