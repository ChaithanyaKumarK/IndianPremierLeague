document.addEventListener('DOMContentLoaded', function () {

    createChartMatchesPerYear('container1');
    
    createChartExtraRunPerTeam2016('container2');

    createChartEconomicalBowlers2015('container3');
    
    createChartMatchesWonPerTeam('container4');
});



function createChartEconomicalBowlers2015(HTML_id){

    fetch('/economicalBowlers2015.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart(HTML_id, {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'top 10 economic bowlers'
            },
            colors:['#d2601a'],
            xAxis: {
                categories: Object.keys(data)
            },
            yAxis: {
                title: {
                    text: 'bowling economy'
                }
            },
            series: [{
                name: 'economy',
                data: Object.values(data)
            }]
        });
    });



}
function createChartExtraRunPerTeam2016(HTML_id){
    fetch('/extraRunPerTeam2016.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart(HTML_id, {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Extra runs in 2016'
            },
            
            colors:[ '#1868ae'],
            
            xAxis: {
                
                categories: Object.keys(data)
            },
            yAxis: {
                title: {
                    text: 'Extra runs'
                }
            },
            series: [{
                name: 'Team',
                data: Object.values(data)
            }]
        });
    });
}
function createChartMatchesPerYear(HTML_id){
    fetch('/matchesPerYear.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart(HTML_id, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'matchesPerYear'
            }
            ,colors:['#b20238']
            ,
            xAxis: {
                categories: Object.keys(data)
                
            },
            yAxis: {
                title: {
                    text: 'matches played'
                }
            },
            series: [{
                name: 'Year',
                data: Object.values(data)
            }]
        });
    });
}
function createChartMatchesWonPerTeam(HTML_id){
    fetch('/matchesWonPerTeam.json').then(res => res.json()).then(data => {

        const formater = (data) => {
            const arr = [];

            for (const value of Object.values(data)) {
                for (const key of Object.keys(value)) {
                    if (arr.indexOf(key) === -1) {
                        arr.push(key);
                    }
                }

            }
            let arr1 = arr.reduce((deliveries, current) => {
                deliveries.push({
                    'name': current,
                    'data': []
                });
                return deliveries;
            }, [])

            arr1.forEach(series => {
                for (const value of Object.values(data)) {
                    // console.log(series.name in value);
                    if (series.name in value) {
                        series.data.push(+value[series.name]);
                    } else {
                        series.data.push(0);
                    }

                }
            })
            return arr1;



        };


        const chart = Highcharts.chart(HTML_id, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'matches won by teams'
            },
            xAxis: {
                categories: Object.keys(data)
            },
            yAxis: {
                title: {
                    text: 'matches won'
                }
            },
            series: formater(data)
        });
    });
}
