import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import CSVtoJSON from 'csvtojson'



const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputDeliveries = "./data/deliveries.csv";
const inputMatches = "./data/matches.csv";
const modifyOutputFilePath = (path) => path.replace('.csv', '.json');

function csvToJsonWriter(inputCsvPath) {
    CSVtoJSON()
        .fromFile(path.resolve(__dirname, inputCsvPath))
        .then((json) => {
            fs.writeFileSync(path.resolve(__dirname, modifyOutputFilePath(inputCsvPath)), JSON.stringify(json), "utf-8", (err) => {
                if (err) { console.log(err); }
            })
        })
}


csvToJsonWriter(inputDeliveries);
csvToJsonWriter(inputMatches);