const sortMap = require('sort-map')


//Number of matches played per year for all the years in IPL.
function matchesPerYearCalculator(matchFile) {
    let arr = [];
    let map = new Map();
    let valueCountMap = new Map();
    for (i = 0; i < matchFile.length; i++) {
        if (!map.has(matchFile[i].season)) {
            map.set(matchFile[i].season, true);
            valueCountMap[matchFile[i].season] = 1;
            arr.push(matchFile[i].season);
        } else {
            let temp = valueCountMap[matchFile[i].season];
            valueCountMap[matchFile[i].season] = temp + 1;
        }
    }
    return valueCountMap;
}


function noOfMatchesPerYear(matchFile) {
    const result = matchesPerYearCalculator(matchFile);
    // let result = {};
    // for (const [key, value] of Object.entries(uniqYear)) {
    //     result[key] = value;
    // }
    return result;
}







//Number of matches won per team per year in IPL

function matchesWonPerTeamPerYearCalculator(matchFile) {
    let arr = [];
    let map = new Map();
    let valueCountMap = new Map();
    for (i = 0; i < matchFile.length; i++) {
        if (!map.has(matchFile[i].season)) {
            map.set(matchFile[i].season, true);

            valueCountMap[matchFile[i].season] = {};
            valueCountMap[matchFile[i].season][matchFile[i].winner] = 1;
            arr.push(matchFile[i].season);
        } else {
            if (valueCountMap[matchFile[i].season].hasOwnProperty([matchFile[i].winner])) {
                let temp = valueCountMap[matchFile[i].season][matchFile[i].winner];
                valueCountMap[matchFile[i].season][matchFile[i].winner] = temp + 1;

            } else {
                valueCountMap[matchFile[i].season][matchFile[i].winner] = 1;
            }

        }
    }
    return valueCountMap;
}


function teamWinsPerYear(matchFile) {
    const result = matchesWonPerTeamPerYearCalculator(matchFile);
    return result;

}






///Extra runs conceded per team in the year 2016
function idsOfYear(matchFile, year) {
    return matchFile.filter(obj => obj.season == year).map(values => values.id);
}


function idsToMap(ids) {
    let idMap = new Map();
    for (let value of ids) {
        idMap.set(value, true);
    }
    return idMap;


}
function extraScoreCounter(ids, deliFile) {
    let map = new Map();
    let valueCountMap = new Map();


    for (i = 0; i < deliFile.length; i++) {
        if (ids.has(deliFile[i].match_id)) {

            if (!map.has(deliFile[i].bowling_team)) {
                map.set(deliFile[i].bowling_team, true);
                valueCountMap[deliFile[i].bowling_team] = parseInt(deliFile[i].extra_runs);
            } else {
                let temp = valueCountMap[deliFile[i].bowling_team];
                valueCountMap[deliFile[i].bowling_team] = temp + parseInt(deliFile[i].extra_runs);
            }

        }
    }

    return valueCountMap;
}


function extraRunPerTeam2016(matchFile, deliveriesFile) {
    let ids = idsOfYear(matchFile, 2016);
    let mapIds = idsToMap(ids);
    let result = extraScoreCounter(mapIds, deliveriesFile);
    return result;
}







///Top 10 economical bowlers in the year 2015



function bowlerStatCounter(ids, deliFile) {
    let map = new Map();
    let valueCountMap = new Map();
    for (i = 0; i < deliFile.length; i++) {
        if (ids.has(deliFile[i].match_id)) {

            if (!map.has(deliFile[i].bowler)) {
                map.set(deliFile[i].bowler, true);

                valueCountMap[deliFile[i].bowler] = {};
                valueCountMap[deliFile[i].bowler]['total_balls'] = 1;
                valueCountMap[deliFile[i].bowler]['total_runs'] = parseInt(deliFile[i].total_runs);
            } else {

                let temp = valueCountMap[deliFile[i].bowler]['total_balls'];
                valueCountMap[deliFile[i].bowler]['total_balls'] = temp + 1;
                valueCountMap[deliFile[i].bowler]['total_runs'] += parseInt(deliFile[i].total_runs);

            }
        }
    }
    return valueCountMap;

}

function top10Map(map) {
    let topMap = new Map();
    let counter = 10;
    for (const [key,value] of Object.entries(map)) {
        counter--; 
        if (counter < 0) { break; }
        topMap[key]=value;
         
    }
    return topMap;
}
function customMapInverse(map){
    let newMap=new Map();
    for (const [key,value] of Object.entries(map)) {
        newMap[value]=key; 
    }
    return newMap;

}
function customSortByValueMap(map) {
    let arr=[];
    let sortedMap=new Map();
    for (const [key,value] of Object.entries(map)) {
        arr.push(parseFloat(value)); 
    }
    arr.sort((a, b)=>a - b);
  
    let inverseMap=customMapInverse(map)
    arr.forEach(value => {
        sortedMap[inverseMap[value]]=value;
    })
    return sortedMap;
}

function economicalBowlers2015(matchFile, deliveriesFile) {
    let ids = idsOfYear(matchFile, 2015);
    let mapIds = idsToMap(ids);
    let result = bowlerStatCounter(mapIds, deliveriesFile);
    let economy = new Map();
    
    for (const [key, value] of Object.entries(result)) {
       
        economy[key]=(value.total_runs / (value.total_balls / 6));
        
    }
    
    let sortedMap = customSortByValueMap(economy);
    let finalResult = top10Map(sortedMap);
    return finalResult;
    

}







exports.noOfMatchesPerYear = noOfMatchesPerYear;
exports.teamWinsPerYear = teamWinsPerYear;
exports.extraRunPerTeam2016 = extraRunPerTeam2016;
exports.economicalBowlers2015 = economicalBowlers2015;
