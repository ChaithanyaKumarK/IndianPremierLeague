


//Number of matches played per year for all the years in IPL.

function getNoOfMatchesPerYear(matchFile) {
    const noOfMatchesPerYear = matchFile.reduce((matches, current) => {
        if (matches.hasOwnProperty(current.season)) {
            matches[current.season] += 1;
        } else {
            matches[current.season] = 1;
        }
        return matches;
    }, {})

    return noOfMatchesPerYear;
}



//Number of matches won per team per year in IPL

function getTeamWinsPerYear(matchFile) {
    // const result = matchesWonPerTeamPerYearCalculator(matchFile);
    const teamWinsPerYear = matchFile.reduce((matches, current) => {
        if (matches.hasOwnProperty(current.season)) {
            if (matches[current.season].hasOwnProperty(current.winner)) {
                matches[current.season][current.winner] += 1;
            } else {
                matches[current.season][current.winner] = 1;
            }
        } else {
            matches[current.season] = {};
            matches[current.season][current.winner] = 1;
        }
        return matches;
    }, {})
    return teamWinsPerYear;

}






///Extra runs conceded per team in the year 2016
function idsOfYear(matchFile, year) {
    return matchFile.filter(obj => obj.season == year).map(values => values.id);
}

function getExtraRunPerTeam2016(matchFile, deliveriesFile) {
    const ids = idsOfYear(matchFile, 2016);
    const deli2016 = deliveriesFile.filter(each => ids.indexOf(each.match_id) !== -1);
    const extraRunPerTeam2016 = deli2016.reduce((deliveries, current) => {
        if (deliveries.hasOwnProperty(current.bowling_team)) {
            deliveries[current.bowling_team] += +current.extra_runs;
        } else {
            deliveries[current.bowling_team] = +current.extra_runs;
        }
        return deliveries;
    }, {})

    return extraRunPerTeam2016;
}



///Top 10 economical bowlers in the year 2015

function getTop10Map(map) {
    let top10Map = new Map();
    let counter = 10;
    for (const [key, value] of Object.entries(map)) {
        counter--;
        if (counter < 0) { break; }
        top10Map[key] = +value.toPrecision(5);

    }
    return top10Map;
}

function customMapInverse(map) {
    let inverseMap = new Map();
    for (const [key, value] of Object.entries(map)) {
        inverseMap[value] = key;
    }
    return inverseMap;

}


function customSortByValueMap(map) {
    let arr = [];
    let sortedMap = new Map();
    

    for (const [key, value] of Object.entries(map)) {
        arr.push(parseFloat(value));
    }
    arr.sort((a, b) => a - b);

    let inverseMap = customMapInverse(map)
    arr.forEach(arrValue => {
        sortedMap[inverseMap[arrValue]] = arrValue;
    })
    return sortedMap;
}


function getEconomicalBowlers2015(matchFile, deliveriesFile) {
    const economy = new Map();

    const ids = idsOfYear(matchFile, 2015);

    const deli2015 = deliveriesFile.filter(each => ids.indexOf(each.match_id) !== -1);

    //bowlersEconomy collects the total balls and total runs given
    const bowlersEconomy = deli2015.reduce((deliveries, eachDelivery) => {
        if (deliveries.hasOwnProperty(eachDelivery.bowler)) {
            deliveries[eachDelivery.bowler]['total_balls'] += 1;
            deliveries[eachDelivery.bowler]['total_runs'] += +eachDelivery.total_runs;
        } else {
            deliveries[eachDelivery.bowler] = {};
            deliveries[eachDelivery.bowler]['total_balls'] = 1;
            deliveries[eachDelivery.bowler]['total_runs'] = +eachDelivery.total_runs;
        }
        return deliveries
    }, {})

    
    
    //this calculates the economy of each bowler
    for (const [key, value] of Object.entries(bowlersEconomy)) {

        economy[key] = (value.total_runs / (value.total_balls / 6));

    }

    const sortedMap = customSortByValueMap(economy);
    
    const economicalBowlers2015 = getTop10Map(sortedMap);

    return economicalBowlers2015;
}



export default {
    getNoOfMatchesPerYear,
    getTeamWinsPerYear,
    getExtraRunPerTeam2016,
    getEconomicalBowlers2015
}

