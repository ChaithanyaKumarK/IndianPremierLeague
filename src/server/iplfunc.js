


//Number of matches played per year for all the years in IPL.

function noOfMatchesPerYear(matchFile) {
    const result = matchFile.reduce((matches, current) => {
        if (matches.hasOwnProperty(current.season)) {
            matches[current.season] += 1;
        } else {
            matches[current.season] = 1;
        }
        return matches;
    }, {})

    return result;
}



//Number of matches won per team per year in IPL

function teamWinsPerYear(matchFile) {
    // const result = matchesWonPerTeamPerYearCalculator(matchFile);
    const result = matchFile.reduce((matches, current) => {
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
    return result;

}






///Extra runs conceded per team in the year 2016
function idsOfYear(matchFile, year) {
    return matchFile.filter(obj => obj.season == year).map(values => values.id);
}

function extraRunPerTeam2016(matchFile, deliveriesFile) {
    const ids = idsOfYear(matchFile, 2016);
    const deli2016 = deliveriesFile.filter(each => ids.indexOf(each.match_id) !== -1);
    const result = deli2016.reduce((deliveries, current) => {
        if (deliveries.hasOwnProperty(current.bowling_team)) {
            deliveries[current.bowling_team] += +current.extra_runs;
        } else {
            deliveries[current.bowling_team] = +current.extra_runs;
        }
        return deliveries;
    }, {})

    return result;
}



///Top 10 economical bowlers in the year 2015

function top10Map(map) {
    let topMap = new Map();
    let counter = 10;
    for (const [key, value] of Object.entries(map)) {
        counter--;
        if (counter < 0) { break; }
        topMap[key] = +value.toPrecision(5);

    }
    return topMap;
}

function customMapInverse(map) {
    let newMap = new Map();
    for (const [key, value] of Object.entries(map)) {
        newMap[value] = key;
    }
    return newMap;

}


function customSortByValueMap(map) {
    let arr = [];
    let sortedMap = new Map();
    for (const [key, value] of Object.entries(map)) {
        arr.push(parseFloat(value));
    }
    arr.sort((a, b) => a - b);

    let inverseMap = customMapInverse(map)
    arr.forEach(value => {
        sortedMap[inverseMap[value]] = value;
    })
    return sortedMap;
}


function economicalBowlers2015(matchFile, deliveriesFile) {
    let ids = idsOfYear(matchFile, 2015);

    const deli2015 = deliveriesFile.filter(each => ids.indexOf(each.match_id) !== -1);
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

    let economy = new Map();

    for (const [key, value] of Object.entries(bowlersEconomy)) {

        economy[key] = (value.total_runs / (value.total_balls / 6));

    }

    let sortedMap = customSortByValueMap(economy);
    let finalResult = top10Map(sortedMap);

    return finalResult;
}



export default {
    noOfMatchesPerYear,
    teamWinsPerYear,
    extraRunPerTeam2016,
    economicalBowlers2015
}

