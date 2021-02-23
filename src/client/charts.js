document.addEventListener('DOMContentLoaded', function () {
    fetch('/matchesPerYear.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'matchesPerYear'
            },
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


    fetch('/extraRunPerTeam2016.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart('container1', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Extra runs in 2016'
            },
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



    fetch('/economicalBowlers2015.json').then(res => res.json()).then(data => {
        const chart = Highcharts.chart('container2', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'top 10 economic bowlers'
            },
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


        const chart = Highcharts.chart('container3', {
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




});